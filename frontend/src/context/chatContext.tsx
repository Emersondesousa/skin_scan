import { createContext, useContext, useState } from "react";

type ChatContextType = {
    resposta: string | null;
    setResposta: React.Dispatch<React.SetStateAction<string | null>>;
    carregando: boolean;
    setCarregando: React.Dispatch<React.SetStateAction<boolean>>;
    fotoDiagnostico: string;
    setFotoDiagnostico: React.Dispatch<React.SetStateAction<string>>;
    novoChat: () => void;
};

const ChatContext = createContext({} as ChatContextType);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [resposta, setResposta] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [fotoDiagnostico, setFotoDiagnostico] = useState("");

    function novoChat() {
        setResposta(null);
        setCarregando(false);
        setFotoDiagnostico("");
    }

    return (
        <ChatContext.Provider
            value={{
                resposta,
                setResposta,
                carregando,
                setCarregando,
                fotoDiagnostico,
                setFotoDiagnostico,
                novoChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    return useContext(ChatContext);
}