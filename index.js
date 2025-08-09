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
import notifee, {AndroidImportance} from '@notifee/react-native';

// ✅ Create default notification channel before app loads
async function setupDefaultChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}
setupDefaultChannel();

// ✅ Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // console.log('📡 [index.js] Background message received:', remoteMessage);

  const {notification} = remoteMessage;
  if (notification) {
    await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        pressAction: {id: 'default'},
        smallIcon: 'ic_launcher',
      },
    });
  }
});

AppRegistry.registerComponent(appName, () => App);
