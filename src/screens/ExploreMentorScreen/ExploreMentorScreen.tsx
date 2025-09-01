import React, {useState} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ThemedView} from '../../components/ThemedComponents';
import colors from '../../styles/colors';
import AppHeader from '../../components/AppHeader';
import HomeSearch from '../../components/homeSearch';
import ExploreMentorCard from '../../components/ExploreMentorCard';
import {mentorsData} from '../../utils/data';
import MentorOptionsModal from '../../components/MentorOptionsModal';

const ExploreMentorScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [isModalVisible, setModalVisible] = useState(false);

  const backPress = () => {
    navigation.navigate('Home');
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <AppHeader title="Explore Mentors" height={140} backPress={backPress} />
      <HomeSearch
        iconBackgroundColor={colors.primary}
        searchbarBackground={colors.offWhite}
        onFilterPress={() => setModalVisible(true)}
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'all' && styles.activeTabText,
            ]}>
            All Mentors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'my' && styles.activeTabText,
            ]}>
            My Mentors
          </Text>
        </TouchableOpacity>
      </View>

      {/* FlatList */}
      <FlatList
        data={mentorsData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ExploreMentorCard {...item} navigation={navigation} />
        )}
        contentContainerStyle={{padding: 16}}
      />
      <MentorOptionsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ThemedView>
  );
};

export default ExploreMentorScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 8,
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
