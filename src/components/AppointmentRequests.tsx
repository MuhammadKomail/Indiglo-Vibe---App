// components/AppointmentRequests.tsx
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
import imagePath from '../styles/imgPath';
import {svgPath} from '../styles/svgPath';
import {requests} from '../utils/data';

interface Request {
  id: string;
  name: string;
  date: string;
  time: string;
  image: any;
}

const AppointmentRequests = () => {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Appointment Request</Text>
        <Text style={styles.sectionAll}>See All</Text>
      </View>
      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.card}>
            <Image source={item.image} style={styles.avatar} />
            <View style={{flex: 1}}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.dateTimeRow}>
                <svgPath.Date />
                <Text style={styles.dateText}>{item.date}</Text>
                <svgPath.Clock style={{marginLeft: 10}} />
                <Text style={styles.dateText}>{item.time}</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AppointmentRequests;

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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.lightGray6,
  },
  avatar: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
  name: {fontSize: 16, fontWeight: '500', color: colors.black4},
  dateTimeRow: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  dateText: {fontSize: 12, color: colors.blueHue, marginLeft: 5},
  arrow: {fontSize: 22, color: colors.black4, opacity: 0.5},
});
