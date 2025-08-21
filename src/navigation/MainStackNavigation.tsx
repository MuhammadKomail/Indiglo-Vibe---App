import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './bottomTabNavigation';
import SettingScreen from '../screens/SettingScreen/SettingScreen';
import MentorDetailScreen from '../screens/MentorDetailScreen/MentorDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';
import SetSpecialityScreen from '../screens/SetSpecialityScreen/SetSpecialityScreen';
import EditAvailabilityScreen from '../screens/EditAvailabilityScreen/EditAvailabilityScreen';
import NotificationScreen from '../screens/NotificationScreen/NotificationScreen';

export type MainStackParamList = {
  BottomTabs: undefined;
  SettingScreen: undefined;
  MentorDetailScreen: undefined;
  EditProfileScreen: undefined;
  SetSpecialityScreen: undefined;
  EditAvailabilityScreen: undefined;
  NotificationScreen: undefined;
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
    </Stack.Navigator>
  );
};

export default MainStackNavigation;
