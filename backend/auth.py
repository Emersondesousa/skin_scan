from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import timezone
from config import configuracao

# Configurações do JWT
CHAVE_SECRETA = configuracao.JWT_SECRET
ALGORITMO = "HS256"
TEMPO_EXPIRACAO_HORAS = configuracao.JWT_HORAS_EXPIRACAO

# Configuração do hash de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_senha(senha: str) -> str:
    """Transforma a senha em um hash seguro (não dá pra descobrir a senha original)."""
    return pwd_context.hash(senha)

def verificar_senha(senha: str, senha_hash: str) -> bool:
    """Compara a senha digitada com o hash salvo no banco. Retorna True se bater."""
    return pwd_context.verify(senha, senha_hash)

def criar_token(usuario_id: int) -> str:
    """Gera um token JWT para o usuário logado."""
    expiracao = datetime.now(timezone.utc) + timedelta(hours=TEMPO_EXPIRACAO_HORAS)
    dados = {
        "sub": str(usuario_id),
        "exp": expiracao
    }
    return jwt.encode(dados, CHAVE_SECRETA, algorithm=ALGORITMO)

def validar_token(token: str) -> int | None:
    """Valida o token JWT e retorna o ID do usuário. Retorna None se inválido."""
    try:
        payload = jwt.decode(token, CHAVE_SECRETA, algorithms=[ALGORITMO])
        usuario_id = payload.get("sub")
        if usuario_id is None:
            return None
        return int(usuario_id)
    except JWTError:
        return None