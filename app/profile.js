import { StyleSheet, View, Text, Pressable, ScrollView, Alert, ImageBackground } from 'react-native';
import InputGroups from '../components/InputGroups';
import ButtonGroups from '../components/ButtonGroup';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";


const serverUrl = process.env.EXPO_PUBLIC_API_URL;
SplashScreen.preventAutoHideAsync();

export default function profile() {
    const [getFname, setFname] = useState("");
    const [getLname, setLname] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getRegDate, setRegDate] = useState("");
    const [getSecurity, setsecurity] = useState(true);
    const [getEdittableFname, setEdittableFname] = useState(false);
    const [getEdittableLname, setEdittableLname] = useState(false);
    const [getEdittablePassword, setEdittablePassword] = useState(false);
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
                async function getStored() {
                    const userData = await AsyncStorage.getItem("user");
                    if (userData != null) {
                        const user = JSON.parse(userData);
                        setFname(user.fname);
                        setLname(user.lname);
                        setPassword(user.password);
                        setmobile(user.mobile);
                        setRegDate(user.registeredDate);
                        setImage(serverUrl + "/Talkio/ProfilePics/" + user.mobile + ".png")
                    } else {
                        Alert.alert("Error", "Something went wrong");
                        router.push("/home");
                    }

                }
                getStored();
            }

        }, [loaded, error]
    );

    if (!loaded && !error) {
        return null;
    }
    return (
        <View style={styles.container} >
            <View style={styles.mainBar}>
                <Pressable>
                    <FontAwesome6 name={"arrow-left-long"} size={20} color={"#318CE7"} onPress={() => {
                        router.back();
                    }} />
                </Pressable>

                <Text style={styles.heading1}>Profile1</Text>

            </View>
            <ScrollView style={styles.scrollDiv1}>
                <View style={styles.scrollDiv2}>

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
                    <Text style={styles.registerText1}>Registered On</Text>
                    <Text style={styles.registerText2}>{getRegDate}</Text>
                    <Pressable style={styles.longDiv} onLongPress={
                        () => {
                            setEdittableFname(true)
                        }
                    }>
                        <InputGroups Label={"First Name"} mode={"text"} securityType={false} inputValue={getFname} editStatus={getEdittableFname} functionToDo={
                            (text) => {
                                setFname(text);
                            }
                        } />
                    </Pressable>
                    <Pressable style={styles.longDiv} onLongPress={
                        () => {
                            setEdittableLname(true)
                        }
                    }>
                        <InputGroups Label={"Last Name"} mode={"text"} securityType={false} inputValue={getLname} editStatus={getEdittableLname} functionToDo={
                            (text) => {
                                setLname(text);
                            }
                        } />
                    </Pressable>

                    <InputGroups Label={"Mobile Number"} mode={"tel"} inputValue={getMobile} securityType={false} editStatus={false} functionToDo={
                        (text) => {
                            setmobile(text);
                        }
                    } />

                    <Pressable style={styles.longDiv} onLongPress={
                        () => {
                            setsecurity(false);
                        }
                    } onPress={() => {
                        setsecurity(true);
                        setEdittablePassword(true);
                    }}>
                        <InputGroups Label={"Password"} mode={"text"} inputValue={getPassword} securityType={getSecurity} editStatus={getEdittablePassword} functionToDo={
                            (text) => {
                                setPassword(text);
                            }
                        } />
                    </Pressable>

                    <ButtonGroups Label={"Update Profile"} functionToDo={
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

                            let response = await fetch(serverUrl + "/Talkio/UpdateProfile",
                                {
                                    method: "POST",
                                    body: formData,


                                }
                            );
                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    Alert.alert("Success", json.msg);
                                    setEdittableFname(false)
                                    setEdittableLname(false)
                                    setEdittablePassword(false)

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

                                Alert.alert("Talkio", "Do you want to Log Out?", [
                                    {
                                        text: 'Yes',
                                        onPress: async () => {
                                            try {
                                                await AsyncStorage.removeItem("user");
                                            } catch (error) {
                                                Alert.alert("Error", "Something went wrong")
                                            }
                                            router.push("/");
                                        },

                                    },
                                    {
                                        text: 'No',
                                        onPress: () => {

                                        },

                                    },

                                ]);

                            }
                        }>

                            <Text style={styles.btnTextL}>Logout </Text>

                        </Pressable>
                    </View>
                    <View>
                        <Pressable onPress={
                            () => {
                                Alert.alert("Talkio", "Do you want to Delete Account ?", [
                                    {
                                        text: 'Yes',
                                        onPress: async () => {
                                            let response = await fetch(serverUrl + "/Talkio/DeleteProfile?mobile=" + getMobile);
                                            if (response.ok) {
                                                let json = await response.json();

                                                if (json.success) {
                                                    Alert.alert("Success", json.msg);
                                                    try {
                                                        await AsyncStorage.removeItem("user");
                                                    } catch (error) {
                                                        Alert.alert("Error", "Something went wrong")
                                                    }
                                                    router.push("/home");


                                                } else {
                                                    Alert.alert("Error", json.msg);
                                                }

                                            } else {
                                                Alert.alert("Error", "Something went wrong")
                                            }
                                        },

                                    },
                                    {
                                        text: 'No',
                                        onPress: () => {

                                        },

                                    },

                                ]);


                            }
                        }>

                            <Text style={styles.btnTextD}>Delete Account </Text>

                        </Pressable>
                    </View>


                </View>
            </ScrollView>


        </View>
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

        fontSize: 26,
        color: "#318CE7",
        fontWeight: "bold",


    },
    mainBar: {
        paddingVertical: 5,
        height: 50,
        alignItems: "center",
        width: "100%",

        paddingHorizontal: 20,
        flexDirection: "row",
        columnGap: 20,
        marginBottom: 20,
    },
    registerText1: {
        color: "#318CE7",
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
    registerText2: {
        color: "#318CE7",
        marginBottom: 10,
    },
    footerText: {
        color: "#C0C0C0",
    },
    footer: {
        marginTop: 10,
    },
    imageView: {
        marginVertical: 6,
        height: 100,
        width: 100,
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

    },
    btnTextD: {
        color: "red",
    },
    btnTextL: {
        color: "#318CE7",
        paddingVertical: 5,
        fontWeight: "bold"
    },
    longDiv: {
        width: "100%",
        alignItems: "center",

    }

});

