import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Message} from '../types/chat';
import {ThemedIcon} from './ThemedIcon';
import {colors} from '../styles/style';

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
}

const MessageBubble = React.memo(({message, isSender}: MessageBubbleProps) => {
  return (
    <View
      style={[
        styles.container,
        isSender ? styles.senderContainer : styles.receiverContainer,
      ]}>
      {/* {!isSender && <Image source={{ uri: message.user.avatar }} style={styles.avatar} />} */}
      <View
        style={[
          styles.bubble,
          isSender ? styles.senderBubble : styles.receiverBubble,
        ]}>
        <Text style={isSender ? styles.senderText : styles.receiverText}>
          {message.text}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.time, isSender && styles.senderTime]}>
            {message.time}
          </Text>
          {isSender && (
            <View style={styles.statusIcon}>
              {message.status === 'sending' && (
                <ThemedIcon
                  name="schedule"
                  size={12}
                  color={isSender ? colors.white : colors.gray999}
                />
              )}
              {/* {message.status === 'sent' && <ThemedIcon name="done" size={12} color={isSender ? 'white' : '#999'} />}
              {message.status === 'read' && <ThemedIcon name="done-all" size={12} color={isSender ? 'white' : '#999'} />}
              {message.status === 'failed' && <ThemedIcon name="error-outline" size={12} color="red" />} */}
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 5,
    maxWidth: '80%',
  },
  senderContainer: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  receiverContainer: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  bubble: {
    padding: 10,
    borderRadius: 15,
  },
  senderBubble: {
    backgroundColor: colors.iosBlue,
  },
  receiverBubble: {
    backgroundColor: colors.grayBorderLight,
  },
  senderText: {
    color: colors.white,
  },
  receiverText: {
    color: colors.black,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  time: {
    fontSize: 10,
    color: colors.gray999,
  },
  statusIcon: {
    marginLeft: 5,
  },
  senderTime: {
    color: colors.white,
  },
});

export default MessageBubble;
