import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "@/services/api";

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

type AuthContextData = {
  usuario: Usuario | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signUp: (nome: string, email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({
  usuario: null,
  token: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao abrir o app, verifica se já tem token salvo
  useEffect(() => {
    async function carregarSessao() {
      try {
        const tokenSalvo = await AsyncStorage.getItem("@skinscan_token");
        if (tokenSalvo) {
          const dados = await api.buscarUsuario(tokenSalvo);
          setToken(tokenSalvo);
          setUsuario(dados);
        }
      } catch {
        await AsyncStorage.removeItem("@skinscan_token");
      } finally {
        setIsLoading(false);
      }
    }
    carregarSessao();
  }, []);

  async function signIn(email: string, senha: string) {
    const dados = await api.login(email, senha);
    await AsyncStorage.setItem("@skinscan_token", dados.token);
    setToken(dados.token);
    setUsuario(dados.usuario);
  }

  async function signUp(nome: string, email: string, senha: string) {
    const dados = await api.cadastrar(nome, email, senha);
    await AsyncStorage.setItem("@skinscan_token", dados.token);
    setToken(dados.token);
    setUsuario(dados.usuario);
  }

  async function signOut() {
    await AsyncStorage.removeItem("@skinscan_token");
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, token, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}