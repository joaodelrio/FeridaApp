import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 20,
    },
    imageWrapper: {
      alignItems: 'center',
      marginHorizontal: 5,
    },
    image: {
      width: width * 0.45,
      height: height * 0.3,
      borderColor: 'black',
      borderWidth: 1,
    },
    imageText: {
      marginTop: 10,
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingHorizontal: 20,
    },
    button: {
      width: '45%',
      padding: 13,
      margin: 4,
      backgroundColor: '#1E3C40',
      alignItems: 'center',
      borderRadius: 9,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    inputContainer: {
        width: '80%',
        marginBottom: 20,
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 16,
      }
  });
  export default styles;