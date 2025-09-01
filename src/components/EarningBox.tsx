// TransactionCard.tsx
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../styles/colors';
import {svgPath} from '../styles/svgPath';

interface EarningBoxProps {
  item: any;
}

const EarningBox: React.FC<EarningBoxProps> = ({item}) => {
  return (
    <View style={styles.transactionRow}>
      <View
        style={[
          styles.iconCircle,
          item.type === 'Received'
            ? {backgroundColor: colors.green3}
            : {backgroundColor: colors.silver},
        ]}>
        {item.type === 'Received' ? (
          <svgPath.ReceivedArrow width={18} height={18} />
        ) : (
          <svgPath.WithdrawArrow width={18} height={18} />
        )}
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txType}>{item.type}</Text>
        <Text style={styles.txDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.txAmount,
          item.amount > 0 ? {color: colors.green2} : {color: colors.red2},
        ]}>
        {item.amount > 0 ? `+$${item.amount}` : `-$${Math.abs(item.amount)}`}
      </Text>
    </View>
  );
};

export default EarningBox;

const styles = StyleSheet.create({
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 12,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  txInfo: {flex: 1},
  txType: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  txDate: {
    fontSize: 10,
    color: colors.black,
    marginTop: 2,
    opacity: 0.4,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '400',
  },
});
