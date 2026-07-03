import Cabecalho from '@/components/header';
import { usePhoto } from '@/context/photoContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraPicture() {
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const { setPhoto } = usePhoto();
    const [carregando, setCarregando] = useState(false)

    const handlePic = async () => {
        const photo = await cameraRef.current?.takePictureAsync();

        if (!photo) return;
            setPhoto(photo.uri);
            router.back();
        };
        const toggleCameraFacing = () => {
            setCarregando(true);
            setFacing(prev => (prev === 'back' ? 'front' : 'back'));
        };

    const handlePermission = async () => {
        if (!permission?.granted) {
            await requestPermission();
        }
    };

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.containerPermission}>
                <MaterialIcons name="camera-alt" size={80} color="#cbd5e1" style={{ marginBottom: 20 }} />
                <Text style={styles.message}>Precisamos da sua permissão para usar a câmera</Text>
                <TouchableOpacity style={styles.buttonPermission} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Permitir Acesso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Cabecalho></Cabecalho>
            <CameraView key={facing} ref={cameraRef} facing={facing} style={styles.container} onCameraReady={() => setCarregando(false)} />
            {carregando && (
                <View style={styles.overlayLoading}>
                    <ActivityIndicator size="large" color="#008080" />
                </View>
            )}
            <TouchableOpacity style={styles.button} onPress={handlePic} />
            <TouchableOpacity style={styles.buttonVirarCam} onPress={toggleCameraFacing}>
                <MaterialIcons name="cameraswitch" size={44} color="white"/>  
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    containerPermission: { 
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#f5f6f8',
        padding: 20,
    },
    message: {
        textAlign: 'center',
        fontSize: 18,
        color: '#4b5563',
        marginBottom: 20,
        fontWeight: '500',
    },
    buttonPermission: {
        backgroundColor: '#008080', 
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
    },
    button: {
        width: 70, 
        height: 70, 
        bottom: 50, 
        zIndex: 2, 
        position: 'absolute',
        backgroundColor: 'white', 
        alignSelf: 'center', 
        borderRadius: 35,
    },
    featherCam: {
        marginLeft: 8,
        marginTop: 2,
    },
    buttonVirarCam: {
        width: 70, 
        height: 55, 
        bottom: 50, 
        zIndex: 2, 
        position: 'absolute',
        marginLeft: 280,
        borderRadius: 35,
    },
    overlayLoading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },   
})