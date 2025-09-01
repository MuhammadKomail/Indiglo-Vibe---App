import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors, svgPath} from '../styles/style';
import {useNavigation} from '@react-navigation/native';
import {ThemedText} from './ThemedText';

interface AuthHeaderProps {
  title?: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({title}) => {
  const navigation = useNavigation();

  const backClick = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={backClick} style={styles.backButton}>
        <svgPath.BackArrow width={12} height={12} />
      </TouchableOpacity>
      {title && <ThemedText style={styles.headerTitle}>{title}</ThemedText>}
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blueHue,
    maxWidth: '80%',
    textAlign: 'left',
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    borderColor: colors.lightGray10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
