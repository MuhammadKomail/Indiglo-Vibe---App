import {
  getMessaging,
  getToken,
  requestPermission,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  isDeviceRegisteredForRemoteMessages,
  registerDeviceForRemoteMessages,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {NavigationContainerRef} from '@react-navigation/native';
import {PermissionsAndroid, Platform} from 'react-native';
import {getApp} from '@react-native-firebase/app';

let navigationRef: NavigationContainerRef<any> | null = null;

export function setNavigationRef(ref: NavigationContainerRef<any>) {
  navigationRef = ref;
}

export async function requestAndroidPermission() {
  if (Platform.OS === 'android') {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return result === 'granted';
    } catch (error) {
      // console.log('Error requesting android permission', error);
      return false;
    }
  }
  return true;
}

export async function requestUserPermission() {
  try {
    const app = getApp();
    const messaging = getMessaging(app);

    const isRegistered = await isDeviceRegisteredForRemoteMessages(messaging);
    if (!isRegistered) {
      await registerDeviceForRemoteMessages(messaging);
    }

    let enabled = false;
    if (Platform.OS === 'android') {
      enabled = await requestAndroidPermission();
    } else {
      const authStatus = await requestPermission(messaging);
      enabled = authStatus === 1 || authStatus === 2; // GRANTED or PROVISIONAL for iOS
    }

    if (enabled) {
      // console.log('✅ Notification permission granted.');
      await getFcmToken();
    } else {
      // console.log('❌ Notification permission denied.');
    }
  } catch (error) {
    // console.log('❌ Error requesting permission:', error);
  }
}

async function getFcmToken() {
  try {
    const messaging = getMessaging(getApp());
    const token = await getToken(messaging);
    // console.log('🔥 FCM Token:', token);
  } catch (error) {
    // console.log('❌ Failed to get FCM token:', error);
  }
}

function handleForegroundNotifications() {
  const messaging = getMessaging(getApp());

  onMessage(
    messaging,
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      // console.log('📬 Foreground Notification:', remoteMessage);

      const title = remoteMessage.notification?.title || 'Notification';
      const body = remoteMessage.notification?.body || '';

      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {id: 'default'},
          smallIcon: 'ic_launcher', // 🔴 REQUIRED FOR ANDROID HEAD-UP DISPLAY
        },
      });
    },
  );
}

async function handleNotificationOpenedApp() {
  const messaging = getMessaging(getApp());

  onNotificationOpenedApp(messaging, remoteMessage => {
    // console.log('📥 Opened from background:', remoteMessage);
    const route = remoteMessage.data?.route;
    if (route && navigationRef) {
      // navigationRef.navigate(route);
    }
  });

  const initialMessage = await getInitialNotification(messaging);
  if (initialMessage) {
    // console.log('📥 Opened from quit state:', initialMessage);
    const route = initialMessage.data?.route;
    if (route && navigationRef) {
      // navigationRef.navigate(route);
    }
  }
}

// 🔁 Notifee background tap/dismiss handler
notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  if (type === EventType.ACTION_PRESS && pressAction?.id === 'default') {
    // console.log('🔙 Notification tapped:', notification);
  }

  if (type === EventType.DISMISSED) {
    // console.log('🔕 Notification dismissed:', notification);
  }
});

export async function initializeNotificationService() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  await requestUserPermission();
  handleForegroundNotifications();
  await handleNotificationOpenedApp();
}
