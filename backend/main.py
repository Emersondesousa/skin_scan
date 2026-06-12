import os
import base64
import json
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
# dotenv é essencial para carregar as variáveis do arquivo .env (onde ficam suas chaves)
from dotenv import load_dotenv

# Imports do ecossistema LangChain
from langchain_openai import ChatOpenAI
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.messages import HumanMessage, SystemMessage

# Carrega as variáveis de ambiente (API_KEY e BASE_URL)
load_dotenv()

# Inicializa o aplicativo FastAPI
app = FastAPI(title="API SkinScan - Análise de Lesões de Pele com IA")

# ==========================================
# 1. CONFIGURAÇÃO DE CORS
# ==========================================
# O CORS é um mecanismo de segurança dos navegadores. 
# precisamos avisar o backend que é seguro receber pedidos do React.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, troque "*" pela URL exata do seu front (ex: http://localhost:3000)
    allow_credentials=True,
    allow_methods=["*"], # Permite todos os métodos HTTP (GET, POST, etc.)
    allow_headers=["*"], # Permite todos os cabeçalhos
)

# ==========================================
# 2. CONEXÕES (Banco de Dados Vetorial)
# ==========================================
# Embeddings são transformadores: eles pegam um texto e viram um vetor matemático (números).
# Precisamos usar EXATAMENTE o mesmo modelo de embedding que usamos no script 'ingest.py'.
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

# Conecta ao banco de dados ChromaDB criado previamente na pasta local 'chroma_db'
vector_store = Chroma(persist_directory="chroma_db", embedding_function=embeddings)

# ==========================================
# 3. CONFIGURAÇÃO DOS MODELOS IA (A ARQUITETURA HÍBRIDA)
# ==========================================
# Resgatando as chaves de segurança ocultas no sistema
api_key_opencode = os.getenv("API_KEY_OPENCODE")
base_url_opencode = os.getenv("BASE_URL_OPENCODE")

# MODELO 1: O OLHO (Kimi-k2.5)
# Usado APENAS para ler a imagem, pois ele suporta multimodalidade (visão).
llm_visao = ChatOpenAI(
    api_key=api_key_opencode,
    base_url=base_url_opencode,
    model="kimi-k2.5" 
)

# MODELO 2: O CÉREBRO (DeepSeek-V4-Flash)
# Usado para ler o contexto do RAG e gerar o texto final em JSON. 
# Como ele tem um limite enorme na assinatura GO, economizamos processamento aqui.
llm_texto = ChatOpenAI(
    api_key=api_key_opencode,
    base_url=base_url_opencode,
    model="deepseek-v4-flash"
)

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
@app.post("/api/analyze-injury")
async def analisar_lesao(
    file: UploadFile = File(...),
    sintomas: str = Form(default="O usuário não relatou sintomas adicionais.")
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
                {"type": "text", "text": f"Descreva esta lesão de pele brevemente. Sintomas relatados: {sintomas}. Responda em uma única frase curta dizendo qual é o tipo provável de lesão visualmente."},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{file.content_type};base64,{imagem_base64}"},
                },
            ]
        )
        
        # Faz a chamada para o llm_visao (Kimi)
        analise_visual = llm_visao.invoke([mensagem_visao]).content
        print(f"Kimi detectou visualmente: {analise_visual}")

        # ---------------------------------------------------------
        # PASSO B: RAG (Busca no Banco de Dados)
        # ---------------------------------------------------------
        # A IA viu algo (ex: "queimadura com bolhas"). Jogamos essa frase no banco de dados.
        # O ChromaDB devolve os 'k=2' pedaços de texto do seu manual médico que mais combinam com isso.
        resultados_busca = vector_store.similarity_search(analise_visual, k=2) 
        
        # Juntamos os textos encontrados em um único grande parágrafo para enviar à IA
        contexto_rag = "\n\n".join([doc.page_content for doc in resultados_busca])

        # ---------------------------------------------------------
        # PASSO C: SÍNTESE E RESPOSTA FINAL (Geração do JSON)
        # ---------------------------------------------------------
        # Agora o DeepSeek entra em ação. Ele recebe uma "personalidade" (SystemMessage).
        mensagem_sistema = SystemMessage(
            content="""
                Você é um assistente de primeiros socorros baseado exclusivamente em um banco de dados vetorial.

                Responda APENAS em JSON válido.

                O JSON deve ter exatamente esta estrutura:
                {
                "resposta_md": "texto em Markdown aqui"
                }

                Regras obrigatórias:
                - O valor de "resposta_md" deve ser um texto em Markdown.
                - Use quebras de linha reais dentro do texto Markdown, não escreva barras invertidas manualmente.
                - Use somente informações presentes no CONTEXTO OFICIAL.
                - Não use conhecimento geral.
                - Não complete lacunas.
                - Não recomende condutas, especialistas, urgência ou tratamentos que não estejam explicitamente no CONTEXTO OFICIAL.
                - Se o CONTEXTO OFICIAL não trouxer informação suficiente sobre a lesão identificada, diga "Informação não encontrada no banco de dados" nos tópicos correspondentes.
                - A identificação visual da lesão pode ser mencionada como hipótese visual, mas não deve ser tratada como diagnóstico definitivo.
                - Nunca invente procedimentos médicos.
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
        resposta_final = llm_texto.invoke([mensagem_sistema, mensagem_final]).content

        # ---------------------------------------------------------
        # PASSO D: TRATAMENTO DA RESPOSTA PARA O FRONTEND
        # ---------------------------------------------------------
        try:
            # Algumas IAs retornam o JSON envolvido em blocos de código markdown (```json ... ```).
            # Precisamos limpar isso para o Python conseguir ler como um dicionário real.
            resposta_limpa = resposta_final.replace("```json\n", "").replace("\n```", "").strip()
            
            # Converte a string de texto puro em um objeto JSON
            dados_json = json.loads(resposta_limpa)
            
            # Devolve o JSON bonitinho para o colega que está fazendo o React
            return JSONResponse(content=dados_json)
            
        except:
            # Fallback de segurança: se a IA por algum motivo não gerar um JSON válido, 
            # não quebramos a API, apenas avisamos o erro e mandamos o texto cru.
            return {"erro": "Erro ao formatar resposta", "raw": resposta_final}

    except Exception as e:
        # Se qualquer coisa falhar (banco de dados fora, API da OpenCode fora), 
        # devolvemos o Erro 500 para o React saber que o problema foi no servidor.
        return JSONResponse(status_code=500, content={"erro": str(e)})