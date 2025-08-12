import React from 'react';
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import colors from '../styles/colors';
import {svgPath} from '../styles/svgPath';

interface MentorHeaderProps {
  mentorData: {
    name: string;
    about: string;
    specialties: string[];
    chatPrice: number;
    callPrice: number;
    profileImg: any;
    bgImg: any;
  };
  onBack: () => void;
  onChat: () => void;
  onCall: () => void;
  onSchedule: () => void;
}

const MentorHeader = ({
  mentorData,
  onBack,
  onChat,
  onCall,
  onSchedule,
}: MentorHeaderProps) => {
  return (
    <View style={styles.headerWrapper}>
      <ImageBackground
        source={mentorData.bgImg}
        style={styles.backgroundImg}
        resizeMode="cover">
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={onBack} style={styles.menuButton}>
            <svgPath.Forward
              width={12}
              height={12}
              style={{transform: [{rotate: '180deg'}]}}
            />
          </TouchableOpacity>
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          <Image source={mentorData.profileImg} style={styles.avatar} />
          <Text style={styles.name}>{mentorData.name}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={onChat}>
            <svgPath.Message />
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onCall}>
            <svgPath.Phone />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.scheduleActionBtn}
            onPress={onSchedule}>
            <svgPath.CalendarBottom />
            <Text style={styles.scheduleActionText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default MentorHeader;

const styles = StyleSheet.create({
  headerWrapper: {
    height: 380,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  backgroundImg: {flex: 1, width: '100%', height: '100%'},
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 70,
  },
  menuButton: {
    padding: 10,
    borderColor: colors.silver,
    borderRadius: 12,
    borderWidth: 1,
  },
  profileSection: {alignItems: 'center'},
  avatar: {width: 130, height: 130},
  name: {fontSize: 18, fontWeight: 'bold', color: colors.white, marginTop: 8},
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 35,
    paddingHorizontal: 20,
  },
  actionBtn: {
    borderColor: colors.silver,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleActionBtn: {
    borderColor: colors.silver,
    backgroundColor: colors.white,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {color: colors.white, fontSize: 14, fontWeight: '500'},
  scheduleActionText: {color: colors.primary, fontSize: 14, fontWeight: '500'},
});
