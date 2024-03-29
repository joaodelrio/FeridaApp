import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/Home';
// import Camera from '../screens/CameraApp';
import Aruco from '../screens/CameraAruco';
import Foto from '../screens/DataLabel';
import Galeria from '../screens/Galeria';

const screens = {
    Home: {
        screen: Home,
    },
    Camera: {
        screen: Aruco,
    },
    Foto: {
        screen: Foto,
    },
    Galeria: {
        screen: Galeria,
    },
};

const HomeStack = createStackNavigator( screens );

export default createAppContainer( HomeStack );