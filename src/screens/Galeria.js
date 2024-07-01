import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, FlatList, Image, Button, Alert} from 'react-native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker'; 
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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function Galeria({ navigation }) {

    const [photos, setPhotos] = useState([]);
    const [buttonMode, setButtonMode] = useState("off");
    const [clickedIndex, setClickedIndex] = useState('');
    const [clickedImage, setClickedImage] = useState('');
    const [userInfo, setUserInfo] = useState([]);
    const [imageSource, setImageSource] = useState(null);

    const backScreenNavigation = () => {
        navigation.navigate('Home');
    };

    const buttonHandler = (index) => {
        if(buttonMode == "off"){
            setButtonMode("on");
            setClickedIndex(index);
            setClickedImage(photos[index].node.image.uri);
        } else {
            setButtonMode("off");
            setClickedIndex(null);
        }
    }

    const editButton = async () => {
        let img = photos[clickedIndex].node.image.uri;

        // Convert content URI to file path
        const filePath = await RNFS.stat(img)
            .then((statResult) => {
                return statResult.originalFilepath;
            })
            .catch((err) => {
                console.error('Error: ', err.message, err.code);
            });

        const fileUri = `file://${filePath}`;
        navigation.navigate('Edit', { imageSource: fileUri, screen: 'Galeria' });
    };

    const deleteConfirm = () => {
        Alert.alert('Deletar', 'Deseja deletar a imagem?', [
            {text: 'Sim', onPress: () => deleteHandler()},
            {text: 'Não', onPress: () => console.log('Cancelado')},
        ]);
    }

    const deleteHandler = async () => {
        let img = photos[clickedIndex].node.image.uri;

        // Convert content URI to file path
        const filePath = await RNFS.stat(img)
            .then((statResult) => {
                return statResult.originalFilepath;
            })
            .catch((err) => {
                console.error('Error: ', err.message, err.code);
            });

        const fileUri = `file://${filePath}`;

        // Delete the image from the device
        await RNFS.unlink(fileUri)
            .then(() => {
                console.log('Image deleted');
            })
            .catch((err) => {
                console.error(err);
            });

        // Reload the gallery
        getAllPhotos();
    }

    // const driveSaveConfirm = () => {
    //     if (Platform.OS === 'android') {
    //         Alert.alert('Drive', 'Deseja salvar a imagem no drive?', [
    //             {text: 'Sim', onPress: () => driveSaveHandler()},
    //             {text: 'Não', onPress: () => console.log('Cancelado')},
    //         ]);
    //     }
    // }

    // const driveSaveHandler = async () => {
    //     try{
    //         // Setting the date for the image name
    //         let day = new Date().getDate() + '-' + new Date().getMonth() + '-' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    //         console.log("Salvando no drive... Image: " + `${clickedImage}`);

    //         const gdrive = new GDrive();
    //         gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
    //         // Increase the timeout fetch
    //         gdrive.fetchTimeout = 3000;
    //         // console.log(await gdrive.files.list());

    //         const filePath = clickedImage;

    //         // Converting the image to base64
    //         const res = await
    //         fs.readFile(filePath, 'base64').then((res) => {
    //             return res;
    //         }).catch((err) => {
    //             console.log(err);
    //         });
            
    //         // Loading alert to the user
    //         Alert.alert('Drive', 'Salvando imagem no Drive...');

    //         // Uploading the image to Google Drive
    //         // 1igXlixE4ftYqEu_JBepe0xhjYOre5aHV - Root Folder
    //         // 1j0QvjFzd3qQ9zqJlUvPKb3lGeuXUA-Jl - Folder for Original Images
    //         // 1t3K3hcqsETutFxxGHwPGF5DJ4czLDGfH - Folder for Label Images
    //         // 1ZuU9ByEcMYfyl7iSj8C7B2otHJ49c17u - Folder for Segmented Images
    //         const id = await gdrive.files.newMultipartUploader()
    //         .setData(res, MimeTypes.PNG)
    //         .setIsBase64(true)
    //         .setRequestBody({
    //             name: day,
    //             parents: ["1j0QvjFzd3qQ9zqJlUvPKb3lGeuXUA-Jl"]
    //         })
    //         .execute();
            
    //         //Alert the user that the image was uploaded
    //         Alert.alert('Drive', 'Imagem salva no Drive com sucesso!');
    //     }   
        
    //     catch(e){
    //         console.log("Error uploading the image to Google Drive. Error message: " + e);
    //     } 
    // }

    // const getAllPhotos = async () => {
    //     CameraRoll.getPhotos({
    //         first: 1000,
    //         assetType: 'Photos',
    //         groupName: 'DriveFeridas(1)',
    //       })
    //       .then(r => {
    //         setPhotos(r.edges);
    //         if(r.edges)
    //         console.log(r.edges);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });   

    // };

    const getAllPhotos = async () => {
        CameraRoll.getPhotos({
            first: 1000,
            assetType: 'Photos',
            groupName: 'Aruco',
        })
        .then(async r => {
            setPhotos(r.edges);
    
            if (r.edges.length === 0) {
                console.log('No photos found');
               const dirPath = RNFS.ExternalStorageDirectoryPath + '/DCIM/Aruco';
                try {
                    // Verifique se a pasta já existe antes de criar
                    const dirExists = await fs.exists(dirPath);
                    if (!dirExists) {
                        await RNFS.mkdir(dirPath);
                        // console.log('Directory created');
                    } else {
                        // console.log('Directory already exists');
                    }
                } catch (err) {
                    console.log('Error creating directory', err);
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        });

        if(!result.canceled){
            // Coloca a imagem na pasta Aruco
            const dirPath = RNFS.ExternalStorageDirectoryPath + '/DCIM/Aruco';
            const fileName = result.assets[0].uri.split('/').pop();
            const destPath = `${dirPath}/${fileName}`;
            try {
                await RNFS.moveFile(result.assets[0].uri, destPath);
                console.log('Image moved successfully');
            } catch (err) {
                console.log('Error moving image', err);
            }
            getAllPhotos();
    
        }
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

    // useEffect(() => {
    //     getAllPhotos();
    // }, []);

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
                                    <Pressable style={styles.botaoIcon} onPress={editButton}>
                                        <Image source={require('../../assets/draw.png')} style={{width: 24, height: 24}}/>
                                    </Pressable>
                                    <Pressable style={styles.botaoIcon} onPress={deleteConfirm}>
                                        <Image source={require('../../assets/trash.png')} style={{width: 24, height: 24}}/>
                                    </Pressable>                
                                </View>
                                

                            )}
                            </Pressable>
                            
                        </View>
                    )
                }}/>
             </View>
            <View style={styles.botoesContainer}>
                <Pressable style={styles.botao} onPress={backScreenNavigation}>
                    <Image source={require('../../assets/home.png')} style={{width: 30, height: 30}}/>
                </Pressable>
                <Pressable style={styles.botao} onPress={pickImage}>
                    <Image source={require('../../assets/gallery.png')} style={{width: 30, height: 30}}/>
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
        marginTop: 3,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    botao: {
        backgroundColor: '#1E3C40',
        padding: 10,
        margin: 15,
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