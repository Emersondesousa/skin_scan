import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { router } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MenuItemProps {
  label: string;
  onPress: () => void;
}

const MenuItem = ({ label, onPress }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

const HISTORY = [
    { id: "1", title: "Lesão no braço - 12/06" },
    { id: "2", title: "Mancha perna - 10/06" },
    { id: "3", title: "Pintas costas - 05/06" },
];

export default function DrawerContent() {
    return (
        <View style={styles.drawer}>
            <View style={styles.titulo}>
                <TouchableOpacity>
                    <Image source={require("../../assets/images/logo_3.png")} style={styles.illustration}></Image>
                </TouchableOpacity>
                <Text style={styles.tituloText}>SkinScan</Text>
                <TouchableOpacity onPress={() => router.replace("/assistant")}>
                    <SimpleLineIcons name="logout" size={24} color="black" style={styles.logoutDrawer}/>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <MenuItem label="Início" onPress={() => router.push("/assistant")}/>
                <MenuItem label="Novo Chat" onPress={() => console.log("ok")}/>
            </View>
            <View style={styles.historicoContainer}>
                <Text style={styles.label}>Histórico</Text>
                <FlatList data={HISTORY} keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.historyItem} onPress={() => console.log("Abrir chat:", item.id)}>
                            <Text style={styles.historyText} numberOfLines={1}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ marginTop: 10 }}
                />
            </View>            
        </View>
    )
}

const styles = StyleSheet.create({
  drawer: {
    marginTop: 5,
  },
  container: {
    padding: 10,
    marginLeft: 5,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
  illustration: {
    width: 50,
    height: 50,
    marginLeft: 10,
    resizeMode: "contain",
  },
  titulo: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    // backgroundColor: "#008080"
  },
  tituloText: {
    marginRight: 20,
    fontSize: 20,
    color: "#494848",
  },
  logoutDrawer: {
    marginLeft: 45,
  },
  historicoContainer: {
    marginLeft: 15,
    marginTop: 15,
  },
  label: {
    fontSize: 18,
    color: '#8b8686',
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyText: {
    fontSize: 16,
    color: '#444',
  },
});