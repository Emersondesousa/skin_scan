"""
Script STANDALONE para carregar PDFs no ChromaDB remoto.
Não faz parte do backend — roda separadamente para popular o banco vetorial.

Uso:
  uv run python ingestao_pdfs.py
  
Ou para carregar uma pasta específica:
  uv run python ingestao_pdfs.py --pasta /caminho/para/pdfs
"""
import os
import sys
import argparse
import chromadb
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configurações
CHROMADB_HOST = os.getenv("CHROMADB_HOST", "localhost")
CHROMADB_PORT = int(os.getenv("CHROMADB_PORT", "443"))
CHROMADB_SSL = os.getenv("CHROMADB_SSL", "true").lower() == "true"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

def carregar_pdfs(pasta: str) -> list:
    """Carrega todos os PDFs de uma pasta."""
    print(f"[PDF] Carregando PDFs de: {pasta}")
    
    if not os.path.exists(pasta):
        print(f"[ERRO] Pasta nao encontrada: {pasta}")
        return []
    
    todos_documentos = []
    pdfs_encontrados = 0
    
    for arquivo in sorted(os.listdir(pasta)):
        if arquivo.lower().endswith(".pdf"):
            caminho = os.path.join(pasta, arquivo)
            try:
                loader = PyPDFLoader(caminho)
                documentos = loader.load()
                todos_documentos.extend(documentos)
                pdfs_encontrados += 1
                print(f"  [OK] {arquivo} ({len(documentos)} paginas)")
            except Exception as e:
                print(f"  [ERRO] {arquivo} - Erro: {e}")
    
    if pdfs_encontrados == 0:
        print("[AVISO] Nenhum PDF encontrado na pasta!")
    else:
        print(f"\n[INFO] Total: {pdfs_encontrados} PDFs, {len(todos_documentos)} paginas")
    
    return todos_documentos

def dividir_em_chunks(documentos: list) -> list:
    """Divide documentos em pedacos menores para o ChromaDB."""
    print(f"\n[INFO] Dividindo em chunks (tamanho={CHUNK_SIZE}, overlap={CHUNK_OVERLAP})...")
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    
    chunks = splitter.split_documents(documentos)
    print(f"[INFO] Total de chunks: {len(chunks)}")
    
    return chunks

def conectar_chromadb() -> Chroma:
    """Conecta ao ChromaDB remoto."""
    print(f"\n[CONECTANDO] ChromaDB em {CHROMADB_HOST}:{CHROMADB_PORT} (SSL={CHROMADB_SSL})...")
    
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    
    # Conectar ao ChromaDB remoto via HTTP/HTTPS
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
    
    print("[OK] Conectado ao ChromaDB!")
    return vector_store

def salvar_no_chromadb(vector_store: Chroma, chunks: list):
    """Salva os chunks no ChromaDB."""
    print(f"\n[SALVANDO] {len(chunks)} chunks no ChromaDB...")
    
    vector_store.add_documents(chunks)
    
    print(f"[OK] {len(chunks)} chunks salvos com sucesso!")

def main():
    # Configurar argumentos da linha de comando
    parser = argparse.ArgumentParser(description="Carrega PDFs no ChromaDB remoto")
    parser.add_argument(
        "--pasta", 
        type=str, 
        default="data/pdfs",
        help="Pasta com os PDFs (padrao: data/pdfs)"
    )
    parser.add_argument(
        "--chunk-size",
        type=int,
        default=500,
        help="Tamanho dos chunks (padrao: 500)"
    )
    parser.add_argument(
        "--chunk-overlap",
        type=int,
        default=50,
        help="Sobreposicao dos chunks (padrao: 50)"
    )
    
    args = parser.parse_args()
    
    # Atualizar configurações globais se fornecidas
    global CHUNK_SIZE, CHUNK_OVERLAP
    CHUNK_SIZE = args.chunk_size
    CHUNK_OVERLAP = args.chunk_overlap
    
    # Banner
    print("=" * 60)
    print("INGESTAO DE PDFs NO CHROMADB")
    print("=" * 60)
    print(f"ChromaDB: {CHROMADB_HOST}:{CHROMADB_PORT}")
    print(f"Pasta PDFs: {args.pasta}")
    print(f"Chunk Size: {CHUNK_SIZE}")
    print(f"Chunk Overlap: {CHUNK_OVERLAP}")
    print("=" * 60)
    
    # 1. Carregar PDFs
    documentos = carregar_pdfs(args.pasta)
    if not documentos:
        sys.exit(1)
    
    # 2. Dividir em chunks
    chunks = dividir_em_chunks(documentos)
    
    # 3. Conectar ao ChromaDB
    vector_store = conectar_chromadb()
    
    # 4. Salvar no ChromaDB
    salvar_no_chromadb(vector_store, chunks)
    
    # Resumo final
    print("\n" + "=" * 60)
    print("INGESTAO CONCLUIDA COM SUCESSO!")
    print("=" * 60)
    print(f"PDFs processados: {len(documentos)} paginas")
    print(f"Chunks criados: {len(chunks)}")
    print(f"ChromaDB: {CHROMADB_HOST}:{CHROMADB_PORT}")
    print("=" * 60)

if __name__ == "__main__":
    main()
