from pydantic_settings import BaseSettings, SettingsConfigDict

class Configuracao(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Auth
    JWT_SECRET: str
    JWT_HORAS_EXPIRACAO: int

    # IA
    API_KEY_OPENCODE: str 
    BASE_URL_OPENCODE: str 
    
    # ChromaDB
    CHROMADB_HOST: str = "localhost"
    CHROMADB_PORT: int = 8000
    CHROMADB_SSL: bool = False

configuracao = Configuracao()