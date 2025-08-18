import {StyleSheet, View, FlatList, ScrollView, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ThemedView} from '../../components/ThemedComponents';
import HomeHeader from '../../components/homeHeader';
import colors from '../../styles/colors';
import HomeBanner from '../../components/HomeBanner';
import BestMatchCard from '../../components/BestMatchCard';
import ExploreCard from '../../components/ExploreCard';

const HomeScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const drawerOpen = () => {
    navigation.openDrawer();
  };

  const ViewDetail = () => {
    navigation.navigate('view-detail-screen');
  };

  const settingScreen = () => {
    navigation.navigate('SettingScreen');
  };

  const bestMatchData = [
    {
      id: '1',
      name: 'Alice Grace',
      desc: 'I’m passionate about helping individuals find clarity and positivity in their lives.',
    },
    {
      id: '2',
      name: 'Alice Doe',
      desc: 'I’m passionate about helping individuals find clarity and positivity in their lives.',
    },
  ];

  const exploreData = [
    {id: '1', name: 'John Hall', category: 'Self-Care | Career', price: 15},
    {id: '2', name: 'Alice Sham', category: 'Stress Management', price: 15},
    {id: '3', name: 'David Patel', category: 'Anxiety | Self-Care', price: 15},
  ];

  return (
    <ThemedView style={styles.mainContainer}>
      <HomeHeader
        title={'Guest'}
        notifiction={drawerOpen}
        ViewDetail={ViewDetail}
        settingScreen={settingScreen}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainerScroll}>
        <View style={styles.bannerContainer}>
          <HomeBanner />
        </View>

        {/* Best Match Section */}
        <Text style={styles.sectionTitle}>Best Match</Text>
        <FlatList
          data={bestMatchData}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <BestMatchCard name={item.name} desc={item.desc} index={index} />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 20,
            marginBottom: 20,
          }}
          removeClippedSubviews={false}
        />

        {/* Explore Section */}
        <Text style={styles.sectionTitle}>Explore</Text>
        <FlatList
          data={exploreData}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ExploreCard
              name={item.name}
              category={item.category}
              price={item.price}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 20, marginBottom: 25}}
          removeClippedSubviews={false}
        />
      </ScrollView>
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
  bannerContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 20,
    marginBottom: 10,
    color: colors.black4,
  },
});
