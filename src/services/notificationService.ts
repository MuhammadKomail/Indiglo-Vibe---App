import {
  getMessaging,
  requestPermission,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  isDeviceRegisteredForRemoteMessages,
  registerDeviceForRemoteMessages,
  FirebaseMessagingTypes,
  getToken,
} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {getApp} from '@react-native-firebase/app';
import {store} from '../redux/store';
import {handleIncomingNotification} from './push';

export async function requestAndroidPermission() {
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return result === 'granted';
  }
  return true;
}

export async function requestUserPermission() {
  const app = getApp();
  const messaging = getMessaging(app);

  try {
    // console.log('[Notifications] Platform:', Platform.OS);
    // Registration status
    const isRegistered = await isDeviceRegisteredForRemoteMessages(messaging);
    // console.log('[Notifications] isDeviceRegisteredForRemoteMessages:', isRegistered);
    if (!isRegistered) {
      // console.log('[Notifications] Registering device for remote messages...');
      await registerDeviceForRemoteMessages(messaging);
    }

    // Permission request
    let enabled = false;
    if (Platform.OS === 'android') {
      enabled = await requestAndroidPermission();
      // console.log('[Notifications] Android POST_NOTIFICATIONS granted:', enabled);
    } else {
      const authStatus = await requestPermission(messaging);
      // 1: AUTHORIZED, 2: PROVISIONAL on iOS
      // console.log('[Notifications] iOS authStatus:', authStatus);
      enabled = authStatus === 1 || authStatus === 2;
    }

    // Ensure FCM auto-init is enabled (helps iOS initialize on cold starts)
    try {
      (messaging as any)?.setAutoInitEnabled?.(true);
      // console.log('[Notifications] setAutoInitEnabled(true) called');
    } catch {
      void 0;
    }

    if (enabled) {
      // console.log('[Notifications] Permission granted. Fetching FCM token...');
      await getFcmToken();
    } else {
      // console.log('[Notifications] Permission denied or not authorized.');
    }
  } catch {
    // console.log('[Notifications] requestUserPermission error:');
  }
}

export async function getFcmToken() {
  const messaging = getMessaging(getApp());
  try {
    // console.log('[FCM] getToken start');
    const token = await getToken(messaging);
    // console.log('[FCM] Token:', token || 'null');
    if (Platform.OS === 'ios') {
      // Helpful to see if APNs token exists (required for FCM on iOS)
      const apnsToken = (messaging as any)?.getAPNSToken
        ? await (messaging as any).getAPNSToken()
        : null;
      // console.log('[APNs] Token:', apnsToken || 'null');
      // Simple retry if token missing but APNs token exists
      if (!token && apnsToken) {
        // console.log('[FCM] Retrying getToken after APNs token available...');
        await new Promise(r => setTimeout(r, 500));
        const retry = await getToken(messaging);
        // console.log('[FCM] Token (retry):', retry || 'null');
        return retry;
      }
    }
    return token;
  } catch {
    // console.log('[FCM] getToken error:');
    return null;
  }
}

function handleForegroundNotifications() {
  const messaging = getMessaging(getApp());

  onMessage(
    messaging,
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      const data = remoteMessage?.data || {};
      const type = String(data?.type || '');
      // Incoming call -> restore custom UI flow
      if (type === 'incoming_call') {
        try {
          // Update redux state for incoming and ring UI
          handleIncomingNotification(store.dispatch as any, data as any);
          // Navigate directly to custom CallScreen
          // navigationService.navigate('CallScreen' as any);
        } catch {
          void 0;
        }
        return;
      }

      // Fallback to data.title/body when top-level notification is absent (data-only push)
      const title =
        remoteMessage.notification?.title ||
        (data as any)?.title ||
        'Notification';
      const body =
        remoteMessage.notification?.body || (data as any)?.body || '';
      // const avatar: string | undefined =
      //   typeof remoteMessage.data?.avatar === 'string' &&
      //   remoteMessage.data.avatar
      //     ? remoteMessage.data.avatar
      //     : undefined;

      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {id: 'default'},
          smallIcon: 'ic_launcher', // 🔴 REQUIRED FOR ANDROID HEAD-UP DISPLAY
          // largeIcon: avatar, // Show sender avatar or placeholder if provided
        },
        ios: undefined,
        // Attach routing data so tap handlers can route into chat
        data: {
          ...data,
          title: title,
        },
      });
    },
  );
}

async function handleNotificationOpenedApp() {
  const messaging = getMessaging(getApp());
  // When app is in background and opened by tapping a notification
  onNotificationOpenedApp(messaging, remoteMessage => {
    const data = remoteMessage?.data || {};
    const title = remoteMessage?.notification?.title;
    // If this was an incoming call delivered as an FCM notification, route to CallScreen
    if (String(data?.type || '') === 'incoming_call') {
      handleIncomingNotification(store.dispatch as any, data as any);
      try {
        // navigationService.navigate('CallScreen' as any);
      } catch {
        void 0;
      }
      return;
    }
    navigateToRoomFromPayload(data, title);
  });

  // When app is quit and opened by tapping a notification
  const initialMessage = await getInitialNotification(messaging);
  if (initialMessage) {
    const data = initialMessage?.data || {};
    const title = initialMessage?.notification?.title;
    if (String(data?.type || '') === 'incoming_call') {
      handleIncomingNotification(store.dispatch as any, data as any);
      try {
        // navigationService.navigate('CallScreen' as any);
      } catch {
        void 0;
      }
      return;
    }
    navigateToRoomFromPayload(data, title);
  }
}

// Navigate into the chat screen from notification payload
function navigateToRoomFromPayload(data: any, _title?: string | null) {
  try {
    // const _roomIdRaw = (data as any)?.roomId;
    const senderId = (data as any)?.fromUserId ?? (data as any)?.senderId;
    // const name = (data as any)?.name ?? (data as any)?.title ?? 'User';
    if (!senderId) return;

    const state = store.getState();
    const role = state?.auth?.user?.role;

    // Navigate into nested BottomTabs with params so Chat screen receives route.params
    if (role === 'mentor') {
      // navigationService.navigate('BottomTabs', {
      //   screen: 'ChatDetailScreen',
      //   params: {
      //     user: {id: Number(senderId), name},
      //     roomId: _roomIdRaw ? String(_roomIdRaw) : undefined,
      //   },
      // } as any);
    } else {
      // navigationService.navigate('BottomTabs', {
      //   screen: 'Chat',
      //   params: {
      //     user: {id: Number(senderId), name},
      //     roomId: _roomIdRaw ? String(_roomIdRaw) : undefined,
      //   },
      // } as any);
    }
  } catch {
    // console.log('[Notifications] navigateToRoomFromPayload error:');
  }
}

export async function initializeNotificationService() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
  await notifee.createChannel({
    id: 'calls',
    name: 'Calls',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });

  await requestUserPermission();
  handleForegroundNotifications();
  await handleNotificationOpenedApp();

  // Handle taps while app is in foreground (Notifee notifications we display)
  notifee.onForegroundEvent(async ({type, detail}) => {
    try {
      const d = detail?.notification?.data || {};
      if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
        // Incoming call Accept / Decline
        // const _actionId = detail?.pressAction?.id;
        if (String(d?.type || '') === 'incoming_call') {
          handleIncomingNotification(store.dispatch as any, d);
          try {
            // await (store.dispatch as any)(
            //   acceptCall({meId, otherId, roomId}),
            // );
          } catch {
            void 0;
          }
          // Navigate to custom CallScreen on accept
          try {
            // navigationService.navigate('CallScreen' as any);
          } catch {
            void 0;
          }
        } else {
          navigateToRoomFromPayload(d, (detail?.notification as any)?.title);
        }
      }
    } catch {
      void 0;
    }
  });

  // Handle taps when app is in background (headless task)
  notifee.onBackgroundEvent(async ({type, detail}) => {
    try {
      const d = detail?.notification?.data || {};
      if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
        // const _actionId = detail?.pressAction?.id;
        if (String(d?.type || '') === 'incoming_call') {
          handleIncomingNotification(store.dispatch as any, d);
          try {
            // await (store.dispatch as any)(
            //   acceptCall({meId, otherId, roomId}),
            // );
          } catch {
            void 0;
          }
          // Navigate to custom CallScreen on accept from background
          try {
            // navigationService.navigate('CallScreen' as any);
          } catch {
            void 0;
          }
        } else {
          navigateToRoomFromPayload(d, (detail?.notification as any)?.title);
        }
      }
    } catch {
      void 0;
    }
  });

  // If the app was opened by tapping a Notifee notification while quit
  try {
    const initial = await notifee.getInitialNotification();
    if (initial?.notification?.data) {
      const d = initial.notification.data as any;
      if (String(d?.type || '') === 'incoming_call') {
        handleIncomingNotification(store.dispatch as any, d);
      } else {
        navigateToRoomFromPayload(d, (initial as any)?.notification?.title);
      }
    }
  } catch {
    void 0;
  }
}
