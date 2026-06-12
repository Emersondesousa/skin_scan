"""
Limpa o texto extraído dos PDFs para banco vetorial:
- Remove números de página isolados
- Remove headers/footers repetidos
- Remove URLs soltas
- Normaliza espaçamento
- Preserva estrutura semântica
"""

import fitz
import os
import re

PDF_DIR = "data/pdfs"
OUTPUT = "data/corpus_vetorial.txt"

# ── Headers/footers específicos de cada PDF ──────────────────────────
HEADERS_POR_PDF = {
    "E-book Semiologia Dermatológica.pdf": [
        "SEMIOLOGIA DERMATOLÓGICA & LESÕES ELEMENTARES",
        "FACULDADE DE MEDICINA - CENTRO UNIVERSITÁRIO SÃO CAMILO",
    ],
    "CPWSC_Guia_PU_A5_d7.pdf": [
        "Tamanho",
        "Unidade",
        "por caixa",
        "Código",
    ],
    "rodrigues-9788561673680-04.pdf": [
        "atlas de dermatologia em povos indígenas",
        "doenças causadas por bactérias",
    ],
    "PROTOCOLO ULCERA POR PRESSÃO_260609_194327.pdf": [],
}

# ── Funções de limpeza ───────────────────────────────────────────────


def is_page_number(line: str) -> bool:
    """Detecta linha que é apenas número de página (1-200)."""
    s = line.strip().rstrip(".")
    return bool(re.match(r"^\d{1,3}$", s)) and 1 <= int(s) <= 200


def is_url_line(line: str) -> bool:
    """Detecta linha cujo conteúdo principal é uma URL."""
    s = line.strip()
    return bool(re.match(r"^(https?://|www\.)\S+$", s))


def is_header_footer(line: str, known_headers: list) -> bool:
    """Verifica se a linha é um header/footer conhecido."""
    s = line.strip().lower()
    for h in known_headers:
        if h.lower() in s:
            return True
    return False


def remove_urls_from_line(line: str) -> str:
    """Remove URLs embutidas em linhas que não são só URL."""
    return re.sub(r"https?://\S+|www\.\S+", "", line).strip()


def clean_toc_line(line: str) -> str:
    """Remove trailing dots/numbers de linhas de índice (ex: 'Título.... 4' -> 'Título')."""
    # Detecta padrão de sumário: texto seguido de pontinhos e número no final
    cleaned = re.sub(r"[\s.]{4,}\s*\d{1,3}\s*$", "", line)
    return cleaned.strip()


def normalize_whitespace(text: str) -> str:
    """Remove espaços excessivos e linhas em branco consecutivas."""
    lines = text.split("\n")
    cleaned = []
    prev_empty = False
    for line in lines:
        stripped = line.strip()
        # Substitui bullets Unicode problemáticos
        stripped = stripped.replace("\uf0b7", "-")  # bullet Wingdings
        stripped = stripped.replace("\uf0a7", "-")  # bullet quadrado
        if not stripped:
            if not prev_empty:
                cleaned.append("")
                prev_empty = True
        else:
            cleaned.append(stripped)
            prev_empty = False
    return "\n".join(cleaned).strip()


def clean_text(text: str, pdf_name: str) -> str:
    """Pipeline completo de limpeza para um PDF."""
    known_headers = HEADERS_POR_PDF.get(pdf_name, [])
    lines = text.split("\n")
    cleaned_lines = []

    for line in lines:
        stripped = line.strip()

        # Pula linhas vazias (vamos normalizar depois)
        if not stripped:
            cleaned_lines.append("")
            continue

        # Remove números de página isolados
        if is_page_number(stripped):
            continue

        # Remove linhas que são só URL
        if is_url_line(stripped):
            continue

        # Remove headers/footers conhecidos
        if is_header_footer(stripped, known_headers):
            continue

        # Remove URLs embutidas no meio do texto
        cleaned = remove_urls_from_line(line)
        if cleaned:
            # Limpa linhas de sumário com pontinhos + número
            cleaned = clean_toc_line(cleaned)
            if cleaned:
                cleaned_lines.append(cleaned)

    cleaned_text = "\n".join(cleaned_lines)
    cleaned_text = normalize_whitespace(cleaned_text)
    return cleaned_text


# ── Main ─────────────────────────────────────────────────────────────


def main():
    todas_partes = []

    for fname in sorted(os.listdir(PDF_DIR)):
        if not fname.lower().endswith(".pdf"):
            continue

        fpath = os.path.join(PDF_DIR, fname)
        doc = fitz.open(fpath)

        raw_text = ""
        for page in doc:
            raw_text += page.get_text()
        doc.close()

        titulo = fname.replace(".pdf", "")
        limpo = clean_text(raw_text, fname)

        bloco = (
            f"{'=' * 70}\nDOCUMENTO: {titulo}\nORIGEM: {fname}\n{'=' * 70}\n\n{limpo}\n"
        )
        todas_partes.append(bloco)
        print(f"Limpo: {fname} ({len(limpo)} chars)")

    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write("\n".join(todas_partes))

    total = os.path.getsize(OUTPUT)
    print(f"\nArquivo final: {OUTPUT}")
    print(f"Tamanho: {total:,} bytes ({total / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
