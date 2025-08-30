import {AppDispatch} from '../redux/store';
import {setIncomingCall} from '../redux/slices/callSlice/callSlice';

// Shape of push data (FCM data payload values arrive as strings)
export type PushData = {
  type?: string;
  roomId?: string;
  fromUserId?: string;
  fromUserName?: string;
  fromUserAvatar?: string;
  callType?: 'audio' | 'video';
  typeAlias?: string; // in case backends send different key
  [key: string]: any;
};

export function handleIncomingNotification(
  dispatch: AppDispatch,
  data: PushData,
) {
  const t = (data?.type || data?.typeAlias || '').toString();
  if (t === 'incoming_call') {
    const roomId = data?.roomId?.toString();
    const fromUserId = data?.fromUserId?.toString();
    const fromUserName = data?.fromUserName;
    const fromUserAvatar = data?.fromUserAvatar;
    const callType =
      (data?.callType || data?.type)?.toString() === 'video'
        ? 'video'
        : 'audio';

    if (roomId && fromUserId) {
      dispatch(
        setIncomingCall({
          fromUserId,
          roomId,
          type: callType,
          fromUserName,
          fromUserAvatar,
        }) as any,
      );
    }
  }
}
