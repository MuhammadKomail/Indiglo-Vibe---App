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
  Alert,
} from 'react-native';
import {colors, imgPath} from '../../styles/style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigationTypes';
import Button from '../../components/button';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Input from '../../components/Input';
import {ThemedText} from '../../components/ThemedText';
import imagePath from '../../styles/imgPath';
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../../redux/store';
import {loginUser} from '../../redux/actions/authAction/authAction';

type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'login-screen'
>;

const LoginScreen: React.FC<LoginScreenProps> = ({route, navigation}) => {
  const {role} = route.params;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {loading, error} = useSelector((state: any) => state.auth);

  // Validation states
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
  const isPasswordValid = password.length >= 6;
  const canLogin = isEmailValid && isPasswordValid;
  const dispatch = useAppDispatch();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleForgotPassword = () => {
    navigation.navigate('forget-password-screen', {role});
  };

  const handleSignup = () => {
    navigation.navigate('signup-screen', {role});
  };

  const handleLogin = () => {
    if (loading) {
      return;
    }
    if (error) {
      Alert.alert(error);
      return;
    }
    dispatch(loginUser({data: {name: username, password, role}}));
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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons
              name="arrow-back-ios"
              size={16}
              color={colors.blueHue}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Welcome Back To</Text>
              <Image source={imgPath.logo} style={styles.logo} />
              <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>
                  {role === 'user' ? 'Sign In As User' : 'Sign In As Mentor'}
                </Text>
                <Text style={styles.headerDescription}>
                  {role === 'user'
                    ? 'Your glow awaits! Log in and reconnect with your journey.'
                    : 'Ready to guide and inspire? Log In and let’s light the way together!'}
                </Text>
              </View>
            </View>
            <Input
              title="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />
            <Input
              title="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            <TouchableOpacity onPress={handleForgotPassword}>
              <ThemedText style={styles.forgotText}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>
            <Button
              title="Sign In"
              style={styles.buttonUser}
              backgroundGradient={[colors.blue, colors.blue2]}
              textColor={colors.silver}
              onPress={handleLogin}
            />
            <View style={styles.dividerRow}>
              <View style={styles.blackDivider} />
              <ThemedText style={styles.orText}>Sign In with</ThemedText>
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
                Don’t have account?{' '}
                <TouchableOpacity onPress={handleSignup}>
                  <ThemedText style={styles.signInText}>Sign Up</ThemedText>
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
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    borderColor: colors.lightGray10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    marginLeft: 7,
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
  forgotText: {
    color: colors.primary,
    // fontWeight: '600',
    textAlign: 'right',
    marginBottom: 20,
    marginRight: 20,
  },
  buttonUser: {
    width: '95%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 15,
    // marginTop: 10
  },
  bottomText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '400',
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

export default LoginScreen;
