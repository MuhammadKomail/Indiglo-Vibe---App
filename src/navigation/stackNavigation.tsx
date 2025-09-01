import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const {Navigator, Screen} = Stack;

// Note: Importing required components...!
import OfflineScreen from '../screens/OfflineScreen/OfflineScreen';
import OnboardingScreen from '../screens/OnboardingScreen/OnboardingScreen';
import SelectRoleScreen from '../screens/SelectRoleScreen/SelectRoleScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import SignupScreen from '../screens/SignupScreen/SignupScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen/ProfileSetupScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen/ForgetPasswordScreen';
import EnterOtpScreen from '../screens/EnterOtpScreen/EnterOtpScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen/ResetPasswordScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen/AvailabilityScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen/SubscriptionScreen';
import SubscribePaymentScreen from '../screens/SubscribePaymentScreen/SubscribePaymentScreen';
import VerifyIdentityScreen from '../screens/VerifyIdentityScreen/VerifyIdentityScreen';
import SelectVerificationType from '../screens/SelectVerificationType/SelectVerificationType';

// Note: array of screen data...!
const screenData = [
  {
    id: 1,
    screenName: 'onboarding-screen',
    componentName: OnboardingScreen,
  },
  {
    id: 2,
    screenName: 'offline-screen',
    componentName: OfflineScreen,
  },
  {
    id: 3,
    screenName: 'select-role-screen',
    componentName: SelectRoleScreen,
  },
  {
    id: 4,
    screenName: 'login-screen',
    componentName: LoginScreen,
  },
  {
    id: 5,
    screenName: 'signup-screen',
    componentName: SignupScreen,
  },
  {
    id: 6,
    screenName: 'profile-setup-screen',
    componentName: ProfileSetupScreen,
  },
  {
    id: 7,
    screenName: 'forget-password-screen',
    componentName: ForgetPasswordScreen,
  },
  {
    id: 8,
    screenName: 'enter-otp-screen',
    componentName: EnterOtpScreen,
  },
  {
    id: 9,
    screenName: 'reset-password-screen',
    componentName: ResetPasswordScreen,
  },
  {
    id: 9,
    screenName: 'availability-screen',
    componentName: AvailabilityScreen,
  },
  {
    id: 10,
    screenName: 'subscription-screen',
    componentName: SubscriptionScreen,
  },
  {
    id: 11,
    screenName: 'subscribe-payment-screen',
    componentName: SubscribePaymentScreen,
  },
  {
    id: 12,
    screenName: 'verify-identity-screen',
    componentName: VerifyIdentityScreen,
  },
  {
    id: 13,
    screenName: 'select-verification-type-screen',
    componentName: SelectVerificationType,
  },
];

const StackNavigation = () => {
  return (
    <>
      <Navigator screenOptions={{headerShown: false}}>
        {screenData.map(item => {
          return (
            <Screen
              key={item.id}
              name={item.screenName as string}
              component={item.componentName as any}
            />
          );
        })}
      </Navigator>
    </>
  );
};

export default StackNavigation;
