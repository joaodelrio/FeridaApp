import React, { useState, useRef} from 'react';
import { View, 
        Text, 
        StyleSheet,            
        TouchableOpacity, 
        ImageBackground, 
        Alert, 
        Dimensions } from 'react-native';
import { globalStyles } from '../styles/global';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Svg, Path, Circle } from 'react-native-svg';
import {captureRef } from "react-native-view-shot";

const { height, width } = Dimensions.get('window');

export default function EditSave({ route, navigation}) {

    const {imageSource} = navigation.state.params;
    const [buttonMode, setButtonMode] = useState("menu");

    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState({ path: [], color: 'transparent', size: 10 });
    const [isClearButtonClicked, setClearButtonClicked] = useState(false);
    const [color, setColor] = useState('transparent');
    const [size, setSize] = useState(10); // Tamanho do pincel [10, 20, 30, 40, 50
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);

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
                {text: 'Sim', onPress: () => {
                  CameraRoll.saveAsset(imageSource, {type: 'photo', album: 'Aruco'});
                  saveSvgAsImage();
                  navigation.replace('Galeria')

                }},
            ]);
        }
        
    }

    const onTouchEnd = () => {
        setPaths([...paths, { ...currentPath }]);
        setCurrentPath({ path: [], color: color, size: size}); 
        setClearButtonClicked(false);
      };

    
    const onTouchMove = (event) => {
        const newPath = [...currentPath.path];
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(0)},${locationY.toFixed(0)} `;
        newPath.push(newPoint);
        setCurrentPath({ ...currentPath, path: newPath }); // Atualiza o caminho atual
    };

    const handleClearButtonClick = () => {
        setPaths([]);
        setCurrentPath({ path: [] }); // Reseta o caminho atual e a cor para vermelho
        setClearButtonClicked(true);
    };

    const saveSvgAsImage = async () => {
        if (canvasRef.current) {
          captureRef(canvasRef, {
            format: "png",
            quality: 1,
          })
          .then(
              (uri) => CameraRoll.saveAsset(uri, {type: 'photo', album: 'Aruco'}),
              (error) => console.error("Oops, snapshot failed", error)
            );
        
        }
      };


      return (
        <View style={styles.container}>
          <View style={styles.buttonColors}>
                    <TouchableOpacity style={styles.blueButton} onPress={() => {
                    setColor('blue');
                    setCurrentPath({ ...currentPath, color: 'blue' }); // Atualiza a cor do caminho atual
                  }}>
                      {/*<Text style={styles.clearButtonText}>Azul</Text>*/}
                  </TouchableOpacity>
    
                  <TouchableOpacity style={styles.greenButton} onPress={() => {
                    setColor('green');
                    setCurrentPath({ ...currentPath, color: 'green' }); // Atualiza a cor do caminho atual
                  }}>
                      {/*<Text style={styles.clearButtonText}>Verde</Text>*/}
                  </TouchableOpacity>
    
                  <TouchableOpacity style={styles.redButton} onPress={() => {
                    setColor('red');
                    setCurrentPath({ ...currentPath, color: 'red' }); // Atualiza a cor do caminho atual
                  }}>
                      {/*<Text style={styles.clearButtonText}>Vermelho</Text>*/}
                  </TouchableOpacity>
    
                  <TouchableOpacity style={styles.smallSizeButton} onPress={() => {
                    setSize(10)
                    setCurrentPath({ ...currentPath, size:10}); // Atualiza o tamanho do caminho atual
                  }}>
                  </TouchableOpacity>
    
                  <TouchableOpacity style={styles.mediumSizeButton} onPress={() => {
                    setSize(20)
                    setCurrentPath({ ...currentPath, size:20}); // Atualiza o tamanho do caminho atual
                  }}>
                   
                  </TouchableOpacity>
    
                  <TouchableOpacity style={styles.highSizeButton} onPress={() => {
                    setSize(30)
                    setCurrentPath({ ...currentPath, size:30}); // Atualiza o tamanho do caminho atual
                  }}>
                    
                      
                  </TouchableOpacity>
    
              </View>
          
          <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} ref={canvasRef}>
          
            
            <ImageBackground  source={{uri: `file://'${imageSource}`}} style={{width: '100%', height: '100%'}}>
            
              
              <Svg height={height * 0.7 } width={width}>
              
    
    
                {/* Renderiza os caminhos completos com suas cores específicas */}
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
          margin: 10,
      
        },
        greenButton: {
          backgroundColor: 'green',
          borderRadius: 90,
          paddingVertical: 20,
          paddingHorizontal: 20,
          margin: 10,
        },
        redButton: {
          backgroundColor: 'red',
          borderRadius: 90,
          paddingVertical: 20,
          paddingHorizontal: 20,
          margin: 10,
        },
        smallSizeButton: {
          backgroundColor: '#cccccc',
          borderRadius: 90,
          paddingVertical: 20,
          paddingHorizontal: 20,
          margin: 10,
        },
        mediumSizeButton: {
          backgroundColor: '#999999',
          borderRadius: 90,
          paddingVertical: 20,
          paddingHorizontal: 20,
          margin: 10,
        },
        highSizeButton: {
          backgroundColor: '#4c4c4c',
          borderRadius: 90,
          paddingVertical: 20,
          paddingHorizontal: 20,
          margin: 10,
        }
      
      });