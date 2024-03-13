import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text : {
        fontSize: 20,
    },
    titulo: {
        paddingTop: 115,
        paddingBottom: 50,
        fontSize: 37,
        fontWeight: 'bold',
        color: '#698C8C',
    },
    botoesContainer: {
        flex: 1,
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