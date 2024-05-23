import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, FlatList, Image, Button, Alert} from 'react-native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { FontAwesome5 } from '@expo/vector-icons';
import {
    GDrive,
    MimeTypes
  } from "@robinbobin/react-native-google-drive-api-wrapper";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
var fs = require('react-native-fs');
import { GoogleAndroidClientId, GoogleIosClientId, GoogleWebClientId } from '../env/env';

export default function Galeria({ navigation }) {

    const [photos, setPhotos] = useState([]);
    const [buttonMode, setButtonMode] = useState("off");
    const [clickedIndex, setClickedIndex] = useState('');
    const [clickedImage, setClickedImage] = useState('');
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState([]);
    const [imageSource, setImageSource] = useState(null);

    const exitHandler = () => {
        navigation.navigate('Home');
      };

    const buttonHandler = (index) => {
        if(buttonMode == "off"){
            setButtonMode("on");
            setClickedIndex(index);
            setClickedImage(photos[index].node.image.uri);
            // Console log do path da imagem
            console.log(clickedImage);
            console.log("Botão ligado");
        } else {
            setButtonMode("off");
            setClickedIndex(null);
            console.log("Botão desligado");
        }
    }

    const driveButton = () => {
        if (Platform.OS === 'android') {
            Alert.alert('Drive', 'Deseja salvar a imagem no drive?', [
                {text: 'Sim', onPress: () => driveHandler()},
                {text: 'Não', onPress: () => console.log('Cancelado')},
            ]);
        }
    }

    const editButton = () => {
        
        console.log(teste);
        navigation.navigate('Foto', {imageSource: teste});
    }



    const driveHandler = async () => {
        let day = new Date().getDate() + '-' + new Date().getMonth() + '-' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
        console.log("Salvando no drive...");
        console.log(clickedImage);
        const gdrive = new GDrive();
        gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
        console.log("Drive configurado");
        //console.log(await gdrive.files.list());
        const filePath = clickedImage;
        //convertendo a imagem em base64
        const res = await
        fs.readFile(filePath, 'base64').then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });

        const id = (await gdrive.files.newMultipartUploader()
        .setData(res, MimeTypes.PNG)
        .setIsBase64(true)
        .setRequestBody({
            name: day ,
            parents: ["1igXlixE4ftYqEu_JBepe0xhjYOre5aHV"]
            
        })
        .execute()
        ).id;

        
        console.log(await gdrive.files.getBinary(id));
        
    }

    const getAllPhotos = async () => {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
            groupName: 'Aruco',
          })
          .then(r => {
            setPhotos(r.edges);
            console.log(r.edges);
          })
          .catch((err) => {
             //Error Loading Images
          });
        };

        //Google Sign In
        const configureGoogleSignIn = () => {
            GoogleSignin.configure({
                webClientId: GoogleWebClientId,
                androidClientId: GoogleAndroidClientId,
                iosClientId: GoogleIosClientId,
                //Dando erro
                scopes: [
                    'https://www.googleapis.com/auth/drive',
                  ],
            });
        }

        const signIn = async () => {
            console.log("Sign in");
            try{
                console.log("Try");
                await GoogleSignin.hasPlayServices();
                const info = await GoogleSignin.signIn();
                setUserInfo(info);
                console.log(info);
            } catch(e){
                console.log(e);
                setError(e);
            }
        };
    
        const logOut = async () => {
            try{
                console.log("Log out");
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                setUserInfo([]);
            } catch(e){
                console.log(e);
                setError(e);
            }
        };

        useEffect(() => {
            getAllPhotos();
            configureGoogleSignIn();
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
                                    <Pressable style={styles.botaoIcon} onPress={driveButton}>
                                       <Image source={require('../../assets/google-drive.png')} style={{width: 24, height: 24}}/>
                                        {/* <FontAwesome5 name='google-drive' size={24} color="white" /> */}
                                    </Pressable>
                                    <Pressable style={styles.botaoIcon}>
                                        <Image source={require('../../assets/whatsapp.png')} style={{width: 24, height: 24}}/>
                                        {/* <FontAwesome5 name='whatsapp' size={24} color="white" /> */}
                                    </Pressable>
                                    <Pressable style={styles.botaoIcon} onPress={editButton}>
                                        <Image source={require('../../assets/draw.png')} style={{width: 24, height: 24}}/>
                                        {/* <FontAwesome5 name='whatsapp' size={24} color="white" /> */}
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
                { userInfo.user ? (
                    <Button title="Logout" onPress={logOut}/>
                ) : (
                    <GoogleSigninButton style={styles.botaoGoogle} color={GoogleSigninButton.Color.Dark} onPress={signIn} />
                )}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    botaoGoogle: {
        width: '40%',
        size: GoogleSigninButton.Size.Wide,
        padding: 10,
        margin: 10,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
});