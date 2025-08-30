import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {endCall as endCallThunk} from '../redux/actions/callAction/callAction';
import {webrtcService} from '../services/webrtc';
import CallWaveAvatar from './call/CallWaveAvatar';
import {showToast} from '../utils/toast';
import colors from '../styles/colors';

let RTCView: any = null;
// try {
// Optional dependency; if not installed, we fallback to non-video UI.

RTCView = require('react-native-webrtc').RTCView;
// } catch (e) {
//   RTCView = null;
// }

const CallOverlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const call = useAppSelector((s: any) => s.call);
  const {user} = useAppSelector((s: any) => s.auth);

  const [tick, setTick] = useState(0);
  const intervalRef = useRef<any>(null);
  const lastAlertedStatusRef = useRef<string | null>(null);

  const visible = ['connecting', 'in_call', 'dialing', 'ringing'].includes(
    call?.status,
  );
  const roomId = call?.roomId ? String(call.roomId) : '';
  const otherId = call?.peerUserId ? String(call.peerUserId) : '';
  const meId = user?.id != null ? String(user.id) : '';

  // Start/stop and reset timer with visibility and status transitions
  useEffect(() => {
    if (!visible) {
      setTick(0);
      return;
    }
    // Reset on new call start
    if (
      call.status === 'dialing' ||
      call.status === 'ringing' ||
      call.status === 'connecting'
    ) {
      setTick(0);
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setTick(t => t + 1), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, call?.status]);

  // One-time toasts for terminal/important statuses
  useEffect(() => {
    const st = call?.status;
    if (!st) return;
    if (st === lastAlertedStatusRef.current) return;
    if (['rejected', 'busy', 'failed', 'ended'].includes(st)) {
      lastAlertedStatusRef.current = st;
      if (st === 'rejected')
        showToast({type: 'warning', message: 'Call was rejected'});
      else if (st === 'busy')
        showToast({type: 'warning', message: 'User is busy'});
      else if (st === 'failed')
        showToast({type: 'danger', message: call?.error || 'Call failed'});
      else if (st === 'ended') showToast({type: 'info', message: 'Call ended'});
      // reset tracker after short delay to allow next call alerts
      setTimeout(() => {
        lastAlertedStatusRef.current = null;
      }, 1500);
    }
  }, [call?.status]);

  const timeText = useMemo(() => {
    const s = tick % 60;
    const m = Math.floor(tick / 60) % 60;
    const h = Math.floor(tick / 3600);
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }, [tick]);

  if (!visible) return null;

  const local = webrtcService.getLocalStream?.();
  const remote = webrtcService.getRemoteStream?.();
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
    peerCandidate?.name ||
    peerCandidate?.User?.name ||
    peerCandidate?.fullName ||
    peerCandidate?.username ||
    undefined;
  const resolvedAvatar =
    peerCandidate?.avatar ||
    peerCandidate?.profilePic ||
    peerCandidate?.profileImage ||
    peerCandidate?.photoURL ||
    undefined;
  const displayName =
    resolvedName || (otherId ? `User ${otherId}` : 'Audio call');

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.header}>
        <Text style={styles.statusText}>
          {call.status === 'dialing' && 'Calling...'}
          {call.status === 'ringing' && 'Ringing...'}
          {call.status === 'connecting' && 'Connecting...'}
          {call.status === 'in_call' && `On call ${timeText}`}
        </Text>
      </View>

      {/* Video area (optional) */}
      {RTCView && call.type === 'video' ? (
        <View style={styles.videoArea}>
          {remote ? (
            <RTCView
              streamURL={remote.toURL()}
              style={styles.remote}
              objectFit="cover"
            />
          ) : (
            <View style={[styles.remote, styles.placeholder]}>
              <Text style={styles.placeholderText}>Waiting for video...</Text>
            </View>
          )}
          {local ? (
            <RTCView
              streamURL={local.toURL()}
              style={styles.local}
              objectFit="cover"
            />
          ) : null}
          {/* Name overlay */}
          <View style={styles.nameOverlay}>
            <Text style={styles.nameOverlayText}>{displayName}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.audioArea}>
          <CallWaveAvatar
            avatarUrl={resolvedAvatar}
            active={['dialing', 'ringing', 'in_call'].includes(call.status)}
            size={110}
          />
          <Text style={styles.nameText}>{displayName}</Text>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.ctrlBtn, styles.hangup]}
          activeOpacity={0.9}
          onPress={() => {
            if (meId && otherId && roomId)
              dispatch(endCallThunk({meId, otherId, roomId}) as any);
          }}>
          <Text style={styles.ctrlText}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    backgroundColor: colors.overlay60,
  },
  header: {paddingTop: 60, alignItems: 'center'},
  statusText: {color: colors.white, fontSize: 16, fontWeight: '600'},
  videoArea: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  remote: {width: '100%', height: '100%'},
  local: {
    position: 'absolute',
    width: 120,
    height: 180,
    right: 16,
    bottom: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlayWhite10,
  },
  placeholderText: {color: colors.white},
  audioArea: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  nameText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  controls: {paddingBottom: 60, alignItems: 'center'},
  ctrlBtn: {
    backgroundColor: colors.dangerRed,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  hangup: {},
  ctrlText: {color: colors.white, fontWeight: '700'},
  nameOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nameOverlayText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: colors.overlay60,
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
});

export default CallOverlay;
