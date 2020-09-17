/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

/*
 var ws = new WebSocket('wss://echo.websocket.org');
 ws.onopen = () => {
   //Mesajı gönderen method
   const message = 'hello';
   ws.send(message);
   console.log(`Sent: ${message}`);
 };
 ws.onmessage = (e) => {
   // mesajı alan method
   console.log(`Received: ${e.data}`);
 };
 ws.onerror = (e) => {
   // herhangi bir hata durumunda
   console.log(`Error: ${e.message}`);
 };
 ws.onclose = (e) => {
   //kapalı durumu
   console.log(e.code, e.reason);
 };
 */

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
export interface Message {
  user: string;
  text: string;
  timestamp: number;
}
export interface ChatState {
  messages: Message[];
}
const emptyMessage: Message = {
  user: 'Mehmet Salih',
  timestamp: new Date().getTime(),
  text: '',
};
const ws = new WebSocket('wss://echo.websocket.org');

const App = () => {
  const [message, setMessage] = useState<Message>(emptyMessage);
  const [chat, setChat] = useState<ChatState>({
    messages: [],
  });
  useEffect(() => {
    ws.onopen = () => {
      console.log('Websocket opened.'); // open connection
    };
  }, []);
  ws.onmessage = (e) => {
    // listen
    console.log(`Received: ${e.data}`);
    handleReceive(e.data);
  };
  ws.onerror = (e) => {
    console.log(`Error: ${e.message}`);
  };
  ws.onclose = (e) => {
    // close
    console.log(e.code, e.reason);
  };

  const handleReceive = (text: string) => {
    const newChat = {...chat};
    newChat.messages.push({...emptyMessage, user: 'cpu', text: text});
    setChat(newChat);
  };

  const handleSend = () => {
    console.log('Sent:' + message.text);
    if (message.text === '') {
      return;
    }
    ws.send(message.text); //send input text
    const newChat = {...chat};
    newChat.messages.push({...message});
    setChat(newChat); // chat i günceller
    setMessage(emptyMessage); // state sıfırla
  };

  const handleChangeText = (e: string) => {
    //inputu ele alır.
    setMessage({
      text: e,
      timestamp: new Date().getTime(),
      user: 'Mehmet Salih',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hoursText = hours < 10 ? `0${hours}` : hours;
    const minutesText = minutes < 10 ? `0${minutes}` : minutes;
    return `${hoursText}:${minutesText}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chat.messages}
        keyExtractor={(item) => item.timestamp.toString()}
        renderItem={({item}) => (
          <View
            style={{
              ...styles.messageContainer,
              ...(item.user !== 'Mehmet Salih'
                ? styles.messageContainerReceived
                : {}),
            }}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
          </View>
        )}
      />
      <KeyboardAvoidingView
        enabled={true}
        behavior="padding"
        style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          returnKeyType="send"
          onChangeText={handleChangeText}
          onSubmitEditing={handleSend}
          value={message.text}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  messageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#1976d2',
    borderRadius: 3,
    marginBottom: 5,
    flexDirection: 'row',
    maxWidth: 300,
  },
  messageContainerReceived: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#00796b',
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
    marginEnd: 40,
  },
  messageTime: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginStart: 10,
    position: 'absolute',
    end: 10,
    bottom: 10,
  },
  inputContainer: {flexDirection: 'row', alignItems: 'center'},
  textInput: {
    flex: 1,
    borderColor: '#448aff',
    borderWidth: 1,
    padding: 10,
    borderRadius: 3,
    marginBottom: 20,
  },
  sendButton: {paddingHorizontal: 10, marginBottom: 20},
  sendButtonText: {color: '#448aff'},
});

export default App;
