import React, {useEffect, useState, useMemo, useCallback, useRef} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useAppSelector, useAppDispatch} from '../../redux/store';
import socketService from '../../services/socketService';
import {
  addMessage,
  clearMessages,
  updateMessageStatus,
} from '../../redux/slices/chatSlice/chatSlice';
import {
  startPrivateChat,
  fetchRoomMessages as fetchRoomMessagesThunk,
  sendChatMessage,
  markRoomAsRead,
} from '../../redux/actions/chatAction/chatAction';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  AppState,
  AppStateStatus,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import InfoBanner from '../../components/InfoBanner';
import MessageBubble from '../../components/MessageBubble';
import ChatInput from '../../components/ChatInput';
import {formatDate, formatTime} from '../../utils/time';
// tokenStorage not needed after thunk refactor
import {ThemedIcon} from '../../components/ThemedIcon';
import {
  startCall as startCallThunk,
  endCall as endCallThunk,
  setupCallSocketListeners,
} from '../../redux/actions/callAction/callAction';
import colors from '../../styles/colors';

const ChatScreen = ({route, navigation}: {route: any; navigation: any}) => {
  // Safely extract other user from route params; handle alternate keys and missing params
  const params = route?.params ?? {};
  const otherUser = params?.user ?? params?.otherUser ?? params?.peer ?? null;
  const {messages} = useAppSelector(state => state.chat);
  const {user} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [otherOnline, setOtherOnline] = useState<boolean>(false);
  const call = useAppSelector(state => (state as any)?.call);

  // If we don't have the required user param, render a safe fallback instead of crashing
  if (!otherUser) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <AppHeader title="Chat" backIcon={() => navigation.goBack?.()} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}>
          <Text style={{color: colors.gray444, textAlign: 'center'}}>
            Unable to open this chat because required info was missing.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    // Socket is initialized at navigation level; no need to connect here
    // Ensure call socket listeners are registered once
    try {
      dispatch(setupCallSocketListeners() as any);
    } catch {
      void 0;
    }
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  // Inform backend when this chat is actively open to suppress push notifications
  useEffect(() => {
    const uid = user?.id != null ? String(user.id) : '';
    const rid = roomId != null ? String(roomId) : '';
    if (!socketService.socket || !uid || !rid) return;

    if (isFocused) {
      try {
        socketService.socket.emit('activeRoom', {userId: uid, roomId: rid});
      } catch {
        void 0;
      }
    } else {
      try {
        socketService.socket.emit('inactiveRoom', {userId: uid, roomId: rid});
      } catch {
        void 0;
      }
    }

    // On unmount, mark inactive to be safe
    return () => {
      try {
        if (socketService.socket && uid && rid) {
          socketService.socket.emit('inactiveRoom', {userId: uid, roomId: rid});
        }
      } catch {
        void 0;
      }
    };
  }, [isFocused, roomId, user?.id]);

  // Presence: emit app state for my user and listen for other user's presence
  useEffect(() => {
    const me = user?.id != null ? String(user.id) : '';
    const otherId = otherUser?.id != null ? String(otherUser.id) : '';
    if (!socketService.socket || !me) return;

    // Emit current state and subscribe to AppState changes
    const emitState = (state: AppStateStatus) => {
      const mapped =
        state === 'active'
          ? 'active'
          : state === 'background'
            ? 'background'
            : 'inactive';
      try {
        socketService.socket?.emit('appState', {userId: me, state: mapped});
      } catch {
        void 0;
      }
    };
    emitState(AppState.currentState);

    const appStateHandler = (state: AppStateStatus) => emitState(state);
    const appStateSub = AppState.addEventListener('change', appStateHandler);

    // Subscribe to presence updates
    const handlePresence = (data: any) => {
      try {
        if (String(data?.userId) === otherId) {
          setOtherOnline(Boolean(data?.online));
        }
      } catch {
        void 0;
      }
    };
    socketService.socket.on('userPresence', handlePresence);

    // Query initial presence of other user
    if (otherId) {
      try {
        socketService.socket.emit(
          'getPresence',
          {userId: otherId},
          (ack: any) => {
            if (ack?.ok) setOtherOnline(Boolean(ack?.online));
          },
        );
      } catch {
        void 0;
      }
    }

    return () => {
      try {
        socketService.socket?.off('userPresence', handlePresence);
      } catch {
        void 0;
      }
      try {
        appStateSub?.remove?.();
      } catch {
        void 0;
      }
    };
  }, [user?.id, otherUser?.id]);

  // Navigate to dedicated CallScreen whenever a call becomes active (dialing/ringing/connecting/in_call)
  useEffect(() => {
    const st = (call as any)?.status;
    if (!st) return;
    const isActive = ['dialing', 'ringing', 'connecting', 'in_call'].includes(
      st,
    );
    if (!isActive) return;

    const peerName =
      (otherUser as any)?.name || (otherUser as any)?.fullName || 'Unknown';
    const peerAvatar =
      (otherUser as any)?.profilePic || (otherUser as any)?.avatar || undefined;
    const peerUserId =
      (otherUser as any)?.id != null
        ? String((otherUser as any).id)
        : undefined;
    try {
      navigation.navigate('CallScreen', {peerName, peerAvatar, peerUserId});
    } catch {
      /* console.error('[ChatScreen] Failed to navigate to CallScreen') */ void 0;
    }
  }, [call?.status, navigation, otherUser]);

  // Listen for incoming messages and mark them as read automatically (only when screen is focused)
  useEffect(() => {
    // console.log('🔧 Setting up auto-mark-as-read listener', { hasSocket: !!socketService.socket, roomId, userId: user?.id, otherUserId: otherUser?.id, isFocused });
    // Only attach when screen is focused
    if (!isFocused) {
      // console.log('⏸️ ChatScreen not focused; skipping auto-mark-as-read listener setup.');
      return;
    }

    // Setup listener even if roomId is not available yet
    const handleIncomingMessage = (data: any) => {
      if (!isFocused) {
        // Extra guard in case focus changed between attach and event delivery
        return;
      }
      const senderId = data?.userId != null ? String(data.userId) : '';
      const expectedOtherId = otherUser?.id != null ? String(otherUser.id) : '';
      // const messageRoomId = data?.roomId != null ? String(data.roomId) : '';
      // const currentRoomId = roomId != null ? String(roomId) : '';
      // // console.log('📨 Incoming message in open chat:', data);
      // console.log('🔍 Checking if should auto-mark as read:', { messageFromUserId: senderId, expectedOtherUserId: expectedOtherId, messageRoomId, currentRoomId, shouldMarkAsRead: senderId === expectedOtherId && (!currentRoomId || messageRoomId === currentRoomId) });

      // If message is from the other user in this chat, mark as read immediately
      if (senderId === expectedOtherId) {
        const targetRoomId = roomId ?? data.roomId;

        // If we didn't yet know the room, adopt it and join to ensure we receive future events
        if (!roomId && data.roomId) {
          // console.log('🧭 RoomId not set yet. Adopting incoming roomId and joining room for auto-read.');
          setRoomId(data.roomId);
          const meId = user?.id;
          if (socketService.isConnected() && meId) {
            socketService.joinRoom(data.roomId, meId);
          }
        }

        const meId = user?.id;
        const otherId = otherUser?.id;
        if (targetRoomId && meId && otherId) {
          // console.log('📖 Auto-marking message as read since chat is open (effective room).');
          // Small delay to ensure server persisted the message first
          setTimeout(() => {
            dispatch(
              markRoomAsRead({
                roomId: String(targetRoomId),
                meId: String(meId),
                otherId: String(otherId),
              }),
            );
          }, 300);
        } else {
          // console.log('⚠️ No roomId available to mark as read yet. Will rely on startChat flow.');
        }
      } else {
        // console.log('⏭️ Message not from current chat user, skipping auto-mark-as-read');
      }
    };

    let attached = false;
    const attachNow = () => {
      if (attached) return;
      if (socketService.socket && user && otherUser) {
        // console.log('✅ Adding roomMessageDeliver listener (focused)');
        socketService.socket.on('roomMessageDeliver', handleIncomingMessage);
        attached = true;
      }
    };

    // Attach immediately if possible
    attachNow();

    // Also attach after socket connects if it wasn't ready yet
    const onConnect = () => setTimeout(attachNow, 0);
    if (socketService.socket) {
      socketService.socket.on('connect', onConnect);
    }

    return () => {
      // console.log('🧹 Cleaning up roomMessageDeliver listener');
      if (socketService.socket) {
        socketService.socket.off('roomMessageDeliver', handleIncomingMessage);
        socketService.socket.off('connect', onConnect);
      }
    };
  }, [roomId, user, otherUser, dispatch, isFocused]);

  // Re-join the room any time the socket connects/reconnects
  useEffect(() => {
    if (!roomId || !user) return;
    const onConnect = () => {
      try {
        socketService.joinRoom(roomId, user.id);
        // console.log('🔄 Re-joined room after (re)connect');
        // Re-send any pending messages for this room
        const pending = messages.filter(
          (m: any) =>
            m.roomId?.toString?.() === roomId?.toString?.() &&
            m.status === 'sending',
        );
        pending.forEach((m: any) => {
          const resendPayload = {
            userId: user.id,
            roomId: roomId,
            message: m.text,
            name:
              (user as any)?.name ||
              (user as any)?.User?.name ||
              (user as any)?.fullName ||
              'User',
            isSaveInDb: true,
            clientId: m.id, // use same temp/client id for idempotency
          };
          socketService.sendMessage(resendPayload, (ack: any) => {
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
              const targetId = echoedClientId || m.id;
              dispatch(
                updateMessageStatus({
                  messageId: String(targetId),
                  newId,
                  status: 'sent',
                }),
              );
            }
          });
        });
      } catch {
        /* console.log('❌ Failed to re-join room on connect') */ void 0;
      }
    };
    const onReconnect = () => {
      try {
        socketService.joinRoom(roomId, user.id);
        // console.log('🔄 Re-joined room on reconnect event');
        // Re-send any pending messages for this room
        const pending = messages.filter(
          (m: any) =>
            m.roomId?.toString?.() === roomId?.toString?.() &&
            m.status === 'sending',
        );
        pending.forEach((m: any) => {
          const resendPayload = {
            userId: user.id,
            roomId: roomId,
            message: m.text,
            name:
              (user as any)?.name ||
              (user as any)?.User?.name ||
              (user as any)?.fullName ||
              'User',
            isSaveInDb: true,
            clientId: m.id,
          };
          socketService.sendMessage(resendPayload, (ack: any) => {
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
              const targetId = echoedClientId || m.id;
              dispatch(
                updateMessageStatus({
                  messageId: String(targetId),
                  newId,
                  status: 'sent',
                }),
              );
            }
          });
        });
      } catch {
        /* console.log('❌ Failed to re-join room on reconnect') */ void 0;
      }
    };
    if (socketService.socket) {
      socketService.socket.on('connect', onConnect);
      socketService.socket.on('reconnect', onReconnect);
    }
    return () => {
      if (socketService.socket) {
        socketService.socket.off('connect', onConnect);
        socketService.socket.off('reconnect', onReconnect);
      }
    };
  }, [roomId, user?.id]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef<FlatList<any>>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const scrollButtonAnimation = useRef(new Animated.Value(0)).current;

  // console.log('messages: ', messages);

  useEffect(() => {
    const startChat = async () => {
      if (user && otherUser) {
        setIsLoading(true);
        try {
          const result = await dispatch(
            startPrivateChat({
              meId: String(user.id),
              otherId: String(otherUser.id),
            }),
          ).unwrap();
          if (result?.roomId) {
            setRoomId(String(result.roomId));
          }
        } catch {
          /* console.error('Error starting private chat') */
        } finally {
          setIsLoading(false);
        }
      }
    };

    startChat();
  }, [user, otherUser, dispatch]);

  const fetchMore = async (roomId: string, pageNum: number) => {
    try {
      const res = await dispatch(
        fetchRoomMessagesThunk({
          roomId: String(roomId),
          page: pageNum,
          limit: 20,
        }),
      ).unwrap();
      const count = res?.count ?? 0;
      if (count < 20) setHasMore(false);
    } finally {
      if (pageNum === 1) setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (messageData: any) => {
      // Fast path: if this is our own message echo, flip status immediately using clientId mapping
      const incomingSenderId = (
        messageData?.userId ??
        messageData?.user_id ??
        messageData?.senderId ??
        messageData?.sender_id
      )?.toString?.();
      if (user?.id && incomingSenderId === user.id.toString()) {
        const serverId = (
          messageData?.id ??
          messageData?.messageId ??
          messageData?._id
        )?.toString?.();
        const echoedClientId = (
          messageData?.clientId ?? messageData?.client_id
        )?.toString?.();
        if (echoedClientId && serverId) {
          dispatch(
            updateMessageStatus({
              messageId: echoedClientId,
              newId: serverId,
              status: 'sent',
            }),
          );
          return;
        }
        // Fallback: some backends don't return clientId on echo. Try to match by latest unsent message with same text.
        const incomingText = (
          messageData?.message ??
          messageData?.text ??
          ''
        ).toString();
        if (serverId && incomingText) {
          // Find the most recent message from me that isn't 'sent' yet and has the same text
          const candidate = [...messages]
            .reverse()
            .find(
              (m: any) =>
                m.user?.id?.toString?.() === user.id.toString() &&
                m.text === incomingText &&
                m.status !== 'sent',
            );
          if (candidate?.id) {
            dispatch(
              updateMessageStatus({
                messageId: String(candidate.id),
                newId: serverId,
                status: 'sent',
              }),
            );
            return;
          }
        }
        // Do not append a duplicate of our own message to the list
        return;
      }
      const incomingRoomId = messageData.roomId?.toString?.();
      const currentRoom = roomId?.toString?.();
      const fromOtherUser =
        otherUser?.id?.toString?.() === messageData.userId?.toString?.();

      // If this chat is open and message is from the other user, accept it even if roomId wasn't set yet
      if (
        (currentRoom && incomingRoomId === currentRoom) ||
        (!currentRoom && fromOtherUser)
      ) {
        if (!currentRoom && incomingRoomId) {
          setRoomId(incomingRoomId);
          if (socketService.isConnected() && user?.id) {
            socketService.joinRoom(incomingRoomId, user.id);
          }
        }
        const formattedMessage = {
          id: Math.random().toString(),
          roomId: incomingRoomId || currentRoom,
          text: messageData.message,
          time: messageData.createdAt || new Date().toISOString(),
          user: {
            id: messageData.userId?.toString(),
            name: messageData.name || 'User',
          },
        };
        dispatch(addMessage(formattedMessage));
      }
    };

    const attachGeneralListeners = () => {
      if (!socketService.socket) return;
      socketService.socket.on('roomMessageDeliver', handleNewMessage);
      socketService.socket.on(
        'errorInRoomMessage',
        (_err: any) =>
          // console.warn('errorInRoomMessage', _err),
          void 0,
      );
      socketService.socket.on(
        'joiningRoomError',
        (_err: any) =>
          // console.warn('joiningRoomError', _err),
          void 0,
      );
      socketService.socket.on(
        'mapUserError',
        (_err: any) =>
          // console.warn('mapUserError', _err),
          void 0,
      );
    };

    // Attach now if possible
    attachGeneralListeners();

    // Also attach after connect if socket wasn't ready yet
    const onConnect = () => setTimeout(attachGeneralListeners, 0);
    if (socketService.socket) {
      socketService.socket.on('connect', onConnect);
    }

    return () => {
      if (socketService.socket) {
        socketService.socket.off('roomMessageDeliver', handleNewMessage);
        socketService.socket.off('errorInRoomMessage');
        socketService.socket.off('joiningRoomError');
        socketService.socket.off('mapUserError');
        socketService.socket.off('connect', onConnect);
      }
    };
  }, [roomId, user?.id, dispatch, otherUser?.id]);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const renderItem = useCallback(
    ({item, index}: {item: any; index: number}) => {
      // reversedMessages is newest -> oldest. The first message of a day (chronologically) will be
      // where the NEXT item (older) has a different day. So compare with next item.
      const nextMessage = reversedMessages[index + 1];
      const showDate =
        !nextMessage ||
        formatDate(new Date(item.time)) !==
          formatDate(new Date(nextMessage.time));

      return (
        <View>
          {showDate && (
            <View style={styles.dateSeparator}>
              <Text style={styles.dateText}>
                {formatDate(new Date(item.time))}
              </Text>
            </View>
          )}
          <MessageBubble
            message={{...item, time: formatTime(new Date(item.time))}}
            isSender={String(item?.user?.id) === String(user?.id)}
          />
        </View>
      );
    },
    [user?.id, reversedMessages],
  );

  const loadMoreMessages = async () => {
    if (hasMore && !isFetchingMore && roomId) {
      setIsFetchingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchMore(roomId, nextPage);
    }
  };

  useEffect(() => {
    Animated.timing(scrollButtonAnimation, {
      toValue: showScrollDown ? 1 : 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [showScrollDown]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={
          Platform.select({ios: 0, android: 0}) as number
        }>
        <AppHeader
          user={{
            name: otherUser.name,
            avatar:
              (otherUser as any)?.profilePic ||
              (otherUser as any)?.avatar ||
              '',
            online: otherOnline,
          }}
          backIcon={() => {
            navigation.navigate('Chat');
          }}
        />
        <SafeAreaView style={styles.contentContainer}>
          <InfoBanner text="This chat room will automatically lock 30 minutes after it starts. Make sure to discuss everything you need before time runs out." />
          {isLoading ? (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color={colors.iosBlue}
            />
          ) : (
            <FlatList
              ref={listRef}
              data={reversedMessages}
              keyExtractor={item => `msg-${item.id}`}
              renderItem={renderItem}
              inverted
              contentContainerStyle={styles.messagesContainer}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={21}
              onEndReached={loadMoreMessages}
              showsHorizontalScrollIndicator={true}
              onEndReachedThreshold={0.5}
              removeClippedSubviews={true}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              onScroll={e => {
                // In inverted list: bottom == offset 0. Show button when far from bottom
                const y = e.nativeEvent.contentOffset.y;
                setShowScrollDown(y > 300);
              }}
              scrollEventThrottle={8}
              ListFooterComponent={
                isFetchingMore ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.iosBlue}
                    style={{marginVertical: 10}}
                  />
                ) : null
              }
            />
          )}
          <Animated.View
            style={[
              styles.scrollToBottomBtn,
              {
                opacity: scrollButtonAnimation,
                transform: [
                  {
                    scale: scrollButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}>
            <TouchableOpacity
              onPress={() =>
                listRef.current?.scrollToOffset({offset: 0, animated: true})
              }
              style={styles.touchableContent}
              activeOpacity={0.8}>
              <ThemedIcon name="keyboard-arrow-down" color="white" />
            </TouchableOpacity>
          </Animated.View>
          {/* Dedicated Call UI is now a separate screen; no call UI is rendered inside ChatScreen. */}
          {/* Floating Call Button (Dial/End) */}
          <View style={styles.callButtonsWrapper}>
            {(() => {
              const meId = user?.id != null ? String(user.id) : '';
              const otherId = otherUser?.id != null ? String(otherUser.id) : '';
              const canEnd =
                ['dialing', 'ringing', 'connecting', 'in_call'].includes(
                  (call as any)?.status,
                ) &&
                ((call as any)?.peerUserId
                  ? String((call as any)?.peerUserId) === otherId
                  : true);
              if (canEnd && roomId && meId && otherId) {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      dispatch(
                        endCallThunk({
                          meId,
                          otherId,
                          roomId: String(roomId),
                        }) as any,
                      )
                    }
                    style={[styles.fab, styles.fabEnd]}
                    activeOpacity={0.85}>
                    <ThemedIcon name="call-end" color="white" />
                  </TouchableOpacity>
                );
              }
              if (roomId && meId && otherId) {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      dispatch(
                        startCallThunk({
                          meId,
                          otherId,
                          roomId: String(roomId),
                          type: 'audio',
                        }) as any,
                      )
                    }
                    style={[styles.fab, styles.fabCall]}
                    activeOpacity={0.85}>
                    <ThemedIcon name="call" color="white" />
                  </TouchableOpacity>
                );
              }
              return null;
            })()}
          </View>
          <ChatInput
            onSend={text => {
              if (roomId && user) {
                const safeMessage = (text ?? '').trim();
                const safeName =
                  (user as any)?.name ||
                  (user as any)?.User?.name ||
                  (user as any)?.fullName ||
                  'User';
                const userId = user.id;

                if (!userId || !roomId || !safeMessage || !safeName) {
                  // console.warn('Blocked send: missing fields', { hasUserId: !!userId, hasRoomId: !!roomId, hasMessage: !!safeMessage, hasName: !!safeName });
                  return;
                }
                // Use thunk for sending
                dispatch(
                  sendChatMessage({
                    roomId: String(roomId),
                    meId: String(user.id),
                    name: safeName,
                    text: safeMessage,
                  }),
                );
              }
            }}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    backgroundColor: colors.grayE1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: colors.gray555,
    overflow: 'hidden',
  },
  scrollToBottomBtn: {
    position: 'absolute',
    left: 16,
    bottom: 100,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.iosBlue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
  },
  touchableContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonsWrapper: {
    position: 'absolute',
    right: 16,
    bottom: 100,
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
  },
  fabCall: {
    backgroundColor: colors.green2,
  },
  fabEnd: {
    backgroundColor: colors.dangerRed,
  },
});

export default ChatScreen;
