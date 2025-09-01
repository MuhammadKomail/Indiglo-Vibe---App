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
import SuccessModal from '../../components/SuccessModal';
import imagePath from '../../styles/imgPath';

type ResetPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'reset-password-screen'
>;

const ResetPasswordScreen = ({navigation, route}: ResetPasswordScreenProps) => {
  const {role} = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isReviewModalVisible, setIsReviewModalVisible] = React.useState(false);
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one digit';
    }
    return '';
  };

  const handleUpdate = () => {
    const newErrors: {newPassword?: string; confirmPassword?: string} = {};

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // ✅ No errors, show success modal
      setIsReviewModalVisible(true);
    }
  };

  const handleBack = () => {
    navigation.goBack();
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
                <Text style={styles.headerTitle}>Enter New Password</Text>
                <Text style={styles.headerDescription}>
                  Please enter new password
                </Text>
              </View>
            </View>
            <View style={styles.formContainer}>
              <Input
                title="New Password"
                placeholder="Enter your new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              {errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}
              <Input
                title="Confirm Password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
            <Button
              title="Update"
              style={styles.buttonUser}
              backgroundGradient={[colors.blue, colors.blue2]}
              textColor={colors.silver}
              onPress={handleUpdate}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SuccessModal
        visible={isReviewModalVisible}
        headerImage={imagePath.resetPasswordSuccess}
        imageStyling={styles.headerImage}
        title={'Password Updated Successfully'}
        description={'Your password has been updated successfully'}
        onClose={() => {
          setIsReviewModalVisible(false);
        }}
        bottonText={'Back To Login'}
        onSubmit={() => {
          navigation.navigate('login-screen', {role});
        }}
      />
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
  headerImage: {
    width: 96,
    height: 96,
    marginBottom: 24,
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
  errorText: {
    color: colors.red,
    marginLeft: 25,
    width: '90%',
    fontSize: 14,
  },
});

export default ResetPasswordScreen;
