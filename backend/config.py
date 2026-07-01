from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Configuracao(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env" if os.path.exists(".env") else None,
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Auth
    JWT_SECRET: str = "skinscan-secret-padrao-mude-em-producao"
    JWT_HORAS_EXPIRACAO: int = 24

    # IA
    API_KEY_OPENCODE: str = ""
    BASE_URL_OPENCODE: str = "https://opencode.ai/zen/go/v1"
    
    # ChromaDB
    CHROMADB_HOST: str = "localhost"
    CHROMADB_PORT: int = 8000
    CHROMADB_SSL: bool = False

configuracao = Configuracao()

# Debug: mostrar valores carregados (sem mostrar segredos)
print(f"[CONFIG] JWT_SECRET: {'***' if configuracao.JWT_SECRET else 'VAZIO'}")
print(f"[CONFIG] API_KEY_OPENCODE: {'***' if configuracao.API_KEY_OPENCODE else 'VAZIO'}")
print(f"[CONFIG] BASE_URL_OPENCODE: {configuracao.BASE_URL_OPENCODE}")
print(f"[CONFIG] CHROMADB_HOST: {configuracao.CHROMADB_HOST}")
print(f"[CONFIG] CHROMADB_PORT: {configuracao.CHROMADB_PORT}")
print(f"[CONFIG] CHROMADB_SSL: {configuracao.CHROMADB_SSL}")
