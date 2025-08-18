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

const ToastInitializer = () => {
  const toast = useToast();

  useEffect(() => {
    setToastRef(toast); // Set the global toast reference
  }, [toast]);

  return null;
};

function App(): React.JSX.Element {
  // const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    initializeNotificationService();
  }, []);

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
