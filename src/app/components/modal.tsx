import AntDesign from '@expo/vector-icons/AntDesign';
import { Modal, StyleSheet, Text, View } from "react-native";

type Props = { visible: boolean };

export default function Options({ visible }: Props) {
    return (
        <Modal visible={visible} transparent={true} animationType="slide" style={styles.modal}>
            <View>
                <Text><AntDesign name="file-image" size={24} color="black" />Anexar Foto</Text>
                <Text><AntDesign name="file" size={24} color="black" /> Anexar Arquivo</Text>
                <Text><AntDesign name="camera" size={24} color="black" />Câmera</Text>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        
    }
})