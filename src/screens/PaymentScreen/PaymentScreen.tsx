import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import colors from '../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import AppHeader from '../../components/AppHeader';
import imagePath from '../../styles/imgPath';
import Button from '../../components/button';
import {svgPath} from '../../styles/svgPath';
import SuccessModal from '../../components/SuccessModal';

const PaymentScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const [selected, setSelected] = useState<'master' | 'add'>('master');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [expiryError, setExpiryError] = useState(false);
  const [cardNumberError, setCardNumberError] = useState(false);
  const [cvcError, setCvcError] = useState(false);

  // Luhn Algorithm
  const validateCardNumber = (num: string) => {
    const digits = num.replace(/\s+/g, '');
    if (digits.length !== 16) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const validateExpiry = (val: string) => {
    if (!/^\d{2}\/\d{2}$/.test(val)) return false;
    const [mm, yy] = val.split('/').map(Number);
    if (mm < 1 || mm > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (yy < currentYear) return false;
    if (yy === currentYear && mm < currentMonth) return false;

    return true;
  };

  const validateCvc = (val: string) => /^\d{3,4}$/.test(val);

  const handleUpdate = () => {
    if (selected === 'add') {
      let valid = true;

      if (!validateCardNumber(cardNumber)) {
        setCardNumberError(true);
        valid = false;
      } else {
        setCardNumberError(false);
      }

      if (!validateExpiry(expiry)) {
        setExpiryError(true);
        valid = false;
      } else {
        setExpiryError(false);
      }

      if (!validateCvc(cvc)) {
        setCvcError(true);
        valid = false;
      } else {
        setCvcError(false);
      }

      if (!valid) return; // stop if any error
    }

    setSuccessModal(true);
  };

  // Format Card Input
  const handleCardInput = (text: string) => {
    let formatted = text.replace(/\D/g, '').substring(0, 16);
    formatted = formatted.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry Input
  const handleExpiryInput = (text: string) => {
    let formatted = text.replace(/\D/g, '').substring(0, 4);
    if (formatted.length >= 3) {
      formatted = formatted.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    setExpiry(formatted);

    // validate live
    if (formatted.length === 5) {
      setExpiryError(!validateExpiry(formatted));
    } else {
      setExpiryError(false);
    }
  };

  // Only allow numbers for CVC
  const handleCvcInput = (text: string) => {
    const formatted = text.replace(/\D/g, '').substring(0, 4);
    setCvc(formatted);
  };

  return (
    <>
      <AppHeader title="Payment" height={140} />
      <ScrollView>
        <View style={styles.headerContainer}>
          <Image
            source={imagePath.PaymentCardImage}
            style={styles.cardImageTop}
          />
        </View>
        <View style={styles.ReviewBookingContainer}>
          <Text style={styles.ReviewBooking}>Review Your Booking</Text>
          <Text style={styles.PriceBreakdown}>Price Breakdown</Text>
          <View style={styles.pricingContainer}>
            <Text style={styles.pricing}>Call (30 min)</Text>
            <Text style={styles.pricing}>$20.00</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.total}>$20.00</Text>
          </View>
        </View>
        {/* Payment Methods */}
        <View style={styles.methodContainer}>
          {/* Master Card */}
          <Text style={styles.info}>Payment Information</Text>
          <TouchableOpacity
            style={styles.methodBox}
            onPress={() => setSelected('master')}>
            <View style={styles.addCardBox}>
              <Image source={imagePath.Mastercard} style={styles.cardImage} />
              <View>
                <Text style={styles.methodText}>Master Card</Text>
                <Text style={styles.subText}>6575 4737 3483 3843</Text>
              </View>
            </View>
            <View
              style={[
                styles.radioOuter,
                selected === 'master' && styles.radioOuterActive,
              ]}>
              {selected === 'master' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* Add Another Card */}
          <TouchableOpacity
            style={styles.methodBox}
            onPress={() => setSelected('add')}>
            <View style={styles.addCardBox}>
              <Image source={imagePath.AnotherCard} style={styles.cardImage} />
              <Text style={styles.methodText}>Add Another Card</Text>
            </View>
            <View
              style={[
                styles.radioOuter,
                selected === 'add' && styles.radioOuterActive,
              ]}>
              {selected === 'add' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Form */}
        {selected === 'add' && (
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Payment Information</Text>

            <View style={styles.inputContainer}>
              <svgPath.CardNumber width={20} height={20} />
              <TextInput
                placeholder="1234 1234 1234 1234"
                value={cardNumber}
                onChangeText={handleCardInput}
                style={styles.inputField}
                keyboardType="numeric"
                maxLength={19}
                placeholderTextColor={colors.lightGray9}
              />
            </View>
            {cardNumberError && (
              <Text style={styles.errorText}>Invalid card number</Text>
            )}

            <View style={styles.row}>
              <View style={[styles.inputContainer, {flex: 1}]}>
                <svgPath.Expiry width={20} height={20} />
                <TextInput
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={handleExpiryInput}
                  style={[styles.inputField, {marginRight: 8}]}
                  keyboardType="numeric"
                  placeholderTextColor={colors.lightGray9}
                  maxLength={5}
                />
              </View>
              <View style={[styles.inputContainer, {flex: 1}]}>
                <svgPath.CVC width={20} height={20} />
                <TextInput
                  placeholder="CVC"
                  value={cvc}
                  onChangeText={handleCvcInput}
                  style={styles.inputField}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholderTextColor={colors.lightGray9}
                />
              </View>
            </View>
            {expiryError && (
              <Text style={styles.errorText}>Invalid Expiry Date</Text>
            )}
            {cvcError && <Text style={styles.errorText}>Invalid CVC</Text>}

            <Text style={styles.secureText}>
              Your card information is secured with us.{' '}
            </Text>
          </View>
        )}
        <Button
          title="Pay"
          style={styles.buttonUser}
          backgroundGradient={[colors.blue, colors.blue2]}
          textColor={colors.silver}
          onPress={() => handleUpdate()}
        />
      </ScrollView>
      <SuccessModal
        visible={successModal}
        headerImage={imagePath.PaymentSuccess}
        imageStyling={styles.headerImage}
        title={'Payment Successful!'}
        onClose={() => {
          setSuccessModal(false);
        }}
        bottonText={'Schedules'}
        onSubmit={() => {
          navigation.navigate('BottomTabs');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  methodContainer: {
    marginVertical: 20,
  },
  methodBox: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.black20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.black,
  },
  cardImage: {
    width: 64,
    height: 48,
  },
  subText: {
    fontSize: 12,
    opacity: 0.3,
    color: colors.black,
    fontWeight: '500',
  },
  addCardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.blueHue4,
    // borderColor: colors.black20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderWidth: 2,
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  formContainer: {
    marginHorizontal: 20,
  },
  ReviewBooking: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: colors.black6,
  },
  info: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: colors.black6,
    marginHorizontal: 15,
  },
  PriceBreakdown: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
  pricing: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.blueHue10,
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black6,
  },
  ReviewBookingContainer: {
    marginHorizontal: 14,
    marginVertical: 4,
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderBottomColor: colors.blueHue11,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    color: colors.black6,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  cardImageTop: {
    width: '94%',
    height: 221,
    borderRadius: 12,
  },
  headerImage: {
    width: 140,
    height: 140,
    marginBottom: 24,
    borderRadius: 12,
  },
  buttonUser: {
    width: '95%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 15,
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.silver,
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  secureText: {
    fontSize: 10,
    color: colors.blueHue7,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
});

export default PaymentScreen;
