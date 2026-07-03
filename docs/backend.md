# Documentação — Backend (SkinScan)

> Este documento explains como funciona o backend do projeto SkinScan, para fins de apresentação.

---

## Visão Geral

O backend é uma **API REST** construída em **Python** com o framework **FastAPI**. Ele é responsável por:

1. **Autenticar usuários** (cadastro e login)
2. **Receber fotos** de lesões de pele
3. **Analisar as fotos** com Inteligência Artificial
4. **Buscar informações** em um banco de dados vetorial (RAG)
5. **Retornar** uma resposta em Markdown para o frontend

---

## Tecnologias Principais

| Tecnologia | O que faz no projeto |
|---|---|
| **FastAPI** | Framework web Python para criar as rotas da API |
| **Uvicorn** | Servidor que roda o FastAPI (como o Apache, mas para Python) |
| **SQLite** | Banco de dados relacional para guardar usuários |
| **ChromaDB** | Banco de dados vetorial para a IA buscar conhecimento |
| **LangChain** | Framework para conectar IA com banco de dados e prompts |
| **Pydantic** | Validação de dados que chegam nas requisições |
| **bcrypt** | Criptografia de senhas |
| **JWT** | Tokens de autenticação |
| **Docker** | Container para deploy |

---

## Arquitetura do Backend

```
┌──────────────── Frontend (React/Expo) ────────────────┐
│                                                        │
│  Usuário envia: foto + sintomas + token JWT           │
│                                                        │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌──────────────── Backend (FastAPI) ────────────────────┐
│                                                        │
│  1. Recebe a requisição                               │
│  2. Valida o token JWT                                │
│  3. Envia a foto para o Modelo de Visão (Kimi)        │
│  4. Kimi descreve a lesão visualmente                 │
│  5. Envia a descrição para o ChromaDB (RAG)           │
│  6. ChromaDB retorna textos relevantes                │
│  7. Envia contexto + descrição para o DeepSeek        │
│  8. DeepSeek gera a resposta final em JSON            │
│  9. Retorna JSON para o frontend                      │
│                                                        │
└───────────────────────┬────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
┌─────────────────────┐  ┌───────────────────┐
│   ChromaDB (nuvem)   │  │  Modelos de IA     │
│                     │  │  (OpenCode API)    │
│ - Banco vetorial     │  │                   │
│ - PDFs de medicina   │  │ - Kimi-k2.7       │
│ - Embeddings         │  │   (visão)         │
│                     │  │ - DeepSeek-v4     │
│                     │  │   (texto)         │
└─────────────────────┘  └───────────────────┘
```

---

## Rotas da API (Endpoints)

O backend expõe **4 rotas** principais:

### 1. POST `/api/cadastro` — Cadastrar usuário

**Recebe (JSON):**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

**Retorna (JSON):**
```json
{
  "token": "eyJhbGciOi...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Fluxo interno:**
1. Verifica se o e-mail já existe no SQLite
2. Criptografa a senha com **bcrypt**
3. Salva o usuário no banco
4. Gera um **token JWT**
5. Retorna o token + dados do usuário

---

### 2. POST `/api/login` — Fazer login

**Recebe (JSON):**
```json
{
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

**Retorna:** o mesmo formato do cadastro (token + usuário)

**Fluxo interno:**
1. Busca o e-mail no SQLite
2. Compara a senha digitada com o hash salvo (bcrypt)
3. Se bater → gera token JWT
4. Se não bater → retorna erro 401

---

### 3. GET `/api/me` — Dados do usuário logado

**Recebe:** token JWT no cabeçalho `Authorization: Bearer <token>`

**Retorna:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "criado_em": "2026-07-01 12:00:00"
}
```

**Para que serve:** verificar se o token ainda é válido e pegar dados do usuário.

---

### 4. POST `/api/analyze-injury` — Analisar lesão de pele (ROTA PRINCIPAL)

**Recebe (multipart/form-data):**
- `file` → a foto da lesão
- `sintomas` → texto descrevendo os sintomas

**Retorna (JSON):**
```json
{
  "resposta_md": "## Identificação\nA lesão parece ser...\n\n## Primeiros Socorros\n1. Lave com água..."
}
```

**Esta é a rota mais importante** — é onde a IA acontece.

---

## A Arquitetura Híbrida de IA (A Mágica)

A análise de lesão acontece em **4 passos** dentro da rota `/api/analyze-injury`:

### Passo A: Visão Computacional (O OLHO)

```
Foto + sintomas → MODELO KIMI-K2.7 → "Lesão compatível com queimadura de 2º grau"
```

- O usuário envia uma foto da lesão
- O backend converte a imagem para **Base64** (texto)
- Envia para o **Kimi-k2.7** (modelo multimodal — enxerga imagens)
- O Kimi retorna uma **frase curta** descrevendo o que viu
- **Importante:** o Kimi não dá diagnóstico, só descreve visualmente

### Passo B: RAG — Busca no Banco Vetorial (A MEMÓRIA)

```
"queimadura de 2º grau" → CHROMADB → 5 textos médicos relevantes
```

- Pega a descrição do Kimi
- Faz uma **busca por similaridade** no ChromaDB
- O ChromaDB compara o texto com os **vetores** dos PDFs médicos
- Retorna os **5 pedaços de texto** que mais combinam com a lesão
- Esses textos são o **contexto** que a IA vai usar

> **O que é RAG?** Retrieval-Augmented Generation. Em vez de a IA usar conhecimento geral, ela usa **apenas** os textos dos PDFs médicos que foram cadastrados. Isso garante que as respostas sejam baseadas em fontes confiáveis.

### Passo C: Síntese Final (O CÉREBRO)

```
Contexto RAG + Descrição visual → MODELO DEEPSEEK → Resposta em Markdown
```

- Envia o contexto do RAG + a descrição visual para o **DeepSeek-v4-flash**
- O DeepSeek recebe uma **instrução de sistema** (como deve se comportar):
  - É um assistente de primeiros socorros
  - Usa **principalmente** as informações do contexto
  - Responde em **JSON** com um campo `resposta_md`
  - Organiza em seções: Identificação, Sinais e Sintomas, Primeiros Socorros
  - Não inventa procedimentos médicos
- O DeepSeek gera a resposta final em **Markdown**

### Passo D: Tratamento e Retorno

```
Resposta JSON → LIMPEZA → JSON válido → Frontend
```

- A IA pode retornar o JSON dentro de blocos de código (```json ... ```)
- O backend **limpa** isso para virar um JSON válido
- Retorna para o frontend no formato `{ "resposta_md": "..." }`
- Se a IA falhar, retorna o texto cru como fallback

---

## Banco de Dados Vetorial (ChromaDB)

### O que é

O ChromaDB é um **banco de dados vetorial** — em vez de guardar texto, guarda **vetores** (listas de números que representam o significado do texto).

### Como funciona

1. **Embeddings:** cada pedaço de texto dos PDFs é transformado em um vetor de números usando o modelo `paraphrase-multilingual-MiniLM-L12-v2` (multilingue, bom para português)
2. **Busca por similaridade:** quando a IA descreve a lesão, o ChromaDB compara o vetor da descrição com os vetores dos PDFs
3. **Retorno:** devolve os textos cujos vetores são mais **parecidos** (matematicamente próximos)

### Onde fica

O ChromaDB roda como **serviço separado na nuvem** (EasyPanel), conectado via HTTPS. O backend se conecta a ele pela internet.

### Como os PDFs entram

Um script separado (`ingestao_pdfs.py`) lê os PDFs médicos, divide em pedaços (chunks de 1500 caracteres), transforma em vetores e salva no ChromaDB. Isso é feito separadamente do backend.

---

## Autenticação (JWT)

### Como funciona

```
[Login] → email + senha → valida no SQLite → gera JWT → retorna token
[Uso]   → frontend manda token → backend valida → permite acesso
```

### Token JWT

- É gerado no login com uma **chave secreta** (`JWT_SECRET`)
- Contém o **ID do usuário** e a **data de expiração** (24h)
- É **assinado** — não dá pra falsificar sem a chave
- É enviado pelo frontend no cabeçalho: `Authorization: Bearer <token>`

### Validação

O backend tem uma função `obter_usuario_atual()` que:
1. Extrai o token do cabeçalho
2. Valida a assinatura e a expiração
3. Busca o usuário no SQLite
4. Retorna o usuário ou erro 401

---

## Variáveis de Ambiente

O backend usa o **Pydantic Settings** para carregar configurações:

| Variável | O que faz |
|---|---|
| `JWT_SECRET` | Chave secreta para assinar tokens JWT |
| `JWT_HORAS_EXPIRACAO` | Tempo de validade do token (padrão: 24h) |
| `API_KEY_OPENCODE` | Chave da API dos modelos de IA |
| `BASE_URL_OPENCODE` | URL da API de IA |
| `CHROMADB_HOST` | Endereço do ChromaDB remoto |
| `CHROMADB_PORT` | Porta do ChromaDB (443 para HTTPS) |
| `CHROMADB_SSL` | Usar HTTPS na conexão (true/false) |

---

## Estrutura de Arquivos

```
backend/
├── main.py          ← Rotas da API + lógica da IA
├── config.py        ← Carrega variáveis de ambiente
├── auth.py          ← Criptografia (bcrypt) + tokens (JWT)
├── database.py      ← Conexão com SQLite (usuários)
├── vetorial.py      ← Conexão com ChromaDB (RAG)
├── schemas.py       ← Validação de dados (Pydantic)
├── ingestao_pdfs.py ← Script para carregar PDFs no ChromaDB
├── Dockerfile       ← Configuração do container Docker
├── pyproject.toml   ← Dependências do projeto
└── .env             ← Variáveis de ambiente (não vai pro Git)
```

---

## Recursos Avançados

### Inicialização Lazy

Os modelos de IA e a conexão com ChromaDB **não são inicializados no startup** — só quando alguém realmente usa. Isso evita que o servidor quebre se algum serviço externo estiver fora do ar.

### CORS

O backend permite requisições de qualquer origem (`allow_origins=["*"]`). Em produção, o ideal é limitar para a URL do frontend.

### Documentação Automática

O FastAPI gera automaticamente uma documentação interativa em:
- `/docs` → Swagger UI (dá pra testar as rotas pelo navegador)
- `/redoc` → ReDoc (documentação mais limpa)

---

## Resumo do Fluxo Completo

```
1. Usuário se cadastra/loga → backend valida → gera JWT
2. Usuário tira foto da lesão → envia com sintomas
3. Backend recebe → valida token
4. Backend envia foto para Kimi → Kimi descreve a lesão
5. Backend busca no ChromaDB → encontra textos médicos relevantes
6. Backend envia contexto + descrição para DeepSeek
7. DeepSeek gera resposta em Markdown
8. Backend retorna JSON para o frontend
9. Frontend exibe a resposta formatada para o usuário
```

---

## Perguntas Frequentes para Apresentação

**"Por que usar dois modelos de IA diferentes?"**
> Cada modelo tem uma especialidade. O Kimi é multimodal (enxerga imagens), mas não é bom para gerar textos longos estruturados. O DeepSeek é excelente para gerar texto estruturado em Markdown, mas não enxerga imagens. Usar os dois juntos dá o melhor resultado.

**"O que é RAG e por que usamos?"**
> RAG (Retrieval-Augmented Generation) é uma técnica onde a IA busca informações em um banco de dados antes de responder. Em vez de usar o conhecimento geral da IA (que pode estar errado ou desatualizado), usamos **apenas** os PDFs médicos que cadastramos. Isso garante respostas baseadas em fontes confiáveis.

**"O ChromaDB precisa estar no mesmo servidor?"**
> Não. O ChromaDB roda como serviço separado na nuvem, conectado via HTTPS. Isso permite escalá-lo independentemente e adicionar mais PDFs sem reiniciar o backend.

**"Como o backend sabe quem está fazendo a requisição?"**
> Pelo token JWT. A cada requisição, o frontend manda o token no cabeçalho. O backend decodifica o token, extrai o ID do usuário e sabe quem é. Se o token for inválido ou expirado, retorna erro 401.

**"Por que o backend demora para responder na análise de lesão?"**
> Porque faz **duas chamadas de IA em sequência**: primeiro o Kimi analisa a imagem (pode levar 10-20 segundos), depois o DeepSeek gera a resposta (mais 5-10 segundos). Somado com a busca no ChromaDB, a resposta pode levar até 30 segundos.

**"O que acontece se a IA falhar?"**
> O backend tem tratamento de erros em camadas. Se a IA não gerar um JSON válido, ele retorna o texto cru. Se a conexão com ChromaDB falhar, retorna erro 500. O frontend sempre recebe uma resposta, mesmo em caso de erro.