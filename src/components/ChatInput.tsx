import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {colors} from '../styles/style';

const ChatInput = ({onSend}: {onSend: (text: string) => void}) => {
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Write a message"
        placeholderTextColor={colors.grayTextSecondary}
        returnKeyType="send"
        onSubmitEditing={() => {
          const trimmed = message.trim();
          if (trimmed) {
            onSend(trimmed);
            setMessage('');
          }
        }}
      />
      {message.trim().length > 0 && (
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            const trimmed = message.trim();
            if (trimmed) {
              onSend(trimmed);
              setMessage('');
            }
          }}>
          {/* Using a placeholder for the send icon */}
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grayBorderLight,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: colors.lightBg2,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: colors.iosBlue,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: colors.white,
    fontSize: 18,
    transform: [{rotate: '-45deg'}],
  },
});

export default ChatInput;
