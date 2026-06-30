import { usePhoto } from "@/context/photoContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function PhotoCam() {

    const { photo, setPhoto } = usePhoto();

    if (photo === "") return null;

    return (
        <View style={styles.fotoContainer}>
            <View style={styles.imagem}>
                <Image source={{ uri: photo }} style={styles.foto} />
                <TouchableOpacity style={styles.deleteButton} onPress={() => setPhoto("")}>
                    <MaterialIcons name="close" size={10} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    foto: {
        width: 80,
        height: 80,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#008080',  
    },
    fotoContainer: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    deleteButton: {
        position: "absolute",
        top: -5,
        right: -5, 
        width: 20, 
        height: 20,
        borderRadius: 10,
        backgroundColor: "#ff3b30",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10, 
        elevation: 5,
    },
    imagem: {
        width: 80,
        height: 80,
    }
});