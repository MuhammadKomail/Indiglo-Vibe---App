import './gesture-handler';
import React, {useEffect} from 'react';
import Navigation from './src/navigation/mainNavigation';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/redux/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {I18nextProvider} from 'react-i18next';
import {ToastProvider, useToast} from 'react-native-toast-notifications';
import i18n from './src/languageTranslation/index';
import {setToastRef} from './src/utils/toast';
import {ThemeProvider} from './src/theme/ThemeContext';
import {initializeNotificationService} from './src/services/notificationService';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import appApi from './src/services/api';

const ToastInitializer = () => {
  const toast = useToast();
  useEffect(() => {
    setToastRef(toast);
  }, [toast]);
  return null;
};

function App(): React.JSX.Element {
  useEffect(() => {
    initializeNotificationService();

    // Subscribe to iOS CallKit/PushKit native events
    if (Platform.OS === 'ios' && NativeModules.CallKitBridge) {
      const emitter = new NativeEventEmitter(NativeModules.CallKitBridge);
      const subs = [
        emitter.addListener('voipTokenReceived', async (info: any) => {
          const token = info?.token as string;
          if (!token) return;
          // try {
          // Adjust endpoint path to your backend route if different
          await appApi.post('/api/device/register-voip-token', {token});
          // console.log('[VoIP] Token registered');
          // } catch (e) {
          //   console.log(
          //     '[VoIP] Failed to register token',
          //     (e as any)?.message || e,
          //   );
          // }
        }),
        emitter.addListener('callAnswered', async (payload: any) => {
          // try {
          const {
            acceptCall,
          } = require('./src/redux/actions/callAction/callAction');
          const meId = String(store.getState()?.auth?.user?.id || '');
          const otherId = String(payload?.fromUserId || '');
          const roomId = String(payload?.roomId || '');
          if (meId && otherId && roomId) {
            await (store.dispatch as any)(acceptCall({meId, otherId, roomId}));
          }
          const navigationService =
            require('./src/navigation/navigationService').default;
          // try {
          navigationService.navigate('CallScreen');
          // } catch {}
          // } catch {}
        }),
        emitter.addListener('callEnded', async (payload: any) => {
          // try {
          const {
            rejectCall,
          } = require('./src/redux/actions/callAction/callAction');
          const meId = String(store.getState()?.auth?.user?.id || '');
          const otherId = String(payload?.fromUserId || '');
          const roomId = String(payload?.roomId || '');
          if (meId && otherId && roomId) {
            await (store.dispatch as any)(
              rejectCall({meId, otherId, roomId, reason: 'declined'}),
            );
          }
          // } catch {}
        }),
      ];
      return () => subs.forEach(s => s.remove());
    }

    // CallKeep initialization and related app state handling removed
    // try {
    //   callkeepService.init(store.dispatch as any);
    // } catch (e) {
    //   console.log('CallKeep init error', e);
    // }
    // const handleAppStateChange = (nextAppState: string) => {
    //   if (nextAppState === 'active') {
    //     checkPendingCalls();
    //   }
    // };
    // const subscription = AppState.addEventListener('change', handleAppStateChange);
    // return () => subscription?.remove();
  }, []);
  // const checkPendingCalls = async () => {
  //   try {
  //     const pendingCall = mmkv.getString('pendingCall');
  //     if (pendingCall) {
  //       const callData = JSON.parse(pendingCall);
  //       // Show incoming call UI via CallKeep (removed)
  //     }
  //   } catch (error) {
  //     console.error('[App] Error checking pending calls:', error);
  //   }
  // };

  return (
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView>
            <I18nextProvider i18n={i18n}>
              <ToastProvider
                offset={110}
                duration={3000}
                placement="bottom"
                successColor="#01BCCD">
                <ToastInitializer />
                <Navigation />
              </ToastProvider>
            </I18nextProvider>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
