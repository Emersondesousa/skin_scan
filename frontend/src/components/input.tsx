
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";


export default function Input({ secureTextEntry, ...rest }: TextInputProps) {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} secureTextEntry={secureTextEntry && !mostrarSenha} {...rest}></TextInput>
            {secureTextEntry && (
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.icon}>
                <MaterialCommunityIcons key={mostrarSenha ? "off" : "on"} name={mostrarSenha ? "eye-off" : "eye"} size={24} color="#666"/>
            </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0,
        borderRadius: 8,
        backgroundColor: "#f5f6f8", 
        height: 48,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: "90%", 
        paddingVertical: 0,
        outlineStyle: "none" as any
    },
    icon: {
        paddingLeft: 8,
    },
})
