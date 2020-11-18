import React from "react";
import {ActivityIndicator, View, AsyncStorage} from "react-native";


export default class AuthLoadingScreen extends React.Component{

    componentDidMount() {
        this._bootstrapAsync();
      }
    
      // Fetch the token from storage then navigate to our appropriate place
      _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('@spotfinderToken');
    
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
      };
    

    render(){

        return(
            <View>
                <ActivityIndicator />
            </View>
        );
    }
}