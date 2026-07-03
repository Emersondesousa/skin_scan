import { Button } from "@/components/button";
import Input from "@/components/input";
import { useAuth } from "@/context/authContext";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function SignUp(){
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [carregando, setCarregando] = useState(false)
    const { signUp } = useAuth()

    async function handleSignUp() {
        if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
            Toast.show({
                type: "error",
                text1: "Cadastrar",
                text2: "Preencha todos os campos!",
            });
            return;
        }

        if (senha !== confirmarSenha) {
            Toast.show({
                type: "error",
                text1: "Cadastrar",
                text2: "As senhas não coincidem!",
            });
            return;
        }

        if (senha.length < 8) {
            Toast.show({
                type: "error",
                text1: "Cadastrar",
                text2: "A senha deve ter pelo menos 8 caracteres!",
            });
            return;
        }

        setCarregando(true);

        try {
            await signUp(nome, email, senha);

            Toast.show({
                type: "success",
                text1: "Sucesso",
                text2: "Cadastro realizado com sucesso!",
            });

            router.replace("/assistant");
        } catch (erro: any) {
            Toast.show({
                type: "error",
                text1: "Erro",
                text2: erro.message || "Erro ao cadastrar",
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
                        <Text style={styles.title}>Cadastrar</Text>
                        <Text style={styles.subtitle}>Crie sua conta para acessar.</Text>
                    </View>
                    <View style={styles.form}>
                        <Input placeholder="Nome" onChangeText={setNome}></Input>
                        <Input placeholder="E-mail" keyboardType="email-address" onChangeText={setEmail}></Input>
                        <Input placeholder="Senha" secureTextEntry onChangeText={setSenha}></Input>
                        <Input placeholder="Confirmar Senha" secureTextEntry onChangeText={setConfirmarSenha}></Input>
                        <Button label={carregando ? "Cadastrando..." : "Cadastrar"} style={styles.button} onPress={handleSignUp} disabled={carregando}/>
                    </View>
                    <Text style={styles.footerText}>
                        Já tem uma conta? <Link href={"/"} style={styles.footerLink}>Entre aqui.</Link>
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
        marginTop: 5,
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
        color: "#f5f6f8"
    },
    footerLink: {
        color: "#0321d7",
        fontWeight: 700,
    }
})
    