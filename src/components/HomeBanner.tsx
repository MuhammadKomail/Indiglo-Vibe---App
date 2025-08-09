import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import HomeBannerBg from '../assets/images/HomeBannerBg.png'; // change to your actual path
import HomeBannerImage from '../assets/images/HomeBannerImage.png'; // change to your actual path
import {colors} from '../styles/style';
import ButtonWithIcon from './ButtonWithIcon';

const HomeBanner = () => {
  const ViewDetail = () => {
    return;
  };
  return (
    <View style={styles.headerWrapper}>
      <ImageBackground
        source={HomeBannerBg}
        style={styles.banner}
        resizeMode="cover">
        <View style={styles.content}>
          {/* Left Side */}
          <View style={styles.left}>
            <Text style={styles.heading}>Not Sure Who to Choose?</Text>
            <Text style={styles.subheading}>
              Get matched with the perfect mentor for your needs in just one
              tap.
            </Text>

            {/* <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Find My Mentor</Text>
                        </TouchableOpacity> */}
            <ButtonWithIcon
              title="Find My Mentor"
              style={styles.button}
              backgroundColor={colors.primary}
              textColor={colors.blueHue}
              onPress={ViewDetail}
              textStyle={styles.buttonText}
            />
          </View>

          {/* Right Side */}
          <View style={styles.right}>
            <Image
              source={HomeBannerImage}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HomeBanner;

const styles = StyleSheet.create({
  headerWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  banner: {
    // width: '100%',
    paddingVertical: 20,
    borderRadius: 14,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  left: {
    flex: 1,
    paddingRight: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 12,
    color: colors.white2,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    width: 120,
    borderRadius: 7,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.blueHue,
    fontWeight: 'bold',
    fontSize: 12,
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  image: {
    width: '100%',
    height: 120,
  },
});
