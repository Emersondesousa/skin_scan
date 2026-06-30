import DrawerContent from "@/components/drawerOptions";
import { PhotoProvider } from "@/context/photoContext";
import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <PhotoProvider>
      <Drawer screenOptions={{headerShown: false, drawerStyle: {width: 260}}} drawerContent={() => <DrawerContent/>}>
        <Drawer.Screen name="assistant"/>
        <Drawer.Screen name="index"/>
      </Drawer>
    </PhotoProvider>
  );
}