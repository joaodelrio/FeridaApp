import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, StatusBar, Button, Pressable, ActivityIndicator, GestureResponderEvent, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../styles/global';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

    return (        
        <View style={globalStyles.container}>
            <View style={styles.images}>
                <Image style={StyleSheet.absoluteFill} source={{uri: `file://'${imageSource}`}}  />
                <View style={styles.botoesCamera}>
                    {buttonMode == "menu" && (
                    <>
                        <Pressable style={styles.botaoIcon} onPress={segHandler}>
                            <View style={{padding: 10}}>
                                <MaterialCommunityIcons name='ruler-square-compass' size={24} color="white" />
                            </View>
                        </Pressable>
                        <Pressable style={styles.botaoIcon} onPress={classHandler}>
                            <View style={{padding: 10}}>
                                <MaterialCommunityIcons name='pencil' size={24} color="white" />
                            </View>
                        </Pressable>
                    </>
                    )}
                    {buttonMode == "segmentation" && (
                    <>
                       <Pressable style={styles.botaoIcon} onPress={confirmHandler}>
                            <View style={{padding: 10}}>
                                <MaterialCommunityIcons name='check' size={24} color="white" />
                            </View>
                        </Pressable>
                        <Pressable style={styles.botaoIcon} onPress={cancelHandler}>
                            <View style={{padding: 10}}>
                                <MaterialCommunityIcons name='close' size={24} color="white" />
                            </View>
                        </Pressable> 
                    </>
                    )}
                    {buttonMode == "classification" && (
                    <>
                       <Pressable style={styles.botaoIcon} onPress={confirmHandler}>
                            <View style={{padding: 10}}>
                                <MaterialCommunityIcons name='check' size={24} color="white" />
                            </View>
                        </Pressable>
                        <Pressable style={styles.botaoIcon} onPress={cancelHandler}>
                            <View style={{padding: 10}}>
                                <MaterialCommunityIcons name='close' size={24} color="white" />
                            </View>
                        </Pressable> 
                        <Pressable style={{backgroundColor: "red", borderRadius: 50, margin: 15, padding: 9}}>
                            <View style={{padding: 10}}>
                            </View>
                        </Pressable>
                        <Pressable style={{backgroundColor: "green", borderRadius: 50, margin: 15, padding: 9}}>
                            <View style={{padding: 10}}>
                            </View>
                        </Pressable>
                        <Pressable style={{backgroundColor: "blue", borderRadius: 50, margin: 15, padding: 9}}>
                            <View style={{padding: 10}}>
                            </View>
                        </Pressable>
                        

                    </>
                    )}
                </View>
            </View>
            <View style={styles.botoesContainer}>
                <Pressable style={styles.botao} onPress={backHandler}>
                    <Text style={globalStyles.textbotao}>Voltar</Text>
                </Pressable>
                <Pressable style={styles.botao}>
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