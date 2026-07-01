from pydantic_settings import BaseSettings, SettingsConfigDict

class Configuracao(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
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