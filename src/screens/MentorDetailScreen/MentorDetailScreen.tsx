import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import colors from '../../styles/colors';
import Button from '../../components/button';
import SpecialitiesList from '../../components/SpecialitiesList';
import BottomPanel from '../../components/BottomPanel';
import MentorHeader from '../../components/MentorHeader';
import imagePath from '../../styles/imgPath';
import {mentorData} from '../../utils/data';

const MentorDetailScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [panelType, setPanelType] = useState<'chat' | 'call' | null>(null);
  const slideAnim = useState(new Animated.Value(0))[0]; // 0=hidden, 1=shown

  const openPanel = (type: 'chat' | 'call') => {
    setPanelType(type);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closePanel = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setPanelType(null));
  };

  const backIcon = () => navigation.goBack();

  const overlayOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.2], // match your 0.2 opacity
  });

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <MentorHeader
        mentorData={mentorData}
        onBack={backIcon}
        onChat={() => openPanel('chat')}
        onCall={() => openPanel('call')}
        onSchedule={() => console.log('Schedule Appointment')}
      />

      {/* About Me */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.aboutText}>{mentorData.about}</Text>

        {/* Specialties */}
        <Text style={styles.sectionTitle}>Specialties:</Text>
        <SpecialitiesList specialties={mentorData.specialties} />

        <Button
          title="Schedule Appointment"
          style={styles.buttonUser}
          backgroundGradient={[colors.blue, colors.blue2]}
          textColor={colors.silver}
          onPress={() => console.log('Schedule Appointment')}
        />
      </View>

      {/* Overlay */}
      {panelType && (
        <Animated.View
          style={[styles.overlay, {opacity: overlayOpacity}]}
          pointerEvents={panelType ? 'auto' : 'none'}>
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={1}
            onPress={closePanel}
          />
        </Animated.View>
      )}

      {/* Bottom Panel */}
      {panelType && (
        <BottomPanel
          panelType={panelType}
          slideAnim={slideAnim}
          chatPrice={mentorData.chatPrice}
          callPrice={mentorData.callPrice}
          closePanel={closePanel}
        />
      )}
    </View>
  );
};

export default MentorDetailScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontWeight: 'semibold',
    fontSize: 14,
    marginTop: 10,
    color: colors.black,
  },
  aboutText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.gray2,
  },
  buttonUser: {
    width: '95%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 15,
    marginTop: 30,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black,
    opacity: 0.2,
    zIndex: 1,
  },
});
