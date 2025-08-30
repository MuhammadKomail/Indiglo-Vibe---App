import {createAsyncThunk} from '@reduxjs/toolkit';
import {PermissionsAndroid, Platform} from 'react-native';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import socketService from '../../../services/socketService';
import {
  setDialing,
  setRinging,
  setAccepted,
  setInCall,
  setRejected,
  setBusy,
  setEnded,
  setFailed,
  setIncomingCall,
  clearIncoming,
  resetCall,
} from '../../slices/callSlice/callSlice';
import {webrtcService} from '../../../services/webrtc';

let dialingTimer: any = null;
const clearDialingTimer = () => {
  if (dialingTimer) {
    clearTimeout(dialingTimer);
    dialingTimer = null;
  }
};

async function ensurePermissions(type: 'audio' | 'video') {
  if (Platform.OS !== 'android') return true;
  try {
    const mic = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    const cam =
      type === 'video'
        ? await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          )
        : PermissionsAndroid.RESULTS.GRANTED;
    return (
      mic === PermissionsAndroid.RESULTS.GRANTED &&
      cam === PermissionsAndroid.RESULTS.GRANTED
    );
  } catch {
    // noop
    return false;
  }
}

export const setupCallSocketListeners = createAsyncThunk(
  'call/setupCallSocketListeners',
  async (_: void, {dispatch}) => {
    // Attach listeners through socketService helper registration
    socketService.onIncomingCall((data: any) => {
      // data: { fromUserId, roomId, type, fromUserName?, fromUserAvatar? }
      // Restore custom incoming UI: update state to ringing (UI will navigate)
      dispatch(
        setIncomingCall({
          fromUserId: String(data?.fromUserId ?? data?.callerId ?? ''),
          roomId: String(data?.roomId ?? ''),
          type: (data?.type === 'video' ? 'video' : 'audio') as
            | 'audio'
            | 'video',
          fromUserName: data?.fromUserName,
          fromUserAvatar: data?.fromUserAvatar,
        }) as any,
      );
      dispatch(setRinging());
    });
    socketService.onCallRinging((_data: any) => {
      dispatch(setRinging());
    });
    socketService.onCallAccepted((_data: any) => {
      // Caller side must clear the 30s timeout immediately on accept
      clearDialingTimer();
      dispatch(setAccepted());
      // UI/WebRTC layer should move to in_call once tracks attached; we flip to in_call early for now
      dispatch(setInCall());
      dispatch(clearIncoming());
    });
    socketService.onCallRejected((data: any) => {
      const reason = String(data?.reason || 'declined');
      if (reason === 'busy') dispatch(setBusy());
      else dispatch(setRejected({reason}));
      dispatch(clearIncoming());
      // Ensure we do not stay stuck in a terminal state; reset shortly after
      try {
        void webrtcService.end();
      } catch {
        void 0;
      }
      setTimeout(() => {
        dispatch(resetCall());
      }, 600);
    });
    socketService.onCallEnded((_data: any) => {
      dispatch(setEnded());
      dispatch(clearIncoming());
      // ensure media cleanup and auto reset to idle
      try {
        void webrtcService.end();
      } catch {
        void 0;
      }
      setTimeout(() => {
        dispatch(resetCall());
      }, 500);
    });
    // Note: rtc:offer/answer/ice will be handled in media integration step. For now, listeners are set in socketService and UI can subscribe if needed.
  },
);

export const startCall = createAsyncThunk(
  'call/startCall',
  async (
    {
      meId,
      otherId,
      roomId,
      type = 'audio',
    }: {
      meId: string;
      otherId: string;
      roomId: string;
      type?: 'audio' | 'video';
    },
    {dispatch},
  ) => {
    try {
      const granted = await ensurePermissions(type);
      if (!granted) {
        dispatch(setFailed('Microphone/Camera permission denied'));
        return;
      }

      // End any lingering media from previous call
      try {
        await webrtcService.end();
      } catch {
        void 0;
      }

      // Clear any stale terminal state (busy/ended/failed/rejected) before starting
      dispatch(resetCall());

      // Generate a UUID for the call, but don't show the native UI for the caller.
      // The remote user will see the native incoming call UI via a push notification.
      const callUUID = uuidv4();

      // Update Redux state to 'dialing'
      dispatch(
        setDialing({
          roomId: String(roomId),
          peerUserId: String(otherId),
          type,
          callUUID,
        }),
      );

      const connectAndEmit = async () => {
        socketService.startCall({
          toUserId: String(otherId),
          roomId: String(roomId),
          type,
        });
        // Start WebRTC offer (audio-only unless type === 'video')
        try {
          await webrtcService.startOffer(
            String(roomId),
            String(otherId),
            type !== 'video',
          );
        } catch {
          void 0;
        }
      };
      if (socketService.isConnected()) {
        await connectAndEmit();
      } else {
        socketService.connect(String(meId));
        socketService.onConnectOnce(String(meId), () => {
          void connectAndEmit();
        });
      }

      // Edge case: auto-fail if no answer within 30s
      clearDialingTimer();
      dialingTimer = setTimeout(() => {
        try {
          socketService.cancelCall({
            toUserId: String(otherId),
            roomId: String(roomId),
          });
        } catch {
          void 0;
        }
        dispatch(setFailed('No answer'));
        dispatch(setEnded());
        try {
          void webrtcService.end();
        } catch {
          void 0;
        }
        setTimeout(() => {
          dispatch(resetCall());
        }, 800);
      }, 30000);
    } catch (e: any) {
      dispatch(setFailed(e?.message || 'Failed to start call'));
      throw e;
    }
  },
);

export const acceptCall = createAsyncThunk(
  'call/acceptCall',
  async (
    {meId, otherId, roomId}: {meId: string; otherId: string; roomId: string},
    {dispatch},
  ) => {
    try {
      clearDialingTimer();
      const emit = () =>
        socketService.acceptCall({
          fromUserId: String(otherId),
          roomId: String(roomId),
        });
      if (socketService.isConnected()) emit();
      else {
        socketService.connect(String(meId));
        socketService.onConnectOnce(String(meId), emit);
      }
      // Accept the pending WebRTC offer only after user explicitly accepts.
      try {
        await webrtcService.acceptPendingOffer();
      } catch {
        void 0;
      }
      dispatch(setAccepted());
    } catch (e: any) {
      dispatch(setFailed(e?.message || 'Failed to accept call'));
      throw e;
    }
  },
);

export const rejectCall = createAsyncThunk(
  'call/rejectCall',
  async (
    {
      meId,
      otherId,
      roomId,
      reason = 'declined' as 'declined' | 'busy',
    }: {
      meId: string;
      otherId: string;
      roomId: string;
      reason?: 'declined' | 'busy';
    },
    {dispatch},
  ) => {
    try {
      clearDialingTimer();
      const emit = () =>
        socketService.rejectCall({
          fromUserId: String(otherId),
          roomId: String(roomId),
          reason,
        });
      if (socketService.isConnected()) emit();
      else {
        socketService.connect(String(meId));
        socketService.onConnectOnce(String(meId), emit);
      }
      if (reason === 'busy') dispatch(setBusy());
      else dispatch(setRejected({reason}));
      dispatch(clearIncoming());
      try {
        void webrtcService.end();
      } catch {
        void 0;
      }
      setTimeout(() => {
        dispatch(resetCall());
      }, 800);
    } catch (e: any) {
      dispatch(setFailed(e?.message || 'Failed to reject call'));
      throw e;
    }
  },
);

export const endCall = createAsyncThunk(
  'call/endCall',
  async (
    {meId, otherId, roomId}: {meId: string; otherId: string; roomId: string},
    {dispatch, getState},
  ) => {
    try {
      clearDialingTimer();
      // Decide whether to cancel (pre-connect) or end (active)
      const state: any = getState();
      const status: string | undefined = state?.call?.status;
      const isPreConnect = status === 'dialing' || status === 'ringing';
      const emit = () => {
        if (isPreConnect) {
          try {
            socketService.cancelCall({
              toUserId: String(otherId),
              roomId: String(roomId),
            });
          } catch {
            void 0;
          }
        } else {
          socketService.endCall({
            otherUserId: String(otherId),
            roomId: String(roomId),
          });
        }
      };
      if (socketService.isConnected()) emit();
      else {
        socketService.connect(String(meId));
        socketService.onConnectOnce(String(meId), emit);
      }
      dispatch(setEnded());
      try {
        await webrtcService.end();
      } catch {
        void 0;
      }
      setTimeout(() => {
        dispatch(resetCall());
      }, 500);
    } catch (e: any) {
      dispatch(setFailed(e?.message || 'Failed to end call'));
      throw e;
    }
  },
);
