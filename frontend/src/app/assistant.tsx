import Diagnostico from "@/components/diagnostico";
import Cabecalho from "@/components/header";
import { InputChat } from "@/components/inputChat";
import PhotoCam from "@/components/photo";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function agentIa() {
    
    return (
        <GestureHandlerRootView>
            <SafeAreaView style={styles.container}>
                    <Cabecalho></Cabecalho>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ios: "padding", android: "padding"})}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
                            <Diagnostico></Diagnostico>
                        </ScrollView>
                        <PhotoCam></PhotoCam>
                        <InputChat style={styles.input} placeholder="Descreva a lesão..." ></InputChat>
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