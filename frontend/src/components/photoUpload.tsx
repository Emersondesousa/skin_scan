import * as ImagePicker from "expo-image-picker";

export async function selecionarImagem(setPhoto: (uri: string) => void) {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
        return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
    });

    if (!resultado.canceled) {
        setPhoto(resultado.assets[0].uri);
    }
}