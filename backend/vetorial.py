"""
Modulo de conexao com o banco vetorial (ChromaDB remoto).
Conexao lazy - conecta apenas quando necessario.
"""
import chromadb
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from config import configuracao

# Configuracoes do ChromaDB
CHROMADB_HOST = configuracao.CHROMADB_HOST
CHROMADB_PORT = configuracao.CHROMADB_PORT
CHROMADB_SSL = configuracao.CHROMADB_SSL

# Variaveis globais (inicializadas depois)
_vector_store = None
_embeddings = None

def get_embeddings():
    """Retorna o modelo de embedding (carrega uma vez so)."""
    global _embeddings
    if _embeddings is None:
        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        )
    return _embeddings

def get_vector_store():
    """Retorna o vector store (conecta na primeira chamada)."""
    global _vector_store
    if _vector_store is None:
        print(f"[CHROMADB] Conectando em {CHROMADB_HOST}:{CHROMADB_PORT} (SSL={CHROMADB_SSL})...")
        
        cliente_chroma = chromadb.HttpClient(
            host=CHROMADB_HOST,
            port=CHROMADB_PORT,
            ssl=CHROMADB_SSL,
        )
        
        _vector_store = Chroma(
            client=cliente_chroma,
            embedding_function=get_embeddings(),
            collection_name="skinscan",
        )
        
        print(f"[CHROMADB] Conectado com sucesso!")
    
    return _vector_store

# Para compatibilidade - importar vector_store funciona
# mas so conecta de verdade quando usado
class VectorStoreProxy:
    """Proxy que conecta ao ChromaDB apenas quando usado."""
    def __getattr__(self, name):
        store = get_vector_store()
        return getattr(store, name)

vector_store = VectorStoreProxy()
