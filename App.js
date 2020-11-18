import {createAppContainer, createSwitchNavigator} from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from "./screens/HomeScreen";
import SpotScreen from "./screens/SpotScreen";
import AuthLoadingScreen from "./screens/authentication/AuthLoadingScreen";
import SignInScreen from "./screens/authentication/SignInScreen";
import SignUpScreen from "./screens/authentication/SignUpScreen";


const AppStack = createStackNavigator({
  Home: HomeScreen,
  Spot: SpotScreen
});

const AuthStack = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen
});


const AppNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Auth: AuthStack,
  App: AppStack
});


export default createAppContainer(AppNavigator);