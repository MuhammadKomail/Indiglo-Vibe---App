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
  notification: string;
  time: string;
  type: string;
}

const NotificationBox: React.FC<SettingsRowProps> = ({
  notification,
  time,
  type,
}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.left}>
        <View style={styles.icon}>
          {type === 'chat' ? <svgPath.Message /> : <svgPath.Phone />}
        </View>
        <View>
          <Text style={styles.label}>{notification}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: colors.silver,
    backgroundColor: colors.white,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    backgroundColor: colors.blueHue6,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.black,
  },
  time: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.grayDark,
  },
});
