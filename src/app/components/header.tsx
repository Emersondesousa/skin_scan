import Feather from '@expo/vector-icons/Feather';
import { Image, StyleSheet, View } from "react-native";

export default function Cabecalho() {
    return (
        <View style={styles.container}>
            <Feather name="align-justify" size={34} color="black" style={styles.feather} />
            <View style={styles.container_logo}>
                <Image source={require("../../assets/images/logo_2.png")} style={styles.illustration}></Image>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    container_logo: {

    },
    illustration: {

    },
    feather: {
        
    }
})