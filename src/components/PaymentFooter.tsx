import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '../styles/colors';

interface PaymentFooterProps {
  price: string;
  duration: string;
}

const PaymentFooter = ({price, duration}: PaymentFooterProps) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.duration}>{duration}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.grayBorderLight,
    backgroundColor: colors.white,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 14,
    color: colors.grayTextSecondary,
  },
  button: {
    backgroundColor: colors.iosBlue,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PaymentFooter;
