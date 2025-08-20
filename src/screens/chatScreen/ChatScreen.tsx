import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import colors from '../../styles/colors';
import {useTheme} from '../../theme/ThemeContext';
import {lightTheme} from '../../theme/theme';

const ChatScreen = () => {
  const {theme} = useTheme();
  const [messages, setMessages] = useState([
    {id: '1', text: 'Hello!'},
    {id: '2', text: 'Hi, how are you?'},
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {id: Date.now().toString(), text: input.trim()},
      ]);
      setInput('');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme === 'dark' ? lightTheme.background : colors.white,
        },
      ]}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        removeClippedSubviews={false}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor:
                  theme === 'dark' ? lightTheme.border : colors.white,
                shadowColor: theme === 'dark' ? lightTheme.text : colors.black,
              },
            ]}>
            <Text
              style={{
                color: theme === 'dark' ? lightTheme.text : colors.black,
              }}>
              {item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor:
              theme === 'dark' ? lightTheme.background : colors.white,
            borderColor: theme === 'dark' ? lightTheme.border : colors.grayHue,
          },
        ]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor:
                theme === 'dark' ? lightTheme.background : colors.white,
              borderColor:
                theme === 'dark' ? lightTheme.border : colors.grayHue,
              color: theme === 'dark' ? lightTheme.text : colors.black,
            },
          ]}
          placeholder="Type a message"
          placeholderTextColor={
            theme === 'dark' ? lightTheme.text : colors.gray
          }
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor:
                theme === 'dark' ? lightTheme.border : colors.black,
            },
          ]}
          onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  messagesContainer: {flexGrow: 1, justifyContent: 'flex-end', padding: 16},
  messageBubble: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: colors.grayHue,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.grayHue,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: colors.white,
  },
  sendButton: {
    backgroundColor: colors.black,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
