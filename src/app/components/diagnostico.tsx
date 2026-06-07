import { Image, StyleSheet, Text, View } from "react-native";

export default function Diagnostico() {
    return(
        <View style={styles.container}>
            <View style={styles.containerTitle}>
                <Text>Diagnóstico</Text>
            </View>
            <View>
                <Image source={require("../../../assets/images/foto-queimadura.png")} style={styles.illustration}></Image>
            </View>
            <View style={styles.diagnostico}>
                <Text>Lesão compatível com queimadura de 3º grau</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    containerTitle: {

    },
    illustration: {
        width: "100%",
        height: 230,
    },
    diagnostico: {

    }
})
