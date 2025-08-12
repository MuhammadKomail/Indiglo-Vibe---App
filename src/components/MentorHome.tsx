// components/UpcomingAppointments.tsx
import React from 'react';
import UpcomingAppointments from './UpcomingAppointments';
import AppointmentRequests from './AppointmentRequests';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import colors from '../styles/colors';
import {appointments} from '../utils/data';

const MentorHome = () => {
  const ListHeaderComponent = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <Text style={styles.sectionAll}>See All</Text>
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={({item}) => <UpcomingAppointments item={item} />}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={<AppointmentRequests />}
      />
    </>
  );
};

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

export default MentorHome;
