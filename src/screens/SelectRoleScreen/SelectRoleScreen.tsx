import React from 'react';
import {StyleSheet, ImageBackground, View, Text, Image} from 'react-native';
import {colors, imgPath} from '../../styles/style';
import Button from '../../components/button';

const SelectRoleScreen = ({navigation}: {navigation: any}) => {
  return (
    <ImageBackground
      source={imgPath.backgroundImage2}
      style={styles.backgroundImg}
      resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.headerText}>Welcome To</Text>
        <Image source={imgPath.logo} style={styles.logo} />
        <Text style={styles.headerDescription}>
          Choose your journey and start making a difference — for yourself or
          for others
        </Text>
        <View style={styles.buttonBox}>
          <Button
            title="Find Your Light"
            style={styles.buttonUser}
            backgroundGradient={[colors.blueHue2, colors.blueHue3]}
            textColor={colors.silver}
            onPress={() => navigation.navigate('login-screen', {role: 'user'})}
          />
          <Button
            title="Share Your Light"
            style={styles.buttonUser}
            backgroundGradient={[colors.blue, colors.blue2]}
            textColor={colors.silver}
            onPress={() =>
              navigation.navigate('login-screen', {role: 'mentor'})
            }
          />
          <Text style={styles.bottomText}>Privacy Policy</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: colors.blueHue,
    fontSize: 16,
    fontWeight: '400',
  },
  logo: {
    width: 250,
    height: 75,
    marginVertical: 8,
  },
  headerDescription: {
    color: colors.blueHue,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
  },
  buttonUser: {
    width: '95%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 15,
  },
  buttonBox: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 20,
    alignItems: 'center',
    marginTop: 50,
  },
  bottomText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '400',
  },
});

export default SelectRoleScreen;
