import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native';
import {colors, imgPath, svgPath} from '../../styles/style';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import EarningBox from '../../components/EarningBox';
import {earningsData} from '../../utils/data';

const MyEarningsScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const handleBack = () => {
    navigation.goBack();
  };

  const renderTransaction = ({item}: any) => {
    return <EarningBox item={item} />;
  };

  const headerComponent = () => {
    return (
      <>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <svgPath.BackArrow width={12} height={12} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Earnings</Text>
          <View style={{width: 40}} />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <ImageBackground
            source={imgPath.headerBackground}
            style={styles.backgroundImg}
            resizeMode="cover">
            <View style={styles.balanceContainer}>
              <svgPath.MyBalanceWhite
                width={34}
                height={34}
                fill={colors.white}
              />
              <View>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balanceValue}>$2,000</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.withdrawBtn}
              onPress={() =>
                navigation.navigate('WithdrawalDestinationScreen')
              }>
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>

        {/* Activity Section */}
        <Text style={styles.activityTitle}>Activity</Text>
      </>
    );
  };

  return (
    <View style={{flex: 1}}>
      {/* Header */}

      <FlatList
        data={earningsData}
        renderItem={renderTransaction}
        ListHeaderComponent={headerComponent}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{paddingBottom: 30}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImg: {flex: 1, padding: 20},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 70,
    paddingHorizontal: 20,
  },
  backButton: {
    borderColor: colors.lightGray10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.blueHue,
  },
  balanceCard: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  balanceLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '500',
  },
  balanceValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '600',
  },
  withdrawBtn: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  withdrawText: {
    color: colors.blue2,
    fontWeight: '600',
    fontSize: 15,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.black4,
    marginTop: 20,
    marginLeft: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default MyEarningsScreen;
