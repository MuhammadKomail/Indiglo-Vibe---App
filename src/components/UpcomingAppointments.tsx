// components/UpcomingAppointments.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../styles/colors';
import {svgPath} from '../styles/svgPath';
import {appointments} from '../utils/data';

interface Appointment {
  id: string;
  name: string;
  date: string;
  time: string;
  image: any;
}

const UpcomingAppointments = ({item}: {item: Appointment}) => {
  return (
    <View>
      <View style={styles.card}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <Text style={styles.topHeading}>Appointment Date</Text>
          <TouchableOpacity>
            <svgPath.Menu />
          </TouchableOpacity>
        </View>
        <View style={styles.dateTimeRow}>
          <svgPath.Date />
          <Text style={styles.dateText}>{item.date}</Text>
          <svgPath.Clock style={{marginLeft: 10}} />
          <Text style={styles.dateText}>{item.time}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom Row */}
        <View style={styles.userRow}>
          <View style={styles.avatarContainer}>
            <Image source={item.image} style={styles.avatar} />
            {/* Green message icon overlay */}
            <View style={styles.messageIconContainer}>
              <svgPath.Message width={12} height={12} />
            </View>
          </View>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </View>
    </View>
  );
};

export default UpcomingAppointments;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {fontSize: 18, fontWeight: '500', color: colors.black4},
  sectionAll: {fontSize: 12, color: colors.blueHue3},
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.green2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeRow: {flexDirection: 'row', alignItems: 'center'},
  dateText: {fontSize: 12, color: colors.blueHue, marginLeft: 5},
  divider: {height: 1, backgroundColor: colors.silver, marginVertical: 10},
  userRow: {flexDirection: 'row', alignItems: 'center'},
  avatarContainer: {
    position: 'relative',
  },
  avatar: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
  messageIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: 2,
    backgroundColor: colors.green2,
    borderRadius: 10,
    padding: 3,
  },
  name: {fontSize: 16, fontWeight: '500', color: colors.black5},
  topHeading: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.lightGray5,
    marginBottom: 10,
  },
});
