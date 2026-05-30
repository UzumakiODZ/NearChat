import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert, BackHandler} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../../constants/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import PreferenceSetter from '../../components/PreferenceSetter';
import RouteTray from '../../components/RouteTray';

interface User {
  id: number;
  username: string;
  distance: number;
}

const NearbyUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel'
        },
        { text: 'Exit', onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, []);


  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');

        if (!storedUserId || !token) {
          Alert.alert('Authentication Required', 'Please login to continue');
          router.replace('/LoginPage');
          return;
        }

        const userId = Number.parseInt(storedUserId, 10);
        const distance = 10;
        setCurrentUserId(userId);
        fetchNearbyUsers(userId,distance);
        console.log(userId);
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.replace('/LoginPage');
      }
    };

    const fetchNearbyUsers = async (userId: number, distance: number) => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        const response = await fetch(`${BASE_URL}/nearby-users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.replace('/LoginPage');
            return;
          }
          throw new Error('Failed to fetch nearby users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch nearby users');
        console.error('Error fetching nearby users:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleChatPress = async (receiverId: number) => {
    try {
      await AsyncStorage.setItem('receiverId', receiverId.toString());
      router.push('/ChatUi'); 
    } catch (error) {
      console.error('Error navigating to chat:', error);
      Alert.alert('Error', 'Failed to navigate to chat');
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <View style={{ width: '95%', marginBottom: 20 }}>
          <Text style={styles.welcomeText}>Nearby Users</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
          
            <PreferenceSetter />
            {users.length > 0 ? (
              <FlatList
                style={{ width: '90%' }}
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.pikaNameContainer}>
                    <Text style={styles.pikaName}>{item.username}</Text>
                    <View style={styles.userInfo}>
                      <TouchableOpacity onPress={() => handleChatPress(item.id)}>
                        <Image
                          source={require('../../assets/images/icons8-chat-24.png')}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                      <Text style={styles.pikaName}>{item.distance.toFixed(2)} km away</Text>
                    </View>
                  </View>
                )}
              />
            ) : (
              <View>
                <Text style={styles.pikaName}>No nearby users found</Text>
              </View>
            )}
          </>
        )}

        <RouteTray />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    padding: 10,
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  pikaNameContainer: {
    width: '100%',
    marginVertical: 8,
    padding: 10,
    borderRadius: 15,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pikaName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  userInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 8,
    tintColor: '#007AFF',
  },
});

export default NearbyUser;