import React, {useState} from 'react';
import {StyleSheet, TextInput, View, ViewStyle, TextStyle} from 'react-native';
import colors from '../styles/colors';
import {ThemedText} from './ThemedText';

export type countriesDataItem = {
  countryName: string;
  countryDialCode: string;
  emoji?: string;
  code: string;
};

interface InputTextPhoneNumberProps {
  textLable?: string;
  textInputStyle?: TextStyle;
  textLabelStyle?: TextStyle;
  viewStyle?: ViewStyle;
  onChangeText: (countryCode: string, phoneNumber: string) => void;
  value?: string;
  countryCode?: string;
  phoneNumber?: string;
  sendPackage?: boolean;
}

const InputTextPhoneNumber: React.FC<InputTextPhoneNumberProps> = ({
  textLable,
  textInputStyle,
  textLabelStyle,
  viewStyle,
  onChangeText,
  countryCode = '',
  phoneNumber = '',
  sendPackage = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handlePhoneNumberChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    onChangeText(countryCode, numericText);
  };

  return (
    <View style={[styles.container, viewStyle]}>
      {textLable && (
        <ThemedText style={[styles.label, textLabelStyle]}>
          {textLable}
        </ThemedText>
      )}
      <View style={[styles.inputRow, {marginTop: sendPackage ? 0 : 10}]}>
        <TextInput
          style={[
            styles.countryCodeInput,
            {
              borderColor: isFocused ? colors.primary : colors.blueHue4,
            },
            textInputStyle,
          ]}
          placeholder="+1"
          value={countryCode}
          editable={false}
          placeholderTextColor={colors.black20}
        />
        <View style={styles.space} />
        <TextInput
          style={[
            styles.phoneNumberInput,
            {
              borderColor: isFocused ? colors.primary : colors.blueHue4,
            },
            textInputStyle,
          ]}
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="numeric"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.black20}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.black2,
    marginBottom: 8,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  countryCodeInput: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.black,
    borderWidth: 1,
    width: '15%',
    textAlign: 'center',
  },
  space: {
    width: 8,
  },
  phoneNumberInput: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.black,
    borderWidth: 1,
    flex: 1,
  },
});

export default InputTextPhoneNumber;
