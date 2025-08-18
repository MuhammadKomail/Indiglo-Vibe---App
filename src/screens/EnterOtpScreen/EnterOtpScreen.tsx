import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import {colors, imgPath} from '../../styles/style';
import Button from '../../components/button';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigationTypes';

type EnterOtpScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'enter-otp-screen'
>;

const EnterOtpScreen = ({navigation, route}: EnterOtpScreenProps) => {
  const {role} = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(60);
    // Add your resend OTP API logic here
  };
  const handleBack = () => {
    navigation.goBack();
  };

  const verifyOtp = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length === 4) {
      // Add your OTP verification logic here
      navigation.navigate('reset-password-screen', {role});
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
              <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>Enter OTP Code</Text>
                <Text style={styles.headerDescription}>
                  OTP code has been sent to your email.
                </Text>
              </View>
            </View>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={text => handleOtpChange(text, index)}
                  // returnKeyType="next"
                />
              ))}
            </View>

            <View style={styles.resendContainer}>
              <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                <Text
                  style={[
                    styles.resendText,
                    timer > 0 && styles.disabledResend,
                  ]}>
                  Resend Code
                </Text>
              </TouchableOpacity>
              <Text style={styles.timerText}>
                {timer > 0 ? `00:${timer < 10 ? `0${timer}` : timer}` : ''}
              </Text>
            </View>

            <Button
              title="Verify"
              style={styles.buttonUser}
              backgroundGradient={[colors.blue, colors.blue2]}
              textColor={colors.silver}
              onPress={verifyOtp}
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
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.6,
  },
  headerTitle: {
    color: colors.blueHue,
    fontSize: 16,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '80%',
    marginHorizontal: 20,
    marginTop: 40,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: colors.lightGray3,
    width: 80,
    borderRadius: 14,
    height: 80,
    textAlign: 'center',
    fontSize: 22,
    color: colors.black,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // width: '80%',
    marginTop: 20,
    marginHorizontal: 20,
    gap: 8,
  },
  resendText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  disabledResend: {
    opacity: 0.4,
  },
  timerText: {
    color: colors.blueHue,
    fontSize: 14,
    fontWeight: '400',
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

export default EnterOtpScreen;
