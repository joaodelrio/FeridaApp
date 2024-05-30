import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert, Dimensions, Platform } from 'react-native';
import { globalStyles } from '../styles/global';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Svg, Path, Rect } from 'react-native-svg';
import { captureRef } from "react-native-view-shot";
import Toast from 'react-native-toast-message';

const { height, width } = Dimensions.get('window');

export default function EditSave({ route, navigation }) {

    const { imageSource } = navigation.state.params;
    const [buttonMode, setButtonMode] = useState("menu");

    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState({ path: [], color: 'transparent', size: 10 });
    const [isClearButtonClicked, setClearButtonClicked] = useState(false);
    const [color, setColor] = useState('transparent');
    const [size, setSize] = useState(10); // Tamanho do pincel [10, 20, 30, 40, 50]
    const canvasRef = useRef(null);
    const drawCanvas = useRef(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        Alert.alert(
            "Informações sobre as cores",
            "• Azul: Granulação\n" +
            "• Verde: Epitalização\n" +
            "• Vermelho: Necrose\n" +
            "• Amarelo: Fibrina\n" +
            "• Laranja: Esfacelo\n" +
            "• Roxo: Outro tipo de Ferida\n" +
            "• Preto: Contorno da Ferida",
            [{ text: "OK" }]
        );
    }, []);

    const backHandler = () => {
        navigation.navigate('Camera');
        //navigation.push('Home');
    }

    const segHandler = () => {
        setButtonMode("segmentation");
        //navigation.push('Home');
    }

    const classHandler = () => {
        setButtonMode("classification");
        //navigation.push('Home');
    }

    const confirmHandler = () => {
        setButtonMode("menu");
        //navigation.push('Home');
    }

    const cancelHandler = () => {
        setButtonMode("menu");
        //navigation.push('Home');
    }

    const uploadHandler = () => {
        if (Platform.OS === 'android') {
            Alert.alert('Salvar', 'Deseja salvar a imagem?', [
                {
                    text: 'Sim', onPress: async () => {
                        try {
                            await CameraRoll.save(imageSource, { type: 'photo', album: 'Aruco' });
                            await saveSvgAsImage();
                            Toast.show({
                                type: 'success',
                                text1: 'Imagem salva com sucesso!',
                            });
                            navigation.replace('Galeria');
                        } catch (error) {
                            Toast.show({
                                type: 'error',
                                text1: 'Erro ao salvar a imagem',
                            });
                        }
                    }
                },
                {
                    text: 'Não',
                    style: 'cancel'
                }
            ]);
        }
    };

    const onTouchEnd = () => {
        setPaths([...paths, { ...currentPath }]);
        setCurrentPath({ path: [], color: color, size: size });
        setClearButtonClicked(false);
    };

    const onTouchMove = (event) => {
        const newPath = [...currentPath.path];
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(0)},${locationY.toFixed(0)} `;
        newPath.push(newPoint);
        setCurrentPath({ ...currentPath, path: newPath });
    };

    const handleClearButtonClick = () => {
        setPaths([]);
        setCurrentPath({ path: [] });
        setClearButtonClicked(true);
    };

    const saveSvgAsImage = async () => {
        if (drawCanvas.current) {
            try {
                const uri = await captureRef(drawCanvas, {
                    format: "png",
                    quality: 1,
                });
                await CameraRoll.save(uri, { type: 'photo', album: 'Aruco' });
            } catch (error) {
                console.error("Oops, snapshot failed", error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonColors}>
                <TouchableOpacity style={styles.blueButton} onPress={() => {
                    setColor('blue');
                    setCurrentPath({ ...currentPath, color: 'blue' });
                }} />
                <TouchableOpacity style={styles.greenButton} onPress={() => {
                    setColor('green');
                    setCurrentPath({ ...currentPath, color: 'green' });
                }} />
                <TouchableOpacity style={styles.redButton} onPress={() => {
                    setColor('red');
                    setCurrentPath({ ...currentPath, color: 'red' });
                }} />
                <TouchableOpacity style={styles.yellowButton} onPress={() => {
                    setColor('yellow');
                    setCurrentPath({ ...currentPath, color: 'yellow' });
                }} />
                <TouchableOpacity style={styles.orangeButton} onPress={() => {
                    setColor('orange');
                    setCurrentPath({ ...currentPath, color: 'orange' });
                }} />
                <TouchableOpacity style={styles.purpleButton} onPress={() => {
                    setColor('purple');
                    setCurrentPath({ ...currentPath, color: 'purple' });
                }} />
                 <TouchableOpacity style={styles.blackButton} onPress={() => {
                    setColor('black');
                    setCurrentPath({ ...currentPath, color: 'black' });
                }} />
            </View>

            <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} ref={canvasRef}>
                <ImageBackground source={{ uri: `file://${imageSource}` }} style={{ width: '100%', height: '100%' }}>
                    <Svg height={height * 0.7} width={width} ref={drawCanvas}>
                        {paths.map((item, index) => (
                            <Path
                                key={`path-${index}`}
                                d={item.path.join('')}
                                stroke={isClearButtonClicked ? 'transparent' : item.color}
                                fill={'transparent'}
                                strokeWidth={item.size}
                                strokeLinejoin={'round'}
                                strokeLinecap={'round'}
                            />
                        ))}
                        <Path
                            d={currentPath.path.join('')}
                            stroke={isClearButtonClicked ? 'transparent' : currentPath.color}
                            fill={'transparent'}
                            strokeWidth={currentPath.size}
                            strokeLinejoin={'round'}
                            strokeLinecap={'round'}
                        />
                    </Svg>
                </ImageBackground>
            </View>

            <View style={styles.buttonsOP}>
                <TouchableOpacity style={styles.clearButton} onPress={handleClearButtonClick}>
                    <Text style={globalStyles.textbotao}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearButton} onPress={uploadHandler}>
                    <Text style={globalStyles.textbotao}>Salvar</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    svgContainer: {
        height: height * 0.7,
        width,
        borderColor: 'black',
        backgroundColor: 'white',
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
    buttonColors: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        backgroundColor: 'white',
    },
    buttonsOP: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    blueButton: {
        backgroundColor: 'blue',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 90,
        margin: 6,
    },
    greenButton: {
        backgroundColor: 'green',
        borderRadius: 90,
        paddingVertical: 20,
        paddingHorizontal: 20,
        margin: 6,
    },
    redButton: {
        backgroundColor: 'red',
        borderRadius: 90,
        paddingVertical: 20,
        paddingHorizontal: 20,
        margin: 6,
    },
    yellowButton: {
        backgroundColor: 'yellow',
        borderRadius: 90,
        paddingVertical: 20,
        paddingHorizontal: 20,
        margin: 6,
    },
    orangeButton: {
        backgroundColor: 'orange',
        borderRadius: 90,
        paddingVertical: 20,
        paddingHorizontal: 20,
        margin: 6,
    },
    blackButton: {
        backgroundColor: 'black',
        borderRadius: 90,
        paddingVertical: 20,
        paddingHorizontal: 20,
        margin: 6,
    },
    purpleButton: {
        backgroundColor: 'purple',
        borderRadius: 90,
        paddingVertical: 20,
        paddingHorizontal: 20,
        margin: 6,
    },
});
