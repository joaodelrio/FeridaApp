import React, {useEffect, useRef, useState} from 'react';
import { View, Text, StyleSheet, StatusBar, Button, Pressable, ActivityIndicator, GestureResponderEvent, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import { useCameraDevice, useCameraPermission, Camera } from 'react-native-vision-camera';
import { MaterialIcons } from '@expo/vector-icons';

export default function CameraAruco({ navigation}) {
    const backHandler = () => {
        navigation.navigate('Home');
        //navigation.push('Home');
    }

    const {hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');
    const [imageSource, setImageSource] = useState('');
    const camera = useRef(null);
    const [flashMode, setFlashMode] = useState('off');
    

    useEffect(() => {
      if (!hasPermission) {
        requestPermission();
      }
    }
    , [hasPermission]);

    console.log('hasPermission', hasPermission);

    if (device == null) return <ActivityIndicator />;

    if(!hasPermission){
      return <Text>No permission</Text>
    }
      
    if(!device){
      return <Text>No device</Text>
    }

    const openCamera = async () => {
      try {
        // Inicializar a câmera
            // Abrir a câmera
        await Camera;
        setCameraOpen(true);
      } catch (error) {
        console.error('Erro ao abrir a câmera:', error);
      }
    };

    const capturePhoto = async () => {    
        if(camera.current !== null) {
            const photo = await camera.current.takePhoto();
            console.log(photo.path);
            navigation.navigate('Foto', {imageSource: photo.path});
        }
    }

    const flashHandler = () => {
        if(flashMode == 'off') {
            setFlashMode('on');
        } else {
            setFlashMode('off');
        }
    }

    return (        
        <View style={globalStyles.container}>
            {/* Faz uma tela verde*/}
            <View style={styles.cameraContainer}>
                <Camera ref={camera} device={device} style={StyleSheet.absoluteFill} isActive={true} torch={flashMode} photo={true}></Camera>
                <View style={styles.botoesCamera}>
                    <Pressable style={styles.botaoIcon} onPress={flashHandler}>
                        <View style={{padding: 10}}>
                            <MaterialIcons name={flashMode == "on" ?"flash-on":"flash-off"} size={24} color="white" />
                        </View>
                    </Pressable>
                </View>
            </View>
            <View style={styles.botoesContainer}>
                <Pressable style={styles.botao} onPress={backHandler}>
                    <Text style={globalStyles.textbotao}>Voltar</Text>
                </Pressable>
                <Pressable style={styles.botao} onPress={capturePhoto}>
                    <Text style={globalStyles.textbotao}>Tirar foto</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        width: '100%',
        height: '90%',
        backgroundColor: 'green',
        position: 'relative',
    },
    botoesContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        
    },
    botao: {
        width: '47%',
        padding: 13,
        margin: 4,
        backgroundColor: '#1E3C40',
        alignContent: 'center',
        borderRadius: 9,
    },
    botoesCamera: {
        position: 'absolute',
        top: 25,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    botaoIcon: {
        padding: 2,
        margin: 10,
        backgroundColor: '#1E3C40',
        borderRadius: 50,
    }
});