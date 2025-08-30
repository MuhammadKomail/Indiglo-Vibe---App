/**
 * @format
 */
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import * as WebStreamsPolyfill from 'web-streams-polyfill';

if (!global.ReadableStream) {
  global.ReadableStream = WebStreamsPolyfill.ReadableStream;
}
if (!global.WritableStream) {
  global.WritableStream = WebStreamsPolyfill.WritableStream;
}
if (!global.TransformStream) {
  global.TransformStream = WebStreamsPolyfill.TransformStream;
}

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// ✅ Add below for notifications:
import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidCategory,
  EventType,
} from '@notifee/react-native';
import {store} from './src/redux/store';
import {handleIncomingNotification} from './src/services/push';
import navigationService from './src/navigation/navigationService';
import {Platform} from 'react-native';

// ✅ Create default notification channel before app loads
async function setupDefaultChannel() {
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
}
setupDefaultChannel();

// ✅ Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  const data = remoteMessage.data || {};
  const type = String(data.type || '');

  // Exit early if this is not a message type we want to handle in the background
  if (!type) {
    return;
  }

  // --- Handle Incoming Call Notifications ---
  if (type === 'incoming_call') {
    // On Android, we still show enhanced notifications for background/killed state
    // On iOS, VoIP pushes handle this in AppDelegate.mm
    if (Platform.OS === 'android') {
      const callTitle = data.fromUserName || 'Incoming Call';
      const callBody = data.callType === 'video' ? 'Video call' : 'Audio call';

      // All call notifications must have a roomId to be valid
      if (!data.roomId) {
        return;
      }

      await notifee.displayNotification({
        title: callTitle,
        body: callBody,
        android: {
          channelId: 'calls',
          category: AndroidCategory.CALL,
          importance: AndroidImportance.HIGH,
          smallIcon: 'ic_launcher',
          asForegroundService: true,
          ongoing: true,
          pressAction: {id: 'default', launchActivity: 'default'},
          actions: [
            {
              title: 'Accept',
              pressAction: {id: 'accept', launchActivity: 'default'},
            },
            {title: 'Decline', pressAction: {id: 'decline'}},
          ],
        },
        data,
      });
    }
    return; // Stop processing after handling the call
  }

  // --- Handle Standard Message Notifications ---
  if (type === 'message') {
    const title = data.title || 'New Message';
    const body = data.body || '';

    // Only display if there is content
    if (title && body) {
      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {id: 'default'},
          smallIcon: 'ic_launcher',
        },
        data,
      });
    }
    return; // Stop processing after handling the message
  }
});

// Handle Notifee background events (accept/decline) to hydrate and navigate
notifee.onBackgroundEvent(async ({type, detail}) => {
  // try {
  if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
    const d = detail?.notification?.data || {};
    const actionId = detail?.pressAction?.id;
    if (String(d?.type || '') === 'incoming_call') {
      if (
        actionId === 'accept' ||
        (type === EventType.PRESS && actionId === 'default')
      ) {
        // try {
        handleIncomingNotification(store.dispatch, d);
        // } catch {}
        // Restore navigation to custom CallScreen on accept in background
        setTimeout(() => {
          // try {
          navigationService.navigate('CallScreen');
          // } catch {}
        }, 500);
      } else if (actionId === 'decline') {
        // Handle decline action - could emit socket event to caller
        // try {
        // Clear any incoming call state
        const {
          rejectCall,
        } = require('./src/redux/actions/callAction/callAction');
        const meId = String(store.getState()?.auth?.user?.id || '');
        const otherId = String(d?.fromUserId || '');
        const roomId = String(d?.roomId || '');
        if (meId && otherId && roomId) {
          store.dispatch(
            rejectCall({meId, otherId, roomId, reason: 'declined'}),
          );
        }
        // } catch {}
        // Dismiss the notification
        // try {
        await notifee.cancelNotification(detail?.notification?.id);
        // } catch {}
      }
    }
  }
  // } catch {}
});

AppRegistry.registerComponent(appName, () => App);
