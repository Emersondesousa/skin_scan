# Documentação — Banco de Dados Relacional (SkinScan)

 Este documento explica como funciona o banco de dados relacional do projeto SkinScan, para fins de apresentação.

---

## O que é nosso banco de dados

O SkinScan usa **SQLite**, que é um banco de dados relacional (como o PostgreSQL, só mais leve). Ele guarda as informações dos **usuários** que podem se cadastrar e logar no app.

> **Diferença entre SQLite e PostgreSQL:**
> - SQLite é um arquivo dentro do próprio servidor
> - PostgreSQL seria um serviço separado
> - A **lógica é a mesma** — os dois usam SQL

---

## Onde fica guardado

O banco é um arquivo chamado `skinscan.db` que fica dentro do servidor, em uma pasta `/data` que persiste mesmo se o servidor reiniciar (volume montado no Docker).

---

## A tabela de usuários

O banco tem **uma tabela** chamada `usuarios` com estas colunas:

| Coluna       | Tipo                | O que guarda                                          |
|--------------|---------------------|-------------------------------------------------------|
| `id`         | Número (chave primária) | Identificador único (1, 2, 3...)                  |
| `nome`       | Texto               | Nome do usuário (ex: "João Silva")                    |
| `email`      | Texto (único)       | E-mail, não pode repetir (ex: "joao@email.com")       |
| `senha_hash` | Texto               | Senha criptografada (não guardamos a senha original)  |
| `criado_em`  | Data/hora           | Quando a conta foi criada                             |

### Comando SQL que cria a tabela

```sql
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**O que cada palavra significa:**
- `PRIMARY KEY AUTOINCREMENT` → o ID é gerado automaticamente e é único (ninguém repete)
- `NOT NULL` → não pode ficar vazio (é obrigatório)
- `UNIQUE` → não pode repetir (cada e-mail só pode se cadastrar uma vez)
- `DEFAULT CURRENT_TIMESTAMP` → preenche a data/hora sozinho na hora do cadastro

---

## Fluxo de como funciona

### 1. Cadastro

A pessoa digita nome, e-mail e senha no app:

1. O sistema **criptografa a senha** com **bcrypt** (transforma "minhasenha123" em algo ilegível como `$2b$12$XyZ...`)
2. Salva no banco: `INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)`
3. Se o e-mail já existe, retorna erro: "Este e-mail já está cadastrado"

### 2. Login

A pessoa digita e-mail e senha:

1. O sistema **busca o e-mail** no banco: `SELECT * FROM usuarios WHERE email = ?`
2. **Compara a senha** digitada com a senha criptografada usando bcrypt
3. Se bater → gera um **token JWT** (um crachá digital)
4. Se não bater → retorna erro: "E-mail ou senha incorretos"

### 3. Uso do app

A cada requisição (analisar lesão, ver dados do usuário):

1. O frontend envia o token JWT no cabeçalho: `Authorization: Bearer <token>`
2. O backend **valida o token** — verifica se é válido e não expirou
3. Se válido → permite o acesso
4. Se inválido → retorna erro 401 (não autorizado) e a pessoa precisa logar de novo

---

## Por que a senha está criptografada

Nunca guardamos a senha original. Usamos o **bcrypt**, que:

- Transforma "minhasenha123" em algo como `$2b$12$XyZ123abc...`
- É **irreversível** — não dá pra descobrir a senha original a partir do hash
- Mesmo que alguém acesse o banco de dados, não consegue ver as senhas
- Para validar no login, o bcrypt compara a senha digitada com o hash salvo sem nunca descriptografar

---

## Como funciona o token JWT

O **JWT (JSON Web Token)** é um token gerado no momento do login.

### Características:
- Tem **validade de 24 horas** (configurável)
- Contém o **ID do usuário**
- É **assinado** com uma chave secreta (`JWT_SECRET`)
- É enviado pelo frontend em **cada requisição** no cabeçalho

### Estrutura do token:
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxN...>.assinatura
└── cabeçalho ──┘ └── dados (ID + validade) ──┘ └── assinatura ──┘
```

### Validação:
- O backend decodifica o token
- Verifica se a assinatura bate com a chave secreta
- Verifica se não expirou
- Extrai o ID do usuário para saber quem está fazendo a requisição

---

## Resumo visual do fluxo

```
[CADASTRO]
  usuário digita nome + email + senha
    → bcrypt criptografa a senha
    → salva no SQLite (tabela usuarios)
    → gera token JWT
    → usuário está logado

[LOGIN]
  usuário digita email + senha
    → busca email no SQLite
    → bcrypt compara a senha
    → se bater: gera token JWT
    → se não bater: erro

[USO DO APP]
  frontend envia token JWT no cabeçalho
    → backend valida o token
    → se válido: permite acesso
    → se inválido: erro 401
```

---

## Tecnologias usadas

| Tecnologia   | O que faz                           |
|--------------|-------------------------------------|
| **SQLite**   | Banco de dados relacional           |
| **bcrypt**   | Criptografia de senhas              |
| **JWT**      | Tokens de autenticação              |
| **SQL**      | Linguagem para consultar o banco    |
| **Docker**   | Volume persistente para o banco     |

---

## Perguntas frequentes para a apresentação

**"Por que SQLite e não PostgreSQL?"**
> SQLite é mais leve e simples para projetos menores. A lógica é a mesma — ambos são bancos relacionais com SQL. Se o projeto crescer, dá pra migrar para PostgreSQL sem mudar a lógica.

**"Como as senhas estão seguras?"**
> Usamos bcrypt, que é um algoritmo de hash irreversível. A senha original nunca é guardada e não pode ser descoberta, apenas comparada.

**"O que acontece se o servidor reiniciar?"**
> O banco de dados fica em um volume persistente do Docker, então os dados não se perdem. O arquivo `skinscan.db` continua intacto.

**"Como o token JWT funciona na prática?"**
> É como um crachá digital. Você faz login uma vez, recebe o crachá, e o apresenta a cada requisição. O crachá expira em 24 horas, depois disso você precisa fazer login de novo.