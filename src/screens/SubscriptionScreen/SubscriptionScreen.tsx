import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {colors, imgPath, svgPath} from '../../styles/style';
import Button from '../../components/button';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigationTypes';
import LinearGradient from 'react-native-linear-gradient';

type SubscriptionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'subscription-screen'
>;

const SubscriptionScreen = ({navigation, route}: SubscriptionScreenProps) => {
  const {role, name, password} = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={imgPath.backgroundImage2}
      style={styles.backgroundImg}
      resizeMode="cover">
      <KeyboardAvoidingView style={{flex: 1}} keyboardVerticalOffset={80}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <svgPath.BackArrow width={12} height={12} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Subscription</Text>
            <View style={{width: 40}} />
          </View>

          <View style={styles.container}>
            <View style={styles.headerBox}>
              <Text style={styles.headerTitle2}>
                Unlock Your Earning Potential as a Mentor!
              </Text>
              <Text style={styles.headerDescription}>
                Subscribe now get access to a supportive community, seamless
                session management, and secure payouts.
              </Text>
            </View>

            {/* Pricing Card */}
            <View style={styles.card}>
              <LinearGradient
                colors={[colors.blue, colors.blue2]}
                start={{x: 1, y: 0}}
                end={{x: 0, y: 0}}
                style={styles.cardGradient}>
                <View>
                  <View style={styles.cardHeader}>
                    <Text style={styles.price}>$9.99</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Standard</Text>
                    </View>
                  </View>
                  <Text style={styles.feeLabel}>Annual Subscription Fees</Text>

                  <View style={styles.benefitRow}>
                    <MaterialIcons
                      name="check-box"
                      size={18}
                      color={colors.purple}
                    />
                    <Text style={styles.benefitText}>
                      Full access to text and voice call mentoring sessions
                    </Text>
                  </View>
                  <View style={styles.benefitRow}>
                    <MaterialIcons
                      name="check-box"
                      size={18}
                      color={colors.purple}
                    />
                    <Text style={styles.benefitText}>
                      Personalized mentor profile listing
                    </Text>
                  </View>
                  <View style={styles.benefitRow}>
                    <MaterialIcons
                      name="check-box"
                      size={18}
                      color={colors.purple}
                    />
                    <Text style={styles.benefitText}>
                      Flexible scheduling & session management
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Subscribe Button */}
            <Button
              title="Subscribe"
              style={styles.subscribeBtn}
              backgroundGradient={[colors.blue, colors.blue2]}
              textColor={colors.silver}
              onPress={() => {
                navigation.navigate('subscribe-payment-screen', {
                  name: name!,
                  password: password!,
                  role,
                });
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
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
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.blueHue,
  },
  container: {
    marginTop: 10,
    flex: 1,
    alignItems: 'center',
  },
  headerBox: {
    width: '90%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 12,
    gap: 8,
  },
  headerDescription: {
    color: colors.blueHue,
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
  },
  headerTitle2: {
    color: colors.blueHue,
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    width: '90%',
    // backgroundColor: '#1A47D3',
    borderRadius: 16,
    // padding: 20,
    marginBottom: 40,
    marginTop: 10,
  },
  cardGradient: {
    borderRadius: 16,
    flex: 1,
    // padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.white,
  },
  badge: {
    backgroundColor: colors.purple,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  feeLabel: {
    color: colors.white,
    fontSize: 12,
    marginTop: 8,
    marginHorizontal: 10,
    marginBottom: 16,
    fontWeight: '600',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  benefitText: {
    color: colors.white,
    fontSize: 10,
    marginLeft: 8,
  },
  subscribeBtn: {
    width: '95%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    position: 'absolute',
    bottom: 20,
  },
});

export default SubscriptionScreen;
