import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, FlatList, Image} from 'react-native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { FontAwesome5 } from '@expo/vector-icons';

export default function Galeria({ navigation }) {

    const [photos, setPhotos] = useState([]);
    const [buttonMode, setButtonMode] = useState("off");
    const [clickedIndex, setClickedIndex] = useState('');

    const exitHandler = () => {
        navigation.navigate('Home');
      };

    const buttonHandler = (index) => {
        if(buttonMode == "off"){
            setButtonMode("on");
            setClickedIndex(index);
            console.log("Botão ligado");
        } else {
            setButtonMode("off");
            setClickedIndex(null);
            console.log("Botão desligado");
        }
    }

    const driveHandler = () => {
        console.log("Salvando no drive...");
    }

    const getAllPhotos = async () => {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
            groupName: 'Aruco',
          })
          .then(r => {
            setPhotos(r.edges);
          })
          .catch((err) => {
             //Error Loading Images
          });
        };

        useEffect(() => {
            getAllPhotos();
        }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.fotosContainer}>
                <FlatList  data={photos} horizontal={false} numColumns={2} renderItem={({item, index})=>{
                    return(
                        <View style={styles.listaFotos}>
                            <Pressable onPress={() => buttonHandler(index)}>
                            <Image source={{uri: item.node.image.uri}} style={{width: 184, height: 184}}/>
                            {buttonMode === "on" && clickedIndex === index && (
                                <View style={{flexDirection: 'row'}}>
                                    <Pressable style={styles.botaoIcon} onPress={driveHandler}>
                                        <FontAwesome5 name='google-drive' size={24} color="white" />
                                    </Pressable>
                                    <Pressable style={styles.botaoIcon}>
                                        <FontAwesome5 name='whatsapp' size={24} color="white" />
                                    </Pressable>
                                </View>
                            )}
                            </Pressable>
                            
                        </View>
                    )
                
                }}/>
             </View>
            <View style={styles.botoesContainer}>
                <Pressable style={styles.botao} onPress={exitHandler}>
                    <Text style={styles.textbotao}>Tela Inicial</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    text : {
        fontSize: 20,
    },
    titulo: {
        paddingTop: 95,
        paddingBottom: 50,
        fontSize: 37,
        fontWeight: 'bold',
        color: '#698C8C',
    },
    botoesContainer: {
        width: '100%',
        margin: 3,
        flex: 1,
        alignItems: 'center',
    },
    botao: {
        backgroundColor: '#1E3C40',
        width: '40%',
        padding: 10,
        margin: 10,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    textbotao: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
    },
    listaFotos: {
        padding: 5,
    },
    fotosContainer: {
        width: '100%',
        height: '88%',
        alignItems: 'center',
        position: 'relative',
        
    },
    botaoIcon: {
        padding: 2,
        backgroundColor: '#1E3C40',
        // borderRightColor: 'black',
        // borderRightWidth: 1,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});