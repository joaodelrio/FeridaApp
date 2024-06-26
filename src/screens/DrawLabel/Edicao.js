import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Pressable } from 'react-native';
import { Svg, Path, Circle, Polygon } from 'react-native-svg';
import { captureRef } from "react-native-view-shot";
import _ from 'lodash';
import styles from './EdicaoStyle';
import Configuracao from '../Configuracao';
import { globalStyles } from '../../styles/global';

const { height, width } = Dimensions.get('window');

export default function EditSave({ navigation }) {
    const { imageSource, screen } = navigation.state.params;
    const [imageLabel, setImageLabel] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isPainting, setIsPainting] = useState(false);
    const [isBlackDrawing, setIsBlackDrawing] = useState(false);
    const [blackPoints, setBlackPoints] = useState({ points: [{ data: [], end: false }] });
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState({ path: [], color: 'transparent', size: 10 });
    const [modalVisible, setModalVisible] = useState(false);
    const [fill, setFill] = useState(true);
    const [size, setSize] = useState(10);
    const [isClearButtonClicked, setClearButtonClicked] = useState(false);
    const canvasRef = useRef(null);
    const drawCanvas = useRef(null);
    const [color, setColor] = useState('transparent');
    const [legend, setLegend] = useState('');
    const [endingPolygon, setEndingPolygon] = useState(false);

    const [colors, setColors] = useState({
        backgroundColor: 'transparent',
        backgroudCima: 'transparent',
        fillColor: 'transparent',
        colorLines: 'black',
        colorCircle: 'black',
        segmentationFillColor: 'transparent'
    });

    const saveHandler = async () => {
        try {
            await saveCanvasAsImage();
        } catch (error) {
            console.error("Oops, snapshot failed", error);
        }
    };

    const onTouchEnd = (event) => {
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;

        if (isBlackDrawing) {
            if (endingPolygon) {
                setBlackPoints(prev => ({
                    ...prev,
                    points: [
                        ...prev.points,
                        {
                            data: [{ x: locationX, y: locationY }],
                            end: false
                        }
                    ],
                }));
                setEndingPolygon(false);
            } else {
                setBlackPoints(prev => {
                    const updatedPoints = [...prev.points];
                    updatedPoints[updatedPoints.length - 1].data.push({ x: locationX, y: locationY });
                    return { ...prev, points: updatedPoints };
                });
            }
        } else {
            setPaths([...paths, { ...currentPath }]);
        }
        setCurrentPath({ path: [], color: color, size: size, fill: fill });
        setClearButtonClicked(false);
    };

    useEffect(() => {
    }, [isBlackDrawing]);

    const onTouchMove = (event) => {
        const newPath = [...currentPath.path];
        const locationX = event.nativeEvent.locationX;
        const locationY = event.nativeEvent.locationY;
        const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(0)},${locationY.toFixed(0)} `;
        newPath.push(newPoint);
        setCurrentPath({ ...currentPath, path: newPath });
    };

    const redoLastDraw = () => {
        if (isBlackDrawing) {
            if (blackPoints.points > 0) {
            const updatedBlackPoints = blackPoints.points.append(blackPoints.points.slice(0, blackPoints.points.length - 1));
            setBlackPoints( { points:updatedBlackPoints });
        }
        return;
     } else
        if (paths.length > 0) {
            const updatedPaths = paths.slice(0, paths.length - 1);
            setPaths(updatedPaths);
        }
    };

    const handleClearButtonClick = () => {
        setPaths([]);
        setBlackPoints({ points: [{ data: [], end: false }] });
        setClearButtonClicked(true);
    };

    const changeColors = () => {
        setColors({
            ...colors,
            backgroundColor: 'transparent',
            backgroudCima: 'pink',
            fillColor: 'transparent',
            colorLines: 'purple',
            colorCircle: 'transparent',
            segmentationFillColor: 'purple'
        });
    };

    const saveCanvasAsImage = async () => {
        if (drawCanvas.current) {
            const oldColors = colors;
            changeColors();
            try {
                const uri = await captureRef(drawCanvas.current, {
                    format: "jpg",
                    quality: 1,
                });
                setColors(oldColors);

                setImageLabel(uri);
            } catch (error) {
                console.error("Oops, snapshot failed", error);
            }
        }
    };

    const handleColorButtonClick = (selectedColor, colorLegend) => {
        setIsBlackDrawing(false);
        setColor(selectedColor);
        setCurrentPath({ ...currentPath, color: selectedColor });
        setLegend(colorLegend);
    };

    const RenderBlackLines = useMemo(() => () => {
        return blackPoints.points.flatMap((polygon, setIndex) =>
            polygon.data.map((point, index) => {
                if (index === 0) return null;
                const previousPoint = polygon.data[index - 1];
                return (
                    <Path
                        key={`black-line-${setIndex}-${index}`}
                        d={`M${previousPoint.x},${previousPoint.y} L${point.x},${point.y}`}
                        stroke={isClearButtonClicked ? 'transparent' : colors.colorLines}
                        strokeWidth={4}
                        strokeLinecap="round"
                    />
                );
            })
        );
    }, [blackPoints, isClearButtonClicked, colors]);

    const RenderBlackPoints = useMemo(() => () => {
        return blackPoints.points.flatMap((polygon, setIndex) =>
            polygon.data.map((point, index) => (
                <Circle
                    key={`black-point-${setIndex}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={5}
                    fill={isClearButtonClicked ? 'transparent' : colors.colorCircle}
                />
            ))
        );
    }, [blackPoints, isClearButtonClicked, colors]);

    const RenderPolygon = useMemo(() => () => {
        return blackPoints.points.map((polygon, index) => {
            if (polygon.data.length < 5) return null;
            const pointsString = polygon.data.map(point => `${point.x},${point.y}`).join(' ');
            return (
                <Polygon
                    key={`polygon-${index}`}
                    points={pointsString}
                    fill={polygon.end ? colors.segmentationFillColor : 'transparent'}
                    stroke={polygon.end ? colors.colorLines : 'transparent'}
                    strokeWidth={9}
                />
            );
        });
    }, [blackPoints, colors]);

    const Draw = useMemo(() => () => {
        return paths.map((item, index) => (
            <Path
                key={`path-${index}`}
                d={item.path.join('')}
                stroke={item.color}
                //fill={item.color === 'black' || !item.fill ? colors.fillColor : item.color}
                fill = {
                    item.color === 'black' ? colors.segmentationFillColor : 
                    !item.fill ? colors.fillColor : 
                    item.color
                }
                fillOpacity={0.9}
                strokeWidth={item.size}
                strokeLinejoin={'round'}
                strokeLinecap={'round'}
            />
        ));
    }, [paths, colors]);

    const RenderDrawCanvas = useMemo(() => () => {
        return (
            <Svg height={height * 0.69} width={width} ref={drawCanvas} style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }} >
                <RenderBlackPoints />
                <RenderBlackLines />
                <RenderPolygon />
                <Draw />
                <Path
                    d={currentPath.path.join('')}
                    stroke={currentPath.color}
                    fill={'transparent'}
                    strokeWidth={currentPath.size}
                    strokeLinejoin={'round'}
                    strokeLinecap={'round'}
                />
            </Svg>
        );
    }, [currentPath, Draw, RenderBlackPoints, RenderBlackLines, RenderPolygon]);

    const lastLineVariation = (firstPoint, lastPoint) => {
        const delta = Math.abs(firstPoint - lastPoint);
        const diference = Math.abs(firstPoint) * 0.15;
        return delta <= diference;
    };

    
    useEffect(() => {
        const currentBlackPoints = blackPoints.points[blackPoints.points.length - 1];
        if (currentBlackPoints.data.length < 5) return;
        const firstPoint = currentBlackPoints.data[0];
        const lastPoint = currentBlackPoints.data[currentBlackPoints.data.length - 1];
        if (!firstPoint || !lastPoint) return;
        if (lastLineVariation(firstPoint.x, lastPoint.x) && lastLineVariation(firstPoint.y, lastPoint.y)) {
            currentBlackPoints.end = true;
            setEndingPolygon(true);
        }
    }, [blackPoints]);

    useEffect(() => {
        if (imageLabel) {
            navigation.navigate('DriveSave', { imageOriginal: imageSource, imageLabel: imageLabel });
        }
    }, [imageLabel]);

    useEffect(() => {
        setCurrentPath({ ...currentPath, size: size });
    }, [size]);

    useEffect(() => {
        setCurrentPath({ ...currentPath, fill: fill });
    }, [fill]);

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Pressable style={[styles.circleButton, { backgroundColor: "#1E3C40" }]} onPress={() => { isDrawing ? setIsDrawing(false) : setIsDrawing(true); setLegend('') }}>
                    <Image source={require('../../../assets/pencil.png')} style={{ width: 25, height: 25 }} />
                </Pressable>
                {isDrawing && (
                    <>
                        <TouchableOpacity style={[styles.colorButton, { backgroundColor: "black" }]} onPress={() => handleColorButtonClick('black', 'Preto: Contorno da Ferida')} />
                        <TouchableOpacity style={[styles.colorButton, { backgroundColor: "gray" }]} onPress={() => {setIsBlackDrawing(true), setLegend('Preto: Contorno da Ferida')}} />
                    </>
                )}
                <Pressable style={[styles.circleButton, { backgroundColor: "#1E3C40" }]} onPress={() => { isPainting ? setIsPainting(false) : setIsPainting(true); setLegend('') }}>
                    <Image source={require('../../../assets/paleta.png')} style={{ width: 25, height: 25 }} />
                </Pressable>
                {isPainting && (
                    <>
                        <TouchableOpacity style={[styles.colorButton, { backgroundColor: "blue" }]} onPress={() => handleColorButtonClick('blue', 'Azul: Granulação')} />
                        <TouchableOpacity style={[styles.colorButton, { backgroundColor: "green" }]} onPress={() => handleColorButtonClick('green', 'Verde: Epitalização')} />
                        <TouchableOpacity style={[styles.colorButton, { backgroundColor: "red" }]} onPress={() => handleColorButtonClick('red', 'Vermelho: Necrose')} />
                        <TouchableOpacity style={[styles.colorButton, { backgroundColor: "yellow" }]} onPress={() => handleColorButtonClick('yellow', 'Amarelo: Fibrina')} />
                        <TouchableOpacity style={[styles.colorButton, { backgroundColor: "orange" }]} onPress={() => handleColorButtonClick('orange', 'Laranja: Esfacelo')} />
                        <TouchableOpacity style={[styles.colorButton, { backgroundColor: "purple" }]} onPress={() => handleColorButtonClick('purple', 'Roxo: Outro tipo de Tecido')} />
                    </>
                )}
                <Pressable style={[styles.circleButton, { backgroundColor: "#1E3C40" }]} onPress={() => redoLastDraw()}>
                    <Image source={require('../../../assets/redo.png')} style={{ width: 25, height: 25 }} />
                </Pressable>
                <Pressable style={[styles.circleButton, { backgroundColor: "#1E3C40" }]} onPress={() => setModalVisible(true)}>
                    <Image source={require('../../../assets/config.png')} style={{ width: 25, height: 25 }} />
                </Pressable>
            </View>
            {legend ? (
                <Text style={styles.legendText}>{legend}</Text>
            ) : null}
            <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} ref={canvasRef}>
                <ImageBackground source={{ uri: `file://${imageSource}` }} style={{ width: '100%', height: '100%' }}>
                    {RenderDrawCanvas()}
                </ImageBackground>
            </View>
            <View style={styles.buttonsOP}>
                <TouchableOpacity style={styles.clearButton} onPress={handleClearButtonClick}>
                    <Text style={globalStyles.textbotao}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearButton} onPress={saveHandler}>
                    <Text style={globalStyles.textbotao}>Avançar</Text>
                </TouchableOpacity>
            </View>
            <Configuracao modalVisible={modalVisible} setModalVisible={setModalVisible} fill={fill} setFill={setFill} selectedBrushSize={size} setSelectedBrushSize={setSize} />
        </View>
    );
}
