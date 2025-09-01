import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, KeyboardAvoidingView} from 'react-native';
import {colors} from '../../styles/style';
import Button from '../../components/button';
import Input from '../../components/Input';
import SuccessModal from '../../components/SuccessModal';
import imagePath from '../../styles/imgPath';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import AppHeader from '../../components/AppHeader';

const ChangePasswordScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isReviewModalVisible, setIsReviewModalVisible] = React.useState(false);

  // Error states
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Password regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 digit
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const validateForm = () => {
    let isValid = true;

    setOldPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    // Old password
    if (!oldPassword.trim()) {
      setOldPasswordError('Old password is required');
      isValid = false;
    }

    // New password
    if (!newPassword.trim()) {
      setNewPasswordError('New password is required');
      isValid = false;
    } else if (!passwordRegex.test(newPassword)) {
      setNewPasswordError(
        'Password must be at least 8 characters long and contain an uppercase, lowercase, and a digit',
      );
      isValid = false;
    }

    // Confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleUpdate = () => {
    if (validateForm()) {
      setIsReviewModalVisible(true);
    }
  };

  return (
    <>
      <AppHeader title="Change Password" height={140} />

      <KeyboardAvoidingView style={{flex: 1}} keyboardVerticalOffset={80}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <Input
              title="Old Password"
              placeholder="Enter your old password"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              error={oldPasswordError}
            />
            <Input
              title="New Password"
              placeholder="Enter your new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              error={newPasswordError}
            />
            <Input
              title="Confirm Password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={confirmPasswordError}
            />
          </View>
          <Button
            title="Update"
            style={styles.buttonUser}
            backgroundGradient={[colors.blue, colors.blue2]}
            textColor={colors.silver}
            onPress={handleUpdate}
          />
          {/* </View> */}
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
        bottonText={'Back To Home'}
        onSubmit={() => {
          navigation.navigate('BottomTabs');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  headerImage: {
    width: 96,
    height: 96,
    marginBottom: 24,
  },
  formContainer: {
    marginTop: 20,
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

export default ChangePasswordScreen;
