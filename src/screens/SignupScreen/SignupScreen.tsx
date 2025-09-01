import React, {useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {colors, imgPath} from '../../styles/style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigationTypes';
import Button from '../../components/button';
import Input from '../../components/Input';
import {ThemedText} from '../../components/ThemedText';
import imagePath from '../../styles/imgPath';
import InputTextPhoneNumber from '../../components/InputTextPhoneNumber';
import AuthHeader from '../../components/AuthHeader';

type SignupScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'signup-screen'
>;

const SignupScreen: React.FC<SignupScreenProps> = ({route, navigation}) => {
  const {role} = route.params;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Error states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handlePhoneInputChange = (
    newCountryCode: string,
    newPhoneNumber: string,
  ) => {
    setCountryCode(newCountryCode);
    setPhoneNumber(newPhoneNumber);
  };

  const validateForm = () => {
    let isValid = true;
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setPhoneError('');

    // Username validation
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters long and contain uppercase, lowercase, and a digit',
      );
      isValid = false;
    }

    // Phone validation
    if (!phoneNumber.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (phoneNumber.length < 10) {
      setPhoneError('Phone number must be at least 10 digits');
      isValid = false;
    }
    return isValid;
  };

  const handleSignup = () => {
    if (validateForm()) {
      navigation.navigate('profile-setup-screen', {
        name: username,
        password,
        role,
      });
    }
  };

  return (
    <ImageBackground
      source={imgPath.backgroundImage2}
      style={styles.backgroundImg}
      resizeMode="cover">
      <KeyboardAvoidingView
        style={{flex: 1}}
        // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <AuthHeader />
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Welcome To</Text>
              <Image source={imgPath.logo} style={styles.logo} />
              <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>
                  {role === 'user' ? 'Sign Up As User' : 'Sign Up As Mentor'}
                </Text>
                <Text style={styles.headerDescription}>
                  {role === 'user'
                    ? 'Your journey begins here. Create your account and start glowing!'
                    : "Share your light, connect as mentors, and make a difference in someone's life."}
                </Text>
              </View>
            </View>
            {/* <View style={styles.formContainer}> */}
            <Input
              title="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              error={usernameError}
            />
            <Input
              title="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              error={passwordError}
            />
            <Input
              title="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              error={emailError}
            />
            <InputTextPhoneNumber
              textLable="Phone Number"
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onChangeText={handlePhoneInputChange}
              error={phoneError}
            />
            <Button
              title="Sign Up"
              style={styles.buttonUser}
              backgroundGradient={[colors.blue, colors.blue2]}
              textColor={colors.silver}
              onPress={handleSignup}
            />
            <View style={styles.dividerRow}>
              <View style={styles.blackDivider} />
              <ThemedText style={styles.orText}>Sign Up with</ThemedText>
              <View style={styles.blackDivider} />
            </View>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Image
                  source={imagePath.googleIcon}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomMainContainer}>
              <ThemedText style={styles.bottomText2}>
                Already have an account?{' '}
                <TouchableOpacity onPress={handleSignup}>
                  <ThemedText style={styles.signInText}>Sign In</ThemedText>
                </TouchableOpacity>
              </ThemedText>
            </View>
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
  container: {
    marginTop: 120,
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
  headerBox: {
    width: '90%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 12,
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
    marginTop: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 80,
    marginTop: 40,
  },
  blackDivider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.blueHue,
    opacity: 0.2,
  },
  orText: {
    marginHorizontal: 8,
    color: colors.black,
    fontSize: 10,
    opacity: 0.7,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 26,
  },
  socialBtn: {
    borderColor: colors.lightGray2,
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 6,
  },
  socialIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  bottomMainContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  bottomText2: {
    color: colors.grayHue2,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  signInText: {
    color: colors.primary,
    fontSize: 14,
  },
});

export default SignupScreen;
