import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../styles/colors';

interface SpecialitiesListProps {
  specialties: string[];
}

const SpecialitiesList = ({specialties}: SpecialitiesListProps) => {
  const bgColors = [
    colors.speciality1,
    colors.speciality2,
    colors.speciality3,
    colors.speciality4,
  ];
  const textColors = [
    colors.primary,
    colors.specialityText2,
    colors.specialityText3,
    colors.specialityText4,
  ];

  return (
    <View style={styles.tagsContainer}>
      {specialties.map((tag: string, idx: number) => {
        const bgColor = bgColors[idx % bgColors.length];
        const textColor = textColors[idx % textColors.length];
        return (
          <View key={idx} style={[styles.tag, {backgroundColor: bgColor}]}>
            <Text style={[styles.tagText, {color: textColor}]}>{tag}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default SpecialitiesList;

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    gap: 8,
  },
  tag: {paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8},
  tagText: {fontSize: 12},
});
