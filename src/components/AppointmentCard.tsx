import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../styles/colors';
import {svgPath} from '../styles/svgPath';
import imgPath from '../styles/imgPath';

export const AppointmentCard = ({
  name,
  date,
  time,
  status,
  type,
  activeTab,
  navigation,
}: any) => {
  const getButtonStyle = () => {
    if (activeTab === 'upcoming') {
      if (status === 'Call Now' || status === 'Join Now')
        return {backgroundColor: colors.green2, textColor: colors.white};
      if (status === 'Chat')
        return {backgroundColor: colors.gray20, textColor: colors.blueHue4};
      if (status === 'Call')
        return {backgroundColor: colors.gray20, textColor: colors.blueHue4};
    }
    if (activeTab === 'completed') {
      return {backgroundColor: colors.primary, textColor: colors.white};
    }
    if (activeTab === 'requested') {
      if (status === 'View Details')
        return {backgroundColor: colors.primary, textColor: colors.white};
      return {backgroundColor: colors.brown, textColor: colors.white};
    }
    return {backgroundColor: colors.primary, textColor: colors.white};
  };

  const {backgroundColor, textColor} = getButtonStyle();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('AppointmentDetailScreen', {
          name,
          date,
          time,
          activeTab,
          type,
          status,
        })
      }>
      <View style={styles.info}>
        <View style={{position: 'relative'}}>
          <Image source={imgPath.profileUser} style={styles.image} />
          {activeTab === 'upcoming' &&
          (status === 'Call Now' || status === 'Join Now') ? (
            <View style={styles.editIcon}>
              <svgPath.Phone width={10} height={10} fill={colors.white} />
            </View>
          ) : activeTab === 'upcoming' &&
            (status === 'Chat' || status === 'Call') ? (
            <View style={styles.editIcon}>
              <svgPath.Message width={10} height={10} fill={colors.white} />
            </View>
          ) : activeTab === 'upcoming' &&
            (status === 'Call' || status === 'Join') ? (
            <View style={styles.editIcon}>
              <svgPath.Phone width={10} height={10} fill={colors.white} />
            </View>
          ) : activeTab === 'requested' && status === 'View Details' ? (
            <View style={styles.editIcon}>
              <svgPath.Phone width={10} height={10} fill={colors.white} />
            </View>
          ) : null}
        </View>

        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          <svgPath.CalendarBottom width={14} height={14} />
          <Text style={styles.metaText}>{date}</Text>
        </View>
        <View style={styles.metaRow}>
          <svgPath.Clock width={14} height={14} />
          <Text style={styles.metaText}>{time}</Text>
        </View>
      </View>

      {/* Status Button */}
      <TouchableOpacity style={[styles.statusButton, {backgroundColor}]}>
        <Text style={[styles.statusText, {color: textColor}]}>{status}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderColor: colors.black10,
    borderWidth: 1,
  },
  info: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray11,
    paddingBottom: 12,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 50,
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    right: -2, // slight outside padding
    bottom: -2, // move it to the bottom
    backgroundColor: colors.green2,
    borderRadius: 50,
    padding: 5,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.black,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
    paddingBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 6,
    color: colors.gray,
  },
  statusButton: {
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statusText: {
    fontWeight: '500',
    fontSize: 14,
  },
});
