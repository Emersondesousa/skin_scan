import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "./components/button";

export default function Index(){
    return (
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                <Image
                source={require("../../assets/images/logo.png")} style={styles.illustration}/>
            </View>
            <View style={styles.containerTittle}>
                <Text style={styles.title}>Bem-vindo ao SkinScan</Text>
                <Text style={styles.subtitle}>Avaliação inteligente para apoiar o cuidado ao paciente.</Text>
                <Button label="Entrar" style={styles.button} onPress={() => router.push("/assistant")}/>
            </View>
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#008080",
    },
    containerLogo: {
        height: 350,
        backgroundColor: "#f5f6f8",
        borderBottomLeftRadius: 1000,
        borderBottomRightRadius: 1000,
        transform: [{ scaleX: 1.5 }],
    },
    containerTittle: {
    },
    illustration: {
        width: "100%",
        height: 230,
        borderRadius: 60,
        resizeMode: "contain",
        marginTop: 45,
    },
    title: {
        fontSize: 25,
        fontWeight: 900,
        marginTop: 40,
        marginLeft: 10,
        color: "#f5f6f8"
    },
    subtitle: {
        fontSize: 16,
        marginTop: -2,
        marginLeft: 10,
        color: "#f5f6f8"
    },
    button: {
        marginTop: 25,
        marginLeft: 20,
    }
})
    