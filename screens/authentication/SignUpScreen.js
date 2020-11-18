import React from "react";
import {View, Button, TextInput, Text, StyleSheet} from "react-native";


export default class SignUpScreen extends React.Component{

    constructor(props){

        super(props);

        this.state = {

            username:"",
            email:"",
            password:"",
            errors: {}
        }
    }

    updateUsername = (username) => {

        this.setState({
            username: username
        })
    }

    updateEmail = (email) => {

        this.setState({
            email: email
        });
    }

    updatePassword = (password) => {

        this.setState({
            password: password
        })
    }

    updateConfirmPassword = (confirm_password) => {

        this.setState({
            confirm_password: confirm_password
        });
    }


    _signUp = async() => {

        const {username, email, password, confirm_password} = this.state;

        const response = await fetch("https://spotfinder-api.herokuapp.com/v1/users/", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            body:JSON.stringify({
                username: username,
                email: email,
                password: password,
                confirm_password: confirm_password
            })
        });

        const responseJson = await response.json();

        if(response.ok){

            const {navigation} = this.props;

            navigation.navigate("Home");

        } else if (response.status == 400){

            this.setState({
                errors: responseJson
            })
        }

    }

    navigateToSignUpScreen = () => {

        const {navigation} = this.props;

        navigation.navigate("SignIn");
    }

    render(){


        const {errors} = this.state;

        return(
            <View style = {{justifyContent: "center", flex: 1}}>
                
                <View style = {{alignItems: "center"}}>
                    <Text style = {{fontSize: 40, marginBottom: 10}}>
                        Sign Up
                    </Text>
                </View>
                <TextInput
                    placeholder = {"Username"}
                    onChangeText = {this.updateUsername}
                    style = {{borderColor: 'grey', borderWidth: 1, marginBottom: 3}}
                />
                <Text>
                    {errors.username}
                </Text>
                <TextInput
                    placeholder = {"Email"}
                    onChangeText = {this.updateEmail}
                    style = {{borderColor: 'grey', borderWidth: 1, marginBottom: 3}}
                />
                <Text>
                    {errors.email}
                </Text>
                <TextInput
                    placeholder = {"Password"}
                    onChangeText = {this.updatePassword}
                    style = {{borderColor: 'grey', borderWidth: 1, marginBottom: 3}}
                />
                <Text>
                    {errors.password}
                </Text>
                <TextInput
                    placeholder = {"Confirm Password"}
                    onChangeText = {this.updateConfirmPassword}
                    style = {{borderColor: 'grey', borderWidth: 1, marginBottom: 3}}
                />
                <Text>
                    {errors.confirm_password}
                </Text>
                <Button
                    title = {"Sign Up"}
                    onPress = {this._signUp}
                    style = {{marginBottom: 5}} 
                />

                <Button
                    title = {"Sign In"}
                    onPress = {this.navigateToSignUpScreen}
                    style = {{marginBottom: 5}} 
                />
            </View>
        );
    }
}