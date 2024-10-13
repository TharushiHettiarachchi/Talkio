import { Image } from 'expo-image';
import { StyleSheet, View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputGroups from '../components/InputGroups';
import ButtonGroups from '../components/ButtonGroup';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";


SplashScreen.preventAutoHideAsync();
const serverUrl = process.env.EXPO_PUBLIC_API_URL;


export default function index() {

    const [getPassword, setPassword] = useState("");
    const [getMobile, setmobile] = useState("");
    const [loaded, error] = useFonts(
        {
            'MochiyPopOne-Regular': require("../assets/fonts/MochiyPopOne-Regular.ttf"),
        }
    );


    useEffect(
        () => {
            async function checkUserIn() {

                try {
                    let userJson = await AsyncStorage.getItem("user");
                    if (userJson !== null) {
                        router.replace("/home");
                    }
                } catch (e) {

                }
            }
            checkUserIn();
        }, []
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
                        <Image
                            source={{
                                uri: 'https://img.freepik.com/premium-vector/chat-vector-icon_676179-133.jpg',
                            }}
                            style={styles.img1}
                        />
                    </View>
                    <View>
                        <Text style={styles.heading1}>Sign In</Text>
                    </View>
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
                    <ButtonGroups Label={"Sign In"} functionToDo={
                        async () => {


                            let response = await fetch(serverUrl + "/Talkio/SignIn",
                                {
                                    method: "POST",
                                    body: JSON.stringify({
                                        mobile: getMobile,
                                        password: getPassword,
                                    }),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }


                                }
                            );
                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    Alert.alert("Success", json.msg);
                                    try {
                                        await AsyncStorage.setItem("user", JSON.stringify(json.user));
                                    } catch (error) {
                                        Alert.alert("User Details not saved");
                                    }
                                    router.push("/home");
                                } else if (json.msg == "Have a logged account") {




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



                                }

                                else {
                                    Alert.alert("Error", json.msg);
                                }

                            } else {
                                Alert.alert("Error", "Something went wrong")
                            }

                        }} />
                    <View>
                        <Pressable onPress={
                            () => {
                                router.push("/signUp");
                            }
                        } >

                            <Text style={styles.btnText}  >Don't have an account? Sign Up </Text>

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
        height: "100%",

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
        marginTop: 40,
        color: "#318CE7",

        fontFamily: "MochiyPopOne-Regular",
    },
    heading1: {
        marginTop: 20,
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
    scrollDiv1: {
        width: "100%",
        flex: 1,
        height: "100%",

    },
    scrollDiv2: {


        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",

    }

});



