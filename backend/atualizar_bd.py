from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

def adicionar_novos_conhecimentos():
    # 1. Carrega APENAS o arquivo novo
    print("Lendo o arquivo de novos dados...")
    loader = TextLoader("data/equimose.txt", encoding="utf-8")
    novos_documentos = loader.load()

    # 2. Divide o texto novo em blocos
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len
    )
    novos_chunks = text_splitter.split_documents(novos_documentos)

    # 3. Configura o MESMO modelo de embedding
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )

    # 4. CONECTA ao banco de dados existente
    # Repare que aqui chamamos apenas Chroma() em vez de Chroma.from_documents()
    print("Conectando ao banco de dados existente...")
    vector_store = Chroma(
        persist_directory="chroma_db", 
        embedding_function=embeddings
    )

    # 5. Adiciona os novos blocos à base de dados
    print("Injetando novos conhecimentos...")
    vector_store.add_documents(novos_chunks)
    
    print(f"Sucesso! {len(novos_chunks)} novos blocos foram adicionados ao banco de dados permanentemente.")

if __name__ == "__main__":
    adicionar_novos_conhecimentos()