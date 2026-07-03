import { Button } from "@/components/button";
import Input from "@/components/input";
import { useAuth } from "@/context/authContext";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Index(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [carregando, setCarregando] = useState(false)
    const { signIn } = useAuth()

    async function handleSignIn() {
        if (!email.trim() || !password.trim()) {
            Toast.show({
                type: "error",
                text1: "Entrar",
                text2: "Preencha e-mail e senha para entrar!",
            });
            return;
        }

        setCarregando(true);

        try {
            await signIn(email, password);

            Toast.show({
                type: "success",
                text1: "Sucesso",
                text2: "Login realizado com sucesso!",
            });

            router.replace("/assistant");
        } catch (erro: any) {
            Toast.show({
                type: "error",
                text1: "Erro",
                text2: erro.message || "Erro ao fazer login",
            });
        } finally {
            setCarregando(false);
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height" })}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={styles.containerLogo}>
                        <View style={styles.logoContent}>
                            <Image source={require("../../assets/images/logo_2.png")} style={styles.illustration}/>
                        </View>
                    </View>
                    <View style={styles.containerTittle}>
                        <Text style={styles.title}>Entrar</Text>
                        <Text style={styles.subtitle}>Acesse sua conta com e-mail e senha.</Text>
                    </View>
                    <View style={styles.form}>
                        <Input placeholder="E-mail" autoFocus keyboardType="email-address" onChangeText={(text) => (setEmail(text))}></Input>
                        <Input placeholder="Senha" secureTextEntry onChangeText={(text) => (setPassword(text))}></Input>
                        <Button label={carregando ? "Entrando..." : "Entrar"} style={styles.button} onPress={handleSignIn} disabled={carregando}/>
                    </View>
                    <Text style={styles.footerText}>
                        Não tem uma conta?{" "}<Link href={"/signup"} style={styles.footerLink}>Cadastre-se aqui.</Link>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    logoContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        transform: [{ scaleX: 1 / 1.5 }],
    },
    containerTittle: {
    },
    illustration: {
        width: "100%",
        height: 230,
        borderRadius: 60,
        resizeMode: "contain",
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
        marginTop: 2,
    },
    form: {
        gap: 5,
        width: "90%",
        marginLeft: 20,
        marginTop: 5
    },
    footerText: {
        textAlign: "center",
        marginTop: 24,
        //color: "#585860"
        color: "#f5f6f8"
    },
    footerLink: {
        color: "#0321d7",
        fontWeight: 700,
    }
})
    