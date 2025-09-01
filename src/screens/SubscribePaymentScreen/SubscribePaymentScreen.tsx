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
import imagePath from '../../styles/imgPath';
import Button from '../../components/button';
import {svgPath} from '../../styles/svgPath';
import SuccessModal from '../../components/SuccessModal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigationTypes';
import {loginUser} from '../../redux/actions/authAction/authAction';
import {useAppDispatch} from '../../redux/store';

type SubscribePaymentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'subscribe-payment-screen'
>;

const SubscribePaymentScreen = ({
  navigation,
  route,
}: SubscribePaymentScreenProps) => {
  const {role, name, password} = route.params;

  const dispatch = useAppDispatch();

  const [saveCard, setSaveCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [expiryError, setExpiryError] = useState('');
  const [cardError, setCardError] = useState('');
  const [cvcError, setCvcError] = useState('');
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
    let valid = true;

    if (!validateCardNumber(cardNumber)) {
      setCardError('Please enter a valid 16-digit card number.');
      valid = false;
    } else {
      setCardError('');
    }

    if (!validateExpiry(expiry)) {
      setExpiryError('Invalid expiry date (MM/YY).');
      valid = false;
    } else {
      setExpiryError('');
    }

    if (!validateCvc(cvc)) {
      setCvcError('CVC should be 3 or 4 digits.');
      valid = false;
    } else {
      setCvcError('');
    }

    if (valid) {
      setSuccessModal(true);
    }
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
      setExpiryError(
        !validateExpiry(formatted) ? 'Invalid expiry date (MM/YY).' : '',
      );
    } else {
      setExpiryError('');
    }
  };

  // Only allow numbers for CVC
  const handleCvcInput = (text: string) => {
    const formatted = text.replace(/\D/g, '').substring(0, 4);
    setCvc(formatted);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <svgPath.BackArrow width={12} height={12} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{width: 40}} />
      </View>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Image
            source={imagePath.PaymentCardImage}
            style={styles.cardImageTop}
          />
        </View>
        <View style={styles.ReviewBookingContainer}>
          <Text style={styles.ReviewBooking}>Annual Subscription</Text>
          <View style={styles.totalContainer}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.total}>$20.00</Text>
          </View>
        </View>
        {/* Payment Methods */}
        <View style={styles.methodContainer}>
          {/* Master Card */}
          <Text style={styles.info}>Payment Information</Text>
        </View>

        {/* Payment Form */}
        <View style={styles.formContainer}>
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
          {cardError ? <Text style={styles.errorText}>{cardError}</Text> : null}

          <View style={styles.row}>
            <View style={[styles.inputContainer, {flex: 1}]}>
              <svgPath.Expiry width={20} height={20} />
              <TextInput
                placeholder="MM/YY"
                value={expiry}
                onChangeText={handleExpiryInput}
                style={[
                  styles.inputField,
                  {marginRight: 8},
                  // expiryError && { borderColor: 'red', borderWidth: 1 },
                ]}
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
          {expiryError ? (
            <Text style={styles.errorText}>{expiryError}</Text>
          ) : null}
          {cvcError ? <Text style={styles.errorText}>{cvcError}</Text> : null}

          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[styles.checkbox, saveCard && styles.checkboxChecked]}
              onPress={() => setSaveCard(!saveCard)}>
              {saveCard && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.secureText}>
              Save this card for future transactions
            </Text>
          </View>
        </View>
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
        title={'Subscribed Successful!'}
        onClose={() => {
          setSuccessModal(false);
        }}
        bottonText={'Continue'}
        onSubmit={() => {
          dispatch(loginUser({data: {name: name!, password: password!, role}}));
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
  methodContainer: {
    marginVertical: 10,
  },
  formContainer: {
    marginHorizontal: 15,
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
  total: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black6,
  },
  ReviewBookingContainer: {
    marginHorizontal: 14,
    marginVertical: 4,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.blueHue11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
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
    width: '96%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 15,
    marginTop: 60,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray70,
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
    fontSize: 12,
    color: colors.lightGray12,
    fontWeight: '400',
    marginTop: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.lightGray12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: colors.primary, // use your app’s primary blue
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 5,
    marginTop: 4,
  },
});

export default SubscribePaymentScreen;
