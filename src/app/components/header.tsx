import Feather from '@expo/vector-icons/Feather';
import { router, useNavigation } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Cabecalho() {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Feather name="align-justify" size={34} color="black" style={styles.featherMenu} />
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source={require("../../../assets/images/logo_3.png")} style={styles.illustration}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace("/")}>
                <Feather name="log-out" size={34} color="black" style={styles.featherLogout} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#DCDCDC",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    illustration: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    featherMenu: {
        marginLeft: 8,
        marginTop: 2
    },
    featherLogout: {
        marginRight: 8,
        marginTop: 3
    },
})