// components/ExploreCard.tsx
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../styles/colors';
import imagePath from '../styles/imgPath';
import {svgPath} from '../styles/svgPath';

interface ExploreCardProps {
  id: string;
  name: string;
  description: string;
  avatar: any;
  navigation: any;
}

const ExploreMentorCard: React.FC<ExploreCardProps> = ({
  id,
  name,
  description,
  avatar,
  navigation,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MentorDetailScreen')}>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.tabContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <svgPath.Phone />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <svgPath.Message />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.iconButton}>
                    </TouchableOpacity> */}
          <TouchableOpacity style={styles.scheduleButton}>
            <svgPath.CalendarBottom />
            <Text style={styles.scheduleText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 100,
    height: 130,
    borderRadius: 8,
    marginRight: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.black,
  },
  description: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.blueHue3,
    marginBottom: 8,
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  iconButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.silver,
    borderRadius: 8,
    marginRight: 8,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ExploreMentorCard;
