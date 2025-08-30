import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {fetchUserChatList} from '../../actions/chatAction/chatAction';
import {Message} from '../../../types/chat';

interface ChatState {
  messages: Message[];
  users: any[];
  unreadCounts: {[userId: string]: number};
  loading: boolean;
  error: string | null;
  lastMessagePreviews: Record<string, {text: string; time: string}>;
  roomToOtherMap: Record<string, string>;
  // New API chat list
  chatListItems: Array<{
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
  chatListPage: number;
  chatListPageSize: number;
  chatListHasMore: boolean;
  chatListLoading: boolean;
  chatListError: string | null;
}

const initialState: ChatState = {
  messages: [],
  users: [],
  unreadCounts: {},
  loading: false,
  error: null,
  lastMessagePreviews: {},
  roomToOtherMap: {},
  chatListItems: [],
  chatListPage: 1,
  chatListPageSize: 20,
  chatListHasMore: false,
  chatListLoading: false,
  chatListError: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    fetchMessagesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMessagesSuccess(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
      state.loading = false;
    },
    fetchMessagesFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    updateMessageStatus(
      state,
      action: PayloadAction<{
        messageId: string;
        newId?: string;
        status: 'sent' | 'failed' | 'read';
      }>,
    ) {
      const {messageId, newId, status} = action.payload;
      const message = state.messages.find(m => m.id === messageId);
      if (message) {
        message.status = status;
        if (newId) {
          message.id = newId;
        }
      }
    },
    fetchUsersSuccess(state, action: PayloadAction<any[]>) {
      state.users = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
    setUnreadCount(
      state,
      action: PayloadAction<{userId: string; count: number}>,
    ) {
      const {userId, count} = action.payload;
      state.unreadCounts[userId] = count;
    },
    clearUnreadCount(state, action: PayloadAction<string>) {
      const userId = action.payload;
      state.unreadCounts[userId] = 0;
    },
    mergeLastMessagePreviews(
      state,
      action: PayloadAction<Record<string, {text: string; time: string}>>,
    ) {
      state.lastMessagePreviews = {
        ...state.lastMessagePreviews,
        ...action.payload,
      };
    },
    setLastMessagePreview(
      state,
      action: PayloadAction<{otherId: string; text: string; time: string}>,
    ) {
      const {otherId, text, time} = action.payload;
      state.lastMessagePreviews[otherId] = {text, time};
    },
    mergeRoomToOtherMap(state, action: PayloadAction<Record<string, string>>) {
      state.roomToOtherMap = {...state.roomToOtherMap, ...action.payload};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserChatList.pending, state => {
        state.chatListLoading = true;
        state.chatListError = null;
      })
      .addCase(
        fetchUserChatList.fulfilled,
        (
          state,
          action: PayloadAction<{
            items: any[];
            page: number;
            pageSize: number;
            hasMore: boolean;
          }>,
        ) => {
          const {items, page, pageSize, hasMore} = action.payload;
          state.chatListLoading = false;
          state.chatListError = null;
          state.chatListItems = items || [];
          state.chatListPage = page;
          state.chatListPageSize = pageSize;
          state.chatListHasMore = hasMore;
        },
      )
      .addCase(fetchUserChatList.rejected, (state, action) => {
        state.chatListLoading = false;
        state.chatListError =
          action.error?.message || 'Failed to load chat list';
      });
  },
});

export const {
  fetchMessagesStart,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  addMessage,
  updateMessageStatus,
  fetchUsersSuccess,
  clearMessages,
  setUnreadCount,
  clearUnreadCount,
  mergeLastMessagePreviews,
  setLastMessagePreview,
  mergeRoomToOtherMap,
} = chatSlice.actions;

export default chatSlice.reducer;
