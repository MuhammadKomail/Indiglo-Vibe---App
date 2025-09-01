// components/DiscoverCard.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import colors from '../styles/colors';

interface DiscoverCardProps {
  title: string;
  button: string;
  image: any;
  onPress: () => void;
}

const DiscoverCard: React.FC<DiscoverCardProps> = ({
  title,
  button,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={onPress}>
      <ImageBackground
        source={image}
        style={styles.cardImage}
        imageStyle={{borderRadius: 12}}>
        <View style={styles.overlay} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{button}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    height: 140,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    color: colors.white4,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DiscoverCard;
