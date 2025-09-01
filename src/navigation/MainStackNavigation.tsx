import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './bottomTabNavigation';
import SettingScreen from '../screens/SettingScreen/SettingScreen';
import MentorDetailScreen from '../screens/MentorDetailScreen/MentorDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';
import SetSpecialityScreen from '../screens/SetSpecialityScreen/SetSpecialityScreen';
import EditAvailabilityScreen from '../screens/EditAvailabilityScreen/EditAvailabilityScreen';
import NotificationScreen from '../screens/NotificationScreen/NotificationScreen';
import PaymentDetailScreen from '../screens/PaymentDetailsScreen/PaymentDetailScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen/ChangePasswordScreen';
import ScheduleScreen from '../screens/ScheduleScreen/ScheduleScreen';
import PaymentScreen from '../screens/PaymentScreen/PaymentScreen';
import AppointmentDetailScreen from '../screens/AppointmentDetailScreen/AppointmentDetailScreen';
import MyEarningsScreen from '../screens/MyEarningsScreen/MyEarningsScreen';
import WithdrawalDestinationScreen from '../screens/WithdrawalDestinationScreen/WithdrawalDestinationScreen';
import ArticlesScreen from '../screens/ArticlesScreen/ArticlesScreen';
import AddContentScreen from '../screens/AddContentScreen/AddContentScreen';
import ArticleDetailsScreen from '../screens/ArticleDetailsScreen/ArticleDetailsScreen';

export type MainStackParamList = {
  BottomTabs: undefined;
  SettingScreen: undefined;
  MentorDetailScreen: undefined;
  EditProfileScreen: undefined;
  SetSpecialityScreen: undefined;
  EditAvailabilityScreen: undefined;
  NotificationScreen: undefined;
  PaymentDetailScreen: undefined;
  ChangePasswordScreen: undefined;
  ScheduleScreen: undefined;
  PaymentScreen: undefined;
  AppointmentDetailScreen: undefined;
  MyEarningsScreen: undefined;
  WithdrawalDestinationScreen: undefined;
  ArticlesScreen: {headerTitle?: string};
  AddContentScreen: undefined;
  ArticleDetailsScreen: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTabs" component={BottomTab} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="MentorDetailScreen" component={MentorDetailScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen
        name="SetSpecialityScreen"
        component={SetSpecialityScreen}
      />
      <Stack.Screen
        name="EditAvailabilityScreen"
        component={EditAvailabilityScreen}
      />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen
        name="PaymentDetailScreen"
        component={PaymentDetailScreen}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen
        name="AppointmentDetailScreen"
        component={AppointmentDetailScreen}
      />
      <Stack.Screen name="MyEarningsScreen" component={MyEarningsScreen} />
      <Stack.Screen
        name="WithdrawalDestinationScreen"
        component={WithdrawalDestinationScreen}
      />
      <Stack.Screen name="ArticlesScreen" component={ArticlesScreen} />
      <Stack.Screen name="AddContentScreen" component={AddContentScreen} />
      <Stack.Screen
        name="ArticleDetailsScreen"
        component={ArticleDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigation;
