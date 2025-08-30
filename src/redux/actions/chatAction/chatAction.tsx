import {createAsyncThunk} from '@reduxjs/toolkit';
import socketService from '../../../services/socketService';
import {chatApi} from '../../../services/api';
import {
  fetchMessagesStart,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  addMessage,
  updateMessageStatus,
  clearUnreadCount,
  setUnreadCount,
  fetchUsersSuccess,
} from '../../slices/chatSlice/chatSlice';

// Helpers
const normalizeServerList = (data: any): any[] => {
  const list = Array.isArray(data?.message)
    ? data.message
    : Array.isArray(data?.message?.data)
      ? data.message.data
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.messages)
          ? data.messages
          : [];
  return Array.isArray(list) ? list : [];
};

const formatServerMessage = (msg: any, roomId: string) => ({
  id: msg.id?.toString?.() || Math.random().toString(),
  roomId,
  text: msg.message ?? msg.text ?? msg.content ?? '',
  time: msg.createdAt || msg.created_at || msg.time || new Date().toISOString(),
  user: {
    id: (
      msg.userId ??
      msg.user_id ??
      msg.senderId ??
      msg.sender_id
    )?.toString?.(),
    name: msg.name || msg.userName || msg.username || 'User',
  },
});

// 1) Start or find a private chat room, join, fetch first page, mark read
export const startPrivateChat = createAsyncThunk(
  'chat/startPrivateChat',
  async ({meId, otherId}: {meId: string; otherId: string}, {dispatch}) => {
    // Ensure socket connected
    if (!socketService.isConnected()) {
      socketService.connect(meId);
    }

    const roomRes = (
      await chatApi.post('/api/room/private', {
        userId1: String(meId),
        userId2: String(otherId),
      })
    ).data;
    const roomId: string = roomRes?.message?.roomId || roomRes?.roomId;
    if (!roomId) throw new Error('roomId not found');

    // Join room (idempotent server-side)
    try {
      socketService.joinRoom(String(roomId), String(meId));
    } catch {
      void 0;
    }

    // Fetch first page messages
    dispatch(fetchMessagesStart());
    try {
      const msgsRes = (
        await chatApi.get(`/api/messages/${String(roomId)}`, {
          params: {page: 1, limit: 20},
          headers: {'Content-Type': 'application/json'},
        })
      ).data;
      const list = normalizeServerList(msgsRes)
        .map((m: any) => formatServerMessage(m, String(roomId)))
        .sort(
          (a: any, b: any) =>
            new Date(a.time).getTime() - new Date(b.time).getTime(),
        );
      dispatch(fetchMessagesSuccess(list));
    } catch (e: any) {
      dispatch(fetchMessagesFailure(e?.message || 'Failed to load messages'));
    }

    // Mark as read + emit + clear unread
    try {
      await chatApi.post('/api/room/mark-as-read', {
        roomId: String(roomId),
        userId: String(meId),
      });
      if (socketService.socket && socketService.isConnected()) {
        socketService.socket.emit('markAsRead', {
          roomId: String(roomId),
          userId: String(meId),
        });
      }
      dispatch(clearUnreadCount(String(otherId)));
    } catch {
      void 0;
    }

    return {roomId};
  },
);

// 9) Fetch chat list (other user, last message, unreadCount) for a user via new API
export const fetchUserChatList = createAsyncThunk(
  'chat/fetchUserChatList',
  async ({
    userId,
    search,
    page = 1,
    pageSize = 20,
  }: {
    userId: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const res = await chatApi.get(`/api/room/user/${String(userId)}` as const, {
      params: {search, page, pageSize},
    });
    // Expected shape according to backend
    // { status: 'success', message: { items: [...], page, pageSize, hasMore }, error: 'OK' }
    const payload = res?.data?.message ?? res?.data ?? {};
    const items = Array.isArray(payload?.items) ? payload.items : [];
    return {
      items,
      page: Number(payload?.page ?? page ?? 1),
      pageSize: Number(payload?.pageSize ?? pageSize ?? 20),
      hasMore: Boolean(payload?.hasMore ?? false),
    } as {
      items: Array<{
        roomId: number;
        otherUser: {id: number; name: string; avatar?: string | null} | null;
        lastMessage: {
          id: number;
          text: string;
          createdAt: string;
          senderId: number;
          isRead: boolean;
        } | null;
        unreadCount: number;
      }>;
      page: number;
      pageSize: number;
      hasMore: boolean;
    };
  },
);

// 8) Fetch active users list (moved from socketService)
export const fetchActiveUsers = createAsyncThunk(
  'chat/fetchActiveUsers',
  async (_: void, {dispatch}) => {
    const res = await chatApi.get('/api/user/activeUsers');
    const data = res.data;
    if (
      data?.status === 'success' &&
      data?.message?.data &&
      Array.isArray(data.message.data)
    ) {
      dispatch(fetchUsersSuccess(data.message.data));
    }
    return data;
  },
);

// 2) Fetch paginated messages with safe merge
export const fetchRoomMessages = createAsyncThunk(
  'chat/fetchRoomMessages',
  async (
    {roomId, page, limit = 20}: {roomId: string; page: number; limit?: number},
    {dispatch, getState},
  ) => {
    if (page === 1) dispatch(fetchMessagesStart());
    try {
      const msgsRes = (
        await chatApi.get(`/api/messages/${String(roomId)}`, {
          params: {page, limit},
          headers: {'Content-Type': 'application/json'},
        })
      ).data;
      const pageList = normalizeServerList(msgsRes)
        .map((m: any) => formatServerMessage(m, String(roomId)))
        .sort(
          (a: any, b: any) =>
            new Date(a.time).getTime() - new Date(b.time).getTime(),
        );

      if (page === 1) {
        dispatch(fetchMessagesSuccess(pageList));
      } else {
        const state: any = getState();
        const existing = Array.isArray(state?.chat?.messages)
          ? state.chat.messages
          : [];
        // Simple de-dup by id+time
        const byKey = new Map<string, any>();
        const push = (m: any) => byKey.set(`${m.id}|${m.time}`, m);
        existing.forEach(push);
        pageList.forEach(push);
        const merged = Array.from(byKey.values()).sort(
          (a: any, b: any) =>
            new Date(a.time).getTime() - new Date(b.time).getTime(),
        );
        dispatch(fetchMessagesSuccess(merged));
      }
      return {count: pageList.length};
    } catch (e: any) {
      dispatch(fetchMessagesFailure(e?.message || 'Failed to load messages'));
      return {count: 0};
    }
  },
);

// 3) Send a chat message with optimistic UI + ack handling
export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async (
    {
      roomId,
      meId,
      name,
      text,
    }: {roomId: string; meId: string; name: string; text: string},
    {dispatch},
  ) => {
    const safeMessage = (text ?? '').trim();
    if (!safeMessage) return;

    const tempId = Math.random().toString();
    const localMessage = {
      id: tempId,
      roomId: String(roomId),
      text: safeMessage,
      time: new Date().toISOString(),
      user: {
        id: String(meId),
        name: name || 'User',
      },
      status: 'sending' as const,
    };
    dispatch(addMessage(localMessage));

    const payload = {
      userId: String(meId),
      roomId: String(roomId),
      message: safeMessage,
      name: name || 'User',
      isSaveInDb: true,
      clientId: tempId,
    };

    // Fail-safe timer
    const FAIL_TIMEOUT_MS = 30000;
    let settled = false;
    const failTimer = setTimeout(() => {
      if (!settled) {
        settled = true;
        dispatch(
          updateMessageStatus({messageId: tempId, status: 'failed'} as any),
        );
      }
    }, FAIL_TIMEOUT_MS);

    const send = () => {
      try {
        socketService.joinRoom(String(roomId), String(meId));
      } catch {
        void 0;
      }
      // Optimistic sent if still connected
      const OPTIMISTIC_SENT_MS = 800;
      const optimisticTimer = setTimeout(() => {
        if (!settled && socketService.isConnected()) {
          dispatch(
            updateMessageStatus({messageId: tempId, status: 'sent'} as any),
          );
        }
      }, OPTIMISTIC_SENT_MS);

      socketService.sendMessage(payload, (ack: any) => {
        if (settled) return;
        settled = true;
        clearTimeout(failTimer);
        clearTimeout(optimisticTimer);
        const ok =
          ack?.status === 'success' ||
          ack?.message === 'success' ||
          ack?.ok === true;
        if (ok) {
          const newId =
            ack?.data?.id?.toString?.() ||
            ack?.messageId?.toString?.() ||
            ack?.id?.toString?.();
          const echoedClientId = ack?.data?.clientId || ack?.clientId;
          const targetId = echoedClientId || tempId;
          dispatch(
            updateMessageStatus({
              messageId: String(targetId),
              newId,
              status: 'sent',
            } as any),
          );
        } else {
          dispatch(
            updateMessageStatus({messageId: tempId, status: 'failed'} as any),
          );
        }
      });
    };

    if (socketService.isConnected()) {
      send();
    } else {
      socketService.connect(String(meId));
      socketService.onConnectOnce(String(meId), send);
    }
  },
);

// 4) Mark a room as read and clear unread locally
export const markRoomAsRead = createAsyncThunk(
  'chat/markRoomAsRead',
  async (
    {roomId, meId, otherId}: {roomId: string; meId: string; otherId: string},
    {dispatch},
  ) => {
    await chatApi.post('/api/room/mark-as-read', {
      roomId: String(roomId),
      userId: String(meId),
    });
    if (socketService.socket && socketService.isConnected()) {
      socketService.socket.emit('markAsRead', {
        roomId: String(roomId),
        userId: String(meId),
      });
    }
    dispatch(clearUnreadCount(String(otherId)));
  },
);

// 5) Batch fetch unread counts for a list of users
export const fetchUnreadCountsForUsers = createAsyncThunk(
  'chat/fetchUnreadCountsForUsers',
  async ({meId, userIds}: {meId: string; userIds: string[]}, {dispatch}) => {
    const tasks = userIds.map(async otherId => {
      if (!otherId || otherId === meId) return;
      try {
        const res = (
          await chatApi.post('/api/room/unread-count', {
            userId1: String(meId),
            userId2: String(otherId),
          })
        ).data;
        const count = res?.message?.data?.unreadCount ?? res?.unreadCount ?? 0;
        dispatch(setUnreadCount({userId: String(otherId), count}));
      } catch {
        void 0;
      }
    });
    await Promise.allSettled(tasks);
  },
);

// 6) Fetch last message preview for a list of users (raw data; UI will format)
export const fetchLastMessagePreviewsRaw = createAsyncThunk(
  'chat/fetchLastMessagePreviewsRaw',
  async ({meId, userIds}: {meId: string; userIds: string[]}) => {
    const result: Record<
      string,
      | {text: string; createdAt: string; fromMe: boolean; roomId?: string}
      | {text: ''; createdAt: ''; fromMe: false; roomId?: string}
    > = {} as any;
    const tasks = userIds.map(async otherId => {
      try {
        const roomRes = (
          await chatApi.post('/api/room/private', {
            userId1: String(meId),
            userId2: String(otherId),
          })
        ).data;
        const roomId = roomRes?.message?.roomId || roomRes?.roomId;
        if (!roomId) {
          result[String(otherId)] = {
            text: '',
            createdAt: '',
            fromMe: false,
            roomId: undefined,
          } as any;
          return;
        }
        const msgsRes = (
          await chatApi.get(`/api/messages/${String(roomId)}`, {
            params: {page: 1, limit: 1},
            headers: {'Content-Type': 'application/json'},
          })
        ).data;
        const list = normalizeServerList(msgsRes);
        if (Array.isArray(list) && list.length > 0) {
          const sorted = [...list].sort(
            (a: any, b: any) =>
              new Date(a.createdAt || a.time || 0).getTime() -
              new Date(b.createdAt || b.time || 0).getTime(),
          );
          const latest = sorted[sorted.length - 1];
          const senderId = String(
            latest.userId ??
              latest.user_id ??
              latest.senderId ??
              latest.sender_id ??
              '',
          );
          const fromMe = String(meId) === senderId;
          const text = String(
            latest.message ?? latest.text ?? latest.content ?? '',
          );
          const createdAt = String(
            latest.createdAt || latest.time || new Date().toISOString(),
          );
          result[String(otherId)] = {
            text,
            createdAt,
            fromMe,
            roomId: String(roomId),
          } as any;
        } else {
          result[String(otherId)] = {
            text: '',
            createdAt: '',
            fromMe: false,
            roomId: String(roomId),
          } as any;
        }
      } catch {
        result[String(otherId)] = {
          text: '',
          createdAt: '',
          fromMe: false,
          roomId: undefined,
        } as any;
      }
    });
    await Promise.allSettled(tasks);
    return result;
  },
);

// 7) Mark-as-read by other user id (resolves/creates room internally)
export const markAsReadForUser = createAsyncThunk(
  'chat/markAsReadForUser',
  async ({meId, otherId}: {meId: string; otherId: string}, {dispatch}) => {
    const roomRes = (
      await chatApi.post('/api/room/private', {
        userId1: String(meId),
        userId2: String(otherId),
      })
    ).data;
    const roomId = roomRes?.message?.roomId || roomRes?.roomId;
    if (!roomId) throw new Error('Room not found');
    await chatApi.post('/api/room/mark-as-read', {
      roomId: String(roomId),
      userId: String(meId),
    });
    if (socketService.socket && socketService.isConnected()) {
      socketService.socket.emit('markAsRead', {
        roomId: String(roomId),
        userId: String(meId),
      });
    }
    dispatch(clearUnreadCount(String(otherId)));
    return {roomId};
  },
);
