import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native"

type ButtonProps = TouchableOpacityProps & {label: string}

export function Button({label, style, ...rest}: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.container, style]} {...rest} activeOpacity={0.7}>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 48,
        backgroundColor: "#3CB371",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    label: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: 600,
    }
})