import { Drawer } from "expo-router/drawer";
import DrawerContent from "./components/drawerOptions";

export default function Layout() {
  return (
    <Drawer screenOptions={{headerShown: false, drawerStyle: {width: 220}}} drawerContent={() => <DrawerContent/>}>
      <Drawer.Screen name="assistant"/>
      <Drawer.Screen name="index"/>
    </Drawer>
  );
}