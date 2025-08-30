import io from 'socket.io-client';
import {AppState, AppStateStatus} from 'react-native';
import {store} from '../redux/store';
import {fetchUsersSuccess} from '../redux/slices/chatSlice/chatSlice';
import {CHAT_API_BASE_URL, chatApi} from './api';
import NetInfo from '@react-native-community/netinfo';

class SocketService {
  socket: any;
  reconnectAttempts: number = 0;
  maxReconnectAttempts: number = 10; // Increased max attempts
  reconnectTimer: any = null;
  userId: string = '';
  isNetworkAvailable: boolean = true;
  netInfoUnsubscribe: any = null;
  // Presence
  heartbeatTimer: any = null;
  appStateSub: any = null;
  lastAppState: AppStateStatus = AppState.currentState;

  constructor() {
    // Start monitoring network status
    this.setupNetworkMonitoring();
  }

  // ====== Call Signaling (Client APIs) ======
  private callListeners: {
    incomingCall?: (data: any) => void;
    callRinging?: (data: any) => void;
    callAccepted?: (data: any) => void;
    callRejected?: (data: any) => void;
    callEnded?: (data: any) => void;
    rtcOffer?: (data: any) => void;
    rtcAnswer?: (data: any) => void;
    rtcIce?: (data: any) => void;
  } = {};

  private setupCallListeners() {
    if (!this.socket) return;
    // Remove existing listeners to avoid duplicates after reconnect
    try {
      this.socket.off('incomingCall');
      this.socket.off('callRinging');
      this.socket.off('callAccepted');
      this.socket.off('callRejected');
      this.socket.off('callEnded');
      this.socket.off('callCancelled');
      this.socket.off('callCanceled');
      this.socket.off('cancelCall');
      this.socket.off('hangup');
      this.socket.off('endCall');
      this.socket.off('rtc:offer');
      this.socket.off('rtc:answer');
      this.socket.off('rtc:ice-candidate');
    } catch {
      void 0;
    }

    this.socket.on('incomingCall', (data: any) =>
      this.callListeners.incomingCall?.(data),
    );
    this.socket.on('callRinging', (data: any) =>
      this.callListeners.callRinging?.(data),
    );
    this.socket.on('callAccepted', (data: any) =>
      this.callListeners.callAccepted?.(data),
    );
    this.socket.on('callRejected', (data: any) =>
      this.callListeners.callRejected?.(data),
    );
    this.socket.on('callEnded', (data: any) =>
      this.callListeners.callEnded?.(data),
    );
    // Some backends emit different names when caller cancels; treat all as 'callEnded'
    this.socket.on('callCancelled', (data: any) =>
      this.callListeners.callEnded?.(data),
    );
    this.socket.on('callCanceled', (data: any) =>
      this.callListeners.callEnded?.(data),
    );
    this.socket.on('cancelCall', (data: any) =>
      this.callListeners.callEnded?.(data),
    );
    this.socket.on('hangup', (data: any) =>
      this.callListeners.callEnded?.(data),
    );
    this.socket.on('endCall', (data: any) =>
      this.callListeners.callEnded?.(data),
    );
    this.socket.on('rtc:offer', (data: any) =>
      this.callListeners.rtcOffer?.(data),
    );
    this.socket.on('rtc:answer', (data: any) =>
      this.callListeners.rtcAnswer?.(data),
    );
    this.socket.on('rtc:ice-candidate', (data: any) =>
      this.callListeners.rtcIce?.(data),
    );
  }

  // Listener registration helpers
  onIncomingCall(cb: (data: any) => void) {
    this.callListeners.incomingCall = cb;
  }
  onCallRinging(cb: (data: any) => void) {
    this.callListeners.callRinging = cb;
  }
  onCallAccepted(cb: (data: any) => void) {
    this.callListeners.callAccepted = cb;
  }
  onCallRejected(cb: (data: any) => void) {
    this.callListeners.callRejected = cb;
  }
  onCallEnded(cb: (data: any) => void) {
    this.callListeners.callEnded = cb;
  }
  onRtcOffer(cb: (data: any) => void) {
    this.callListeners.rtcOffer = cb;
  }
  onRtcAnswer(cb: (data: any) => void) {
    this.callListeners.rtcAnswer = cb;
  }
  onRtcIce(cb: (data: any) => void) {
    this.callListeners.rtcIce = cb;
  }

  // Emit helpers
  startCall(params: {
    toUserId: string;
    roomId: string;
    type?: 'audio' | 'video';
  }) {
    if (!this.socket || !this.userId) return;
    this.socket.emit('initiateCall', {
      fromUserId: this.userId,
      toUserId: params.toUserId,
      roomId: params.roomId,
      type: params.type || 'audio',
    });
  }

  cancelCall(params: {toUserId: string; roomId: string}) {
    if (!this.socket || !this.userId) return;
    this.socket.emit('cancelCall', {
      fromUserId: this.userId,
      toUserId: params.toUserId,
      roomId: params.roomId,
    });
  }

  acceptCall(params: {fromUserId: string; roomId: string}) {
    if (!this.socket || !this.userId) return;
    // here this.userId is callee, fromUserId is caller
    this.socket.emit('acceptCall', {
      fromUserId: this.userId,
      toUserId: params.fromUserId,
      roomId: params.roomId,
    });
  }

  rejectCall(params: {
    fromUserId: string;
    roomId: string;
    reason?: 'declined' | 'busy';
  }) {
    if (!this.socket || !this.userId) return;
    this.socket.emit('rejectCall', {
      fromUserId: this.userId,
      toUserId: params.fromUserId,
      roomId: params.roomId,
      reason: params.reason || 'declined',
    });
  }

  endCall(params: {otherUserId: string; roomId: string}) {
    if (!this.socket || !this.userId) return;
    this.socket.emit('endCall', {
      fromUserId: this.userId,
      toUserId: params.otherUserId,
      roomId: params.roomId,
    });
  }

  sendOffer(params: {toUserId: string; roomId: string; sdp: any}) {
    if (!this.socket || !this.userId) return;
    this.socket.emit('rtc:offer', {
      fromUserId: this.userId,
      toUserId: params.toUserId,
      roomId: params.roomId,
      sdp: params.sdp,
    });
  }

  sendAnswer(params: {toUserId: string; roomId: string; sdp: any}) {
    if (!this.socket || !this.userId) return;
    this.socket.emit('rtc:answer', {
      fromUserId: this.userId,
      toUserId: params.toUserId,
      roomId: params.roomId,
      sdp: params.sdp,
    });
  }

  sendIceCandidate(params: {toUserId: string; roomId: string; candidate: any}) {
    if (!this.socket || !this.userId) return;
    this.socket.emit('rtc:ice-candidate', {
      fromUserId: this.userId,
      toUserId: params.toUserId,
      roomId: params.roomId,
      candidate: params.candidate,
    });
  }

  // Ensure a callback runs once when the socket is connected.
  // If already connected, run immediately. If socket not yet created,
  // create it and attach the listener once the instance exists.
  onConnectOnce(userId: string | undefined, cb: () => void) {
    if (this.isConnected()) {
      cb();
      return;
    }
    if (userId) {
      this.userId = String(userId);
    }
    if (!this.socket) {
      this.initializeSocket();
    }
    const start = Date.now();
    const attach = () => {
      if (this.socket) {
        this.socket.once('connect', cb);
      } else if (Date.now() - start < 3000) {
        setTimeout(attach, 50);
      } else {
        // console.warn('onConnectOnce: socket instance not available in time');
      }
    };
    attach();
  }

  setupNetworkMonitoring() {
    // Subscribe to network info updates
    this.netInfoUnsubscribe = NetInfo.addEventListener(state => {
      const wasConnected = this.isNetworkAvailable;
      this.isNetworkAvailable = state.isConnected || false;

      // console.log(
      //   'Network status changed:',
      //   this.isNetworkAvailable ? 'Connected' : 'Disconnected',
      // );

      // If we just got network back and we have a userId, try to reconnect
      if (!wasConnected && this.isNetworkAvailable && this.userId) {
        // console.log('Network restored, attempting to reconnect...');
        this.reconnectAttempts = 0; // Reset attempts on network restore
        this.reconnect();
      }
    });
  }

  connect(userId: string) {
    if (!userId) {
      // console.error('❌ Cannot connect without userId');
      return;
    }

    this.userId = userId;

    // Check network status before attempting connection
    NetInfo.fetch().then(state => {
      this.isNetworkAvailable = state.isConnected || false;

      if (!this.isNetworkAvailable) {
        // console.log(
        //   '⚠️ No network connection available. Will connect when network is restored.',
        // );
        return;
      }

      this.initializeSocket();
    });
  }

  initializeSocket() {
    if (this.socket && this.socket.connected) {
      // console.log('Socket already connected, skipping connection');
      return;
    }

    // console.log('Attempting to connect to:', CHAT_API_BASE_URL);

    // Force close any existing socket before creating a new one
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    // Configure socket with improved options
    this.socket = io(CHAT_API_BASE_URL, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000, // Increased timeout
      transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
      forceNew: true, // Force a new connection
      query: {userId: this.userId}, // Send userId as a query parameter
    });

    this.socket.on('connect', () => {
      // console.log('✅ Socket connected successfully');
      this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      // console.log('📤 Emitting mapUser event with userId:', this.userId);
      this.socket.emit('mapUser', this.userId);
      this.fetchActiveUsers(); // Fetch active users on successful connection
      // Start presence tracking globally
      this.startPresenceTracking();
      // Attach call signaling listeners on each successful connect
      this.setupCallListeners();
    });

    // Add listeners for mapUser response
    this.socket.on('mapUserSuccess', (_data: any) => {
      // console.log('✅ mapUser successful:', data);
    });

    this.socket.on('mapUserError', (_data: any) => {
      // console.log('❌ mapUser error:', data);
    });

    this.socket.on('connect_error', (_error: any) => {
      // console.error('❌ Socket connection error:', error);
      this.handleConnectionError(_error);
    });

    this.socket.on('error', (_error: any) => {
      // console.error('❌ Socket error:', error);
      this.handleConnectionError(_error);
    });

    this.socket.on('disconnect', (_reason: any) => {
      // console.log('🔌 Socket disconnected:', reason);
      // Stop presence tracking on disconnect
      this.stopPresenceTracking();
      // If we were in a call, proactively inform the app to end the call locally.
      try {
        const state: any = store.getState?.();
        const callStatus: string | undefined = state?.call?.status;
        const isActiveCall = [
          'dialing',
          'ringing',
          'connecting',
          'connected',
          'in-call',
        ].includes(String(callStatus || ''));
        if (isActiveCall) {
          // Fire the existing callEnded pipeline so UI cleans up immediately
          this.callListeners.callEnded?.({reason: 'socket_disconnected'});
        }
      } catch {
        // console.log('disconnect -> call end handling error');
      }

      // Handle various disconnect reasons
      if (_reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect manually
        this.reconnect();
      } else if (_reason === 'transport close' || _reason === 'ping timeout') {
        // Transport closed or ping timeout, check network and reconnect
        this.checkNetworkAndReconnect();
      }
    });

    this.socket.on('reconnect', (_attemptNumber: number) => {
      // console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_error', (_error: any) => {
      // console.error('❌ Socket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      // console.error('❌ Socket reconnection failed after all attempts');
    });

    // Message delivery is handled in ChatScreen to apply room filtering and formatting

    this.socket.on('userJoined', (_data: any) => {
      // console.log('User joined:', data);
      this.fetchActiveUsers();
    });

    this.socket.on('userLeft', (_data: any) => {
      // console.log('User left:', data);
      this.fetchActiveUsers();
    });
  }

  checkNetworkAndReconnect() {
    NetInfo.fetch().then(state => {
      this.isNetworkAvailable = state.isConnected || false;

      if (this.isNetworkAvailable) {
        this.reconnect();
      } else {
        // console.log(
        //   '⚠️ Network unavailable, will reconnect when network is restored',
        // );
      }
    });
  }

  handleConnectionError(_error: any) {
    // If we've reached max reconnect attempts, stop trying
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      // console.log(
      //   '⚠️ Max reconnection attempts reached. Please check your network connection.',
      // );
      return;
    }

    // Check if network is available before attempting to reconnect
    this.checkNetworkAndReconnect();
  }

  reconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    // console.log(
    //   `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,
    // );

    // Exponential backoff for reconnection attempts
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000);

    this.reconnectTimer = setTimeout(() => {
      this.initializeSocket();
    }, delay);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
      this.netInfoUnsubscribe = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    // Ensure presence tracking fully stopped
    this.stopPresenceTracking();
  }

  sendMessage(message: any, ack?: (response: any) => void) {
    if (this.socket) {
      if (ack) {
        this.socket.emit('roomMessage', message, ack);
      } else {
        this.socket.emit('roomMessage', message);
      }
    }
  }

  joinRoom(roomId: string, joinUser: string) {
    if (this.socket) {
      this.socket.emit('joinRoom', {roomId, joinUser});
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  async fetchActiveUsers() {
    try {
      // console.log(
      //   '🔄 Fetching active users from:',
      //   `${CHAT_API_BASE_URL}/api/user/activeUsers`,
      // );
      const res = await chatApi.get('/api/user/activeUsers');
      // console.log('📡 Response status:', res.status);
      const data = res.data;
      // console.log('📦 Response data:', data);
      if (
        data.status === 'success' &&
        data.message &&
        Array.isArray(data.message.data)
      ) {
        store.dispatch(fetchUsersSuccess(data.message.data));
        // console.log('✅ Active users updated successfully');
      }
    } catch {
      // console.error('❌ Error fetching active users');
    }
  }

  setupUnreadCountListeners(dispatch: any) {
    if (!this.socket) {
      // console.log('❌ Socket not available for unread count listeners');
      return;
    }

    // console.log('🔧 Setting up unread count listeners');

    // Remove existing listeners to avoid duplicates
    this.socket.off('updateUnreadCount');
    this.socket.off('messagesRead');

    // Listen for real-time unread count updates
    this.socket.on('updateUnreadCount', (data: any) => {
      try {
        // console.log('🔔 Real-time unread count update received:', data);
        // Accept multiple backend shapes
        const rawOtherId =
          data?.senderId ??
          data?.fromUserId ??
          data?.otherUserId ??
          data?.userId ??
          data?.uid ??
          '';
        const otherId =
          rawOtherId !== undefined && rawOtherId !== null
            ? String(rawOtherId)
            : '';
        const rawCount = data?.unreadCount ?? data?.count ?? data?.unread ?? 0;
        const count = Number(rawCount) || 0;
        if (!otherId) return;
        dispatch({
          type: 'chat/setUnreadCount',
          payload: {userId: otherId, count},
        });
      } catch {
        // console.log('updateUnreadCount handler error');
      }
    });

    // Listen for messages read events
    this.socket.on('messagesRead', (data: any) => {
      try {
        // console.log('📖 Messages read event received:', data);
        // Backend may send who read whose messages; normalize to the "other user" from my perspective
        const rawOtherId =
          data?.otherUserId ??
          data?.senderId ??
          data?.readerId ??
          data?.userId ??
          '';
        const otherId =
          rawOtherId !== undefined && rawOtherId !== null
            ? String(rawOtherId)
            : '';
        if (!otherId) return;
        dispatch({
          type: 'chat/clearUnreadCount',
          payload: otherId,
        });
      } catch {
        // console.log('messagesRead handler error');
      }
    });

    // console.log('✅ Unread count listeners attached successfully');
  }

  // ===== Presence Tracking =====
  private startPresenceTracking() {
    // Avoid duplicates
    this.stopPresenceTracking();
    try {
      // Emit immediate current state
      const initial = this.mapRNState(this.lastAppState);
      this.safeEmitAppState(initial);
      // Subscribe to AppState changes
      this.appStateSub = AppState.addEventListener('change', nextState => {
        this.lastAppState = nextState;
        const mapped = this.mapRNState(nextState);
        this.safeEmitAppState(mapped);
      });
      // Heartbeat every 15s to avoid stale presence
      this.heartbeatTimer = setInterval(() => {
        this.safeEmitAppState(this.mapRNState(this.lastAppState));
      }, 15000);
    } catch {
      // console.log('startPresenceTracking error');
    }
  }

  private stopPresenceTracking() {
    try {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
      if (this.appStateSub && typeof this.appStateSub.remove === 'function') {
        this.appStateSub.remove();
      }
      this.appStateSub = null;
    } catch {
      void 0;
    }
  }

  private mapRNState(
    state: AppStateStatus,
  ): 'active' | 'background' | 'inactive' {
    return state === 'active'
      ? 'active'
      : state === 'background'
        ? 'background'
        : 'inactive';
  }

  private safeEmitAppState(mapped: 'active' | 'background' | 'inactive') {
    try {
      if (this.socket && this.userId) {
        this.socket.emit('appState', {userId: this.userId, state: mapped});
      }
    } catch {
      void 0;
    }
  }
}

const socketService = new SocketService();
export default socketService;
