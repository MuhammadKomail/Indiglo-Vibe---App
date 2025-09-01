import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {ThemedView} from '../../components/ThemedComponents';
import colors from '../../styles/colors';
import AppHeader from '../../components/AppHeader';
import {appointmentsData, mentorAppointmentsData} from '../../utils/data';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {AppointmentCard} from '../../components/AppointmentCard';

const AppointmentScreen = ({route}: {route: any}) => {
  const {user} = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<
    'upcoming' | 'completed' | 'requested'
  >('upcoming');
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  useEffect(() => {
    if (route?.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route?.params?.activeTab]);

  const backPress = () => {
    navigation.navigate('Home');
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <AppHeader title="Appointments" height={140} backPress={backPress} />

      {/* Tabs */}
      {user?.role === 'user' ? (
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'upcoming' && styles.activeTabText,
              ]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'completed' && styles.activeTabText,
              ]}>
              Completed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'requested' && styles.activeTab]}
            onPress={() => setActiveTab('requested')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'requested' && styles.activeTabText,
              ]}>
              Requested
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'upcoming' && styles.activeTabText,
              ]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'requested' && styles.activeTab]}
            onPress={() => setActiveTab('requested')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'requested' && styles.activeTabText,
              ]}>
              Requested
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Appointment List */}
      <FlatList
        data={
          user?.role === 'user'
            ? appointmentsData[activeTab]
            : mentorAppointmentsData[activeTab]
        }
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <AppointmentCard
            {...item}
            activeTab={activeTab}
            navigation={navigation}
          />
        )}
        contentContainerStyle={{padding: 16}}
      />
    </ThemedView>
  );
};

export default AppointmentScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.lightGray7,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
