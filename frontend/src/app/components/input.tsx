import Options from "@/app/components/modal";
import { Ionicons } from "@expo/vector-icons";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useState } from "react";
import { StyleProp, StyleSheet, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from "react-native";

type InputProps = TextInputProps & {style?: StyleProp<ViewStyle>;};


export function Input({style, ...rest}: InputProps) {
    const [ visible, setVisible ] = useState(false)
    
    return (
        <View style={[styles.container, style]}>
            <Options visible={visible}></Options>
            <TouchableOpacity onPress={() => setVisible(!visible)}>
                <Ionicons name="add-circle" size={35} color="#008080"/>
            </TouchableOpacity>
            <TextInput style={styles.input} placeholderTextColor="#9CA3AF" {...rest}/>  
            <TouchableOpacity>
                <EvilIcons name="arrow-up" size={45} color="black"/>
            </TouchableOpacity>
        </View>   
)}

const styles = StyleSheet.create({
    input: {
        width: "100%",
        color: "#FFFFFF",
        height: 48,
        borderRadius: 13,
        borderWidth: 0,
        fontSize: 20,
        paddingLeft: 16,
        marginLeft: 5,
        outlineStyle: "none" as any,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        height: 56,
        borderRadius: 28,
        backgroundColor: "#807d7d",
        paddingHorizontal: 12,
        width: "98%",
        marginLeft: 3,
    }
})