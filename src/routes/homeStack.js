import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/Home';
import Camera from '../screens/CameraApp';

const screens = {
    Home: {
        screen: Home,
    },
    Camera: {
        screen: Camera,
    },
};

const HomeStack = createStackNavigator( screens );

export default createAppContainer( HomeStack );