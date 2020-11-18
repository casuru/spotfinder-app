import React from "react";
import {View, Button, Text, TextInput, AsyncStorage} from "react-native";
import * as Location from "expo-location";
import { LocationAccuracy } from "expo-location";
import MapView from "react-native-maps";
import {Marker} from "react-native-maps";
import * as ImagePicker from 'expo-image-picker';
import ActionButton from "react-native-action-button";
import * as mime from 'react-native-mime-types';



export default class HomeScreen extends React.Component{


    constructor(props){
        super(props);

        this.state = {
            needsPermission: false,
            spots: [],
            currentLocation: null,
            region: null,
            spotFormModalIsVisible: false,
            needsImagePickerPermission: false,
            name: "",
            imageUri: "",
            isSubmitting: false

        }
    }


    componentDidMount(){

        this.getLocationPermission();
    }


    getLocationPermission = async() => {

        const {status} = await Location.requestPermissionsAsync();

        if(status !== "granted"){

            this.setState({
                needsPermission: true
            });

        } else if(status == "granted"){

            this.setState({
                needsPermission: false
            });

            Location.watchPositionAsync({
                accuracy: LocationAccuracy.BestForNavigation,
                timeInterval: 1000,
            }, (location) => {

                this.setState({
                    currentLocation: location,
                });

                
                const {latitude, longitude} = location.coords;

                this.getSpots(latitude, longitude);

                const {region} = this.state;

                if(region === null){

                    this.setState({
                        region:{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.00922,
                            longitudeDelta: 0.00422
                        }
                    })
                }


            })
        }
    }


    getSpots = async(lat, lng) => {

        const endpoint = `https://spotfinder-api.herokuapp.com/v1/spots/?lat=${lat}&lng=${lng}`;

        const token = await AsyncStorage.getItem("@spotfinderToken");

        const response = await fetch(endpoint, {
            method:"GET",
            headers:{
                Authorization: "Token " + token
            }
        });

        const responseJson = await response.json();

        this.setState({
            spots: responseJson.results
        });

    }



    onRegionChange = (region) => {

        this.setState({region});
    }

    spotFormToggle = () => {

        const {spotFormIsVisible} = this.state;

        this.setState({
            spotFormIsVisible: !spotFormIsVisible
        })
    }


    selectPhoto = async() => {

        const {status} = await ImagePicker.requestCameraRollPermissionsAsync();

        if(status !== "granted"){

            this.setState({
                needsImagePickerPermission: true
            });

        } else if(status === "granted"){

            this.setState({
                needsImagePickerPermission: false
            });

        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

        if (!result.cancelled){

            this.setState({
                imageUri: result.uri
            });
        }

    }


    updateName = (name) => {

        this.setState({
            name: name
        });
    }

    submitForm = async() => {

        const {name, imageUri, currentLocation} = this.state;

        this.setState({
            isSubmitting: true
        })

        const coordinates = {
            lat: currentLocation.coords.latitude,
            lng: currentLocation.coords.longitude
        }

        const token = await AsyncStorage.getItem("@spotfinderToken");

        const postResponse = await fetch("https://spotfinder-api.herokuapp.com/v1/spots/", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Authorization: "Token " + token
            },
            body: JSON.stringify({
                name: name,
                coordinates: coordinates
            })
        });

        const postResponseJson = await postResponse.json();

        const filename = imageUri.replace(/^.*[\\\/]/, '');
        const type = mime.lookup(filename);
        const formData = new FormData();

        formData.append("photo", {uri: imageUri, name:filename, type});


        const patchResponse = await fetch(`https://spotfinder-api.herokuapp.com/v1/spots/${postResponseJson.id}/`, {
            method: "PATCH",
            headers:{
                "Content-Type":"multipart/form-data",
                Authorization: "Token " + token
            },
            body: formData
        });


        const patchResponseJson = await patchResponse.json();


        if(patchResponse.ok){

            this.setState({
                spotFormIsVisible: false,
                isSubmitting: false,
                imageUri:"",
                name: ""
            });
        }
        

    }
    

    render(){

        const {needsPermission, currentLocation, region, spots, spotFormIsVisible, name, imageUri, isSubmitting} = this.state;

        const markers = spots.map((spot) => {

            return(
                <Marker
                    title = {spot.name}
                    coordinate = {{latitude: spot.coordinates.lat, longitude: spot.coordinates.lng}}
                    key = {spot.id}
                />
            )
        });

        if(currentLocation !== null){

            markers.push(<Marker key = {0} title = {"Me"} coordinate = {{latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude}} pinColor = "#00FF00" />);

        }
        
        return(
            <View style = {{flex: 1}}>
                {region !== null && !spotFormIsVisible &&
                <MapView
                    style = {{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                    initialRegion = {region}
                    onRegionChange = {this.onRegionChange}>
                    {markers}
                </MapView>}
                {needsPermission && 
                <View style = {{flex: 1, justifyContent: "center", alignItems: 'center'}}>
                    <Text style = {{alignItems: "center"}}>
                        Spotfinder requires access to your location to work properly.
                    </Text>
                    <Button title = {"Give Location Permission"} onPress = {this.getLocationPermission}/>
                </View>}

                {spotFormIsVisible && 
                <View style = {{flex: 1, justifyContent: "center"}}>
                    <View style = {{alignItems: 'center'}}>
                        <Text style = {{fontSize: 40, marginBottom: 10}}>
                            New Spot
                        </Text>
                    </View>
                    <TextInput 
                        placeholder = {"Spot Name"} 
                        onChangeText = {this.updateName}
                        style = {{borderColor: 'grey', borderWidth: 1, marginBottom: 3}}
                    />
                    <Button title = "Select Photo" onPress = {this.selectPhoto} />

                    <Button title = "Submit" onPress = {this.submitForm} disabled = {imageUri == "" || name == "" || isSubmitting}/>
                    <Button title = "Cancel" onPress = {this.spotFormToggle} />
                </View>}
                <ActionButton onPress = {this.spotFormToggle}>

                </ActionButton>
            </View>
        );
    }
}