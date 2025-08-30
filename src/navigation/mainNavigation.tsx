import React, {useEffect} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import StackNavigation from './stackNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootState, useAppSelector, useAppDispatch} from '../redux/store';
import {ThemeProvider, useTheme} from '../theme/ThemeContext';
import {lightTheme, darkTheme} from '../theme/theme';
import MainStackNavigation from './MainStackNavigation';
import socketService from '../services/socketService';
import {setupCallSocketListeners} from '../redux/actions/callAction/callAction';
import navigationService from './navigationService';

const NavigationContent = () => {
  const {user, token} = useAppSelector((state: RootState) => state.auth);
  const call = useAppSelector((state: RootState) => (state as any).call);
  const {theme} = useTheme();
  const dispatch = useAppDispatch();

  // Ensure socket is initialized as soon as the user is authenticated
  useEffect(() => {
    if (user && token) {
      try {
        socketService.connect(String(user.id));
        // Ensure call socket listeners are attached globally
        dispatch(setupCallSocketListeners() as any);
      } catch {
        // swallow; UI flows continue and Chat screens will retry if needed
        // console.log('Socket init in Navigation failed:');
        void 0;
      }
    }
    // Do not disconnect on unmount; keep socket alive across screens
  }, [user, token]);

  // Global route into CallScreen whenever call becomes active
  useEffect(() => {
    const st = (call as any)?.status;
    if (!st) return;
    const isActive = ['dialing', 'ringing', 'connecting', 'in_call'].includes(
      st,
    );
    if (!isActive) return;
    // Restore custom CallScreen navigation
    try {
      navigationService.navigate('CallScreen');
    } catch {
      void 0;
    }
  }, [call?.status]);

  const navigationTheme =
    theme === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            ...darkTheme,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            ...lightTheme,
          },
        };

  return (
    <NavigationContainer
      theme={navigationTheme}
      ref={ref => navigationService.setTopLevelNavigator(ref)}
      onReady={navigationService.onReady}>
      {!user && !token ? <StackNavigation /> : <MainStackNavigation />}
    </NavigationContainer>
  );
};

const Navigation = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default Navigation;
