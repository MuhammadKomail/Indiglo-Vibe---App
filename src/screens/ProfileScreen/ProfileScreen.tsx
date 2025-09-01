import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {useTheme} from '../../theme/ThemeContext';
import {lightTheme} from '../../theme/theme';

const demoProfile = {
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Software Engineer',
};

const ProfileScreen = () => {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme === 'dark' ? lightTheme.background : colors.white,
        },
      ]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              theme === 'dark' ? lightTheme.background : colors.white,
            shadowColor: theme === 'dark' ? lightTheme.text : colors.black,
          },
        ]}>
        <Image source={{uri: demoProfile.avatar}} style={styles.avatar} />
        <Text
          style={[
            styles.name,
            {color: theme === 'dark' ? lightTheme.text : colors.black},
          ]}>
          {demoProfile.name}
        </Text>
        <Text
          style={[
            styles.email,
            {color: theme === 'dark' ? lightTheme.text : colors.gray},
          ]}>
          {demoProfile.email}
        </Text>
        <Text
          style={[
            styles.role,
            {color: theme === 'dark' ? lightTheme.text : colors.gray},
          ]}>
          {demoProfile.role}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
    elevation: 3,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    width: 300,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: colors.gray,
  },
});

export default ProfileScreen;
