import { StyleSheet, View, Text, Pressable } from 'react-native';


export default function ButtonGroups({Label,functionToDo}) {
    return (

        <View style={styles.btnGroup}>
        <Pressable style={styles.btn} onPress={functionToDo}>
               
            <Text style={styles.btnText}> {Label} </Text>
         
        </Pressable>
      </View>


    );
}

const styles = StyleSheet.create({

    btnGroup: {
        width: "86%",
        paddingHorizontal: 10,
        height: "auto",
        paddingVertical: 8,
        alignItems:"center",
        justifyContent:"center",
      },
      btn: {
        backgroundColor: "#318CE7",
        color: "white",
        width: "100%",
        alignItems:"center",
        justifyContent:"center",
        height:40,
        borderRadius:10,
      },
      btnText:{
        color:"white",
        fontSize:16,
        fontWeight:"bold",
      }
});
