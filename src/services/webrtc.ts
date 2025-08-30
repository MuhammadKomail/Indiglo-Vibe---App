import {Platform} from 'react-native';
import socketService from './socketService';
// Avoid eager importing the store to prevent init-time circular deps
import {
  setAccepted,
  setInCall,
  setEnded,
} from '../redux/slices/callSlice/callSlice';
let appStore: any;
const dispatchSafe = (action: any) => {
  try {
    if (!appStore) {
      appStore = require('../redux/store').store;
    }
    appStore?.dispatch?.(action);
  } catch {
    // swallow; can occur very early during cold start
  }
};

// Lazy import to avoid breaking if dependency not yet installed at dev-time.
let RTCPeerConnectionCtor: any;
let RTCSessionDescriptionCtor: any;
let RTCIceCandidateCtor: any;
let mediaDevicesRef: any;
let InCallManager: any;

try {
  const m = require('react-native-webrtc');
  RTCPeerConnectionCtor = m.RTCPeerConnection;
  RTCSessionDescriptionCtor = m.RTCSessionDescription;
  RTCIceCandidateCtor = m.RTCIceCandidate;
  mediaDevicesRef = m.mediaDevices;
} catch {
  // Dependency not installed yet; functions will no-op safely
  void 0;
  // console.log(
  //   'react-native-webrtc not available yet. Install it to enable media.',
  // );
}

try {
  InCallManager = require('react-native-incall-manager');
} catch {
  // optional; if not available we still proceed
  void 0;
}

export type CreateConfig = {
  iceServers?: Array<{
    urls: string | string[];
    username?: string;
    credential?: string;
  }>;
};

class WebRTCService {
  pc: any | null = null;
  localStream: any | null = null;
  remoteStream: any | null = null;
  currentRoomId: string | null = null;
  peerUserId: string | null = null;
  pendingOffer: any | null = null;

  async ensureSetup(
    roomId: string,
    peerUserId: string,
    audioOnly: boolean = true,
    config?: CreateConfig,
  ) {
    if (!RTCPeerConnectionCtor || !mediaDevicesRef) return;
    this.currentRoomId = roomId;
    this.peerUserId = peerUserId;

    if (!this.pc) {
      this.pc = new RTCPeerConnectionCtor({
        iceServers: config?.iceServers ?? [
          {urls: ['stun:stun.l.google.com:19302']},
        ],
      } as any);
      this.pc.onicecandidate = (event: any) => {
        const cand = event?.candidate;
        if (cand && this.currentRoomId && this.peerUserId) {
          socketService.sendIceCandidate({
            toUserId: String(this.peerUserId),
            roomId: String(this.currentRoomId),
            candidate: cand,
          });
        }
      };
      this.pc.onconnectionstatechange = () => {
        const state = this.pc?.connectionState;
        if (state === 'connected') {
          dispatchSafe(setInCall());
        } else if (
          state === 'failed' ||
          state === 'disconnected' ||
          state === 'closed'
        ) {
          dispatchSafe(setEnded());
        }
      };
      this.pc.ontrack = (event: any) => {
        try {
          this.remoteStream = event.streams?.[0] || this.remoteStream;
        } catch {
          void 0;
        }
      };
    }

    if (!this.localStream) {
      const constraints: any = {
        audio: true,
        video: audioOnly ? false : {facingMode: 'user'},
      };
      this.localStream = await mediaDevicesRef.getUserMedia(constraints);
      this.localStream
        .getTracks()
        .forEach((track: any) => this.pc?.addTrack(track, this.localStream));
      // Start audio session
      try {
        InCallManager?.start?.({media: 'audio', ringback: '_DEFAULT_'});
        InCallManager?.setKeepScreenOn?.(true);
        if (Platform.OS === 'android') {
          // Try both boolean and string forms for broader device coverage
          try {
            InCallManager?.setForceSpeakerphoneOn?.(false);
          } catch {
            void 0;
          }
          try {
            InCallManager?.setForceSpeakerphoneOn?.('off');
          } catch {
            void 0;
          }
        }
        InCallManager?.setSpeakerphoneOn?.(false);
      } catch {
        void 0;
      }
    }
  }

  getLocalStream() {
    return this.localStream;
  }
  getRemoteStream() {
    return this.remoteStream;
  }

  async startOffer(
    roomId: string,
    peerUserId: string,
    audioOnly: boolean = true,
  ) {
    if (!RTCPeerConnectionCtor) return;
    await this.ensureSetup(roomId, peerUserId, audioOnly);
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    socketService.sendOffer({
      toUserId: String(peerUserId),
      roomId: String(roomId),
      sdp: offer,
    });
  }

  async handleRemoteOffer(data: any) {
    // Do NOT auto-answer. Store as pending until user accepts.
    try {
      this.pendingOffer = data;
    } catch {
      void 0;
    }
  }

  async acceptPendingOffer() {
    if (!RTCPeerConnectionCtor) return;
    const data = this.pendingOffer;
    if (!data) return;
    const roomId = String(data?.roomId ?? '');
    const fromUserId = String(data?.fromUserId ?? data?.callerId ?? '');
    await this.ensureSetup(roomId, fromUserId, true);
    await this.pc.setRemoteDescription(
      new RTCSessionDescriptionCtor(data?.sdp),
    );
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    socketService.sendAnswer({toUserId: fromUserId, roomId, sdp: answer});
    dispatchSafe(setAccepted());
    this.pendingOffer = null;
  }

  async handleRemoteAnswer(data: any) {
    if (!RTCPeerConnectionCtor) return;
    await this.pc?.setRemoteDescription(
      new RTCSessionDescriptionCtor(data?.sdp),
    );
    dispatchSafe(setAccepted());
  }

  async handleRemoteIce(data: any) {
    if (!RTCPeerConnectionCtor) return;
    try {
      const cand = new RTCIceCandidateCtor(data?.candidate);
      await this.pc?.addIceCandidate(cand);
    } catch {
      void 0;
      // console.log('Failed to add ICE', e);
    }
  }

  async end() {
    try {
      this.localStream?.getTracks?.().forEach((t: any) => t.stop?.());
    } catch {
      void 0;
    }
    try {
      this.pc?.getSenders?.().forEach((s: any) => s.track && s.track.stop?.());
    } catch {
      void 0;
    }
    try {
      this.pc?.close?.();
    } catch {
      void 0;
    }
    this.pc = null;
    this.localStream = null;
    this.remoteStream = null;
    this.currentRoomId = null;
    this.peerUserId = null;
    try {
      InCallManager?.setSpeakerphoneOn?.(false);
      InCallManager?.setKeepScreenOn?.(false);
      if (Platform.OS === 'android') {
        try {
          InCallManager?.setForceSpeakerphoneOn?.(false);
        } catch {
          void 0;
        }
        try {
          InCallManager?.setForceSpeakerphoneOn?.('off');
        } catch {
          void 0;
        }
      }
      InCallManager?.stop?.();
    } catch {
      void 0;
    }
  }

  setSpeakerphone(on: boolean) {
    try {
      if (Platform.OS === 'android') {
        // setForceSpeakerphoneOn handles routing on Android better
        try {
          InCallManager?.setForceSpeakerphoneOn?.(on);
        } catch {
          void 0;
        }
        try {
          InCallManager?.setForceSpeakerphoneOn?.(on ? 'on' : 'off');
        } catch {
          void 0;
        }
      }
      InCallManager?.setSpeakerphoneOn?.(on);
    } catch {
      void 0;
    }
  }
}

export const webrtcService = new WebRTCService();

// Wire socket events to webrtc service
(function attachSocket() {
  try {
    socketService.onRtcOffer(async (data: any) => {
      try {
        await webrtcService.handleRemoteOffer(data);
      } catch {
        void 0; /* ignore */
      }
    });
    socketService.onRtcAnswer(async (data: any) => {
      try {
        await webrtcService.handleRemoteAnswer(data);
      } catch {
        void 0; /* ignore */
      }
    });
    socketService.onRtcIce(async (data: any) => {
      try {
        await webrtcService.handleRemoteIce(data);
      } catch {
        void 0; /* ignore */
      }
    });
  } catch {
    void 0;
  }
})();
