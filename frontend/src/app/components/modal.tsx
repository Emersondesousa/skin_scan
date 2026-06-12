import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = { visible: boolean };

export default function Options({ visible }: Props) {
    if (!visible) return null;

    return (
        <View style={styles.menu}>
            <TouchableOpacity>
                <Text><AntDesign name="file-image" size={24} color="black" />Anexar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text><AntDesign name="file" size={24} color="black" />Anexar Arquivo</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text><AntDesign name="camera" size={24} color="black" />Câmera</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    menu: {
        position: "absolute",
        bottom: 40,
        left: 35,
        backgroundColor: "#ece3e3",
        borderRadius: 12,
        padding: 12,
        elevation: 5,
        gap: 5,
    }
})