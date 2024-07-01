import React from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, Alert, Platform, BackHandler, Button} from 'react-native';


export default function Home({ navigation }) {
    const driveGaleriaScreenNavigation = () => {
        navigation.navigate('DriveGaleria');
    }

    const galeriaScreenNavigation = () => {
        navigation.navigate('Galeria');
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {/* <Text style={styles.titulo}>Galeria</Text>  */}
            <View style={styles.botoesContainer}>
                <Pressable style={styles.botao} onPress={driveGaleriaScreenNavigation}>
                    <Text style={styles.textbotao}>Drive</Text>
                </Pressable>
                <Pressable style={styles.botao} onPress={galeriaScreenNavigation}>
                    <Text style={styles.textbotao}>Celular</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text : {
        fontSize: 20,
    },
    titulo: {
        paddingTop: 30,
        paddingBottom: 50,
        fontSize: 37,
        fontWeight: 'bold',
        color: '#698C8C',
    },
    botoesContainer: {
        width: '100%',
        marginTop: 40,
        alignItems: 'center',
    },
    botao: {
        width: '90%',
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#1E3C40',
        alignContent: 'center',
        borderRadius: 9,
        borderBottomColor: '#000',
    },
    textbotao: {
        color: '#fff',
        fontFamily: 'Roboto',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
