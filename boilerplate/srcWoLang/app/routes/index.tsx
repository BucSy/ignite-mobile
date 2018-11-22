import { createStackNavigator } from 'react-navigation';
import App from '../containers/App';


export const BaseNavigation = createStackNavigator({
    App: { screen: App }
});