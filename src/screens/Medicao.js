import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, Button, Platform, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import { FileSystem, shareAsync } from 'expo';
import { globalStyles } from '../styles/global';

export default function Medicao({ navigation }) {
    const URL = 'https://feridas-api.onrender.com';
    const [imageSource, setImageSource] = useState(null);
    const [imageResponse, setImageResponse] = useState(null);
    const [altura, setAltura] = useState(null);
    const [largura, setLargura] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    const refreshAPI = async () => {
        try {
            let res = await fetch(URL, {
                method: 'GET',
            });
            let responseJson = await res.json();
            console.log("resposta: \n", responseJson.data);
        } catch (error) {
            console.error('Error refreshing API: ', error);
        }
    };

    const editHandler = () => {
        console.log(imageSource);
        if(imageSource){
            navigation.navigate('EditSave', {imageSource: imageSource});
        }
        else{
            Alert.alert('Sem Imagem', 'Selecione uma imagem para avançar');
        }       
    }





    const pickImage = async () => {
        setImageResponse(null);
        setAltura(null);
        setLargura(null);
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        

        console.log(result);
    
        if (!result.canceled) {
            setImageSource(result.assets[0].uri);
        }
      };

    
      //pira total
    const downloadImage = async () => {
        const filename = 'image.jpg';
        const url = `${URL}/${filename}`;
        const fileUri = `${FileSystem.documentDirectory}${filename}`;

        try {
            const { uri } = await FileSystem.downloadAsync(url, fileUri);
            setImageUri(uri);
            console.log("Image downloaded to: ", uri);
        } catch (error) {
            console.error('Error downloading image: ', error);
        }
    };




    const upload = async () => {
        const url = `${URL}/upload`
        if (!imageSource) {
            console.log('No image selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: imageSource,
            type: 'image/jpeg', // Ou 'image/png', conforme apropriado
            name: 'image.jpg',
        });

        try {
            let res = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            let responseJson = await res.json();
            if(responseJson.data.altura != null && responseJson.data.largura != null){
                setImageResponse('https://feridas-api.onrender.com/uploads/image.jpg');
                //set altura com 2 casas decimais
                setAltura(responseJson.data.altura.toFixed(2));
                setLargura(responseJson.data.largura.toFixed(2));
                console.log("resposta: \n", responseJson.data);
            }
        } catch (error) {
            console.error('Error uploading image: ', error);
        }
    };

    const backHandler = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Escolher Imagem</Text>
                </TouchableOpacity>
                {imageSource && (
                    <View style={styles.imageUpload}>
                        <Image
                            style={styles.image}
                            source={{ uri: imageSource }}
                        />
                        <TouchableOpacity style={styles.buttonUpload} onPress={upload}>
                            <Text style={styles.buttonText}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {altura !== null && largura !== null && (
                    <Text style={styles.resultText}>Altura: {altura} cm | Largura: {largura} cm</Text>
                )}
                {imageResponse && (
                    <Image
                        style={styles.image}
                        source={{ uri: imageResponse }}
                    />
                )}
                <View style={styles.finalButtons}>
                    <TouchableOpacity style={styles.button} onPress={backHandler}>
                        <Text style={styles.buttonText}>Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={editHandler}>
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                </View>    
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        paddingTop: 50,
        paddingBottom: 20,
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '80%',
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 15,
        backgroundColor: '#1E3C40',
        alignItems: 'center',
        borderRadius: 10,
        
    },
    buttonUpload: {
        width: '80%',
        padding: 10,
        backgroundColor: '#1E3C40',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    image: {
        width: 300,
        height: 200,
        marginVertical: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    resultText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    finalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%', // Ajuste conforme necessário
        marginTop: 20,
        
    },
});