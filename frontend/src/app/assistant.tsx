import Diagnostico from "@/components/diagnostico";
import Cabecalho from "@/components/header";
import { InputChat } from "@/components/inputChat";
import PhotoCam from "@/components/photo";
import { useAuth } from "@/context/authContext";
import { usePhoto } from "@/context/photoContext";
import { analisarLesao } from "@/services/api";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function agentIa() {
    const [resposta, setResposta] = useState<string | null>(null)
    const [carregando, setCarregando] = useState(false)
    const { photo, setPhoto } = usePhoto()
    const { token } = useAuth()

    async function handleEnviar(texto: string) {
        if (!photo) {
            return Alert.alert("Atenção", "Tire uma foto da lesão primeiro!")
        }
        if (!token) {
            return Alert.alert("Erro", "Você precisa estar logado")
        }

        setCarregando(true)
        setResposta(null)
        try {
            const resultado = await analisarLesao(token, photo, texto)
            setResposta(resultado.resposta_md)
        } catch (erro: any) {
            Alert.alert("Erro", erro.message || "Falha ao analisar lesão")
        } finally {
            setCarregando(false)
        }
    }
    
    return (
        <GestureHandlerRootView>
            <SafeAreaView style={styles.container}>
                    <Cabecalho></Cabecalho>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ios: "padding", android: "padding"})}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
                            <Diagnostico foto={photo || undefined} resposta={resposta || undefined} carregando={carregando}></Diagnostico>
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