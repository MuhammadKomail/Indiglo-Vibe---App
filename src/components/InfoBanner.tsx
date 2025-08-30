import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../styles/style';

interface InfoBannerProps {
  text: string;
}

const InfoBanner = ({text}: InfoBannerProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.infoBg,
    padding: 15,
    borderRadius: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: colors.infoBorder,
  },
  text: {
    textAlign: 'center',
    color: colors.infoText,
  },
});

export default InfoBanner;
