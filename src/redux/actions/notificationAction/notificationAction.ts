import {createAsyncThunk} from '@reduxjs/toolkit';
import {chatApi} from '../../../services/api';
import {
  getFcmToken,
  requestUserPermission,
} from '../../../services/notificationService';
import {RootState} from '../../store';

// POST /api/notification/register-token
// body: { userId: number, fcmToken: string }
export const registerFcmToken = createAsyncThunk<
  {userId: number; fcmToken: string},
  void,
  {state: RootState}
>(
  'notification/registerFcmToken',
  async (_: void, {getState, rejectWithValue}) => {
    try {
      const state = getState();
      const user = state.auth.user as any;
      const userIdRaw = user?.id;
      const userId =
        typeof userIdRaw === 'string' ? Number(userIdRaw) : (userIdRaw ?? 0);
      if (!userId || Number.isNaN(userId)) {
        return rejectWithValue('Missing valid userId');
      }

      // Try to get token; if null, ask permission then retry
      let fcmToken = await getFcmToken();
      if (!fcmToken) {
        await requestUserPermission();
        fcmToken = await getFcmToken();
      }

      if (!fcmToken) {
        return rejectWithValue('FCM token unavailable');
      }

      await chatApi.post('/api/notification/register-token', {
        userId,
        fcmToken,
      });

      return {userId, fcmToken};
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to register FCM token';
      return rejectWithValue(msg);
    }
  },
);
