import {StyleSheet, View, Modal, TouchableWithoutFeedback} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ThemedView} from '../../components/ThemedComponents';
import HomeHeader from '../../components/homeHeader';
import colors from '../../styles/colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import MentorHome from '../../components/MentorHome';
import UserHome from '../../components/UserHome';
import FilterOverlay from '../../components/FilterOverlay';

const HomeScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const {user} = useSelector((state: RootState) => state.auth);

  const [isFilterVisible, setFilterVisible] = useState(false);

  const openFilter = () => setFilterVisible(true);
  const closeFilter = () => setFilterVisible(false);

  const drawerOpen = () => {
    navigation.openDrawer();
  };

  const ViewDetail = () => {
    navigation.navigate('MyEarningsScreen');
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
        openFilter={openFilter}
      />

      {user?.role === 'mentor' ? <MentorHome /> : <UserHome />}

      {/* Bottom Panel Modal */}
      <Modal
        visible={isFilterVisible}
        transparent
        animationType="slide"
        onRequestClose={closeFilter}>
        {/* Background */}
        <TouchableWithoutFeedback onPress={closeFilter}>
          <View style={styles.modalBackground}>
            {/* Prevent closing when tapping inside */}
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <FilterOverlay onClose={closeFilter} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ThemedView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.black60,
  },
  modalContent: {
    height: '60%', // panel height
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
});
