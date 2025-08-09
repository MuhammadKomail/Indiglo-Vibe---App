import React, {useRef, useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcConnection,
  IRtcEngineEventHandler,
} from 'react-native-agora';
import {ThemedIcon} from '../../components/ThemedIcon';

// 🔑 Replace with your real credentials
const appId = 'b7cfccb0e80642c689c945a667f7ba29';
const token =
  '007eJxTYPC9MPsek/7NrcWdYT8P5mffvaDIuC7mdqSWwzQ5eY1/9/cpMCSZJ6clJycZpFoYmJkYJZtZWCZbmpgmmpmZp5knJRpZPlzZk9EQyMgw18+RkZEBAkF8boaS1OIS54zEvLzUHAYGAJvJI2E=';
const channelName = 'testChannel';
const localUid = 0;

const VoiceCallScreen = () => {
  const agoraEngineRef = useRef<IRtcEngine>();
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [message, setMessage] = useState('');
  const [isSpeakerphoneEnabled, setIsSpeakerphoneEnabled] = useState(true);
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentView, setCurrentView] = useState('joinScreen'); // 'joinScreen', 'incomingCall', 'onCall'
  const [isTimeLimitModalVisible, setIsTimeLimitModalVisible] = useState(false);

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
    }
  };

  const setupAgora = async () => {
    if (Platform.OS === 'android') await getPermission();
    agoraEngineRef.current = createAgoraRtcEngine();
    await agoraEngineRef.current?.initialize({appId});
    setupListeners();
  };

  const eventHandler: IRtcEngineEventHandler = {
    onJoinChannelSuccess: () => {
      setMessage(`✅ Joined channel: ${channelName}`);
      setIsJoined(true);
    },
    onUserJoined: (_conn: RtcConnection, uid: number) => {
      setMessage(`👤 Remote user joined: ${uid}`);
      setRemoteUid(uid);
    },
    onUserOffline: (_conn: RtcConnection, uid: number) => {
      setMessage(`❌ Remote user left: ${uid}`);
      setRemoteUid(0);
    },
  };

  const setupListeners = () => {
    agoraEngineRef.current?.registerEventHandler(eventHandler);
  };

  const showIncomingCall = () => {
    setCurrentView('incomingCall');
  };

  const acceptCall = async () => {
    setCurrentView('onCall');
    join();
  };

  const rejectCall = () => {
    setCurrentView('joinScreen');
  };

  const join = async () => {
    agoraEngineRef.current?.joinChannel(token, channelName, localUid, {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishMicrophoneTrack: true,
      autoSubscribeAudio: true,
    });
  };

  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      setMessage('You left the channel');
      setCurrentView('joinScreen'); // Return to join screen after leaving call
    } catch (e) {
      return e;
      // console.log(e);
    }
  };

  const toggleSpeakerphone = () => {
    const newSpeakerphoneState = !isSpeakerphoneEnabled;
    agoraEngineRef.current?.setEnableSpeakerphone(newSpeakerphoneState);
    setIsSpeakerphoneEnabled(newSpeakerphoneState);
    setMessage(
      `🎤 Audio output switched to ${newSpeakerphoneState ? 'Speaker' : 'Earpiece'}`,
    );
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    agoraEngineRef.current?.muteLocalAudioStream(newMuteState);
    setIsMuted(newMuteState);
    setMessage(newMuteState ? '🎤 Muted' : '🎤 Unmuted');
  };

  useEffect(() => {
    setupAgora();
    return () => {
      agoraEngineRef.current?.unregisterEventHandler(eventHandler);
      agoraEngineRef.current?.release();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isJoined) {
      timer = setInterval(() => {
        setCallTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime === 10) {
            // 2 minutes
            setIsTimeLimitModalVisible(true);
          }
          return newTime;
        });
      }, 1000);
    } else {
      setCallTime(0);
      setIsTimeLimitModalVisible(false);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isJoined]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Render different views based on the current state
  if (currentView === 'joinScreen') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welcome to Agora Voice Call</Text>
        <TouchableOpacity style={styles.button} onPress={showIncomingCall}>
          <Text style={styles.buttonText}>Simulate Incoming Call</Text>
        </TouchableOpacity>
        <Text>{message}</Text>
      </SafeAreaView>
    );
  }

  if (currentView === 'incomingCall') {
    return (
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=2512&auto=format&fit=crop',
        }}
        style={styles.background}
        blurRadius={10}>
        <SafeAreaView style={styles.container_v2}>
          <View style={styles.callInfo}>
            <Text style={styles.callStatusText}>Incoming Call</Text>
            <Image
              source={{uri: 'https://randomuser.me/api/portraits/women/43.jpg'}}
              style={styles.avatar}
            />
            <Text style={styles.name}>Iris James</Text>
          </View>

          <View style={styles.incomingControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.acceptButton]}
              onPress={acceptCall}>
              <ThemedIcon name="call" size={30} color="#fff" />
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.cancelButton]}
              onPress={rejectCall}>
              <ThemedIcon name="call-end" size={30} color="#fff" />
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (currentView === 'onCall') {
    return (
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=2512&auto=format&fit=crop',
        }}
        style={styles.background}
        blurRadius={10}>
        <SafeAreaView style={styles.container_v2}>
          <View style={styles.callInfo}>
            <Text style={styles.callStatusText}>Calling...</Text>
            <Image
              source={{uri: 'https://randomuser.me/api/portraits/women/43.jpg'}}
              style={styles.avatar}
            />
            <Text style={styles.name}>Jessica Smith</Text>
            <Text style={styles.timer}>{formatTime(callTime)}</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
              <ThemedIcon
                name={isMuted ? 'mic-off' : 'mic'}
                size={30}
                color="#fff"
              />
              <Text style={styles.buttonText}>Mute</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleSpeakerphone}>
              <ThemedIcon
                name={isSpeakerphoneEnabled ? 'volume-up' : 'volume-down'}
                size={30}
                color="#fff"
              />
              <Text style={styles.buttonText}>Speaker</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.cancelButton]}
              onPress={leave}>
              <ThemedIcon name="call-end" size={30} color="#fff" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isTimeLimitModalVisible}
            onRequestClose={() => {
              setIsTimeLimitModalVisible(!isTimeLimitModalVisible);
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Time's Almost Up!</Text>
                <Text style={styles.modalText}>
                  Your 30-minute session is about to end. Wrap up the session so
                  that nothing is left unsorted.
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setIsTimeLimitModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Got it</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=2512&auto=format&fit=crop',
      }}
      style={styles.background}
      blurRadius={10}>
      <SafeAreaView style={styles.container_v2}>
        <View style={styles.callInfo}>
          <Text style={styles.callStatusText}>Calling...</Text>
          <Image
            source={{uri: 'https://randomuser.me/api/portraits/women/43.jpg'}}
            style={styles.avatar}
          />
          <Text style={styles.name}>Jessica Smith</Text>
          <Text style={styles.timer}>{formatTime(callTime)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
            <ThemedIcon
              name={isMuted ? 'mic-off' : 'mic'}
              size={30}
              color="#fff"
            />
            <Text style={styles.buttonText}>Mute</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleSpeakerphone}>
            <ThemedIcon
              name={isSpeakerphoneEnabled ? 'volume-up' : 'volume-down'}
              size={30}
              color="#fff"
            />
            <Text style={styles.buttonText}>Speaker</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.cancelButton]}
            onPress={leave}>
            <ThemedIcon name="call-end" size={30} color="#fff" />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isTimeLimitModalVisible}
          onRequestClose={() => {
            setIsTimeLimitModalVisible(!isTimeLimitModalVisible);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Time's Almost Up!</Text>
              <Text style={styles.modalText}>
                Your 30-minute session is about to end. Wrap up the session so
                that nothing is left unsorted.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsTimeLimitModalVisible(false)}>
                <Text style={styles.modalButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default VoiceCallScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  header: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  buttons: {flexDirection: 'row', marginVertical: 20},
  button: {
    backgroundColor: '#0055cc',
    color: '#fff',
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  msg: {marginTop: 20, color: 'black', fontSize: 16},
  // V2 Styles
  background: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container_v2: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  callInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callStatusText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  timer: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 30,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  acceptButton: {
    backgroundColor: '#34c759',
    marginRight: 80, // Add space between buttons
  },
  incomingControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 100,
  },
  buttonText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 12,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#0055cc',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TextInput,
//   SafeAreaView,
//   TouchableOpacity,
//   ScrollView,
//   useWindowDimensions,
//   Platform,
//   I18nManager,
//   ActivityIndicator,
// } from 'react-native';

// // Suppress lint rules for dynamic styles and types in this screen
// import React, {useState} from 'react';
// import {colors, defaultStyles, imgPath, typography} from '../../styles/style';
// import Button from '../../components/button';
// import {useTranslation} from 'react-i18next';
// import Icon from '@react-native-vector-icons/material-icons';
// import {showToast} from '../../utils/toast';
// import {lightTheme} from '../../theme/theme';
// import {RootState, useAppDispatch, useAppSelector} from '../../redux/store';
// import {useTheme} from '../../theme/ThemeContext';
// import {loginUser} from '../../redux/actions/authAction/authAction';

// interface Login {
//   name: string;
//   password: string;
//   showPassword: boolean;
//   rememberMe: boolean;
// }

// const LoginScreen = () => {
//   const {width, height} = useWindowDimensions();
//   const {t} = useTranslation();
//   const isRTL = I18nManager.isRTL;
//   const {theme} = useTheme();

//   const [formStates, setFormStates] = useState<Login>({
//     name: '',
//     password: '',
//     showPassword: false,
//     rememberMe: false,
//   });

//   const dispatch = useAppDispatch();

//   const {loading} = useAppSelector((state: RootState) => state.auth);

//   const submitForm = () => {
//     if (formStates.name === '') {
//       showToast({
//         type: 'danger',
//         message: 'User name is required',
//       });
//     } else if (formStates.password === '') {
//       showToast({
//         type: 'danger',
//         message: 'Password is required',
//       });
//     } else {
//       dispatch(
//         loginUser({
//           data: {
//             name: formStates.name,
//             password: formStates.password,
//           },
//         }),
//       );
//     }
//   };

//   return (
//     <>
//       <ScrollView contentContainerStyle={[styles.container]}>
//         {loading ? (
//           <ActivityIndicator
//             size="large"
//             color={theme === 'dark' ? lightTheme.text : colors.black}
//           />
//         ) : (
//           <SafeAreaView style={[styles.container]}>
//             <Image
//               source={imgPath.logo}
//               style={[defaultStyles.image]}
//               resizeMode="contain"
//             />
//             <Text
//               style={[
//                 defaultStyles.mainHeading,
//                 {color: theme === 'dark' ? lightTheme.text : colors.black},
//               ]}>
//               {t('Sign into your account')}
//             </Text>
//             <Text
//               style={[
//                 defaultStyles.subHeading,
//                 {color: theme === 'dark' ? lightTheme.text : undefined},
//               ]}>
//               {t('Enter your Username and Password to login')}
//             </Text>
//             <View
//               style={[
//                 defaultStyles.mainContainer,
//                 {
//                   backgroundColor:
//                     theme === 'dark' ? lightTheme.background : undefined,
//                 },
//               ]}>
//               <Text
//                 style={[
//                   styles.textStyles,
//                   {color: theme === 'dark' ? lightTheme.text : colors.black},
//                 ]}>
//                 {t('Iqama ID')}
//               </Text>
//               <TextInput
//                 style={[
//                   styles.input,
//                   {
//                     backgroundColor:
//                       theme === 'dark' ? lightTheme.background : colors.white,
//                     borderColor:
//                       theme === 'dark' ? lightTheme.border : colors.lightGray,
//                     color: theme === 'dark' ? lightTheme.text : colors.black,
//                   },
//                 ]}
//                 value={formStates.name}
//                 onChangeText={text =>
//                   setFormStates({...formStates, name: text})
//                 }
//                 placeholder={t('Enter your Iqama ID')}
//                 placeholderTextColor={
//                   theme === 'dark' ? lightTheme.text : colors.lightGray
//                 }
//                 textAlign={isRTL ? 'right' : 'left'}
//               />
//               <Text
//                 style={[
//                   styles.textStyles,
//                   {color: theme === 'dark' ? lightTheme.text : colors.black},
//                 ]}>
//                 {t('Password')}
//               </Text>
//               <View style={styles.passwordContainer}>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     styles.passwordInput,
//                     {
//                       backgroundColor:
//                         theme === 'dark' ? lightTheme.background : colors.white,
//                       borderColor:
//                         theme === 'dark' ? lightTheme.border : colors.lightGray,
//                       color: theme === 'dark' ? lightTheme.text : colors.black,
//                     },
//                   ]}
//                   value={formStates.password}
//                   onChangeText={text =>
//                     setFormStates({...formStates, password: text})
//                   }
//                   secureTextEntry={!formStates.showPassword}
//                   placeholder={t('Enter your password')}
//                   placeholderTextColor={
//                     theme === 'dark' ? lightTheme.text : colors.lightGray
//                   }
//                   textAlign={isRTL ? 'right' : 'left'}
//                 />
//                 <TouchableOpacity
//                   style={styles.eyeIcon}
//                   onPress={() =>
//                     setFormStates({
//                       ...formStates,
//                       showPassword: !formStates.showPassword,
//                     })
//                   }>
//                   <Icon
//                     name={
//                       formStates.showPassword ? 'visibility' : 'visibility-off'
//                     }
//                     size={width * 0.05}
//                     color={theme === 'dark' ? lightTheme.text : colors.black}
//                   />
//                 </TouchableOpacity>
//               </View>
//               <Button title={t('Login')} onPress={submitForm} />
//             </View>
//           </SafeAreaView>
//         )}
//       </ScrollView>
//     </>
//   );
// };

// export default LoginScreen;

// // NOTE: Unused style warnings can be ignored because styles are used via createRTLAwareStyles (styles)
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     marginBottom: Platform.OS === 'android' ? 70 : '30%',
//   },
//   textStyles: {
//     fontFamily: typography.fontFamilies.mullish,
//     color: colors.black,
//     textAlign: I18nManager.isRTL ? 'right' : 'left',
//     alignSelf: I18nManager.isRTL ? 'flex-end' : 'flex-start',
//     width: '100%',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: colors.lightGray,
//     borderRadius: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     marginVertical: 8,
//     width: '100%',
//     textAlign: I18nManager.isRTL ? 'right' : 'left',
//   },
//   passwordContainer: {
//     position: 'relative',
//     width: '100%',
//     flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
//   },
//   passwordInput: {
//     paddingRight: I18nManager.isRTL ? 15 : 40,
//     paddingLeft: I18nManager.isRTL ? 40 : 15,
//     color: colors.black,
//     width: '100%',
//   },
//   eyeIcon: {
//     position: 'absolute',
//     top: Platform.OS === 'android' ? 12 : 15,
//     [I18nManager.isRTL ? 'left' : 'right']: 5,
//     padding: 5,
//   },
//   secondContainer: {
//     flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
//     justifyContent: 'space-between',
//     marginVertical: 10,
//     width: '100%',
//   },
//   rememberMeContainer: {
//     flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
//     alignItems: 'center',
//     gap: 5,
//   },
//   forgotPassword: {
//     color: colors.primary,
//     fontFamily: typography.fontFamilies.mullish,
//   },
//   dateContainer: {
//     backgroundColor: colors.white,
//     padding: 10,
//     borderRadius: 5,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   dateText: {
//     fontFamily: typography.fontFamilies.mullish,
//     color: colors.black,
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   lastLoginContainer: {
//     backgroundColor: colors.primary,
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   lastLoginText: {
//     fontFamily: typography.fontFamilies.mullish,
//     color: colors.primary,
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   errorText: {
//     color: colors.error,
//     textAlign: I18nManager.isRTL ? 'right' : 'left',
//     marginTop: 10,
//     fontFamily: typography.fontFamilies.mullish,
//   },
// });
