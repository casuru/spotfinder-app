import React from "react";
import {View, Button, TextInput, Text, AsyncStorage} from "react-native";


export default class SignInScreen extends React.Component{

    constructor(props){

        super(props);

        this.state = {

            username:"",
            password:"",
            errors:{}
        }
    }

    updateUsername = (username) => {

        this.setState({
            username: username
        })
    }

    updatePassword = (password) => {

        this.setState({
            password: password
        })
    }


    _signIn = async() => {

        this.setState({
            errors: {}
        })

        const {username, password} = this.state;

        const response = await fetch("https://spotfinder-api.herokuapp.com/v1/auth/token/", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            body:JSON.stringify({
                username: username,
                password: password
            })
        });

        const responseJson = await response.json();

        

        if(response.ok){

            await AsyncStorage.setItem("@spotfinderToken", responseJson.token);
            const {navigation} = this.props;

            navigation.navigate("App");

            console.log("Ok");

        } else if (response.status == 400){

            console.log(responseJson);

            this.setState({
                errors: responseJson
            })
        }

    }

    navigateToSignUpScreen = () => {

        const {navigation} = this.props;

        navigation.navigate("SignUp");
    }

    render(){

        const {errors} = this.state;

        return(
            <View style = {{justifyContent: "center", flex: 1}}>
                
                <View style = {{alignItems: "center"}}>
                    <Text style = {{fontSize: 40, marginBottom: 10}}>
                        Sign In
                    </Text>
                </View>
                <Text>
                    {errors.non_field_errors}
                </Text>
                <TextInput
                    placeholder = {"Username"}
                    onChangeText = {this.updateUsername}
                    style = {{borderColor: 'grey', borderWidth: 1, marginBottom: 3}}
                />

                <Text>
                    {errors.username}
                </Text>

                <TextInput
                    placeholder = {"Password"}
                    onChangeText = {this.updatePassword}
                    style = {{borderColor: 'grey', borderWidth: 1, marginBottom: 3}}
                    secureTextEntry = {true}
                />

                <Text>
                    {errors.password}
                </Text>
                <Button
                    title = {"Sign In"}
                    onPress = {this._signIn}
                    style = {{marginBottom: 5}} 
                />

                <Button
                    title = {"Sign Up"}
                    onPress = {this.navigateToSignUpScreen}
                    style = {{marginBottom: 5}} 
                />
            </View>
        );
    }
}