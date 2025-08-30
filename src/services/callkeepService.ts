// import RNCallKeep, { CONSTANTS as CK_CONSTANTS } from 'react-native-callkeep';
// import 'react-native-get-random-values';
// import { v4 as uuidv4 } from 'uuid';
// import { type AppDispatch } from '../redux/store';
// import { setIncomingCall } from '../redux/slices/callSlice/callSlice';
// import navigationService from '../navigation/navigationService';
// import { store } from '../redux/store';
// import { acceptCall, rejectCall } from '../redux/actions/callAction/callAction';
// import { Platform } from 'react-native';
// import notifee, { AndroidImportance } from '@notifee/react-native';

// // Type for the data payload from the push notification
// export type CallKeepData = {
//   roomId?: string;
//   fromUserId?: string;
//   fromUserName?: string;
//   fromUserAvatar?: string;
//   callType?: 'audio' | 'video';
// };

// class CallKeepService {
//   private dispatch: AppDispatch | null = null;
//   private currentCallId: string | null = null;
//   private lastRoomId: string | null = null;
//   private lastFromUserId: string | null = null;
//   private lastFromUserName: string | null = null;
//   private lastFromUserAvatar: string | null = null;

//   // Initialize CallKeep and set up listeners
//   init(dispatch: AppDispatch) {
//     this.dispatch = dispatch;
//     try {
//       RNCallKeep.setup({
//         ios: {
//           appName: 'IndiGloVibe',
//         },
//         android: {
//           alertTitle: 'Permissions required',
//           alertDescription: 'This application needs to access your phone accounts',
//           cancelButton: 'Cancel',
//           okButton: 'ok',
//           additionalPermissions: [
//             'android.permission.RECORD_AUDIO',
//             'android.permission.READ_PHONE_STATE',
//             'android.permission.CALL_PHONE',
//             'android.permission.FOREGROUND_SERVICE',
//             'android.permission.BLUETOOTH_CONNECT',
//           ],
//           // Required for foreground service on Android 11+
//           foregroundService: {
//             channelId: 'calls',
//             channelName: 'Incoming Calls',
//             notificationTitle: 'IndiGloVibe Call in Progress',
//           },
//         },
//       });

//       // --- Register Event Listeners ---
//       RNCallKeep.addEventListener('answerCall', this.onAnswerCall);
//       RNCallKeep.addEventListener('endCall', this.onEndCall);

//       RNCallKeep.setAvailable(true);
//     } catch (e) {
//       console.error('[CallKeep] Initialization error:', e);
//     }
//   }

//   // --- Event Handlers ---
//   private onAnswerCall = async (payload: any) => {
//     const { callUUID } = payload;
//     console.log(`[CallKeep] Answered call ${callUUID}`);

//     this.currentCallId = callUUID;
//     // Dispatch acceptCall with IDs we stored when showing the incoming call
//     try {
//       const meId = String(store.getState()?.auth?.user?.id || '');
//       const otherId = String(this.lastFromUserId || '');
//       const roomId = String(this.lastRoomId || '');
//       if (meId && otherId && roomId && this.dispatch) {
//         await (this.dispatch as any)(acceptCall({ meId, otherId, roomId }));
//       }
//     } catch (e) {}
//     // Bring the app to foreground and show custom CallScreen (do not end the telecom call)
//     const toCallScreen = async () => {
//       try {
//         if (Platform.OS === 'ios' && (RNCallKeep as any)?.backToForeground) {
//           (RNCallKeep as any).backToForeground();
//         }
//         if (Platform.OS === 'android') {
//           // Fire a full-screen notification to bring app to foreground on Android
//           try {
//             await notifee.displayNotification({
//               title: 'Connecting call…',
//               body: this.lastFromUserName || 'Bringing call to foreground',
//               android: {
//                 channelId: 'calls',
//                 importance: AndroidImportance.HIGH,
//                 pressAction: { id: 'default' },
//                 fullScreenAction: { id: 'open_call' },
//                 asForegroundService: true,
//               },
//               data: {
//                 fromUserId: this.lastFromUserId || '',
//                 roomId: this.lastRoomId || '',
//               } as any,
//             });
//           } catch (e) {
//             // Fallback: best effort, continue to navigate
//           }
//         }
//       } catch {}
//       try {
//         navigationService.navigate('CallScreen', {
//           peerName: this.lastFromUserName,
//           peerAvatar: this.lastFromUserAvatar,
//           peerUserId: this.lastFromUserId,
//         });
//         // iOS: report the call as active to CallKit after UI transition
//         if (Platform.OS === 'ios') {
//           setTimeout(() => {
//             try {
//               this.reportConnected(callUUID);
//             } catch {}
//           }, 700);
//         }
//         // Keep native CallKeep UI active; do not dismiss here. It will end when the call is actually hung up.
//       } catch (e) {
//         console.error('[CallKeep] Failed to navigate to CallScreen on answer:', e);
//       }
//     };

//     // First attempt shortly after answer
//     setTimeout(() => { void toCallScreen(); }, 250);
//     // Second attempt as a fallback (helps some Android devices)
//     setTimeout(() => { void toCallScreen(); }, 800);
//   };

//   private onEndCall = async (payload: any) => {
//     const { callUUID } = payload;
//     console.log(`[CallKeep] Ended call ${callUUID}`);
//     try {
//       const meId = String(store.getState()?.auth?.user?.id || '');
//       const otherId = String(this.lastFromUserId || '');
//       const roomId = String(this.lastRoomId || '');
//       if (meId && otherId && roomId && this.dispatch) {
//         await (this.dispatch as any)(rejectCall({ meId, otherId, roomId, reason: 'declined' }));
//       }
//     } catch (e) {}
//     // Here you would clean up the call (e.g., close WebRTC connection)
//     this.currentCallId = null;
//   };

//   // --- Public Methods ---

//   // Display the native incoming call UI
//   displayIncomingCall = (data: CallKeepData) => {
//     if (!this.dispatch || !data.roomId || !data.fromUserId) {
//       console.warn('[CallKeep] Cannot display call, service not ready or data missing.');
//       return;
//     }

//     const callUUID = uuidv4();
//     this.currentCallId = callUUID;
//     this.lastRoomId = data.roomId;
//     this.lastFromUserId = data.fromUserId;
//     this.lastFromUserName = data.fromUserName || null;
//     this.lastFromUserAvatar = data.fromUserAvatar || null;

//     // Show native CallKeep incoming UI
//     RNCallKeep.displayIncomingCall(
//       callUUID,
//       data.fromUserName || 'Unknown Caller',
//       'IndiGloVibe',
//       'generic',
//       data.callType === 'video'
//     );
//   };

//   // Start an outgoing call
//   startCall = (options: {
//     toUserId: string;
//     toUserName?: string;
//     callType?: 'audio' | 'video';
//   }) => {
//     const { toUserId, toUserName, callType } = options;
//     const handle = toUserName || toUserId;
//     const callUUID = uuidv4();
//     this.currentCallId = callUUID; // Store the new UUID

//     console.log(`[CallKeep] Starting outgoing call to ${handle} (UUID: ${callUUID})`);

//     // Display the native dialing screen
//     RNCallKeep.startCall(callUUID, handle, toUserName || 'Unknown Caller', 'generic', callType === 'video');

//     return callUUID; // Return the generated UUID
//   };

//   // Report that the call has connected
//   reportConnected = (uuid: string) => {
//     console.log(`[CallKeep] Call ${uuid} connected`);
//     try {
//       if (Platform.OS === 'ios' && (RNCallKeep as any)?.setCurrentCallActive) {
//         (RNCallKeep as any).setCurrentCallActive(uuid);
//       }
//     } catch (e) {
//       console.warn('[CallKeep] Failed to set current call active:', e);
//     }
//   };

//   // Report that the user has ended the call from the app's UI
//   endCallFromApp = () => {
//     if (this.currentCallId) {
//       RNCallKeep.endCall(this.currentCallId);
//       this.currentCallId = null;
//     }
//   };

//   // End a specific call by UUID
//   endCallByUUID = (uuid: string) => {
//     console.log(`[CallKeep] Ending call by UUID: ${uuid}`);
//     RNCallKeep.endCall(uuid);
//     if (this.currentCallId === uuid) {
//       this.currentCallId = null;
//     }
//   };

//   // Clean up listeners
//   destroy() {
//     RNCallKeep.removeEventListener('answerCall');
//     RNCallKeep.removeEventListener('endCall');
//   }
// }

// // Export a singleton instance
// const callkeepService = new CallKeepService();
// export default callkeepService;
