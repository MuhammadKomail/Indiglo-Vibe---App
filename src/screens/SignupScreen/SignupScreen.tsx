import React, {useState, useEffect} from 'react';
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

  // Touched states
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Validators
  const validateUsername = (val: string) => {
    const v = val.trim();
    if (!v) return 'Username is required';
    if (v.length < 3) return 'Username must be at least 3 characters';
    return '';
  };

  const validateEmail = (val: string) => {
    const v = val.trim();
    if (!v) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (val: string) => {
    const v = val.trim();
    if (!v) return 'Password is required';
    if (v.length < 8) return 'Password must be at least 8 characters';
    const missing: string[] = [];
    if (!/[A-Z]/.test(v)) missing.push('uppercase');
    if (!/[a-z]/.test(v)) missing.push('lowercase');
    if (!/\d/.test(v)) missing.push('digit');
    if (missing.length) return `Include at least one ${missing.join(', ')}`;
    return '';
  };

  const expectedPhoneLengths: Record<string, number> = {
    '+1': 10, // US/Canada
    '+44': 10, // UK (common case)
    '+91': 10, // India
    '+92': 10, // Pakistan
    '+971': 9, // UAE (mobile typically 9 after code)
    '+61': 9, // Australia
    '+49': 10, // Germany (varies; using 10 as common)
    '+33': 9, // France
    '+81': 9, // Japan (mobile usually 9 after code)
  };

  const validatePhone = (cc: string, local: string) => {
    const digits = local.trim();
    if (!digits) return 'Phone number is required';
    const expected = expectedPhoneLengths[cc];
    if (expected && digits.length !== expected) {
      return 'Invalid phone number';
    }
    // Fallback range if country not mapped
    if (!expected && (digits.length < 6 || digits.length > 14)) {
      return 'Invalid phone number';
    }
    return '';
  };

  // Debounced validation after user pauses typing (runs only if field touched)
  useEffect(() => {
    const t = setTimeout(() => {
      if (usernameTouched) setUsernameError(validateUsername(username));
      if (emailTouched) setEmailError(validateEmail(email));
      if (passwordTouched) setPasswordError(validatePassword(password));
      if (phoneTouched) setPhoneError(validatePhone(countryCode, phoneNumber));
    }, 600);
    return () => clearTimeout(t);
  }, [
    username,
    email,
    password,
    phoneNumber,
    countryCode,
    usernameTouched,
    emailTouched,
    passwordTouched,
    phoneTouched,
  ]);

  // Change handlers clear errors while typing for better UX
  const handleUsernameChange = (text: string) => {
    if (usernameError) setUsernameError('');
    setUsername(text);
  };
  const handleEmailChange = (text: string) => {
    if (emailError) setEmailError('');
    setEmail(text);
  };
  const handlePasswordChange = (text: string) => {
    if (passwordError) setPasswordError('');
    setPassword(text);
  };
  const handlePhoneInputChange = (
    newCountryCode: string,
    newPhoneNumber: string,
  ) => {
    if (phoneError) setPhoneError('');
    setCountryCode(newCountryCode);
    setPhoneNumber(newPhoneNumber);
  };

  // Blur (end editing) handlers show errors immediately and mark touched
  const handleUsernameEndEditing = () => {
    setUsernameTouched(true);
    setUsernameError(validateUsername(username));
  };
  const handleEmailEndEditing = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };
  const handlePasswordEndEditing = () => {
    setPasswordTouched(true);
    setPasswordError(validatePassword(password));
  };
  const handlePhoneEndEditing = () => {
    setPhoneTouched(true);
    setPhoneError(validatePhone(countryCode, phoneNumber));
  };

  const validateForm = () => {
    // Mark all as touched and validate immediately
    setUsernameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setPhoneTouched(true);

    const uErr = validateUsername(username);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const phErr = validatePhone(countryCode, phoneNumber);
    setUsernameError(uErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setPhoneError(phErr);
    return !(uErr || eErr || pErr || phErr);
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
              onChangeText={handleUsernameChange}
              onEndEditing={handleUsernameEndEditing}
              error={usernameError}
            />
            <Input
              title="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={handlePasswordChange}
              onEndEditing={handlePasswordEndEditing}
              secureTextEntry={true}
              error={passwordError}
            />
            <Input
              title="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={handleEmailChange}
              onEndEditing={handleEmailEndEditing}
              error={emailError}
            />
            <InputTextPhoneNumber
              textLable="Phone Number"
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onChangeText={handlePhoneInputChange}
              onEndEditing={handlePhoneEndEditing}
              // Blur handling via phone input: simulate with end typing callback when possible
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
