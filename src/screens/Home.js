import React from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, Alert, Platform, BackHandler} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';



export default function Home({ navigation }) {
    const pressHandler = () => {
        navigation.navigate('Camera');
        //navigation.push('Camera');
    }
    const exitHandler = () => {
        if (Platform.OS === 'android') {
            Alert.alert('Sair', 'Deseja sair do aplicativo?', [
                {text: 'Sim', onPress: () => BackHandler.exitApp()},
                {text: 'Não', onPress: () => console.log('Cancelado')},
            ]);
        }
      };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.titulo}>Segwound</Text> 
            <View style={styles.botoesContainer}>
                <Pressable style={styles.botao} onPress={pressHandler}>
                    <Text style={styles.textbotao}>Abrir câmera</Text>
                </Pressable>
                <Pressable style={styles.botao} onPress={exitHandler}>
                    <Text style={styles.textbotao}>Sair</Text>
                </Pressable>
            </View>
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
        paddingTop: 95,
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
