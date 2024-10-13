import { Image } from 'expo-image';
import { StyleSheet, View, Text, Pressable, TextInput, Alert, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlashList } from '@shopify/flash-list';

SplashScreen.preventAutoHideAsync();
const serverUrl = process.env.EXPO_PUBLIC_API_URL;

export default function home() {
    const [getUser, setUser] = useState("");
    async function getHomeUser() {
        const userData = await AsyncStorage.getItem("user");
        if (userData != null) {
            const user = JSON.parse(userData);
            const text = "";
            let response = await fetch(serverUrl + "/Talkio/LoadHomeContact?id=" + user.id + "&searchTxt=" + text);
            if (response.ok) {

                let json = await response.json();


                if (json.status) {

                    setUser(json.user);

                } else {

                    Alert.alert("Error", "Something went wrong")
                }


            } else {
                Alert.alert("Error", "Something went wrong")

            }

        } else {

            router.push("/home");
        }

    }
    const [loaded, error] = useFonts(
        {

            'MochiyPopOne-Regular': require("../assets/fonts/MochiyPopOne-Regular.ttf"),
        }
    );
    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
                async function getStored() {
                    const userData = await AsyncStorage.getItem("user");
                    if (userData != null) {


                    } else {

                        router.push("/");
                    }

                }
                getStored();
                getHomeUser();
            }
        }, [loaded, error]
    );

    if (!loaded && !error) {
        return null;
    }



    return (
        <View style={styles.container}>
            <View style={styles.mainBar}>
                <View style={styles.brandBox} >
                    <Text style={styles.brandName}>Talkio</Text>
                </View>
                <View style={styles.iconPanel}>
                    <Pressable style={styles.iconBox} onPress={
                        () => {
                            router.push("/users");
                        }
                    }>
                        <FontAwesome name={"plus"} size={20} color={"#318CE7"} />

                    </Pressable>
                    <Pressable style={styles.iconBox} onPress={
                        () => {
                            router.push("/profile");
                        }
                    }>
                        <FontAwesome name={"user"} size={20} color={"#318CE7"} />

                    </Pressable>

                    <View style={styles.iconBox}>
                        <FontAwesome name={"ellipsis-v"} size={20} color={"#318CE7"} />

                    </View>

                </View>
            </View>
            <View style={styles.inputGroup}>
                <TextInput style={styles.inputField} placeholder='Search...' onChangeText={
                    async (text) => {
                        const userData = await AsyncStorage.getItem("user");
                        if (userData != null) {
                            const user = JSON.parse(userData);

                            let response = await fetch(serverUrl + "/Talkio/LoadHomeContact?id=" + user.id + "&searchTxt=" + text);

                            if (response.ok) {

                                let json = await response.json();


                                if (json.status) {

                                    setUser(json.user);

                                } else {

                                    Alert.alert("Error", "Something went wrong")
                                }


                            } else {
                                Alert.alert("Error", "Something went wrong")

                            }

                        } else {

                            router.push("/home");
                        }
                    }
                } />
            </View>
            <View style={styles.scrollBox}>
                <FlashList
                    data={getUser}
                    nestedScrollEnabled
                    renderItem={({ item }) => (
                        <Pressable style={styles.msgDiv} onPress={() => {
                            router.push({
                                pathname: "/chat",
                                params: item
                            });
                        }}>
                            <View style={styles.profilePicBox}>
                                <ImageBackground source={require("../assets/images/person1.png")}  >

                                    <Image source={serverUrl + "/Talkio/ProfilePics/" + item.mobile + ".png"}
                                        style={styles.profPic} />
                                </ImageBackground>

                            </View>
                            <View style={styles.msgDesc}>
                                <Text style={styles.msgNameUnread}>{item.name}</Text>
                                <Text style={styles.msg}>{item.message}</Text>
                            </View>
                            <View style={styles.timeDesc}>
                                <Text style={styles.time}>{item.datetime}</Text>
                                {item.unreadMessages != null ? <View style={styles.countBox}>

                                    <Text style={styles.count}>{item.unreadMessages}</Text>
                                </View> : null}

                            </View>
                        </Pressable>

                    )}
                    estimatedItemSize={1200}
                />

            </View>

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
     

    },
    img1: {
        height: 150,
        width: 150,

    },
    brandName: {
        fontSize: 32,
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
    mainBar: {
        paddingVertical: 5,
        height: 50,
        width: "100%",
        justifyContent: "center",
        paddingHorizontal: 5,
        flexDirection: "row",
        marginBottom:20,
    },
    iconBox: {
        height: 40,
        width: 40,

        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
    },
    iconPanel: {
       
        position: "absolute",
        right: 5,
        flexDirection: "row",
    },
    brandBox: {
        justifyContent: "center",
        position: "absolute",
        left: 10,
        height: 50,

    },
    inputGroup: {
        width: "86%",
        paddingHorizontal: 10,
        height: "auto",
        paddingVertical: 8,
    },
    inputField: {
        borderColor: "#0066b2",
        borderWidth: 1,
        marginTop: 5,
        height: 40,
        borderRadius: 10,
        paddingLeft: 10,
    },
    msgDiv: {
        width: "100%",
        height: 100,
      
        flexDirection: "row",
        paddingHorizontal: 5,
        alignItems: "center",
    },
    scrollBox: {
        flex: 1,
        width: "100%",
        paddingTop: 10,
    },
    profilePicBox: {
      
        height: 100,
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    profPic: {
      
        height: 70,
        width: 70,

        borderRadius: 100,
    },
    msgDesc: {
       
        height: 100,
        flex: 6,
        justifyContent: "center",
    },
    timeDesc: {
       
        height: 100,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    msgNameUnread: {
        fontSize: 18,
        color: "#0066b2",
        fontWeight: "bold",
    },
    msgNameRead: {
        fontSize: 16,
        color: "#0066b2",
       
    },
    time: {
        fontSize: 12,
    },
    countBox: {

        height: 20,
        width: 20,
        borderRadius: 100,
        backgroundColor: "#318CE7",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    countBoxNone: {

        height: 20,
        width: 20,
        borderRadius: 100,
        backgroundColor: "#318CE7",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        display: "none",
    },
    count: {
        fontSize: 12,
        fontWeight: "bold",
        color: "white",
    }


});


