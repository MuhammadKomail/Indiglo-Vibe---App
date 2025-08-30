import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type CallStatus =
  | 'idle'
  | 'dialing'
  | 'ringing'
  | 'connecting'
  | 'in_call'
  | 'ended'
  | 'rejected'
  | 'busy'
  | 'failed';

export interface CallState {
  status: CallStatus;
  callUUID?: string | null;
  roomId?: string | null;
  peerUserId?: string | null;
  peerName?: string | null;
  peerAvatar?: string | null;
  type?: 'audio' | 'video';
  error?: string | null;
  incoming?: {
    fromUserId: string;
    roomId: string;
    type?: 'audio' | 'video';
    fromUserName?: string;
    fromUserAvatar?: string;
  } | null;
}

const initialState: CallState = {
  status: 'idle',
  callUUID: null,
  roomId: null,
  peerUserId: null,
  peerName: null,
  peerAvatar: null,
  type: 'audio',
  error: null,
  incoming: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    resetCall: () => ({...initialState}),

    setDialing(
      state,
      action: PayloadAction<{
        roomId: string;
        peerUserId: string;
        type?: 'audio' | 'video';
        callUUID: string;
      }>,
    ) {
      state.status = 'dialing';
      state.roomId = action.payload.roomId;
      state.peerUserId = action.payload.peerUserId;
      state.type = action.payload.type || 'audio';
      state.callUUID = action.payload.callUUID;
      state.error = null;
    },

    setRinging(state) {
      state.status = 'ringing';
      state.error = null;
    },

    setAccepted(state) {
      state.status = 'connecting';
      state.error = null;
    },

    setInCall(state) {
      state.status = 'in_call';
      state.error = null;
    },

    setRejected(state, action: PayloadAction<{reason?: string} | undefined>) {
      Object.assign(state, {
        ...initialState,
        status: 'rejected',
        error: action.payload?.reason || null,
      });
    },

    setBusy(state) {
      state.status = 'busy';
      state.error = 'User is busy';
    },

    setEnded(state) {
      Object.assign(state, {...initialState, status: 'ended'});
    },

    setFailed(state, action: PayloadAction<string | undefined>) {
      state.status = 'failed';
      state.error = action.payload || 'Call failed';
    },

    setIncomingCall(
      state,
      action: PayloadAction<{
        fromUserId: string;
        roomId: string;
        type?: 'audio' | 'video';
        fromUserName?: string;
        fromUserAvatar?: string;
      }>,
    ) {
      state.incoming = action.payload;
      state.status = 'ringing';
      state.roomId = action.payload.roomId;
      state.peerUserId = action.payload.fromUserId;
      state.peerName = action.payload.fromUserName || state.peerName || null;
      state.peerAvatar =
        action.payload.fromUserAvatar || state.peerAvatar || null;
      state.type = action.payload.type || 'audio';
    },

    clearIncoming(state) {
      state.incoming = null;
      if (state.status === 'ringing') state.status = 'idle';
    },
  },
});

export const {
  resetCall,
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
} = callSlice.actions;

export default callSlice.reducer;
