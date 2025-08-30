import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {colors} from '../styles/style';

interface ChatListItemProps {
  onPress: () => void;
  onLongPress?: () => void;
  chat: {
    id: string;
    user: {
      name: string;
      avatar: string;
      online: boolean;
    };
    lastMessage: {
      text: string;
      time: string;
    };
    unreadCount: number;
  };
}

const ChatListItem = ({chat, onPress, onLongPress}: ChatListItemProps) => {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Default image source
  const defaultImage = require('../assets/images/profileUser.png');

  // Check if we should use remote image
  const shouldUseRemoteImage =
    chat.user.avatar &&
    typeof chat.user.avatar === 'string' &&
    chat.user.avatar.trim() !== '' &&
    !avatarFailed &&
    (chat.user.avatar.startsWith('http://') ||
      chat.user.avatar.startsWith('https://'));

  const handleImageLoadStart = () => {
    if (shouldUseRemoteImage) {
      setIsLoading(true);
    }
  };

  const handleImageLoadEnd = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setAvatarFailed(true);
  };

  // Render image with proper fallback
  const renderAvatar = () => {
    if (shouldUseRemoteImage) {
      return (
        <Image
          source={{uri: chat.user.avatar}}
          style={styles.avatar}
          onLoadStart={handleImageLoadStart}
          onLoadEnd={handleImageLoadEnd}
          onError={handleImageError}
          defaultSource={Platform.OS === 'android' ? defaultImage : undefined}
        />
      );
    } else {
      return <Image source={defaultImage} style={styles.avatar} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}>
      <View style={styles.avatarContainer}>
        {renderAvatar()}
        {isLoading && shouldUseRemoteImage && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={colors.iosBlue} />
          </View>
        )}
        <View
          style={[
            styles.onlineIndicator,
            {
              backgroundColor: chat.user.online
                ? colors.green2
                : colors.graySystem,
            },
          ]}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name}>{chat.user.name}</Text>
          <Text style={styles.time}>{chat.lastMessage.time}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.message}>{chat.lastMessage.text}</Text>
          {chat.unreadCount > 0 && (
            <View style={styles.unreadContainer}>
              <Text style={styles.unreadText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.green2,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.white,
  },
  loaderContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: colors.grayTextSecondary,
    fontSize: 12,
  },
  message: {
    color: colors.grayTextSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  unreadContainer: {
    backgroundColor: colors.iosBlue,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatListItem;
