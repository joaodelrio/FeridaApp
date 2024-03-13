import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, StatusBar, Button, Pressable, ActivityIndicator, GestureResponderEvent, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../styles/global';

export default function CameraAruco({ route, navigation}) {

    const {imageSource} = navigation.state.params;

    return (        
        <View style={globalStyles.container}>
            <Image style={StyleSheet.absoluteFill} source={{uri: `file://'${imageSource}`}}  />
        </View>
    );
}

const styles = StyleSheet.create({
    images: {
        width: '100%',
        height: '100%',
    },
});