import base64
import json

# Imports FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Imports arquivos locais
from schemas import AnaliseResponse, CadastroRequest, LoginRequest, AuthResponse, UsuarioResponse
from database import inicializar_banco, criar_usuario, buscar_usuario_por_email, buscar_usuario_por_id
from auth import hash_senha, verificar_senha, criar_token, validar_token
from config import configuracao

# Imports do ecossistema LangChain
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

# Import do módulo vetorial (conexão com ChromaDB remoto)
from vetorial import vector_store

# Inicializa o aplicativo FastAPI
app = FastAPI(title="API SkinScan - Análise de Lesões de Pele com IA")

# Inicializa o banco de dados SQLite (cria a tabela se não existir)
inicializar_banco()

# ==========================================
# 1. CONFIGURAÇÃO DE CORS
# ==========================================
# O CORS é um mecanismo de segurança dos navegadores.
# precisamos avisar o backend que é seguro receber pedidos do React.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Em produção, troque "*" pela URL exata do seu front (ex: http://localhost:3000)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

# ==========================================
# 3. CONFIGURAÇÃO DOS MODELOS IA (A ARQUITETURA HÍBRIDA)
# ==========================================
# Resgatando as chaves de segurança ocultas no sistema
api_key_opencode = configuracao.API_KEY_OPENCODE
base_url_opencode = configuracao.BASE_URL_OPENCODE

# LLMs inicializados de forma lazy (na primeira chamada)
_llm_visao = None
_llm_texto = None

def get_llm_visao():
    """Retorna o modelo de visão (Kimi-k2.5)."""
    global _llm_visao
    if _llm_visao is None:
        model_llm_imagem = "kimi-k2.7-code"  # Modelo de visão para análise de imagens
        print(f"[LLM] Inicializando {model_llm_imagem}...")
        _llm_visao = ChatOpenAI(
            api_key=api_key_opencode, base_url=base_url_opencode, model=model_llm_imagem
        )
    return _llm_visao

def get_llm_texto():
    """Retorna o modelo de texto (DeepSeek-V4-Flash)."""
    global _llm_texto
    if _llm_texto is None:
        model_llm_texto = "deepseek-v4-flash"  # Modelo de texto para análise de texto
        print(f"[LLM] Inicializando {model_llm_texto}...")
        _llm_texto = ChatOpenAI(
            api_key=api_key_opencode, base_url=base_url_opencode, model=model_llm_texto
        )
    return _llm_texto


# ==========================================
# 4. FUNÇÕES AUXILIARES
# ==========================================
def codificar_imagem_base64(conteudo_imagem):
    """
    Modelos de IA não recebem arquivos físicos de imagem diretamente.
    Eles precisam que a imagem seja convertida em uma string de texto longa chamada Base64.
    """
    return base64.b64encode(conteudo_imagem).decode("utf-8")


# ==========================================
# 5. A ROTA PRINCIPAL (Endpoint)
# ==========================================
# Esta é a porta de entrada onde o React vai enviar o POST com a foto e os sintomas.
@app.post(
    "/api/analyze-injury",
    response_model=AnaliseResponse,
    summary="Analisar lesão de pele",
)
async def analisar_lesao(
    file: UploadFile = File(...),
    sintomas: str = Form(default="O usuário não relatou sintomas adicionais."),
):
    try:
        # Pega o arquivo cru recebido e transforma em Base64 para a IA entender
        conteudo_imagem = await file.read()
        imagem_base64 = codificar_imagem_base64(conteudo_imagem)

        # ---------------------------------------------------------
        # PASSO A: VISÃO COMPUTACIONAL (Extração de características)
        # ---------------------------------------------------------
        # Aqui enviamos a foto para o Kimi. A instrução é clara: não dê diagnóstico, apenas descreva.
        mensagem_visao = HumanMessage(
            content=[
                {
                    "type": "text",
                    "text": f"Descreva esta lesão de pele brevemente. Sintomas relatados: {sintomas}. Responda em uma única frase curta dizendo qual é o tipo provável de lesão visualmente.",
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{file.content_type};base64,{imagem_base64}"
                    },
                },
            ]
        )

        # Faz a chamada para o llm_visao (Kimi)
        analise_visual = get_llm_visao().invoke([mensagem_visao]).content
        print(f"Kimi detectou visualmente: {analise_visual}")

        # ---------------------------------------------------------
        # PASSO B: RAG (Busca no Banco de Dados)
        # ---------------------------------------------------------
        # A IA viu algo (ex: "queimadura com bolhas"). Jogamos essa frase no banco de dados.
        # O ChromaDB devolve os 'k=5' pedaços de texto do seu manual médico que mais combinam com isso.
        resultados_busca = vector_store.similarity_search(analise_visual, k=5)
        
        print(f"[RAG] Busca por: '{analise_visual}'")
        print(f"[RAG] Encontrados {len(resultados_busca)} resultados:")
        for i, doc in enumerate(resultados_busca):
            print(f"[RAG] Resultado {i+1}: {doc.page_content[:80]}...")
        print(f"[RAG] Tamanho total do contexto: {sum(len(d.page_content) for d in resultados_busca)} chars")

        # Juntamos os textos encontrados em um único grande parágrafo para enviar à IA
        contexto_rag = "\n\n".join([doc.page_content for doc in resultados_busca])

        # ---------------------------------------------------------
        # PASSO C: SÍNTESE E RESPOSTA FINAL (Geração do JSON)
        # ---------------------------------------------------------
        # Agora o DeepSeek entra em ação. Ele recebe uma "personalidade" (SystemMessage).
        mensagem_sistema = SystemMessage(
            content="""
                Você é um assistente de primeiros socorros baseado em um banco de dados vetorial.

                Responda APENAS em JSON válido.

                O JSON deve ter exatamente esta estrutura:
                {
                "resposta_md": "texto em Markdown aqui"
                }

                Regras:
                - O valor de "resposta_md" deve ser um texto em Markdown.
                - Use quebras de linha reais dentro do texto Markdown.
                - Use PRINCIPALMENTE as informações presentes no CONTEXTO OFICIAL.
                - Se o contexto tiver informações relevantes, mesmo que parcial, use-as.
                - Organize a resposta em seções: Identificação, Sinais e Sintomas, e Primeiros Socorros.
                - A identificação visual da lesão é uma hipótese, não um diagnóstico definitivo.
                - Se o contexto não trouxer informação sobre um tópico específico, diga "Informação não disponível" naquele tópico.
                - Não invente procedimentos médicos que não estejam no contexto.
            """
        )

        # Enviamos o manual que o RAG achou + o que o Kimi viu na foto + a estrutura de resposta que o React precisa.
        mensagem_final = HumanMessage(
            content=f"""
            Contexto Oficial de Primeiros Socorros: {contexto_rag}
            
            Lesão identificada visualmente: {analise_visual}
            """
        )

        # Faz a chamada para o llm_texto (DeepSeek)
        resposta_final = get_llm_texto().invoke([mensagem_sistema, mensagem_final]).content

        # ---------------------------------------------------------
        # PASSO D: TRATAMENTO DA RESPOSTA PARA O FRONTEND
        # ---------------------------------------------------------
        try:
            # Algumas IAs retornam o JSON envolvido em blocos de código markdown (```json ... ```).
            # Precisamos limpar isso para o Python conseguir ler como um dicionário real.
            resposta_limpa = (
                resposta_final.replace("```json\n", "").replace("\n```", "").strip()
            )

            # Converte a string de texto puro em um objeto JSON
            dados_json = json.loads(resposta_limpa)

            # Devolve o JSON bonitinho para o colega que está fazendo o React
            return AnaliseResponse(resposta_md=dados_json["resposta_md"])

        except:
            # Fallback de segurança: se a IA por algum motivo não gerar um JSON válido,
            # não quebramos a API, apenas avisamos o erro e mandamos o texto cru.
            return {"erro": "Erro ao formatar resposta", "raw": resposta_final}

    except Exception as e:
        # Se qualquer coisa falhar (banco de dados fora, API da OpenCode fora),
        # devolvemos o Erro 500 para o React saber que o problema foi no servidor.
        return JSONResponse(status_code=500, content={"erro": str(e)})


# ==========================================
# 6. ROTAS DE AUTENTICAÇÃO
# ==========================================

security = HTTPBearer()

def obter_usuario_atual(credentials: HTTPAuthorizationCredentials = Depends(security)):
    usuario_id = validar_token(credentials.credentials)
    if usuario_id is None:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    usuario = buscar_usuario_por_id(usuario_id)
    if usuario is None:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    return usuario

@app.post("/api/cadastro", response_model=AuthResponse, summary="Cadastrar novo usuário")
async def cadastro(dados: CadastroRequest):
    usuario_existente = buscar_usuario_por_email(dados.email)
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Este e-mail já está cadastrado")
    senha_hashed = hash_senha(dados.senha)
    novo_usuario = criar_usuario(dados.nome, dados.email, senha_hashed)
    if novo_usuario is None:
        raise HTTPException(status_code=500, detail="Erro ao criar usuário")
    token = criar_token(novo_usuario["id"])
    return AuthResponse(token=token, usuario=novo_usuario)

@app.post("/api/login", response_model=AuthResponse, summary="Fazer login")
async def login(dados: LoginRequest):
    usuario = buscar_usuario_por_email(dados.email)
    if usuario is None:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")
    if not verificar_senha(dados.senha, usuario["senha_hash"]):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")
    token = criar_token(usuario["id"])
    return AuthResponse(token=token, usuario={"id": usuario["id"], "nome": usuario["nome"], "email": usuario["email"]})

@app.get("/api/me", response_model=UsuarioResponse, summary="Dados do usuário logado")
async def eu(usuario: dict = Depends(obter_usuario_atual)):
    return usuario