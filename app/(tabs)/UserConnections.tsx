import React,{useState,useEffect} from 'react'
import { StyleSheet, View, Text,} from 'react-native';
import { fetch } from "expo/fetch";
import { SafeAreaView } from 'react-native-safe-area-context';
import RouteTray from '@/components/RouteTray';

const UserConnections = () =>{
    const [connectionList, setConnectionList] = useState([]);

    /*    // Fetch chat list sorted with last chat
        const fetchConnectionList = async () => {
            try {
                const response = await fetch('YOUR_API_URL');

                const data = await response.json();

                setConnectionList(data);
            } 
            catch (error) {
                console.log("Error fetching connections");
            }
        };

        useEffect(() => {
            fetchConnectionList();
        }, []);
    */
    
    return(
        <SafeAreaView style={styles.container}>
            <View>
                <Text>
                    user connections 
                </Text>
            </View>
            <RouteTray />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#F0F4F8',
        padding: 10,
        width: '100%',
        height: '100%',
    },
});

export default UserConnections