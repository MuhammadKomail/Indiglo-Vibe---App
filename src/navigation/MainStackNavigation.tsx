import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './bottomTabNavigation';
import SettingScreen from '../screens/SettingScreen/SettingScreen';
import CallScreen from '../screens/CallScreen/CallScreen';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {registerFcmToken} from '../redux/actions/notificationAction/notificationAction';

export type MainStackParamList = {
  BottomTabs: undefined;
  SettingScreen: undefined;
  CallScreen: {peerName?: string; peerAvatar?: string} | undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStackNavigation = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(registerFcmToken());
    }
  }, [user, dispatch]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTabs" component={BottomTab} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="CallScreen" component={CallScreen} />
    </Stack.Navigator>
  );
};

export default MainStackNavigation;
