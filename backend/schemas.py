from pydantic import BaseModel, Field

class AnaliseResponse(BaseModel):
    resposta_md: str = Field(..., description="Texto em Markdown com a resposta do assistente de primeiros socorros.")

class ChatRequest(BaseModel):
    mensagem: str = Field(..., description="Mensagem do usuário para o assistente de primeiros socorros.")
    historico: list[str] = Field(default_factory=list, description="Histórico de mensagens anteriores entre o usuário e o assistente.")

class ChatResponse(BaseModel):
    resposta_md: str = Field(..., description="Texto em Markdown com a resposta do assistente de primeiros socorros.")

# ==========================================
# SCHEMAS DE AUTENTICAÇÃO
# ==========================================

class CadastroRequest(BaseModel):
    nome: str = Field(..., description="Nome completo do usuário", min_length=2)
    email: str = Field(..., description="E-mail do usuário")
    senha: str = Field(..., description="Senha do usuário", min_length=8)

class LoginRequest(BaseModel):
    email: str = Field(..., description="E-mail do usuário")
    senha: str = Field(..., description="Senha do usuário")

class AuthResponse(BaseModel):
    token: str = Field(..., description="Token JWT para autenticação")
    usuario: dict = Field(..., description="Dados do usuário (id, nome, email)")

class UsuarioResponse(BaseModel):
    id: int
    nome: str
    email: str
    criado_em: str