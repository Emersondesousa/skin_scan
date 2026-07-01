// URL base do backend — mude para a URL do EasyPanel em produção
const BASE_URL = "http://localhost:8000";

// ==========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ==========================================

export async function cadastrar(nome: string, email: string, senha: string) {
  const resposta = await fetch(`${BASE_URL}/api/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.detail || "Erro ao cadastrar");
  }

  return resposta.json();
}

export async function login(email: string, senha: string) {
  const resposta = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.detail || "Erro ao fazer login");
  }

  return resposta.json();
}

export async function buscarUsuario(token: string) {
  const resposta = await fetch(`${BASE_URL}/api/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!resposta.ok) {
    throw new Error("Token inválido");
  }

  return resposta.json();
}

// ==========================================
// FUNÇÃO DE ANÁLISE DE LESÃO
// ==========================================

export async function analisarLesao(token: string, imagemUri: string, sintomas: string) {
  const formData = new FormData();

  // No Expo Web, convertemos a URI da imagem para Blob
  const respostaImagem = await fetch(imagemUri);
  const blob = await respostaImagem.blob();

  formData.append("file", blob, "foto.jpg");
  formData.append("sintomas", sintomas);

  const resposta = await fetch(`${BASE_URL}/api/analyze-injury`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.detail || "Erro ao analisar lesão");
  }

  return resposta.json();
}