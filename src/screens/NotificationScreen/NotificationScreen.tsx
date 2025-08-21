import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import colors from '../../styles/colors';
import {notifications} from '../../utils/data';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import AppHeader from '../../components/AppHeader';
import NotificationBox from '../../components/NotificationBox';

const NotificationScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const handleBack = () => {
    navigation.goBack();
  };

  const renderSectionItem = ({item}: {item: (typeof notifications)[0]}) => {
    const list = item.notificationList || item.notifications || [];
    return (
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionHeader}>{item.day}</Text>
        <FlatList
          data={list}
          keyExtractor={(tag, index) => tag.notification + index}
          renderItem={({item}) => (
            <NotificationBox
              notification={item.notification}
              time={item.time}
              type={item.type}
            />
          )}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <>
      <AppHeader title="Notifications" backIcon={handleBack} height={140} />
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => item.day + index}
        renderItem={renderSectionItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  sectionBlock: {
    marginTop: 20,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 12,
    color: colors.grayDark,
  },
});

export default NotificationScreen;
