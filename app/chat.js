import { Image } from 'expo-image';
import { StyleSheet, View, Text, Pressable, TextInput, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import * as ImagePicker from 'expo-image-picker'

const serverUrl = process.env.EXPO_PUBLIC_API_URL;
SplashScreen.preventAutoHideAsync();

export default function chat() {
    const [getChatText, setChatText] = useState([]);
    const [getIcon, setIcon] = useState("ellipsis-v");
    const [getImage, setImage] = useState(null);
    const [getMsgId, setMsgId] = useState(null);
    const item = useLocalSearchParams();
    const [getChatArray, setChatArray] = useState("");
    useEffect(() => {
        fetchChatArray();
    }, []);

    async function fetchChatArray() {
        let userJson = await AsyncStorage.getItem("user");
        let user = JSON.parse(userJson);

        let response = await fetch(serverUrl + "/Talkio/LoadChat?logged_user_id=" + user.id + "&other_user_id=" + item.id);
        if (response.ok) {
            let chatArray = await response.json();

            setChatArray(chatArray);
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
            }
        }, [loaded, error]
    );

    if (!loaded && !error) {
        return null;
    }



    return (

        <View style={styles.container}>
            <View style={styles.msgTopBar}>
                {
                    item.profilePic == "true" ?
                        <Image source={serverUrl + "/Talkio/ProfilePics/" + item.mobile + ".png"} style={styles.profPic} />
                        :
                        <Image source={require("../assets/images/person1.png")} style={styles.profPic} />
                }

                <View>
                    <Text style={styles.personName}>{item.name}</Text>
                    <Text style={styles.proState}>{item.userStatus == 1 ? "Online " : "Offline"}</Text>
                </View>
                <View style={styles.iconPanel}>

                    <Pressable style={styles.iconBox} onPress={
                        async () => {
                            if (getMsgId != null) {
                                let response = await fetch(serverUrl + "/Talkio/DeleteMessage?msgId=" + getMsgId);

                                if (response.ok) {

                                    let json = await response.json();


                                    if (json.success) {

                                        fetchChatArray();
                                        setIcon("ellipsis-v");
                                        setMsgId(null);

                                    } else {

                                        Alert.alert("Error", "Something went wrong")
                                    }


                                } else {
                                    Alert.alert("Error", "Something went wrong")

                                }
                            }

                        }}>
                        <FontAwesome name={getIcon} size={20} color={"white"} />

                    </Pressable>

                </View>

            </View>
            <View style={styles.msgViewScroll}>

                <FlashList
                    data={getChatArray}
                    renderItem={({ item }) => (
                        
                        <Pressable style={item.side == "right" ? styles.senderMsgDiv : styles.recieverMsgDiv} onLongPress={() => {
                            if(item.side == "right"){
                                setIcon("trash");
                                setMsgId(item.id);
                            }
                          
                        }}>
                            {item.status == 3 ? <Text style={styles.recieverMsgDelete}>Message Deleted</Text> : <Text style={styles.recieverMsg}>{item.message}</Text>}

                            <View style={styles.deliverBox}>
                                <Text style={styles.msgTime}>{item.dateTime}</Text>
                                {item.side == "right" ? <FontAwesome6 name={"circle-check"} size={14} color={item.status == 1 ? "#318CE7" : "white"} /> : null}

                            </View>
                        </Pressable>
                    )}
                    estimatedItemSize={200}
                />
            </View>
            <View style={styles.msgSendBox}>
                <Pressable style={styles.iconBox} 
                // onPress={
                    //    async () => {
                    //     let result = await ImagePicker.launchImageLibraryAsync({});
                    //     if (!result.canceled) {
                    //         setImage(result.assets[0].uri);

                    //         let formData = new FormData();
                      
                    //         formData.append("logged_user_id", user.id);
                    //         formData.append("other_user_id", item.id);
                          
                    //         if (getImage != null) {

                    //             formData.append("sendImage",
                    //                 {
                    //                     name: "sendImage.png",
                    //                     type: "image/png",
                    //                     uri: getImage,

                    //                 }


                    //             );
                    //         }
                    //         let response = await fetch(serverUrl+"/Talkio/SignUp",
                    //             {
                    //                 method: "POST",
                    //                 body: formData,


                    //             }
                    //         );
                    //         if (response.ok) {
                    //             let json = await response.json();

                    //             if (json.success) {
                    //                 Alert.alert("Success", json.msg);
                    //                 router.push("/");
                    //             } 
                                
                    //             else {
                    //                 if(json.msg = "Mobile Number already Exist"){
                    //                     Alert.alert("Talkio", "You have signed In through another device.Do you want to Link this Device?", [
                    //                         {
                    //                             text: 'Yes',
                    //                             onPress: async () => {
    
                    //                                 router.push("/mobile");
                    //                             },
    
                    //                         },
                    //                         {
                    //                             text: 'No',
                    //                             onPress: () => {
    
                    //                             },
    
                    //                         },
    
                    //                     ]);
                    //                 }else{
                    //                     Alert.alert("Error", json.msg);
                    //                 }
                                   
                    //             }

                    //         } else {
                    //             Alert.alert("Error", "Something went wrong")
                    //         }



                    //     }
                    // }
                //   } 
                   >
                    <FontAwesome6 name={"plus"} size={20} color={"#318CE7"} />

                </Pressable>
                <View style={styles.inputGroup}>
                    <TextInput style={styles.inputField} placeholder='Type something...' value={getChatText}
                        onChangeText={
                            (text) => {
                                setChatText(text);


                            }
                        } editable={item.id == 7? false : true} />
                </View>
                <Pressable style={styles.iconBox} onPress={
                    async () => {
                        let userJson = await AsyncStorage.getItem("user");
                        let user = JSON.parse(userJson);
                        let response = await fetch(serverUrl + "/Talkio/SendChat?logged_user_id=" + user.id + "&other_user_id=" + item.id + "&message=" + getChatText);
                        if (response.ok) {
                            let json = await response.json();

                            if (json.success) {
                                setChatText("");
                                fetchChatArray();
                            }
                        }


                    }
                }>
                    <FontAwesome6 name={"paper-plane"} size={20} color={"#318CE7"} />

                </Pressable>


            </View>

        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 10,

    },
    img1: {
        height: 150,
        width: 150,

    },
    deliverBox: {
        flexDirection: "row",
        justifyContent: "flex-end",
        columnGap: 5,
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
    msgTopBar: {
        backgroundColor: '#318CE7',
        height: 60,
        width: "100%",
        alignItems: "center",


        paddingHorizontal: 5,
        flexDirection: "row",
    },
    msgSendBox: {
        height: 50,
        width: "100%",

        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
    },
    profPic: {
        backgroundColor: "white",
        height: 50,
        width: 50,

        borderRadius: 100,
    },
    personName: {
        color: "white",
        paddingStart: 10,
        fontSize: 16,
        fontWeight: "bold",

    },
    proState: {
        color: "white",
        paddingStart: 10,
        fontSize: 12,

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
        alignItems: "center",
        justifyContent: "center",
    },
    inputGroup: {
        width: "80%",
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
    
    msgViewScroll: {
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 10,
        flex: 1,

    },
    senderMsgDiv: {
        minWidth: 100,
        maxWidth: "40%",
        paddingStart: 10,
        backgroundColor: "#C0C0C0",
        alignSelf: "flex-end",
        minHeight: 30,
        paddingHorizontal: 5,
        paddingVertical: 5,
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    senderMsg: {
        fontSize: 14,
    },
    recieverMsgDiv: {
        minWidth: 100,
        maxWidth: "40%",
        paddingStart: 10,
        backgroundColor: "#87CEFA",
        alignSelf: "flex-start",
        minHeight: 30,
        paddingHorizontal: 5,
        paddingVertical: 5,
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    recieverMsg: {
        fontSize: 14,
    },
    recieverMsgDelete: {
        fontSize: 12,
        fontStyle: "italic",
    },
    msgTime: {
        fontSize: 12,
        alignSelf: "flex-end",
    },

});



