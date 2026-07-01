"""
Modulo de conexao com o banco vetorial (ChromaDB remoto).
Este modulo fornece a instancia do vector_store para uso em outros modulos.
"""
import chromadb
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from config import configuracao

# Configuracoes do ChromaDB
CHROMADB_HOST = configuracao.CHROMADB_HOST
CHROMADB_PORT = configuracao.CHROMADB_PORT
CHROMADB_SSL = configuracao.CHROMADB_SSL

# Modelo de embedding (multilingual, bom para portugues)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

# Conecta ao ChromaDB remoto via HTTP/HTTPS
cliente_chroma = chromadb.HttpClient(
    host=CHROMADB_HOST,
    port=CHROMADB_PORT,
    ssl=CHROMADB_SSL,
)

vector_store = Chroma(
    client=cliente_chroma,
    embedding_function=embeddings,
    collection_name="skinscan",
)

print(f"[OK] Conectado ao ChromaDB em {CHROMADB_HOST}:{CHROMADB_PORT} (SSL={CHROMADB_SSL})")
