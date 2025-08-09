import React from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ViewStyle,
  StyleSheet,
  View,
  TextStyle,
} from 'react-native';
import {colors} from '../styles/style';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  textColor?: string;
  style?: ViewStyle;
  icon?: React.ReactNode; // Optional icon component
  backgroundColor?: string; // Background color from parent
  textStyle?: TextStyle;
}

const ButtonWithIcon: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textColor = colors.white,
  icon,
  textStyle,
  backgroundColor = colors.primary, // fallback to default color
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      {...props}
      style={[
        styles.primaryButton,
        {backgroundColor}, // Dynamic background
        style,
      ]}>
      <View style={styles.content}>
        <Text style={[textStyle, {color: textColor}]}>{title}</Text>
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
};

export default ButtonWithIcon;

const styles = StyleSheet.create({
  primaryButton: {},
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 8,
  },
});
