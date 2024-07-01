import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/Home';
import Foto from '../screens/Preview';
import Galeria from '../screens/Galeria';
import HomeGaleria from '../screens/HomeGaleria';
import DriveGaleria from '../screens/DriveGaleria';
import Edit from '../screens/DrawLabel/Edicao';
import DriveSave from '../screens/save/DriveSaveImg';
import Camera from '../screens/Camera';
import Config from '../screens/Configuracao';

const screens = {
    Home: {
        screen: Home,
        navigationOptions: {
            headerShown: false,
        },
    },
    Camera: {
        screen: Camera,
        navigationOptions: {
            headerShown: false,
        },
    },
    Foto: {
        screen: Foto,
        navigationOptions: {
            title: 'Preview',
            headerStyle: {
                backgroundColor: '#1e90ff',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    },
    HomeGaleria: {
        screen: HomeGaleria,
        navigationOptions: {
            title: 'Galeria',
        },
        
    },
    Galeria: {
        screen: Galeria,
        navigationOptions: {
            title: 'Galeria',
        },
    },
    DriveGaleria: {
        screen: DriveGaleria,
        navigationOptions: {
            title: 'Drive',
        },
    },
    Edit: {
        screen: Edit,
        navigationOptions: {
            title: ' ',
        },
    },
    DriveSave: {
        screen: DriveSave,
        navigationOptions: {
            title: 'Drive',
        },
    },
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
