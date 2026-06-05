import Cabecalho from "@/app/components/header";
import { Input } from "@/app/components/input";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";


export default function agentIa() {
    return (
        <View style={styles.container}>
            <Cabecalho></Cabecalho>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ios: "padding", android: "height"})}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
                </ScrollView>
                <Input style={styles.input} placeholder="Descreva a lesão..."></Input>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#008080",
    },
    input: {
        marginBottom: 10
    },
})