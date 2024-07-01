import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    svgContainer: {
        height: height * 0.68,
        width,
        borderColor: 'black',
        backgroundColor: 'black',
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
    },
    clearButton: {
        width: '47%',
        padding: 13,
        margin: 4,
        backgroundColor: '#1E3C40',
        alignContent: 'center',
        borderRadius: 9,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
    },
    buttonsOP: {
        flex: 100,
        alignItems: 'center',
        flexDirection: 'row',
    },
    circleButton: {
        borderRadius: 90,
        paddingVertical: 12,
        paddingHorizontal: 12,
        margin: 6,
    },
    colorButton: {
        borderRadius: 90,
        paddingVertical: 18,
        paddingHorizontal: 18,
        marginRight: 6,
    }
});

export default styles;