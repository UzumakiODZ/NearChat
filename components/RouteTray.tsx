import React,{useState} from 'react';
import { StyleSheet, View, TouchableOpacity,} from 'react-native';
import {useRouter} from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';



const RouteTray = () => {
    const [Tab,setTab] = useState('nearyuser')
    const router = useRouter()

    return(
        <View style={styles.tray}>
            <TouchableOpacity
                style={Tab === 'nearbyuser' ? styles.activeTab : undefined}
                onPress={() => {
                    setTab('nearbyuser');
                    router.replace('/NearbyUser');
                }}
            >
                <FontAwesome5 name="user-friends" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                style={Tab === 'friends' ? styles.activeTab : undefined}
                onPress={() => {
                    setTab('friends');
                    router.replace('/UserConnections');
                }}>
                <Entypo name="chat" size={28} color="black" />    
            </TouchableOpacity>
            <TouchableOpacity 
                style={Tab === 'profile' ? styles.activeTab : undefined}
                onPressIn={() => {
                    setTab('profile');
                    router.replace('/UserProfile')
                }}
                onPress={() => router.replace('/UserProfile')}>
                <EvilIcons name="user" size={28} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tray: {
    width: "100%",
    padding: 4,
    justifyContent: "space-between",
    marginTop: "auto",
    flexDirection: 'row',
  },
  activeTab: {
    backgroundColor: "#ef7171"
  }
});

export default RouteTray;