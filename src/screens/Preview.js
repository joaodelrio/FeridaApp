import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, Image, Alert } from 'react-native';
import { globalStyles } from '../styles/global';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

export default function CameraAruco({ route, navigation}) {

    const {imageSource} = navigation.state.params;
    const [buttonMode, setButtonMode] = useState("menu");

    const backHandler = () => {
        navigation.navigate('Camera');
        //navigation.push('Home');
    }

    const segHandler = () => {
        setButtonMode("segmentation");
        //navigation.push('Home');
    }

    const classHandler = () => {
        setButtonMode("classification");
        //navigation.push('Home');
    }

    const confirmHandler = () => {
        setButtonMode("menu");
        //navigation.push('Home');
    }

    const cancelHandler = () => {
        setButtonMode("menu");
        //navigation.push('Home');
    }

    const uploadHandler = () => {
        //CameraRoll.save(imageSource, {type: 'photo', album: 'Aruco'})
        if (Platform.OS === 'android') {
            Alert.alert('Salvar', 'Deseja salvar a imagem?', [
                {text: 'Sim', onPress: () => {
                    CameraRoll.saveAsset(imageSource, {type: 'photo', album: 'Aruco'});
                    console.log("Imagem salva");
                    navigation.replace('Galeria')
                }},
                {text: 'Não', onPress: () => console.log('Cancelado')},
            ]);
        }
        
    }

    return (
        <View style={globalStyles.container}>
            <View style={styles.images}>
                <Image style={StyleSheet.absoluteFill} source={{uri: `file://'${imageSource}`}}  />
            </View>
            <View style={styles.botoesContainer}>
                <Pressable style={styles.botao} onPress={backHandler}>
                    <Text style={globalStyles.textbotao}>Voltar</Text>
                </Pressable>
                <Pressable style={styles.botao} onPress={uploadHandler}>
                    <Text style={globalStyles.textbotao}>Salvar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    images: {
        width: '100%',
        height: '90%',
        backgroundColor: 'green',
        position: 'relative',
    },
    botoesCamera: {
        position: 'absolute',
        top: 25,
        right: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    botaoIcon: {
        padding: 2,
        margin: 10,
        backgroundColor: '#1E3C40',
        borderRadius: 50,
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
});