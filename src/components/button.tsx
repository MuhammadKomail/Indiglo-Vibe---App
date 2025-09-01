import React from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import defaultStyles from '../styles/defaultStyles';
import {colors} from '../styles/style';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  backgroundGradient?: string[]; // <== NEW
  textColor?: string;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  backgroundGradient = [colors.primary, colors.primary], // Default fallback
  textColor = colors.white,
  ...props
}) => {
  return (
    <TouchableOpacity onPress={onPress} {...props} style={[style]}>
      <LinearGradient
        colors={backgroundGradient}
        start={{x: 1, y: 0}}
        end={{x: 0, y: 0}}
        style={[style]}>
        <Text style={[defaultStyles.primaryButtonText, {color: textColor}]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;
