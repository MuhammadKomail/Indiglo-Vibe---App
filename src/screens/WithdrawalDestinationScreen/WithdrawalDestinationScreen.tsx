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
import imagePath from '../../styles/imgPath';
import Button from '../../components/button';
import {svgPath} from '../../styles/svgPath';
import SuccessModal from '../../components/SuccessModal';
import {banks} from '../../utils/data';

const WithdrawalDestinationScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const [selected, setSelected] = useState<'master' | 'add'>('master');
  const [successModal, setSuccessModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Errors
  const [bankError, setBankError] = useState('');
  const [accountError, setAccountError] = useState('');

  const handleUpdate = () => {
    let valid = true;
    setBankError('');
    setAccountError('');

    if (selected === 'add') {
      if (!selectedBank) {
        setBankError('Please select a bank.');
        valid = false;
      }
      if (!accountNumber) {
        setAccountError('Account number is required.');
        valid = false;
      } else if (!/^\d{8,17}$/.test(accountNumber)) {
        setAccountError('Account number must be between 8 and 17 digits.');
        valid = false;
      }
    }

    if (valid) {
      setSuccessModal(true);
    }
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
        <Text style={styles.headerTitle}>Withdrawal Destination</Text>
        <View style={{width: 40}} />
      </View>
      <ScrollView>
        {/* Payment Methods */}
        <View style={styles.methodContainer}>
          {/* Master Card */}
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
              <Text style={styles.methodText}>Add Another Bank</Text>
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
            <Text style={styles.formLabel}>Bank Information</Text>

            {/* Dropdown for Bank */}
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setDropdownVisible(!dropdownVisible)}>
              <View style={styles.dropdownTextContainer}>
                <svgPath.SelectBank width={20} height={20} />
                <Text
                  style={{
                    color: selectedBank ? colors.black : colors.lightGray9,
                  }}>
                  {selectedBank || 'Choose Bank'}
                </Text>
              </View>
              <svgPath.DownArrow width={16} height={16} />
            </TouchableOpacity>
            {bankError ? (
              <Text style={styles.errorText}>{bankError}</Text>
            ) : null}

            {dropdownVisible && (
              <View style={styles.dropdownList}>
                {banks.map((bank, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedBank(bank);
                      setDropdownVisible(false);
                    }}>
                    <Text style={styles.dropdownText}>{bank}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Account Number Input */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Account Number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                style={styles.inputField}
                keyboardType="numeric"
                placeholderTextColor={colors.lightGray9}
              />
            </View>
            {accountError ? (
              <Text style={styles.errorText}>{accountError}</Text>
            ) : null}
          </View>
        )}
        <Button
          title="Add Now"
          style={styles.buttonUser}
          backgroundGradient={[colors.blue, colors.blue2]}
          textColor={colors.silver}
          onPress={() => handleUpdate()}
        />
      </ScrollView>
      <SuccessModal
        visible={successModal}
        headerImage={imagePath.AddBank}
        imageStyling={styles.headerImage}
        title={'Bank Added Successfully'}
        onClose={() => {
          setSuccessModal(false);
        }}
        bottonText={'Home'}
        onSubmit={() => {
          navigation.navigate('BottomTabs');
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
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.blueHue,
  },
  methodContainer: {
    marginTop: 20,
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
  dropdownTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    color: colors.black6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.silver,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.silver,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  dropdownList: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray10,
    marginBottom: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray10,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.black,
  },
  headerImage: {
    width: 200,
    height: 131,
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
    marginTop: 40,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    // marginBottom: 8,
    marginLeft: 5,
    marginTop: 4,
  },
});

export default WithdrawalDestinationScreen;
