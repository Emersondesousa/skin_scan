import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = { visible: boolean; onClose: () => void };

export default function Options({ visible, onClose }: Props) {
    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose} />
            <View style={styles.menu}>
                <TouchableOpacity onPress={() => { onClose(); }}>
                    <Text><AntDesign name="file-image" size={24} color="black"/>{" "}Anexar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { onClose(); }}>
                    <Text><AntDesign name="file" size={24} color="black" />{" "}Anexar Arquivo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { onClose(); router.push("/camera"); }}>
                    <Text><AntDesign name="camera" size={24} color="black" />{" "}Câmera</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1, 
    },
    menu: {
        position: "absolute",
        bottom: 70, 
        left: 35,
        backgroundColor: "#ece3e3",
        borderRadius: 12,
        padding: 12,
        elevation: 5,
        gap: 15,
    }
})
