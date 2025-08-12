// components/UpcomingAppointments.tsx
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import HomeBanner from './HomeBanner';
import BestMatchCard from './BestMatchCard';
import ExploreCard from './ExploreCard';
import colors from '../styles/colors';
import {bestMatchData, exploreData} from '../utils/data';

const UserHome = () => {
  return (
    <>
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
          <BestMatchCard
            name={item.name}
            desc={item.desc}
            index={index}
            callTime={item.callTime}
            callPrice={item.callPrice}
            messageTime={item.messageTime}
            messagePrice={item.messagePrice}
            image={item.image}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 20,
          marginBottom: 20,
        }}
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
            time={item.time}
            image={item.image}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 20, marginBottom: 25}}
      />
    </>
  );
};

export default UserHome;

const styles = StyleSheet.create({
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
