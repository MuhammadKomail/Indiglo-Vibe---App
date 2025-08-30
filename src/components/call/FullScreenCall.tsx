import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  acceptCall as acceptCallThunk,
  rejectCall as rejectCallThunk,
  endCall as endCallThunk,
} from '../../redux/actions/callAction/callAction';
import {webrtcService} from '../../services/webrtc';
import CallWaveAvatar from './CallWaveAvatar';
import {showToast} from '../../utils/toast';
import colors from '../../styles/colors';

let RTCView: any = null;
try {
  RTCView = require('react-native-webrtc').RTCView;
} catch {
  void 0;
}

type Props = {peerName?: string; peerAvatar?: string};

const FullScreenCall: React.FC<Props> = ({peerName, peerAvatar}) => {
  const dispatch = useAppDispatch();
  const call = useAppSelector((s: any) => s.call);
  const {user} = useAppSelector((s: any) => s.auth);
  const insets = useSafeAreaInsets();

  const [tick, setTick] = useState(0);
  const intervalRef = useRef<any>(null);
  const lastAlertedStatusRef = useRef<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false); // UI state only; audio routing depends on platform-specific lib

  const meId = user?.id != null ? String(user.id) : '';
  const otherId = call?.peerUserId ? String(call.peerUserId) : '';
  const roomId = call?.roomId ? String(call.roomId) : '';

  const incoming = (call as any)?.incoming;
  const users = useAppSelector((s: any) => s.chat?.users);
  const chatListItems = useAppSelector((s: any) => s.chat?.chatListItems);
  // Resolve peer info from Redux if props are missing
  const resolvedPeerId = incoming?.fromUserId
    ? String(incoming.fromUserId)
    : call?.peerUserId
      ? String(call.peerUserId)
      : '';
  const peerFromList = Array.isArray(users)
    ? users.find((u: any) => String(u?.id) === resolvedPeerId)
    : null;
  const peerFromChatListById = Array.isArray(chatListItems)
    ? chatListItems.find(
        (it: any) => String(it?.otherUser?.id) === resolvedPeerId,
      )?.otherUser
    : null;
  const peerFromChatListByRoom = Array.isArray(chatListItems)
    ? chatListItems.find((it: any) => String(it?.roomId) === String(roomId))
        ?.otherUser
    : null;
  const peerCandidate =
    peerFromList || peerFromChatListById || peerFromChatListByRoom || null;
  const resolvedName =
    (incoming?.fromUserName as string | undefined) ||
    (call?.peerName as string | undefined) ||
    peerName ||
    peerCandidate?.name ||
    peerCandidate?.User?.name ||
    peerCandidate?.fullName ||
    peerCandidate?.username ||
    undefined;
  const resolvedAvatar =
    (incoming?.fromUserAvatar as string | undefined) ||
    (call?.peerAvatar as string | undefined) ||
    peerAvatar ||
    peerCandidate?.avatar ||
    peerCandidate?.profilePic ||
    peerCandidate?.profileImage ||
    peerCandidate?.photoURL ||
    undefined;
  const displayName =
    resolvedName || (resolvedPeerId ? `User ${resolvedPeerId}` : 'Audio call');
  // Show overlay for all active states, but start timer only when connecting/in_call
  const isVisible = ['dialing', 'ringing', 'connecting', 'in_call'].includes(
    call?.status,
  );
  const isCounting = ['connecting', 'in_call'].includes(call?.status);
  const isVideo = call?.type === 'video' && !!RTCView;

  // Timer: start after acceptance (connecting/in_call)
  useEffect(() => {
    if (!isCounting) {
      setTick(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = setInterval(() => setTick(t => t + 1), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isCounting, call?.status]);

  // Toasts for terminal states
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
      setTimeout(() => {
        lastAlertedStatusRef.current = null;
      }, 1200);
    }
  }, [call?.status]);

  // Mute handling (toggle audio track enabled)
  useEffect(() => {
    const stream = webrtcService.getLocalStream?.();
    try {
      stream?.getAudioTracks?.().forEach((t: any) => {
        t.enabled = !muted;
      });
    } catch {
      void 0;
    }
  }, [muted]);

  // Start/stop audio session
  useEffect(() => {
    if (isVisible) {
      // Ensure proper audio session during call
      try {
        InCallManager.start({media: isVideo ? 'video' : 'audio'});
        InCallManager.setKeepScreenOn(true);
      } catch {
        void 0;
      }
    }
    return () => {
      // Stop on unmount or when UI hides
      try {
        InCallManager.setForceSpeakerphoneOn(false);
        InCallManager.stop();
      } catch {
        void 0;
      }
    };
  }, [isVisible, isVideo]);

  // Re-apply speaker route on toggle or when call status changes (some stacks reset routing)
  useEffect(() => {
    try {
      InCallManager.setForceSpeakerphoneOn(!!speaker);
    } catch {
      void 0;
    }
    try {
      webrtcService.setSpeakerphone?.(!!speaker);
    } catch {
      void 0;
    }
  }, [speaker, call?.status]);

  const timeText = useMemo(() => {
    const s = tick % 60;
    const m = Math.floor(tick / 60) % 60;
    const h = Math.floor(tick / 3600);
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }, [tick]);

  if (!isVisible) return null;

  const local = webrtcService.getLocalStream?.();
  const remote = webrtcService.getRemoteStream?.();

  const onAccept = () => {
    if (!incoming || !meId) return;
    dispatch(
      acceptCallThunk({
        meId,
        otherId: String(incoming.fromUserId),
        roomId: String(incoming.roomId),
      }) as any,
    );
  };

  const onReject = () => {
    if (!incoming || !meId) return;
    dispatch(
      rejectCallThunk({
        meId,
        otherId: String(incoming.fromUserId),
        roomId: String(incoming.roomId),
        reason: 'declined',
      }) as any,
    );
  };

  const onEnd = () => {
    if (meId && otherId && roomId) {
      dispatch(endCallThunk({meId, otherId, roomId}) as any);
    }
  };

  return (
    <View style={styles.overlay}>
      {/* Top status */}
      <View style={styles.header}>
        <Text style={styles.statusText}>
          {call.status === 'dialing' && 'Calling...'}
          {call.status === 'ringing' && 'Ringing...'}
          {call.status === 'connecting' && 'Connecting...'}
          {call.status === 'in_call' && `On call ${timeText}`}
        </Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {isVideo ? (
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
          </View>
        ) : (
          <View style={styles.audioArea}>
            <CallWaveAvatar
              avatarUrl={resolvedAvatar}
              active={['dialing', 'ringing', 'in_call'].includes(call.status)}
              size={120}
            />
            <Text style={styles.peerName}>{displayName}</Text>
            {/* Time pill (only after acceptance) */}
            {(call.status === 'connecting' || call.status === 'in_call') && (
              <View style={styles.timePill}>
                <Text style={styles.timePillText}>{timeText}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Controls */}
      <View
        style={[
          styles.controls,
          {paddingBottom: Math.max(24, insets.bottom + 16)},
        ]}>
        {call.status === 'ringing' && incoming ? (
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.ctrlBtn, styles.reject, styles.rowItem]}
              activeOpacity={0.9}
              onPress={onReject}>
              <Text style={styles.ctrlText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctrlBtn, styles.accept, styles.rowItem]}
              activeOpacity={0.9}
              onPress={onAccept}>
              <Text style={styles.ctrlText}>Accept</Text>
            </TouchableOpacity>
          </View>
        ) : call.status === 'ringing' && !incoming ? (
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.ctrlBtn, styles.hangup, styles.rowItem]}
              activeOpacity={0.9}
              onPress={onEnd}>
              <Text style={styles.ctrlText}>End</Text>
            </TouchableOpacity>
          </View>
        ) : call.status === 'dialing' ? (
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.ctrlBtn, styles.hangup, styles.rowItem]}
              activeOpacity={0.9}
              onPress={onEnd}>
              <Text style={styles.ctrlText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : call.status === 'connecting' || call.status === 'in_call' ? (
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.smallBtn,
                styles.rowItem,
                muted ? styles.smallBtnActive : null,
              ]}
              activeOpacity={0.85}
              onPress={() => setMuted(m => !m)}>
              <Text style={styles.smallBtnText}>
                {muted ? 'Unmute' : 'Mute'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.smallBtn,
                styles.rowItem,
                speaker ? styles.smallBtnActive : null,
              ]}
              activeOpacity={0.85}
              onPress={() => setSpeaker(s => !s)}>
              <Text style={styles.smallBtnText}>Speaker</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctrlBtn, styles.hangup, styles.rowItem]}
              activeOpacity={0.9}
              onPress={onEnd}>
              <Text style={styles.ctrlText}>End</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black0a,
  },
  header: {paddingTop: 60, alignItems: 'center'},
  statusText: {color: colors.white, fontSize: 16, fontWeight: '600'},
  body: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  audioArea: {alignItems: 'center'},
  peerName: {
    color: colors.white,
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  timePill: {
    marginTop: 16,
    backgroundColor: colors.overlayWhite25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timePillText: {color: colors.white, fontWeight: '700'},
  videoArea: {flex: 1, width: '100%'},
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
  controls: {alignItems: 'center'},
  row: {flexDirection: 'row', alignItems: 'center'},
  rowItem: {marginHorizontal: 6},
  ctrlBtn: {paddingHorizontal: 28, paddingVertical: 12, borderRadius: 28},
  accept: {backgroundColor: colors.green2},
  reject: {backgroundColor: colors.dangerRed},
  hangup: {backgroundColor: colors.dangerRed},
  ctrlText: {color: colors.white, fontWeight: '700'},
  smallBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: colors.overlayWhite15,
  },
  smallBtnActive: {backgroundColor: colors.overlayWhite35},
  smallBtnText: {color: colors.white, fontWeight: '600'},
});

export default FullScreenCall;
