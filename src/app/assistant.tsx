import { Input } from "@/app/components/input";
import Options from "@/app/components/modal";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";


export default function agentIa() {
    const [ visible, setVisible ] = useState(false)
    
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ios: "padding", android: "height"})}>
            <Options visible={visible}></Options>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => setVisible(true)}>
                        <Ionicons name="add-circle" size={35} color="#008080"></Ionicons>
                    </TouchableOpacity>
                    <Input style={styles.input}></Input>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 28,
        width: "85%",
        alignSelf: "center",
        backgroundColor: "#807d7d"
    },
    container: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 20,
    }
})