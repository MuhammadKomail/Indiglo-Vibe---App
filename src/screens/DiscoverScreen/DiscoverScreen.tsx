import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import colors from '../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import AppHeader from '../../components/AppHeader';
import {discoverItems} from '../../utils/data';
import DiscoverCard from '../../components/DiscoverCard';

const DiscoverScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const renderItem = ({item}: {item: (typeof discoverItems)[0]}) => (
    <DiscoverCard
      title={item.title}
      button={item.button}
      image={item.image}
      onPress={() =>
        navigation.navigate(item.route, {headerTitle: item.headerTitle})
      }
    />
  );

  const ListHeaderComponent = () => (
    <View>
      <Text style={styles.heading}>Explore. Learn. Grow.</Text>
      <Text style={styles.subHeading}>
        Welcome to Indiglo Vibe's Discover Community, your space for
        self-growth, mindfulness, and motivation. Find curated resources to
        support your mental well-being.
      </Text>
    </View>
  );

  const backPress = () => {
    navigation.navigate('Home');
  };

  return (
    <>
      <AppHeader title="Discover" height={140} backPress={backPress} />

      <FlatList
        data={discoverItems}
        keyExtractor={(item, index) => item.title + index}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.scrollContent}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: colors.white,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.black,
    textAlign: 'center',
    marginTop: 20,
  },
  subHeading: {
    fontSize: 12,
    color: colors.black,
    fontWeight: '400',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 20,
  },
});

export default DiscoverScreen;
