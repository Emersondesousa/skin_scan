import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

def preparar_banco_dados():
    # 1. Carregar o arquivo de texto com as orientações de primeiros socorros
    loader = TextLoader("data/primeiros_socorros.txt", encoding="utf-8")
    documentos = loader.load()

    # 2. Dividir o texto em pedaços (Chunks)
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len
    )
    chunks = text_splitter.split_documents(documentos)
    print(f"Texto dividido em {len(chunks)} blocos de contexto.")

    # 3. Configurar o modelo de Embedding LOCAL e MULTILINGUAL (funciona ótimo em português)
    # Ele vai baixar um modelo leve (cerca de 100MB) na primeira vez e rodar no seu PC
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )

    # 4. Criar o banco de dados Chroma e salvar os vetores localmente
    print("Gerando embeddings locais e salvando no ChromaDB...")
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory="chroma_db"
    )
    
    print("Banco de dados vetorial pronto e salvo localmente com sucesso!")

if __name__ == "__main__":
    preparar_banco_dados()