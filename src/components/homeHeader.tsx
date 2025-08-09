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
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import HomeSearch from './homeSearch';

interface HomeHeaderProps {
  title: string;
  notifiction: () => void;
  ViewDetail: () => void;
  settingScreen: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  title,
  notifiction,
  ViewDetail,
  settingScreen,
}) => {
  const {user} = useSelector((state: RootState) => state.auth);

  return (
    <View
      style={[
        styles.headerWrapper,
        {height: user?.role === 'mentor' ? 250 : 220},
      ]}>
      <ImageBackground
        source={imgPath.headerBackground}
        style={styles.backgroundImg}
        resizeMode="cover">
        <View style={styles.headerContainer}>
          <View style={[styles.leftContainer]}>
            <View style={[styles.textContainer, {alignItems: 'flex-start'}]}>
              <ThemedText style={styles.headerTitle}>
                Welcome {title}!
              </ThemedText>
              <ThemedText style={styles.headerSubTitle}>
                {user?.role === 'mentor'
                  ? 'Let’s brighten up someone’s day'
                  : 'Let’s brighten your day together.'}
              </ThemedText>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={notifiction} style={styles.menuButton}>
              <svgPath.Notification
                width={24}
                height={24}
                fill={colors.blueHue5}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={settingScreen} style={styles.menuButton}>
              <Image
                source={imgPath.profileUser}
                style={styles.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        {user?.role === 'mentor' ? (
          <View style={styles.bottomContainer}>
            <ImageBackground
              source={imgPath.headerBackgroundWhite}
              style={styles.backgroundImg2}
              resizeMode="cover">
              <View style={styles.balanceContainer}>
                <View style={styles.balanceIcon}>
                  <svgPath.MyBalance width={34} height={34} />
                  <View>
                    <ThemedText style={styles.balanceTitle}>
                      My Balance
                    </ThemedText>
                    <ThemedText style={styles.balanceSubTitle}>
                      $ 1,286.00
                    </ThemedText>
                  </View>
                </View>
                <View>
                  <ButtonWithIcon
                    title="View Details"
                    style={styles.buttonUser}
                    backgroundColor={colors.primary}
                    textColor={colors.tertiary}
                    onPress={ViewDetail}
                    textStyle={styles.buttonText}
                    icon={<svgPath.Forward />}
                  />
                </View>
              </View>
            </ImageBackground>
          </View>
        ) : (
          <View style={styles.bottomContainer2}>
            <HomeSearch
              iconBackgroundColor={colors.white}
              iconColor={colors.primary}
            />
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  headerWrapper: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden', // This is key to apply radius to ImageBackground
  },
  backgroundImg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImg2: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
    marginTop: 70,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  image: {
    height: 40,
    width: 40,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.silver,
    maxWidth: '80%',
    textAlign: 'left',
  },
  headerSubTitle: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.silver,
  },
  balanceTitle: {
    fontSize: 14,
    fontWeight: 400,
    color: colors.black2,
  },
  balanceSubTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  menuButton: {
    padding: 8,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    width: '100%',
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bottomContainer2: {},
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 20,
    justifyContent: 'space-between',
  },
  balanceIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonUser: {
    width: 110,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: colors.tertiary,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
