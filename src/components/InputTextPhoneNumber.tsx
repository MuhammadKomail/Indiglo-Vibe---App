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
  error?: string;
  onEndEditing?: () => void; // optional blur callback for external validation
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
  error,
  onEndEditing,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handlePhoneNumberChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    onChangeText(countryCode, numericText);
  };

  const borderColor = error
    ? colors.red // 🔹 Red if error
    : isFocused
      ? colors.primary
      : colors.blueHue4;

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
              borderColor,
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
              borderColor,
            },
            textInputStyle,
          ]}
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="numeric"
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (onEndEditing) {
              onEndEditing();
            }
          }}
          placeholderTextColor={colors.black20}
        />
      </View>
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
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
    // marginBottom: 4,
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
  errorText: {
    marginTop: 6,
    color: colors.red,
    marginLeft: 4,
    width: '90%',
    fontSize: 14,
  },
});

export default InputTextPhoneNumber;
