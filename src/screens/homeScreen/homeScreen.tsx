import {StyleSheet, View, FlatList, ScrollView, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ThemedView} from '../../components/ThemedComponents';
import HomeHeader from '../../components/homeHeader';
import colors from '../../styles/colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import MentorHome from '../../components/MentorHome';
import UserHome from '../../components/UserHome';

const HomeScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const {user} = useSelector((state: RootState) => state.auth);

  const drawerOpen = () => {
    navigation.openDrawer();
  };

  const ViewDetail = () => {
    navigation.navigate('view-detail-screen');
  };

  const settingScreen = () => {
    navigation.navigate('SettingScreen');
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <HomeHeader
        title={'Guest'}
        notifiction={drawerOpen}
        ViewDetail={ViewDetail}
        settingScreen={settingScreen}
      />

      {user?.role === 'mentor' ? <MentorHome /> : <UserHome />}
    </ThemedView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainerScroll: {flexGrow: 1, backgroundColor: colors.white},
});
