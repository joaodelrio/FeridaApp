import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/Home';
import Camera from '../screens/CameraApp';

const screens = {
    Home: {
        screen: Home,
    },
    Camera: {
        screen: CameraApp,
    },
};

const HomeStack = createStackNavigator( screens );

export default createAppContainer( HomeStack );