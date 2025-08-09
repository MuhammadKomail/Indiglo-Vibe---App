import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './bottomTabNavigation';
import SettingScreen from '../screens/SettingScreen/SettingScreen';

export type MainStackParamList = {
  BottomTabs: undefined;
  SettingScreen: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTabs" component={BottomTab} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
    </Stack.Navigator>
  );
};

export default MainStackNavigation;
