import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import colors from '../styles/colors';
import {svgPath} from '../styles/svgPath';

interface SettingsRowProps {
  icon: any; // can be require(...) or a React component
  label: string;
  isSwitch?: boolean;
  value?: boolean;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  isSwitch = false,
  value,
  onToggle,
  onPress,
}) => {
  const isImage = typeof icon === 'number'; // require(...) returns a number in RN

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={isSwitch ? 1 : 0.6}
      onPress={!isSwitch ? onPress : undefined}>
      <View style={styles.left}>
        {isImage ? <Image source={icon} style={styles.icon} /> : icon}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View>
        {isSwitch ? (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{false: colors.gray, true: colors.primary}}
          />
        ) : (
          <svgPath.RightArrow width={24} height={24} fill={colors.gray} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SettingsRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.silver,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 16,
    color: colors.blueHue,
  },
});
