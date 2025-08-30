import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  Text,
} from 'react-native';
import React from 'react';
import {colors, imgPath, svgPath} from '../styles/style';
import {ThemedText} from './ThemedComponents';
import {useNavigation} from '@react-navigation/native';

interface AppHeaderProps {
  title?: string;
  backIcon?: () => void;
  user?: {
    name: string;
    avatar: string;
    online: boolean;
  };
}

const AppHeader: React.FC<AppHeaderProps> = ({title, user, backIcon}) => {
  const navigation = useNavigation();

  const backClick = () => {
    if (backIcon) {
      backIcon();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.headerWrapper}>
      <ImageBackground
        source={imgPath.headerBackground}
        style={styles.backgroundImg}
        resizeMode="cover">
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={backClick} style={styles.menuButton}>
            <svgPath.Forward
              width={12}
              height={12}
              style={{transform: [{rotate: '180deg'}]}}
            />
          </TouchableOpacity>
          {user ? (
            <View style={styles.userInfoContainer}>
              <ThemedText style={styles.headerTitle}>{user.name}</ThemedText>
              <View style={styles.onlineContainer}>
                <View
                  style={[
                    styles.onlineDot,
                    {
                      backgroundColor: user.online
                        ? colors.green2
                        : colors.graySystem,
                    },
                  ]}
                />
                <Text style={styles.onlineText}>
                  {user.online ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
          ) : (
            title && <ThemedText style={styles.headerTitle}>{title}</ThemedText>
          )}

          {user ? (
            <Image source={{uri: user.avatar}} style={styles.avatar} />
          ) : (
            <View style={styles.rightSpacer} />
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  headerWrapper: {
    height: 160,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  backgroundImg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
    marginTop: 70,
  },
  userInfoContainer: {
    alignItems: 'center',
  },
  onlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green2,
    marginRight: 5,
  },
  onlineText: {
    color: colors.silver,
    fontSize: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  rightSpacer: {
    width: 34, // Same width as the menu button to ensure title is centered
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.silver,
    textAlign: 'center',
  },
  menuButton: {
    padding: 10,
    borderColor: colors.silver,
    borderRadius: 12,
    borderWidth: 1,
  },
});
