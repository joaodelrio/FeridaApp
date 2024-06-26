import React, { useState } from 'react';
import { View, Image, Button, Alert, StyleSheet, Dimensions, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from './driveSaveImgStyles'; // Importando estilos globais
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
var fs = require('react-native-fs');
import {
    GDrive,
    MimeTypes
  } from "@robinbobin/react-native-google-drive-api-wrapper";

import { GoogleAndroidClientId, GoogleIosClientId, GoogleWebClientId } from '../../env/env';
const { height, width } = Dimensions.get('window');

export default function SaveImages({ route, navigation }) {
  const { imageOriginal } = navigation.state.params;
  const { imageLabel } = navigation.state.params;
  const [visible, setVisible] = useState(false);
  const [imageName, setImageName] = useState('');

  const homeScreenNavigation = () => {
    navigation.navigate('Home');
  };

  const sendImgOriginal = async (nameOR, filePathOR) => {
      console.log("Salvando original no drive...");
      
      const gdrive = new GDrive();
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
      // Increase the timeout fetch
      gdrive.fetchTimeout = 5000;

      //convertendo a imagem em base64
      const res = await

      fs.readFile(filePathOR, 'base64').then((res) => {
          return res;
      }).catch((err) => {
          console.log(err);
      });

      const directoryId = '1j0QvjFzd3qQ9zqJlUvPKb3lGeuXUA-Jl';

      // List the files in the specified folder on Drive
      const filesResponse = await gdrive.files.list({
        q: `'${directoryId}' in parents`,
        fields: 'files(id, name, mimeType)',
      });

       

      // Extract only the files from the response
      const filesFromDirectory = filesResponse.files;

      // Filter only the images
      const imageFromDirectory = filesFromDirectory.filter(file => file.mimeType.startsWith('image/'));

      // Compare the ImageName with the other images in the folder
      //console.log(imageFromDirectory);
      const imgNameFromDirectory = imageFromDirectory.map(file => file.name);
      // console.log(imgNameFromDirectory);
      // Check if the image name already exists
      const imgCompare = imageName + '_original';
      console.log('compare', imgCompare);
      const imgExists = imgNameFromDirectory.includes(imgCompare);


      if (imgExists) {
        Alert.alert('Erro', 'O nome do paciente já existe, por favor, escolha outro nome');
        return;
      }


      // Uploading the image to Google Drive
      // 1igXlixE4ftYqEu_JBepe0xhjYOre5aHV - Root Folder
      // 1j0QvjFzd3qQ9zqJlUvPKb3lGeuXUA-Jl - Folder for Original Images
      // 1t3K3hcqsETutFxxGHwPGF5DJ4czLDGfH - Folder for Label Images
      // 1ZuU9ByEcMYfyl7iSj8C7B2otHJ49c17u - Folder for Segmented Images
      const id = (await gdrive.files.newMultipartUploader()
      .setData(res, MimeTypes.JPG)
      .setIsBase64(true)
      .setRequestBody({
          name: nameOR,
          parents: ["1j0QvjFzd3qQ9zqJlUvPKb3lGeuXUA-Jl"]
          
      })
      .execute()
      ).id;
  };

  const sendImgLabel = async (nameL, filePathL) => {
    console.log("Salvando label no drive...");
    
    const gdrive = new GDrive();
    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
    // Increase the timeout fetch
    gdrive.fetchTimeout = 5000;

    //convertendo a imagem em base64
    const res = await

    fs.readFile(filePathL, 'base64').then((res) => {
        return res;
    }).catch((err) => {
        console.log(err);
    });

    // Uploading the image to Google Drive
    // 1igXlixE4ftYqEu_JBepe0xhjYOre5aHV - Root Folder
    // 1j0QvjFzd3qQ9zqJlUvPKb3lGeuXUA-Jl - Folder for Original Images
    // 1t3K3hcqsETutFxxGHwPGF5DJ4czLDGfH - Folder for Label Images
    // 1ZuU9ByEcMYfyl7iSj8C7B2otHJ49c17u - Folder for Segmented Images
    const id = (await gdrive.files.newMultipartUploader()
    .setData(res, MimeTypes.JPG)
    .setIsBase64(true)
    .setRequestBody({
        name: nameL,
        parents: ["1t3K3hcqsETutFxxGHwPGF5DJ4czLDGfH"]
        
    })
    .execute()
    ).id;
  };
      
  const deleteImage = async (uri) => {
    try{
      // Delete on drive
      const gdrive = new GDrive();
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
      // Increase the timeout fetch
      gdrive.fetchTimeout = 5000;

      // Get the file id
      const filesResponse = await gdrive.files.list({
        q: `'1j0QvjFzd3qQ9zqJlUvPKb3lGeuXUA-Jl' in parents`,
        fields: 'files(id, name, mimeType)',
      });
      console.log(uri);
      // Define the image name
      const imgName = uri.split('/').pop().split('.').slice(0, -1)
      //remove the file extension
      
      console.log(imgName);

      // ache o arquivo com o nome da imagem
      const files = filesResponse.files.find(file => file.name === imgName[0]);

      console.log(files);

      // Delete the file
      if (!files) {
          console.log('File not found');
          return;
      }
      else{
        await gdrive.files.delete(files.id);
        console.log('Image deleted from drive');
      }
    }catch(err){
      console.log(err);
    }
    // Convert content URI to file path
    const filePath = await fs.stat(uri)
    .then((statResult) => {
        return statResult.originalFilepath;
    })
    .catch((err) => {
        console.error('Error: ', err.message, err.code);
    });

    const fileUri = `file://${filePath}`;

    // Delete the image from the device
    await fs.unlink(uri)
        .then(() => {
            console.log('Image deleted');
        })
        .catch((err) => {
            console.error(err);
    });
  }

  const verifyName = async (filePathOR) => {
      const gdrive = new GDrive();
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
      // Increase the timeout fetch
      gdrive.fetchTimeout = 5000;

      //convertendo a imagem em base64
      const res = await fs.readFile(filePathOR, 'base64').then((res) => {
          return res;
      }).catch((err) => {
          console.log(err);
      });

      const directoryId = '1j0QvjFzd3qQ9zqJlUvPKb3lGeuXUA-Jl';

      // List the files in the specified folder on Drive
      const filesResponse = await gdrive.files.list({
        q: `'${directoryId}' in parents`,
        fields: 'files(id, name, mimeType)',
      });
      // Extract only the files from the response
      const filesFromDirectory = filesResponse.files;

      // Filter only the images
      const imageFromDirectory = filesFromDirectory.filter(file => file.mimeType.startsWith('image/'));

      // Compare the ImageName with the other images in the folder
      //console.log(imageFromDirectory);
      const imgNameFromDirectory = imageFromDirectory.map(file => file.name);
      // console.log(imgNameFromDirectory);
      // Check if the image name already exists
      const imgCompare = imageName + '_original';
      console.log('compare', imgCompare);
      const imgExists = imgNameFromDirectory.includes(imgCompare);
      if (imgExists) {
        console.log("false");
        return false;
      }
      console.log("true");
      return true;
  }

  const handleSave = async () => {
    // Lógica para validar o nome do paciente
    if (imageName.trim() === '') {
      Alert.alert('Erro', 'Digite o nome para o paciente, exemplo "J.S"');
      return;
    }
  
    // Define os nomes das imagens no estado
    const originalImageName = `${imageName}_original`;
    const labeledImageName = `${imageName}_label`;
  
    try {
      if(await verifyName(imageOriginal)){
        // Chama a primeira refunção de envio de imagem
        Alert.alert('Drive', 'Salvando imagem no Drive...', [{ text: ' ', onPress: () => {} }], { cancelable: false });
        await sendImgOriginal(originalImageName, imageOriginal);
        // Loading alert to the user
        await sendImgLabel(labeledImageName, imageLabel);
        // Após salvar ambas as imagens, exibe uma mensagem de sucesso
        Alert.alert('Imagens Salvas', 'As imagens foram salvas com sucesso!');
        // Navega para a tela de galeria
        
      }else{
        Alert.alert('Erro', 'O nome do paciente já existe, por favor, escolha outro nome');
        return;
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar as imagens');
    }
    // Deleta a imagem do celular
    await deleteImage(imageOriginal);
    homeScreenNavigation();
    
  };
    
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageOriginal }} style={styles.image} />
          <Text style={styles.imageText}>Imagem Original</Text>
        </View>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageLabel }} style={styles.image} />
          <Text style={styles.imageText}>Label</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome para o paciente, exemplo J.S"
          value={imageName}
          onChangeText={text => setImageName(text)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={homeScreenNavigation}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};