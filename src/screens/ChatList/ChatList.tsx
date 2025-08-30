import React, {useEffect, useState} from 'react';
import {useAppSelector, useAppDispatch} from '../../redux/store';
import socketService from '../../services/socketService';
import {
  mergeLastMessagePreviews,
  mergeRoomToOtherMap,
} from '../../redux/slices/chatSlice/chatSlice';
import {
  markAsReadForUser,
  fetchUserChatList,
} from '../../redux/actions/chatAction/chatAction';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  ImageBackground,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {imgPath} from '../../styles/style';
import ChatListItem from '../../components/ChatListItem';
import CallLogItem, {Call} from '../../components/CallLogItem';
import SearchBar from '../../components/SearchBar';
import AppHeader from '../../components/AppHeader';
import {showToast} from '../../utils/toast';
import {formatDate, formatTime} from '../../utils/time';
import colors from '../../styles/colors';

// Helper to format time nicely for list
const humanizeTime = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const label = formatDate(d);
    if (label === 'Today') return formatTime(d);
    if (label === 'Yesterday') return 'Yesterday';
    return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  } catch {
    return '';
  }
};

// Helper to build preview text: add 'You:' if from me and truncate
const buildPreview = (text: string, isFromMe: boolean, maxLen = 25): string => {
  const safe = (text ?? '').trim();
  const shortened = safe.length > maxLen ? safe.slice(0, maxLen) + '…' : safe;
  return isFromMe ? `You: ${shortened}` : shortened;
};

const dummyCallLogs: Call[] = [
  {
    id: '1',
    user: {
      name: 'Athalia Putri',
      avatar: 'https://i.pravatar.cc/150?u=athalia',
    },
    time: 'Today At 11:30 Am',
    type: 'outgoing',
  },
  {
    id: '2',
    user: {
      name: 'Raki Devon',
      avatar: 'https://i.pravatar.cc/150?u=raki',
    },
    time: 'Yesterday At 3:00 Pm',
    type: 'missed',
  },
  {
    id: '3',
    user: {
      name: 'Erian Sadewa',
      avatar: 'https://i.pravatar.cc/150?u=erlan',
    },
    time: 'Jun 10 At 12:00 Am',
    type: 'incoming',
  },
];

const ChatListScreen = ({navigation}: {navigation: any}) => {
  const {
    unreadCounts,
    lastMessagePreviews,
    roomToOtherMap,
    chatListItems,
    chatListLoading,
  } = useAppSelector(state => state.chat);
  const {user} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = React.useState('Messages');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      try {
        if (!socketService.isConnected()) {
          socketService.connect(user.id);
        }
      } catch {
        void 0;
      }
      dispatch(
        fetchUserChatList({userId: String(user.id), page: 1, pageSize: 50}),
      )
        .unwrap()
        .catch(() => {
          void 0;
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    let listenersAttached = false;
    let retryTimer: ReturnType<typeof setInterval> | null = null;

    const setupListeners = () => {
      if (!socketService.socket) return;
      if (listenersAttached) return;
      listenersAttached = true;
      socketService.setupUnreadCountListeners(dispatch);

      const connectErrorHandler = (_err: any) => {
        showToast({type: 'error', message: 'Socket connection error'});
        setLoading(false);
      };

      const disconnectHandler = () => {
        showToast({type: 'error', message: 'Disconnected from server'});
      };

      const roomMessageHandler = async (data: any) => {
        try {
          const senderId = data?.userId != null ? String(data.userId) : '';
          const me = user?.id != null ? String(user.id) : '';
          const roomId = data?.roomId != null ? String(data.roomId) : '';
          if (!roomId || !me) return;
          let otherId: string = '';
          if (senderId && senderId !== me) {
            otherId = senderId;
          } else {
            otherId = String(
              data?.receiverId ??
                data?.toUserId ??
                data?.friendId ??
                data?.peerId ??
                '',
            );
            if (!otherId) {
              otherId = roomToOtherMap[roomId] || '';
            }
          }
          if (!otherId) return;
          const text = buildPreview(data?.message ?? '', senderId === me);
          const time = humanizeTime(
            data?.createdAt || new Date().toISOString(),
          );
          dispatch(mergeLastMessagePreviews({[otherId]: {text, time}}));
        } catch {
          void 0;
        }
      };

      socketService.socket.on('connect_error', connectErrorHandler);
      socketService.socket.on('disconnect', disconnectHandler);
      socketService.socket.on('roomMessageDeliver', roomMessageHandler);

      const lastMessageUpdateHandler = (data: any) => {
        try {
          const me = user?.id != null ? String(user.id) : '';
          const otherId =
            data?.otherUserId != null ? String(data.otherUserId) : '';
          if (!me || !otherId) return;
          const rid = data?.roomId != null ? String(data.roomId) : '';
          if (rid && otherId) {
            dispatch(mergeRoomToOtherMap({[rid]: otherId}));
          }
          const text = buildPreview(data?.message ?? '', Boolean(data?.fromMe));
          const time = humanizeTime(
            data?.createdAt || new Date().toISOString(),
          );
          dispatch(mergeLastMessagePreviews({[otherId]: {text, time}}));
        } catch {
          void 0;
        }
      };

      socketService.socket.on('lastMessageUpdate', lastMessageUpdateHandler);
    };

    const tryAttach = () => {
      if (socketService.socket && socketService.isConnected()) {
        setupListeners();
        if (retryTimer) {
          clearInterval(retryTimer);
          retryTimer = null;
        }
      }
    };

    tryAttach();

    const connectHandler = () => {
      setTimeout(tryAttach, 500);
    };

    if (socketService.socket) {
      socketService.socket.on('connect', connectHandler);
    } else {
      retryTimer = setInterval(tryAttach, 400);
    }

    return () => {
      if (retryTimer) {
        clearInterval(retryTimer);
        retryTimer = null;
      }
      if (socketService.socket) {
        socketService.socket.off('connect', connectHandler);
        socketService.socket.off('connect_error');
        socketService.socket.off('disconnect');
        socketService.socket.off('updateUnreadCount');
        socketService.socket.off('messagesRead');
        socketService.socket.off('roomMessageDeliver');
        socketService.socket.off('lastMessageUpdate');
      }
    };
  }, []);

  useEffect(() => {
    const handlePresence = (data: any) => {
      try {
        const uid = data?.userId != null ? String(data.userId) : '';
        if (!uid) return;
        setPresenceMap(prev => ({...prev, [uid]: Boolean(data?.online)}));
      } catch {
        void 0;
      }
    };
    if (socketService.socket) {
      socketService.socket.on('userPresence', handlePresence);
    }
    return () => {
      try {
        socketService.socket?.off('userPresence', handlePresence);
      } catch {
        void 0;
      }
    };
  }, []);

  useEffect(() => {
    const me = user?.id != null ? String(user.id) : '';
    if (
      !socketService.socket ||
      !me ||
      !Array.isArray(chatListItems) ||
      chatListItems.length === 0
    )
      return;
    const uniqueIds = Array.from(
      new Set(
        chatListItems
          .map(it => it?.otherUser?.id)
          .filter(Boolean)
          .map(String)
          .filter(id => id !== me),
      ),
    );
    uniqueIds.forEach(otherId => {
      try {
        socketService.socket?.emit(
          'getPresence',
          {userId: otherId},
          (ack: any) => {
            if (ack?.ok) {
              setPresenceMap(prev => ({
                ...prev,
                [otherId]: Boolean(ack.online),
              }));
            }
          },
        );
      } catch {
        void 0;
      }
    });
  }, [chatListItems, user?.id]);

  const backClick = () => {
    navigation.navigate('Home');
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[styles.safeArea, Platform.OS === 'ios' && styles.safeAreaIOS]}>
      <StatusBar
        translucent={Platform.OS === 'android'}
        backgroundColor={Platform.OS === 'android' ? 'transparent' : undefined}
        barStyle="light-content"
      />
      {Platform.OS === 'ios' && (
        <ImageBackground
          source={imgPath.headerBackground}
          resizeMode="cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: insets.top,
          }}
        />
      )}
      <View style={styles.container}>
        <AppHeader title="Messages" backIcon={backClick} />

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Messages' && styles.activeTab]}
            onPress={() => setActiveTab('Messages')}>
            <Text
              style={
                activeTab === 'Messages' ? styles.activeTabText : styles.tabText
              }>
              Messages
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Call Logs' && styles.activeTab]}
            onPress={() => setActiveTab('Call Logs')}>
            <Text
              style={
                activeTab === 'Call Logs'
                  ? styles.activeTabText
                  : styles.tabText
              }>
              Call Logs
            </Text>
          </TouchableOpacity>
        </View>

        <SearchBar />

        {loading || chatListLoading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={colors.iosBlue} />
            <Text style={{marginTop: 8, color: colors.grayTextSecondary}}>
              Loading chats...
            </Text>
          </View>
        ) : activeTab === 'Messages' ? (
          <FlatList
            data={(chatListItems && chatListItems.length > 0
              ? chatListItems.filter(
                  it =>
                    it?.otherUser &&
                    String(it.otherUser.id) !== String(user?.id),
                )
              : []
            ).map(it => {
              const otherId = String(it.otherUser?.id || '');
              const preview = otherId
                ? lastMessagePreviews[otherId]
                : undefined;
              let derivedLastText = preview?.text;
              const derivedLastTime =
                preview?.time ??
                (it.lastMessage?.createdAt
                  ? humanizeTime(it.lastMessage.createdAt)
                  : '');
              const derivedUnread =
                otherId && unreadCounts[otherId] !== undefined
                  ? Number(unreadCounts[otherId])
                  : Number(it.unreadCount || 0);
              if (!derivedLastText) {
                const rawText = String(it.lastMessage?.text || '');
                const meId = String(user?.id || '');
                const senderId = it.lastMessage?.senderId;
                const fromMe = senderId != null && String(senderId) === meId;
                derivedLastText = buildPreview(rawText, fromMe);
              }
              return {
                key: String(it.otherUser?.id || it.roomId),
                roomId: String(it.roomId),
                otherId,
                name: String(it.otherUser?.name || 'User'),
                avatar: it.otherUser?.avatar || '',
                lastText: derivedLastText,
                lastTime: derivedLastTime,
                unread: derivedUnread,
                online: Boolean(presenceMap[otherId]),
              };
            })}
            refreshing={refreshing}
            onRefresh={async () => {
              if (!user) return;
              try {
                setRefreshing(true);
                await dispatch(
                  fetchUserChatList({
                    userId: String(user.id),
                    page: 1,
                    pageSize: 50,
                  }),
                ).unwrap();
              } catch {
                showToast({type: 'error', message: 'Failed to refresh chats'});
              } finally {
                setRefreshing(false);
              }
            }}
            keyExtractor={item => item.key}
            renderItem={({item}) => (
              <ChatListItem
                chat={{
                  id: item.otherId,
                  user: {
                    name: item.name,
                    avatar: item.avatar,
                    online: Boolean(item.online),
                  },
                  lastMessage: item.lastText
                    ? {text: item.lastText, time: item.lastTime}
                    : {text: 'Click to chat', time: ''},
                  unreadCount: item.unread,
                }}
                onPress={() =>
                  navigation.navigate('ChatDetailScreen', {
                    roomId: item.roomId,
                    user: {
                      id: item.otherId,
                      name: item.name,
                      profilePic: item.avatar,
                    },
                  })
                }
                onLongPress={async () => {
                  try {
                    if (!user) return;
                    await dispatch(
                      markAsReadForUser({
                        meId: String(user.id),
                        otherId: String(item.otherId),
                      }),
                    ).unwrap();
                    showToast({type: 'success', message: 'Marked as read'});
                  } catch {
                    showToast({
                      type: 'error',
                      message: 'Failed to mark as read',
                    });
                  }
                }}
              />
            )}
            ListEmptyComponent={() => (
              <View style={{padding: 24, alignItems: 'center'}}>
                <Text style={{color: colors.grayTextSecondary}}>
                  No chats yet.
                </Text>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={dummyCallLogs}
            keyExtractor={item => item.id}
            renderItem={({item}) => <CallLogItem call={item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  safeAreaIOS: {
    backgroundColor: colors.iosBlue,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorderLight,
  },
  tab: {
    paddingBottom: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.iosBlue,
  },
  tabText: {
    color: colors.grayTextSecondary,
    fontSize: 16,
  },
  activeTabText: {
    color: colors.iosBlue,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatListScreen;
