import { router } from "expo-router";
import { StyleSheet, View, Text, Pressable, ScrollView, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputGroups from '../components/InputGroups';
import ButtonGroups from '../components/ButtonGroup';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { useState } from 'react';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker'

const serverUrl = process.env.EXPO_PUBLIC_API_URL;
SplashScreen.preventAutoHideAsync();

export default function signUp() {

    const [getFname, setFname] = useState("");
    const [getLname, setLname] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getMobile, setmobile] = useState("");
    const [getImage, setImage] = useState(null);
    const [loaded, error] = useFonts(
        {

            'MochiyPopOne-Regular': require("../assets/fonts/MochiyPopOne-Regular.ttf"),
        }
    );
    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]
    );

    if (!loaded && !error) {
        return null;
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollDiv1}>
                <View style={styles.scrollDiv2}>
                    <View>
                        <Text style={styles.brandName}>Talkio</Text>
                    </View>
                    <View>
                        <Text style={styles.heading1}>Sign Up</Text>
                    </View>
                    <Pressable onPress={
                        async () => {
                            let result = await ImagePicker.launchImageLibraryAsync({});
                            if (!result.canceled) {
                                setImage(result.assets[0].uri);
                            }
                        }
                    }>

                        <ImageBackground source={require("../assets/images/person1.png")}  >
                            <Image source={getImage} style={styles.imageView} contentFit={"cover"} />
                        </ImageBackground>



                    </Pressable>
                    <InputGroups Label={"First Name"} mode={"text"} securityType={false} functionToDo={
                        (text) => {
                            setFname(text);
                        }
                    } />
                    <InputGroups Label={"Last Name"} mode={"text"} securityType={false} functionToDo={
                        (text) => {
                            setLname(text);
                        }
                    } />
                    <InputGroups Label={"Mobile Number"} mode={"tel"} securityType={false} functionToDo={
                        (text) => {
                            setmobile(text);
                        }
                    } />
                    <InputGroups Label={"Password"} mode={"text"} securityType={true} functionToDo={
                        (text) => {
                            setPassword(text);
                        }
                    } />
                    <ButtonGroups Label={"Sign Up"} functionToDo={
                        async () => {
                            let formData = new FormData();
                            formData.append("mobile", getMobile);
                            formData.append("fname", getFname);
                            formData.append("lname", getLname);
                            formData.append("password", getPassword);
                            if (getImage != null) {

                                formData.append("profilePic",
                                    {
                                        name: "profilePic.png",
                                        type: "image/png",
                                        uri: getImage,

                                    }


                                );
                            }

                            let response = await fetch(serverUrl+"/Talkio/SignUp",
                                {
                                    method: "POST",
                                    body: formData,


                                }
                            );
                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    Alert.alert("Success", json.msg);
                                    router.push("/");
                                } 
                                
                                else {
                                    if(json.msg = "Mobile Number already Exist"){
                                        Alert.alert("Talkio", "You have signed In through another device.Do you want to Link this Device?", [
                                            {
                                                text: 'Yes',
                                                onPress: async () => {
    
                                                    router.push("/mobile");
                                                },
    
                                            },
                                            {
                                                text: 'No',
                                                onPress: () => {
    
                                                },
    
                                            },
    
                                        ]);
                                    }else{
                                        Alert.alert("Error", json.msg);
                                    }
                                   
                                }

                            } else {
                                Alert.alert("Error", "Something went wrong")
                            }

                        }} />
                    <View>
                        <Pressable onPress={
                            () => {
                                router.push("/");
                            }
                        }>

                            <Text style={styles.btnText}>Have an account? Sign In </Text>

                        </Pressable>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Powered by WebStudio</Text>
                    </View>
                </View>
            </ScrollView>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    img1: {
        height: 150,
        width: 150,
    },
    brandName: {
        fontSize: 52,
        color: "#318CE7",
        fontFamily: "MochiyPopOne-Regular",
    },
    heading1: {
        marginTop: 15,
        fontSize: 30,
        color: "black",
        fontWeight: "bold",
        marginBottom: 20,
    },
    footerText: {
        color: "#C0C0C0",
    },
    footer: {
        marginTop: 10,
    },
    imageView: {
        marginVertical: 6,
        height: 150,
        width: 150,
        backgroundColor: "#E0FFFF",
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "#0066b2",
        borderStyle: "dashed",
    },
    scrollDiv1: {
        width: "100%",
    },
    scrollDiv2: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",

    }

});

