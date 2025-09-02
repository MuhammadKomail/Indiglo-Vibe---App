import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import React from 'react';
import {colors, imgPath, svgPath} from '../styles/style';
import {ThemedText} from './ThemedComponents';
import {useNavigation} from '@react-navigation/native';

interface AppHeaderProps {
  title?: string;
  height?: number;
  addIcon?: boolean;
  editButton?: boolean;
  addIconClick?: () => void;
  editButtonClick?: () => void;
  backPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  height = 160,
  addIcon = false,
  editButton = false,
  addIconClick,
  editButtonClick,
  backPress,
}) => {
  const navigation = useNavigation();

  const backClick = () => {
    if (backPress) {
      backPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.headerWrapper, {height: height}]}>
      <ImageBackground
        source={imgPath.headerBackground}
        style={styles.backgroundImg}
        resizeMode="cover">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={backClick} style={styles.menuButton}>
            <svgPath.Forward
              width={12}
              height={12}
              style={{transform: [{rotate: '180deg'}]}}
            />
          </TouchableOpacity>
          {title && !addIcon && (
            <>
              <ThemedText style={styles.headerTitle}>{title}</ThemedText>
              <ThemedText style={styles.headerTitle}> </ThemedText>
            </>
          )}
          {addIcon && (
            <>
              <ThemedText style={styles.headerTitle}>{title}</ThemedText>
              <TouchableOpacity
                onPress={addIconClick}
                style={styles.menuButton}>
                <svgPath.AddIcon
                  width={12}
                  height={12}
                  style={{transform: [{rotate: '180deg'}]}}
                />
              </TouchableOpacity>
            </>
          )}
          {editButton && (
            <>
              <ThemedText style={styles.headerTitle}> </ThemedText>
              <ThemedText style={styles.headerTitle}>{title}</ThemedText>
              <TouchableOpacity onPress={editButtonClick}>
                <ThemedText style={styles.editButton}>{'Edit'}</ThemedText>
              </TouchableOpacity>
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
  editButton: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
  menuButton: {
    padding: 10,
    borderColor: colors.silver,
    borderRadius: 12,
    borderWidth: 1,
  },
});
