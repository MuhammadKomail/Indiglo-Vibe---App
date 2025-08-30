import {createSlice} from '@reduxjs/toolkit';
import {registerFcmToken} from '../../actions/notificationAction/notificationAction';

interface NotificationState {
  registering: boolean;
  error: string | null;
  token: string | null;
  lastRegisteredForUserId: number | null;
}

const initialState: NotificationState = {
  registering: false,
  error: null,
  token: null,
  lastRegisteredForUserId: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(registerFcmToken.pending, state => {
        state.registering = true;
        state.error = null;
      })
      .addCase(registerFcmToken.fulfilled, (state, action) => {
        state.registering = false;
        state.error = null;
        state.token = action.payload.fcmToken;
        state.lastRegisteredForUserId = action.payload.userId;
      })
      .addCase(registerFcmToken.rejected, (state, action) => {
        state.registering = false;
        state.error = (action.payload as string) || 'FCM registration failed';
      });
  },
});

export default notificationSlice.reducer;
