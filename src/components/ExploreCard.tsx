// components/ExploreCard.tsx
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import colors from '../styles/colors';
import imagePath from '../styles/imgPath';

interface ExploreCardProps {
  name: string;
  category: string;
  price: number;
}

const ExploreCard: React.FC<ExploreCardProps> = ({name, category, price}) => {
  return (
    <View style={styles.shadowContainer}>
      <View style={styles.card}>
        <Image source={imagePath.ProfileImage2} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.price}>${price} /30 min</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight: 15,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 140,
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  textContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    paddingBottom: 10,
  },
  name: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 10,
  },
  category: {
    color: colors.black,
    opacity: 0.5,
    fontSize: 12,
  },
  price: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ExploreCard;
