import DrawerContent from "@/components/drawerOptions";
import { AuthProvider, useAuth } from "@/context/authContext";
import { PhotoProvider } from "@/context/photoContext";
import { Drawer } from "expo-router/drawer";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";


function LayoutInterno() {
  const { usuario, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f6f8" }}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <Drawer screenOptions={{headerShown: false, drawerStyle: {width: 260}}} drawerContent={() => <DrawerContent/>}>
      {usuario ? (
        <Drawer.Screen name="assistant"/>
      ) : (
        <Drawer.Screen name="index"/>
      )}
    </Drawer>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <PhotoProvider>
        <LayoutInterno />
        <Toast />
      </PhotoProvider>
    </AuthProvider>
  );
}