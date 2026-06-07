import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MenuItemProps {
  label: string;
}

const MenuItem = ({ label }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem}>
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

export default function DrawerContent() {
    return (
        <View>
            <View style={styles.titulo}>
                <TouchableOpacity>
                    <Image source={require("../../../assets/images/logo_3.png")} style={styles.illustration}></Image>
                </TouchableOpacity>
                <Text style={styles.tituloText}>SkinSkan</Text>
            </View>
            <View style={styles.container}>
                <MenuItem label="Início" />
                <MenuItem label="Histórico" />
                <MenuItem label="Configurações" />
                <MenuItem label="Sair" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  menuItem: {
    paddingVertical: 15,
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
  }
});