import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {
  acceptCall as acceptCallThunk,
  rejectCall as rejectCallThunk,
} from '../redux/actions/callAction/callAction';
import CallWaveAvatar from './call/CallWaveAvatar';
import {colors} from '../styles/style';

const IncomingCallModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const {incoming} = useAppSelector((s: any) => s.call);
  const {user} = useAppSelector((s: any) => s.auth);

  const visible = Boolean(incoming);
  if (!incoming) return null;

  const meId = user?.id != null ? String(user.id) : '';
  const otherId = String(incoming.fromUserId);
  const roomId = String(incoming.roomId);

  const users = useAppSelector((s: any) => s.chat?.users);
  const chatListItems = useAppSelector((s: any) => s.chat?.chatListItems);
  const peerFromList = Array.isArray(users)
    ? users.find((u: any) => String(u?.id) === otherId)
    : null;
  const peerFromChatListById = Array.isArray(chatListItems)
    ? chatListItems.find((it: any) => String(it?.otherUser?.id) === otherId)
        ?.otherUser
    : null;
  const peerFromChatListByRoom = Array.isArray(chatListItems)
    ? chatListItems.find((it: any) => String(it?.roomId) === String(roomId))
        ?.otherUser
    : null;
  const peerCandidate =
    peerFromList || peerFromChatListById || peerFromChatListByRoom || null;
  const resolvedName =
    incoming?.fromUserName ||
    peerCandidate?.name ||
    peerCandidate?.User?.name ||
    peerCandidate?.fullName ||
    peerCandidate?.username ||
    undefined;
  const resolvedAvatar =
    incoming?.fromUserAvatar ||
    peerCandidate?.avatar ||
    peerCandidate?.profilePic ||
    peerCandidate?.profileImage ||
    peerCandidate?.photoURL ||
    undefined;
  const displayName =
    resolvedName || (otherId ? `User ${otherId}` : 'Incoming call');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {incoming.type === 'video'
              ? 'Incoming Video Call'
              : 'Incoming Audio Call'}
          </Text>
          <View style={styles.centerArea}>
            <CallWaveAvatar avatarUrl={resolvedAvatar} active size={110} />
            <Text style={styles.name}>{displayName}</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, styles.reject]}
              onPress={() =>
                dispatch(
                  rejectCallThunk({
                    meId,
                    otherId,
                    roomId,
                    reason: 'declined',
                  }) as any,
                )
              }
              activeOpacity={0.85}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.accept]}
              onPress={() =>
                dispatch(acceptCallThunk({meId, otherId, roomId}) as any)
              }
              activeOpacity={0.85}>
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  centerArea: {alignItems: 'center', marginBottom: 16},
  name: {marginTop: 10, fontSize: 16, fontWeight: '700'},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  accept: {backgroundColor: colors.green2},
  reject: {backgroundColor: colors.dangerRed},
  btnText: {color: colors.white, fontWeight: '600'},
});

export default IncomingCallModal;
