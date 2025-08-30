import React, {useEffect, useMemo} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAppSelector} from '../../redux/store';
import FullScreenCall from '../../components/call/FullScreenCall';
import {View, StyleSheet, ImageBackground} from 'react-native';
import colors from '../../styles/colors';

// Route params from ChatScreen when navigating into a call
// peerName, peerAvatar are optional (fallback to slice values/UI defaults)

type RouteParams = {
  peerName?: string;
  peerAvatar?: string;
  peerUserId?: string;
  roomId?: string | number;
};

const CallScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = (route?.params ?? {}) as RouteParams;
  // console.log('params: ', params);

  const call = useAppSelector((s: any) => s.call);
  const users = useAppSelector((s: any) => s.chat.users);
  const chatListItems = useAppSelector((s: any) => s.chat.chatListItems);

  // Resolve peer id from: route params -> call slice -> undefined
  const peerId: string = useMemo(() => {
    if (params?.peerUserId) return String(params.peerUserId);
    if (call?.peerUserId) return String(call.peerUserId);
    return '';
  }, [params?.peerUserId, call?.peerUserId]);

  // Resolve from users[]
  const peerFromUsers = useMemo(() => {
    return Array.isArray(users)
      ? users.find((u: any) => String(u?.id) === peerId)
      : null;
  }, [users, peerId]);

  // Resolve from chatListItems using peerId or roomId
  const peerFromChatList = useMemo(() => {
    try {
      const arr = Array.isArray(chatListItems) ? chatListItems : [];
      const byPeer = peerId
        ? arr.find(
            (i: any) =>
              String(i?.otherUser?.id ?? i?.userId ?? i?.id) === String(peerId),
          )
        : null;
      if (byPeer) return byPeer?.otherUser || byPeer?.user || byPeer;
      const rid = call?.roomId
        ? String(call.roomId)
        : params?.roomId
          ? String((params as any).roomId)
          : '';
      if (rid) {
        const byRoom = arr.find((i: any) => String(i?.roomId ?? i?.id) === rid);
        return byRoom?.otherUser || byRoom?.user || byRoom || null;
      }
      return null;
    } catch {
      return null;
    }
  }, [chatListItems, peerId, call?.roomId, params]);

  const resolved = peerFromUsers || peerFromChatList || {};
  const fallbackName = useMemo(() => {
    const name =
      call?.incoming?.fromUserName ||
      call?.peerName ||
      params?.peerName ||
      resolved?.name ||
      resolved?.User?.name ||
      resolved?.fullName ||
      resolved?.username ||
      resolved?.displayName ||
      (peerId ? `User ${peerId}` : undefined);
    return name;
  }, [
    call?.incoming?.fromUserName,
    call?.peerName,
    params?.peerName,
    resolved,
    peerId,
  ]);

  const fallbackAvatar = useMemo(() => {
    return (
      call?.incoming?.fromUserAvatar ||
      call?.peerAvatar ||
      params?.peerAvatar ||
      resolved?.profilePic ||
      resolved?.avatar ||
      resolved?.profileImage ||
      resolved?.photoURL ||
      resolved?.image ||
      undefined
    );
  }, [
    call?.incoming?.fromUserAvatar,
    call?.peerAvatar,
    params?.peerAvatar,
    resolved,
  ]);

  // Auto-exit when call ends or fails
  useEffect(() => {
    if (
      !call?.status ||
      ['idle', 'ended', 'rejected', 'failed', 'busy'].includes(call.status)
    ) {
      // Prevent double back if already not focused on this screen
      try {
        navigation.goBack();
      } catch {
        void 0;
      }
    }
  }, [call?.status, navigation]);

  const bg = params?.peerAvatar || fallbackAvatar || undefined;
  // console.log('bg: ', bg);

  return (
    <View style={styles.container}>
      {bg ? (
        <ImageBackground source={{uri: bg}} style={styles.bg} blurRadius={20}>
          <FullScreenCall peerName={fallbackName} peerAvatar={fallbackAvatar} />
        </ImageBackground>
      ) : (
        <FullScreenCall peerName={fallbackName} peerAvatar={fallbackAvatar} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.black},
  bg: {flex: 1},
});

export default CallScreen;
