import { Image } from 'expo-image';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputGroups from '../components/InputGroups';
import ButtonGroups from '../components/ButtonGroup';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();
const serverUrl = process.env.EXPO_PUBLIC_API_URL;
export default function otp() {
    const sentMobile = useLocalSearchParams();
    const [getOTP, setOTP] = useState("");
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
            <View style={styles.msgText}><Text>Please Enter the OTP sent to your other device.</Text></View>
            <InputGroups Label={"OTP"} functionToDo={
                (text) => {
                    setOTP(text);
                }
            } />

            <ButtonGroups Label={"Confirm"} functionToDo={
                async () => {



                    let response = await fetch(serverUrl + "/Talkio/CheckOTP?mobile=" + sentMobile.mobile + "&otp=" + getOTP);
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

                        } else {
                            Alert.alert("Error", json.msg);
                        }

                    } else {
                        Alert.alert("Error", "Something went wrong")
                    }

                }} />


            <View>
                <Pressable onPress={
                    () => {
                        router.back();
                    }
                } >

                    <Text style={styles.btnText}  >Back </Text>

                </Pressable>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Powered by WebStudio</Text>
            </View>

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
        bottom: 5,
        position: "absolute",


    },
    msgText: {
        marginBottom: 20,
    },
    msgText2: {
        marginBottom: 5,
        marginTop: 10,
    }

});


