import React, {useEffect, useRef} from 'react';
import {Pressable, StyleSheet, Animated, ViewStyle} from 'react-native';
import colors from '../styles/colors';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  width?: number; // default 52
  height?: number; // default 32
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
  width = 52,
  height = 32,
}) => {
  const padding = 2;
  const thumbSize = height - padding * 2; // circle
  const travel = width - thumbSize - padding * 2; // horizontal travel distance

  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travel],
  });

  const trackColor = value ? colors.primary : colors.silver;
  const opacity = disabled ? 0.6 : 1;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{checked: value, disabled}}
      onPress={() => !disabled && onValueChange(!value)}
      style={[
        {
          width,
          height,
          borderRadius: height / 2,
          backgroundColor: trackColor,
          padding,
          opacity,
        },
        styles.track,
        style,
      ]}>
      <Animated.View
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            transform: [{translateX}],
            backgroundColor: colors.white,
          },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
    elevation: 2,
  },
});

export default CustomSwitch;
