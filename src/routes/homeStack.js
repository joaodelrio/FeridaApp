import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/Home';
import Camera from '../screens/Camera';
import Foto from '../screens/Preview';
import Galeria from '../screens/Galeria';
import EditSave from '../screens/EditSave';
import Medicao from '../screens/Medicao';

const screens = {
    Home: {
        screen: Home,
    },
    Camera: {
        screen: Camera,
    },
    Foto: {
        screen: Foto,
    },
    Galeria: {
        screen: Galeria,
    },
    Medicao: {
        screen: Medicao,
    },
    EditSave: {
        screen: EditSave,
    }
};

const HomeStack = createStackNavigator( screens );

export default createAppContainer( HomeStack );