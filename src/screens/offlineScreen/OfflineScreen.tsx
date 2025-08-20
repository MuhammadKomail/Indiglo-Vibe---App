import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {imgPath, defaultStyles, colors} from '../../styles/style';
import {useTheme} from '../../theme/ThemeContext';
import {lightTheme} from '../../theme/theme';
const OfflineScreen = () => {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme === 'dark' ? lightTheme.background : colors.white,
        },
      ]}>
      <Image
        source={imgPath.internet}
        resizeMode="contain"
        style={defaultStyles.imgStyles}
      />
      <Text
        style={[
          defaultStyles.notFoundHeading,
          {color: theme === 'dark' ? lightTheme.text : colors.black},
        ]}>
        No Internet
      </Text>
      <Text
        style={[
          defaultStyles.notFoundDescription,
          {color: theme === 'dark' ? lightTheme.text : undefined},
        ]}>
        Seems like you dont have internet access, connect with stable network
        and try again.
      </Text>
    </View>
  );
};

export default OfflineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    display: 'flex',
    paddingVertical: '40%',
    gap: 20,
  },
});
