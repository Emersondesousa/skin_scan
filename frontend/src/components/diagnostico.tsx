import { Image, StyleSheet, Text, View } from "react-native";

export default function Diagnostico() {
    return(
        <View style={styles.container}>
            <View style={styles.containerTitle}>
                <Text>Diagnóstico</Text>
            </View>
            <View>
                <Image source={require("../../assets/images/foto-queimadura.png")} style={styles.illustration}></Image>
            </View>
            <View style={styles.diagnostico}>
                <Text>Lesão compatível com queimadura de 3º grau</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        gap: 5,
        marginLeft: 15,
    },
    containerTitle: {
    },
    illustration: {
        width: "90%",
        height: 230,
        marginLeft: 10,
        borderRadius: 15,
    },
    diagnostico: {
    }
})
