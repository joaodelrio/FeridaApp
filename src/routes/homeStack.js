import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/Home';
// import Camera from '../screens/CameraApp';
import Aruco from '../screens/CameraAruco';
import Foto from '../screens/DataLabel';

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
};

const HomeStack = createStackNavigator( screens );

export default createAppContainer( HomeStack );