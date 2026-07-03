import Diagnostico from "@/components/diagnostico";
import Cabecalho from "@/components/header";
import { InputChat } from "@/components/inputChat";
import PhotoCam from "@/components/photo";
import { useAuth } from "@/context/authContext";
import { useChat } from "@/context/chatContext";
import { usePhoto } from "@/context/photoContext";
import { analisarLesao } from "@/services/api";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from "react-native-toast-message";

export default function agentIa() {
    const { photo, setPhoto } = usePhoto()
    const { token } = useAuth()
    const { resposta, setResposta, carregando, setCarregando, fotoDiagnostico, setFotoDiagnostico } = useChat();

    function handleNovoChat() {
        setPhoto("");
        setResposta(null);
        setCarregando(false);
    }

    async function handleEnviar(texto: string) {
        if (!photo) {
            Toast.show({
                type: "error",
                text1: "Atenção",
                text2: "Tire uma foto da lesão primeiro!",
            });
            return;
        }

        if (!token) {
            Toast.show({
                type: "error",
                text1: "Erro",
                text2: "Você precisa estar logado",
            });
            return;
        }

        const fotoParaEnviar = photo;
        setFotoDiagnostico(fotoParaEnviar)
        setPhoto("");
        setCarregando(true);
        setResposta(null);

        try {
            const resultado = await analisarLesao(token, fotoParaEnviar, texto);
            setResposta(resultado.resposta_md);

        } catch (erro: any) {
            Toast.show({
                type: "error",
                text1: "Erro",
                text2: erro.message || "Falha ao analisar lesão",
            });
        } finally {
            setCarregando(false);
        }
    }
    
    return (
        <GestureHandlerRootView>
            <SafeAreaView style={styles.container}>
                    <Cabecalho></Cabecalho>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ios: "padding", android: "padding"})}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
                            <Diagnostico foto={fotoDiagnostico || undefined} resposta={resposta || undefined} carregando={carregando}></Diagnostico>
                        </ScrollView>
                        <PhotoCam></PhotoCam>
                        <InputChat style={styles.input} placeholder="Descreva a lesão..." onSend={handleEnviar}></InputChat>
                    </KeyboardAvoidingView>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f6f8",
    },
    input: {
        marginBottom: 5,
    },  
})