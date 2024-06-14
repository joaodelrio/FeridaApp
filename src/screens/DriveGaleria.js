import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, FlatList, Image, Button, Alert} from 'react-native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { FontAwesome5 } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
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
import RNFS from 'react-native-fs';

export default function GaleriaDrive({ navigation }) {

    const [photos, setPhotos] = useState([]);
    const [buttonMode, setButtonMode] = useState("off");
    const [clickedIndex, setClickedIndex] = useState('');
    const [clickedImage, setClickedImage] = useState('');
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState([]);
    const [imageSource, setImageSource] = useState(null);
    const [photoTest, setPhotoTest] = useState(null);

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

    

    const editButton = async () => {
        let img = photos[clickedIndex].node.image.uri;
        console.log("aqui", img);

        // Convert content URI to file path
        const filePath = await RNFS.stat(img)
            .then((statResult) => {
                return statResult.originalFilepath;
            })
            .catch((err) => {
                console.error('Error: ', err.message, err.code);
            });

        const fileUri = `file://${filePath}`;
        navigation.navigate('EditSave', { imageSource: fileUri });
    };

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
            console.log("driveHandlerError: " + err);
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

    const getAllPhotosFromDrive = async () => {
        try {
            // Initialize Google Drive
            const gdrive = new GDrive();
            gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
    
            const directoryId = '1igXlixE4ftYqEu_JBepe0xhjYOre5aHV';
    
            // List the files in the specified folder on Drive
            const filesResponse = await gdrive.files.list({
                q: `'${directoryId}' in parents`,
                fields: 'files(id, name, mimeType)',
            });
    
            // Extract only the files from the response
            const filesFromDirectory = filesResponse.files;
    
            // Filter only the images
            const imageFromDirectory = filesFromDirectory.filter(file => file.mimeType.startsWith('image/'));
    
            if (imageFromDirectory.length > 0) {
                // Download the images

                for (let i = 0; i < imageFromDirectory.length; i++) {
                    const imageId = imageFromDirectory[i].id;
                    const imageName = imageFromDirectory[i].name;
                    const imageMimeType = imageFromDirectory[i].mimeType;
                    const imageData = await gdrive.files.getBinary(imageId);

                    
                    console.log(imageName);
                    const imageDataBase64 = Buffer.from(imageData, 'binary').toString('base64');
        
                    //Uri of the image on the phone (saving in the cache folder)
                    // const fileUri = `${FileSystem.cacheDirectory}${imageName}`;
                    // console.log(fileUri);


                    // Crate a new folder in the phone's directory if it doesn't exist
                    const folderUri = `${FileSystem.documentDirectory}`+"driveferidas/";
                    await FileSystem.makeDirectoryAsync(folderUri, {intermediates: true});


                    // Uri of the image on the phone (saving in the phone's directory)
                    const fileExtension = imageMimeType.split('/')[1];
                    const fileUri = `${folderUri}${imageName}.${fileExtension}`;
                    console.log(fileUri);
        
                    // Saving the image on the phone
                    await FileSystem.writeAsStringAsync(fileUri, imageDataBase64, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    // Ensure the file has a valid image MIME type before saving to CameraRoll
                    console.log(fileUri.mimeType);
                    // if (imageFromDirectory[i].mimeType.startsWith('image/')) {
                    //     await CameraRoll.saveAsset(fileUri, { type: 'photo', album: 'DriveFeridas' });
                    // }
                    CameraRoll.saveAsset(fileUri, {type: 'photo', album: 'DriveFeridas'});
                    console.log('Image saved on the phone');
                }
            } else {
                console.log('No images found in the specified directory.');
            }

        } catch (error) {
            console.error('Error while fetching photos from Google Drive: ', error);
            setError(error);
        }
    };

    const getAllPhotos = async () => {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
            groupName: 'DriveFeridas',
          })
          .then(r => {
            setPhotos(r.edges);
            //console.log(r.edges);
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
        // getAllPhotosFromDrive();
        // getAllPhotos();
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
    }
    
});