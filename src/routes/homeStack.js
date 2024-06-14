import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/Home';
import Foto from '../screens/Preview';
import Galeria from '../screens/Galeria';
import EditSave from '../screens/EditSave';
import Medicao from '../screens/Medicao';
import HomeGaleria from '../screens/HomeGaleria';
import DriveGaleria from '../screens/DriveGaleria';

const screens = {
    Home: {
        screen: Home,
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
    EditSave: {
        screen: EditSave,
        navigationOptions: {
            title: ' ',
        },
    }
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
