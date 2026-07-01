import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import Markdown from "react-native-markdown-display";

type Props = {
    foto?: string;
    resposta?: string;
    carregando?: boolean;
};

export default function Diagnostico({ foto, resposta, carregando }: Props) {
    // Estado inicial — sem foto nem resposta
    if (!foto && !resposta && !carregando) {
        return (
            <View style={styles.container}>
                <View style={styles.containerTitle}>
                    <Text style={styles.titulo}>Diagnóstico</Text>
                </View>
                <View style={styles.mensagemInicial}>
                    <Text style={styles.textoInicial}>
                        Tire uma foto da lesão e descreva os sintomas para receber uma análise.
                    </Text>
                </View>
            </View>
        )
    }

    // Carregando — IA processando
    if (carregando) {
        return (
            <View style={styles.container}>
                <View style={styles.containerTitle}>
                    <Text style={styles.titulo}>Diagnóstico</Text>
                </View>
                {foto && (
                    <Image source={{ uri: foto }} style={styles.illustration} />
                )}
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#008080" />
                    <Text style={styles.loadingText}>Analisando lesão com IA...</Text>
                </View>
            </View>
        )
    }

    // Com resposta
    return (
        <View style={styles.container}>
            <View style={styles.containerTitle}>
                <Text style={styles.titulo}>Diagnóstico</Text>
            </View>
            {foto && (
                <Image source={{ uri: foto }} style={styles.illustration} />
            )}
            <View style={styles.diagnostico}>
                {resposta ? (
                    <Markdown style={markdownStyles}>{resposta}</Markdown>
                ) : (
                    <Text>Não foi possível obter uma análise.</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        gap: 5,
        marginLeft: 15,
        marginRight: 15,
    },
    containerTitle: {
    },
    titulo: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    illustration: {
        width: "100%",
        height: 230,
        borderRadius: 15,
        resizeMode: "cover",
    },
    diagnostico: {
        marginTop: 5,
    },
    mensagemInicial: {
        padding: 20,
        alignItems: "center",
    },
    textoInicial: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
    },
    loadingContainer: {
        alignItems: "center",
        padding: 30,
        gap: 10,
    },
    loadingText: {
        fontSize: 16,
        color: "#008080",
    },
})

const markdownStyles = {
    body: { fontSize: 15, color: "#333", lineHeight: 22 },
    heading1: { fontSize: 22, fontWeight: "700", marginTop: 10, marginBottom: 5, color: "#008080" },
    heading2: { fontSize: 18, fontWeight: "600", marginTop: 8, marginBottom: 4, color: "#008080" },
    heading3: { fontSize: 16, fontWeight: "600", marginTop: 6, marginBottom: 3, color: "#333" },
    paragraph: { marginBottom: 8 },
    strong: { fontWeight: "700" },
    em: { fontStyle: "italic" },
    list_item: { marginBottom: 4 },
    bullet_list: { marginLeft: 10 },
    ordered_list: { marginLeft: 10 },
};
