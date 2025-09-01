import {
  StyleSheet,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from '@react-native-vector-icons/ionicons';
import colors from '../styles/colors';
import typography from '../styles/typography';
import {svgPath} from '../styles/svgPath';

const HomeSearch = ({
  iconBackgroundColor,
  searchbarBackground,
  onFilterPress,
}: {
  iconBackgroundColor: string;
  searchbarBackground?: string;
  onFilterPress?: () => void;
}) => {
  return (
    <View style={styles.searchContainer}>
      <View
        style={[
          styles.inputContainer,
          {flexDirection: 'row', backgroundColor: searchbarBackground},
        ]}>
        <View style={styles.iconContainer}>
          <Icon name="search" size={22} color={colors.blueHue4} />
        </View>
        <TextInput
          style={[styles.searchInput]}
          placeholder={'Search for Mentor'}
          placeholderTextColor={colors.gray}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: iconBackgroundColor}]}
        onPress={onFilterPress}>
        <svgPath.FilterIcon />
      </TouchableOpacity>
    </View>
  );
};

export default HomeSearch;

const styles = StyleSheet.create({
  searchContainer: {
    marginVertical: typography.fontSizes.size25,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  searchInput: {
    width: '70%',
    color: colors.black,
    fontFamily: typography.fontFamilies.mullish,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
});
