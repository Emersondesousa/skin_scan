FROM python:3.11-slim

WORKDIR /app

# Instalar uv (gerenciador de pacotes rapido)
RUN pip install uv

# Copiar arquivos de dependencia primeiro (melhor cache)
COPY pyproject.toml uv.lock ./

# Instalar dependencias
RUN uv sync --no-dev --no-install-project

# Copiar todo o codigo
COPY . .

# Criar pasta para dados persistentes (SQLite)
RUN mkdir -p /data

# Variavel de ambiente para o banco ficar em /data
ENV DATA_DIR=/data

# Expor porta
EXPOSE 8000

# Comando para rodar
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
