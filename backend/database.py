import sqlite3
import os
from datetime import datetime

# Caminho do banco - usa /data se existir (Docker), senão usa pasta local
PASTA_DADOS = os.getenv("DATA_DIR", ".")
NOME_BANCO = os.path.join(PASTA_DADOS, "skinscan.db")

def obter_conexao():
    conn = sqlite3.connect(NOME_BANCO)
    conn.row_factory = sqlite3.Row
    return conn

def inicializar_banco():
    conn = obter_conexao()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha_hash TEXT NOT NULL,
            criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def criar_usuario(nome: str, email: str, senha_hash: str) -> dict:
    conn = obter_conexao()
    try:
        cursor = conn.execute(
            "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
            (nome, email, senha_hash)
        )
        conn.commit()
        usuario_id = cursor.lastrowid
        return {"id": usuario_id, "nome": nome, "email": email}
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()

def buscar_usuario_por_email(email: str) -> dict | None:
    conn = obter_conexao()
    linha = conn.execute("SELECT * FROM usuarios WHERE email = ?", (email,)).fetchone()
    conn.close()
    if linha:
        return dict(linha)
    return None

def buscar_usuario_por_id(usuario_id: int) -> dict | None:
    conn = obter_conexao()
    linha = conn.execute("SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?", (usuario_id,)).fetchone()
    conn.close()
    if linha:
        return dict(linha)
    return None