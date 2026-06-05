import { Input } from "@/app/components/input";
import Feather from '@expo/vector-icons/Feather';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";


export default function agentIa() {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Feather name="align-justify" size={34} color="black" style={styles.feather} />
            </TouchableOpacity>
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
    feather: {
        marginLeft: 5,
    }
})