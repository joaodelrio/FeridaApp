import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, StatusBar, Button, Pressable, ActivityIndicator, GestureResponderEvent, TouchableOpacity } from 'react-native';
import { useCameraDevice, useCameraPermission, Camera } from 'react-native-vision-camera';

export default function CameraApp({ navigation}) {

    const pressHandler = () => {
        navigation.navigate('Home');
        //navigation.push('Home');
    }

    const {hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');
  


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

    return (        
        <View style={styles.container}>
            <Camera device={device} style={StyleSheet.absoluteFill} isActive={true}></Camera>             
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 50,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text : {
        fontSize: 20,
    },
    titulo: {
        paddingTop: 115,
        paddingBottom: 50,
        fontSize: 37,
        fontWeight: 'bold',
        color: '#698C8C',
    },
    botoesContainer: {
        width: '100%',
        marginTop: 75,
        alignItems: 'center',
    },
    botao: {
        width: '100%',
        margin: 20,
        padding: 13,
        backgroundColor: '#1E3C40',
        alignContent: 'center',
        borderRadius: 9,
    },
    textbotao: {
        color: '#fff',
        fontFamily: 'Roboto',
        textAlign: 'center',
        fontSize: 15,
    },
});