import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import colors from '../styles/colors';
import {ThemedIcon} from './ThemedIcon';
import {ThemedText} from './ThemedText';

interface InputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  backgroundColor?: string;
  unfocusedBorderColor?: string;
  title?: string;
}

const Input: React.FC<InputProps> = ({
  containerStyle,
  inputStyle,
  secureTextEntry,
  backgroundColor,
  unfocusedBorderColor,
  title,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = !!secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {title && <ThemedText style={styles.label}>{title}</ThemedText>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: backgroundColor || 'transparent',
            borderColor: unfocusedBorderColor || colors.blueHue4,
          },
          isFocused && styles.inputFocused,
          inputStyle,
          isPassword && {paddingRight: 40},
        ]}
        placeholderTextColor={colors.black20}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={isPassword && !showPassword}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setShowPassword(prev => !prev)}
          activeOpacity={0.7}>
          <ThemedIcon
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={35}
            color={colors.grayDark}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.black,
    marginBottom: 16,
    borderWidth: 1,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  eyeBtn: {
    position: 'absolute',
    right: 20,
    bottom: -6,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 8,
    zIndex: 2,
  },
  eyeIcon: {
    fontSize: 22,
    color: colors.grayDark,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.black2,
    marginBottom: 8,
    marginTop: 4,
  },
});

export default Input;
