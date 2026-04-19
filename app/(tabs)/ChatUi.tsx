import React, { useState, useEffect } from 'react';
import {StyleSheet, View, KeyboardAvoidingView,Text, Image, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert, BackHandler, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../../constants/config';
import { SafeAreaView } from 'react-native-safe-area-context';


interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: string;
}

// Cache for URL previews
const previewCache = new Map();

const fetchMetadata = async (url: string) => {
  // Check cache first
  if (previewCache.has(url)) {
    return previewCache.get(url);
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Using RegExp object to avoid Metro Bundler parsing issues with literal regex containing tags
    const titleRegex = new RegExp('<title>(.*?)</title>', 'i');
    const titleMatch = html.match(titleRegex);
    const ogTitleMatch = html.match(/<meta property="og:title" content="(.*?)"/i);
    const ogDescMatch = html.match(/<meta property="og:description" content="(.*?)"/i);
    const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)"/i);
    
    const metadata = {
      title: ogTitleMatch?.[1] || titleMatch?.[1] || 'No title',
      description: ogDescMatch?.[1] || '',
      image: ogImageMatch?.[1] || null,
    };
    
    previewCache.set(url, metadata);
    return metadata;
  } catch (error) {
    console.log('Failed to fetch metadata:', error);
    return null;
  }
};

const URLPreview = ({ url }: { url: string }) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetadata(url).then(data => {
      setMetadata(data);
      setLoading(false);
    });
  }, [url]);

  if (loading) {
    return (
      <View style={{ padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8, marginTop: 8 }}>
        <ActivityIndicator size="small" color="#007BFF" />
        <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Loading preview...</Text>
      </View>
    );
  }
  
  if (!metadata) return null;

  return (
    <TouchableOpacity 
      onPress={() => Linking.openURL(url)} 
      style={styles.previewContainer}
      activeOpacity={0.7}
    >
      {metadata.image && (
        <Image 
          source={{ uri: metadata.image }} 
          style={styles.previewImage}
          resizeMode="cover"
        />
      )}
      <Text style={styles.previewTitle} numberOfLines={1}>{metadata.title}</Text>
      {metadata.description && (
        <Text style={styles.previewDescription} numberOfLines={2}>
          {metadata.description}
        </Text>
      )}
    </TouchableOpacity>
  );
};
const ChatUi = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  useEffect(() => {
    const initChat = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const receiver = await AsyncStorage.getItem('receiverId');
        const token = await AsyncStorage.getItem('token');

        if (userId && receiver && token) {
          const parsedUserId = parseInt(userId);
          const parsedReceiverId = parseInt(receiver);
          console.log('Parsed User ID:', parsedUserId);
          console.log('Parsed Receiver ID:', parsedReceiverId);
          setCurrentUserId(parsedUserId);
          setReceiverId(parsedReceiverId);
          fetchMessages(parsedUserId, parsedReceiverId);

          // Initialize Socket.io
          const newSocket = io(BASE_URL, {
            transports: ['websocket'],
            autoConnect: true
          });

          newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            newSocket.emit('authenticate', { token });
            // Join the user's own room for real-time updates
            newSocket.emit('join', { userId: parsedUserId });
          });

          newSocket.on('receiveMessage', (message: Message) => {
            setMessages(prev => {
              if (prev.some(m => m.id === message.id)) return prev;
              return [...prev, message];
            });
          });

          setSocket(newSocket);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initChat();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      router.replace('/NearbyUser');
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [router]);

  const fetchMessages = async (senderId: number, receiverId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `${BASE_URL}/messages?senderId=${senderId}&receiverId=${receiverId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() && currentUserId && receiverId && socket) {
      const token = await AsyncStorage.getItem('token');

      
      socket.emit('sendMessage', {
        token,
        receiverId,
        content: newMessage.trim(),
      });

      console.log('Sending message:', { receiverId, content: newMessage.trim()});

      setNewMessage('');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  const renderItem = ({ item }: { item: Message }) => {
    const urls = item.content.match(urlRegex);
    const cleanText = item.content.replace(urlRegex, '');

    return (
      <View
        style={[
          styles.messageContainer,
          item.senderId === currentUserId ? styles.myMessage : styles.contactMessage
        ]}
      >
        <View>
          {cleanText && <Text style={styles.messageText}>{cleanText}</Text>}
          {urls?.map((url, index) => (
            <URLPreview key={`${item.id}-${index}`} url={url} />
          ))}
        </View>
        <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" keyboardVerticalOffset={10}>
      <SafeAreaView style={styles.container}>
        <FlatList
          inverted
          data={[...messages].reverse()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
            textAlignVertical="top"  
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>  
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  previewImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  previewTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  previewDescription: {
    color: '#666',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#E5DDD5',
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
    maxWidth: '75%',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 0,
    marginRight: 5,
  },
  contactMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 0,
    marginLeft: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    color: '#000',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChatUi;
