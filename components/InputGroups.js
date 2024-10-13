
import { StyleSheet, View, Text, TextInput } from 'react-native';


export default function InputGroups({Label,mode,securityType,functionToDo,inputValue,editStatus}) {
    return (

        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{Label}</Text>
            <TextInput style={styles.inputField} inputMode={mode} secureTextEntry={securityType} onChangeText={functionToDo} value={inputValue} editable={editStatus}  />
        </View>


    );
}

const styles = StyleSheet.create({

    inputGroup: {
        width: "86%",
        paddingHorizontal: 10,
        height: "auto",
        paddingVertical:8,
    },
    inputField: {
        borderColor: "#0066b2",
        borderWidth: 1,
        marginTop: 5,
        height: 40,
        borderRadius: 10,
        paddingStart:10,
    },
    inputLabel: {
        fontSize: 16,
        color: "#0066b2",
        fontWeight: "bold"
    }
});
