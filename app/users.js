import { Image } from 'expo-image';
import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, Alert, FlatList, ImageBackground } from 'react-native';
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';
import { FontAwesome6 } from "@expo/vector-icons";



SplashScreen.preventAutoHideAsync();
const serverUrl = process.env.EXPO_PUBLIC_API_URL;

export default function users() {
    const [getUser, setUser] = useState("");
    async function getStored() {
        const userData = await AsyncStorage.getItem("user");
        if (userData != null) {
            const user = JSON.parse(userData);
            const text = "";
            let response = await fetch(serverUrl + "/Talkio/LoadUsers?mobile=" + user.mobile + "&searchTxt=" + text);
            if (response.ok) {
                let json = await response.json();


                if (json.success) {
                    setUser(json.user);


                } else {
                    router.push("/home");
                }


            } else {
                Alert.alert("Error", "Something went wrong")
                router.push("/home");
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
                getStored();

            }
        }, [loaded, error]
    );

    if (!loaded && !error) {
        return null;
    }



    return (
        <View style={styles.container}>
            <View style={styles.mainBar}>
                <Pressable>
                <FontAwesome6 name={"arrow-left-long"} size={20} color={"#318CE7"} onPress={()=>{
                    router.back();
                }}/>
                </Pressable>
          
             <Text style={styles.heading1}>Users</Text>
                
            </View>
            <View style={styles.inputGroup}>
                <TextInput style={styles.inputField} placeholder='Search...' onChangeText={
                    async (text) => {
                        const userData = await AsyncStorage.getItem("user");
                        if (userData != null) {
                            const user = JSON.parse(userData);
                            let response = await fetch(serverUrl + "/Talkio/LoadUsers?mobile=" + user.mobile + "&searchTxt=" + text);
                            if (response.ok) {
                                let json = await response.json();


                                if (json.success) {
                                    setUser(json.user);


                                } else {
                                    Alert.alert("Error", "No User");
                                }


                            } else {
                                Alert.alert("Error", "Something went wrong")
                                router.push("/home");
                            }

                        } else {

                            router.push("/home");
                        }
                    }
                } />
            </View>


            <View style={styles.scrollBox}>
                <FlatList
               
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
                                <Text style={styles.msgName}>{item.name}</Text>
                                <Text style={styles.msg}>{item.registeredDate}</Text>
                            </View>
                            <View style={styles.timeDesc}>

                                <FontAwesome6 name={"circle-check"} size={20} color={item.userStatus == 2 ? "#C0C0C0" : "#318CE7"} />
                                <Text style={item.userStatus == 2 ? styles.timeOff : styles.timeOn}>{item.userStatus == 2 ? "Offline" : "Online"}</Text>
                            </View>
                        </Pressable>
                    )}
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
        paddingVertical: 10,

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
     
        fontSize: 26,
        color: "#318CE7",
        fontWeight: "bold",
       

    },
    mainBar: {
        paddingVertical: 5,
        height: 50,
        alignItems:"center",
        width: "100%",
      
        paddingHorizontal: 20,
        flexDirection: "row",
        columnGap:20,
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
        width: "100%",
        paddingTop: 10,
        flex:1,
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
    msgName: {
        fontSize: 18,
        color: "#0066b2",
        fontWeight: "bold",
    },

    timeOn: {
        fontSize: 10,
        color: "#0066b2",
    },
    timeOff: {
        fontSize: 10,
        color: "#C0C0C0",
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


