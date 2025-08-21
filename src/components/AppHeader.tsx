import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {colors, imgPath, svgPath} from '../styles/style';
import {ThemedText} from './ThemedComponents';
import ButtonWithIcon from './ButtonWithIcon';
import {useNavigation} from '@react-navigation/native';

interface AppHeaderProps {
  title?: string;
  backIcon?: () => void;
  height?: number;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  backIcon,
  height = 160,
}) => {
  const navigation = useNavigation();

  const backClick = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.headerWrapper, {height: height}]}>
      <ImageBackground
        source={imgPath.headerBackground}
        style={styles.backgroundImg}
        resizeMode="cover">
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={backClick} style={styles.menuButton}>
            <svgPath.Forward
              width={12}
              height={12}
              style={{transform: [{rotate: '180deg'}]}}
            />
          </TouchableOpacity>
          {title && (
            <>
              <ThemedText style={styles.headerTitle}>{title}</ThemedText>
              <ThemedText style={styles.headerTitle}> </ThemedText>
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  headerWrapper: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  backgroundImg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
    marginTop: 70,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.silver,
    maxWidth: '80%',
    textAlign: 'left',
  },
  menuButton: {
    padding: 10,
    borderColor: colors.silver,
    borderRadius: 12,
    borderWidth: 1,
  },
});
