// components/BestMatchCard.tsx
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../styles/colors';
import imagePath from '../styles/imgPath';
import {svgPath} from '../styles/svgPath';

interface BestMatchCardProps {
  name: string;
  desc: string;
  index: number;
}

const BestMatchCard: React.FC<BestMatchCardProps> = ({name, desc, index}) => {
  // Gradient logic based on index
  let gradientColors = ['#ABBBF8', '#576BB7'];
  let gradientStart = {x: 0, y: 0};
  let gradientEnd = {x: 1, y: 1};

  if (index === 1) {
    gradientColors = ['#844AAF', '#E5C1FF'];
    gradientEnd = {x: 1, y: 0};
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={gradientStart}
      end={gradientEnd}
      style={styles.bestMatchCard}>
      <View style={styles.header}>
        <Image source={imagePath.profileUser} style={styles.profileImage} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.desc}>{desc}</Text>
        <View style={styles.descBorder} />
        <View style={styles.actions}>
          <View style={styles.actionButton}>
            <View style={styles.phoneIcon}>
              <svgPath.Phone width={18} height={18} />
            </View>
            <View style={styles.coinSection}>
              <svgPath.Coins width={18} height={18} />
              <View>
                <Text style={styles.priceWhite}>$20</Text>
                <Text style={styles.minWhite}>20 min</Text>
              </View>
            </View>
          </View>
          <View style={styles.actionButtonWhite}>
            <View style={styles.phoneIcon}>
              <svgPath.Message width={18} height={18} />
            </View>
            <View style={styles.coinSection}>
              <svgPath.Coins width={18} height={18} />
              <View>
                <Text style={styles.priceBlue}>$20</Text>
                <Text style={styles.minBlue}>20 min</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bestMatchCard: {
    borderRadius: 12,
    width: 320,
  },
  header: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 5,
  },
  desc: {
    fontSize: 12,
    marginTop: 15,
    color: colors.silver,
    width: '80%',
  },
  descBorder: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    opacity: 0.5,
    backgroundColor: colors.silver,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 15,
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    width: 126,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.silver,
    borderWidth: 1,
    borderRadius: 40,
    padding: 8,
  },
  actionButtonWhite: {
    width: 126,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 40,
    padding: 8,
  },
  coinSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  phoneIcon: {
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 20,
  },
  priceWhite: {fontSize: 10, color: colors.white},
  minWhite: {fontSize: 10, color: colors.white},
  priceBlue: {fontSize: 10, color: colors.blueHue},
  minBlue: {fontSize: 10, color: colors.blueHue},
});

export default BestMatchCard;
