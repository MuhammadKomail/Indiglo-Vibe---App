import React, {useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {colors, imgPath, svgPath} from '../../styles/style';
import Button from '../../components/button';
import Input from '../../components/Input';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigationTypes';

type ForgetPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'forget-password-screen'
>;

const ForgetPasswordScreen = ({
  navigation,
  route,
}: ForgetPasswordScreenProps) => {
  const {role} = route.params;

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRequestCode = () => {
    if (!username) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(username)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    navigation.navigate('enter-otp-screen', {role});
  };

  return (
    <ImageBackground
      source={imgPath.backgroundImage2}
      style={styles.backgroundImg}
      resizeMode="cover">
      <KeyboardAvoidingView style={{flex: 1}} keyboardVerticalOffset={80}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <svgPath.BackArrow width={12} height={12} />
          </TouchableOpacity>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>Forget Password</Text>
                <Text style={styles.headerDescription}>
                  Enter your email address to receive 4 digit code via email.
                </Text>
              </View>
            </View>
            <View style={styles.formContainer}>
              <Input
                placeholder="Enter your email address"
                value={username}
                onChangeText={setUsername}
                error={error}
              />
            </View>
            <Button
              title="Request Code"
              style={styles.buttonUser}
              backgroundGradient={[colors.blue, colors.blue2]}
              textColor={colors.silver}
              onPress={handleRequestCode}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    borderColor: colors.lightGray10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
  container: {
    marginTop: 120,
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 10,
  },
  headerBox: {
    width: '90%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 12,
    gap: 8,
  },
  headerDescription: {
    color: colors.blueHue,
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
  },
  headerTitle: {
    color: colors.blueHue,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonUser: {
    width: '95%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 15,
    marginTop: 100,
  },
});

export default ForgetPasswordScreen;
