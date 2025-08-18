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
import {colors, imgPath} from '../../styles/style';
import Button from '../../components/button';
import MaterialIcons from '@react-native-vector-icons/material-icons';
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
              <Input
                title="Confirm Password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
            <Button
              title="Update"
              style={styles.buttonUser}
              backgroundGradient={[colors.blue, colors.blue2]}
              textColor={colors.silver}
              onPress={() => setIsReviewModalVisible(true)}
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
    paddingVertical: 10,
    paddingHorizontal: 8,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: 96,
    height: 96,
    marginBottom: 24,
  },
  backIcon: {
    marginLeft: 7,
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

export default ResetPasswordScreen;
