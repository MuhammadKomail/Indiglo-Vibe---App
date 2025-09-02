import React, {useState, useEffect} from 'react';
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

  // Touched states
  const [touched, setTouched] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // Password regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 digit
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Debounced validation: runs after user pauses typing, only for touched fields
  useEffect(() => {
    const t = setTimeout(() => {
      if (touched.old) {
        setOldPasswordError(
          oldPassword.trim() ? '' : 'Old password is required',
        );
      }
      if (touched.new) {
        if (!newPassword.trim())
          setNewPasswordError('New password is required');
        else if (!passwordRegex.test(newPassword))
          setNewPasswordError(
            'Password must be at least 8 characters long and contain an uppercase, lowercase, and a digit',
          );
        else setNewPasswordError('');
      }
      if (touched.confirm) {
        if (!confirmPassword.trim())
          setConfirmPasswordError('Please confirm your password');
        else if (confirmPassword !== newPassword)
          setConfirmPasswordError('Passwords do not match');
        else setConfirmPasswordError('');
      }
    }, 600);
    return () => clearTimeout(t);
  }, [oldPassword, newPassword, confirmPassword, touched]);

  // Change handlers clear errors while typing
  const handleOldChange = (text: string) => {
    if (oldPasswordError) setOldPasswordError('');
    setOldPassword(text);
  };
  const handleNewChange = (text: string) => {
    if (newPasswordError) setNewPasswordError('');
    setNewPassword(text);
  };
  const handleConfirmChange = (text: string) => {
    if (confirmPasswordError) setConfirmPasswordError('');
    setConfirmPassword(text);
  };

  // Blur handlers: mark touched and validate immediately
  const onOldEndEditing = () => {
    setTouched(prev => ({...prev, old: true}));
    setOldPasswordError(oldPassword.trim() ? '' : 'Old password is required');
  };
  const onNewEndEditing = () => {
    setTouched(prev => ({...prev, new: true}));
    if (!newPassword.trim()) setNewPasswordError('New password is required');
    else if (!passwordRegex.test(newPassword))
      setNewPasswordError(
        'Password must be at least 8 characters long and contain an uppercase, lowercase, and a digit',
      );
    else setNewPasswordError('');
  };
  const onConfirmEndEditing = () => {
    setTouched(prev => ({...prev, confirm: true}));
    if (!confirmPassword.trim())
      setConfirmPasswordError('Please confirm your password');
    else if (confirmPassword !== newPassword)
      setConfirmPasswordError('Passwords do not match');
    else setConfirmPasswordError('');
  };

  const validateForm = () => {
    let isValid = true;

    setOldPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setTouched({old: true, new: true, confirm: true});

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
              onChangeText={handleOldChange}
              onEndEditing={onOldEndEditing}
              secureTextEntry
              error={oldPasswordError}
            />
            <Input
              title="New Password"
              placeholder="Enter your new password"
              value={newPassword}
              onChangeText={handleNewChange}
              onEndEditing={onNewEndEditing}
              secureTextEntry
              error={newPasswordError}
            />
            <Input
              title="Confirm Password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChangeText={handleConfirmChange}
              onEndEditing={onConfirmEndEditing}
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
