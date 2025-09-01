// components/UpcomingAppointments.tsx
import React from 'react';
import UpcomingAppointments from './UpcomingAppointments';
import AppointmentRequests from './AppointmentRequests';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../styles/colors';
import {appointments} from '../utils/data';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

const MentorHome = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const ListHeaderComponent = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Appointment', {activeTab: 'upcoming'})
          }>
          <Text style={styles.sectionAll}>See All</Text>
        </TouchableOpacity>
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
});

export default MentorHome;
