import { Text, TouchableOpacity, View } from "react-native";

export default function DrawerContent() {
    return (
        <View>
            <TouchableOpacity>
                <Text>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>Histórico</Text>
            </TouchableOpacity>          
            <TouchableOpacity>
                <Text>Configurações</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>Sair</Text>
            </TouchableOpacity>
        </View>
    )
}