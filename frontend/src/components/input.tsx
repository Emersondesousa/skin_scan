
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
        borderWidth: 1,
        borderColor: "#DCDCDC",
        borderRadius: 8,
        backgroundColor: "#f5f6f8", 
        height: 48,
        paddingHorizontal: 12,
        overflow: 'hidden', 
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333", 
        backgroundColor: "transparent", 
        height: "100%", 
        paddingVertical: 0, 
    },
    icon: {
        paddingLeft: 8,
    },
})
// const styles = StyleSheet.create({
//     container: {
//         flexDirection: "row",
//         alignItems: "center",
//         borderWidth: 1,
//         borderColor: "#DCDCDC",
//         borderRadius: 8,
//         backgroundColor: "#f5f6f8d5", // Cor de fundo principal
//         height: 48,
//         paddingHorizontal: 12,
//     },
//     input: {
//         flex: 1,
//         fontSize: 16,
//         backgroundColor: "transparent", // Mude aqui para transparente
//         height: "100%", // Garante que ele ocupe toda a altura do container
//     },
//     icon: {
//         paddingLeft: 8,
//     },
// })