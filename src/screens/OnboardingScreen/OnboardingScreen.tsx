import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {colors, imgPath} from '../../styles/style';
import navigate from '../../navigation/navigationService';

const {width, height} = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Insight, Energy.',
    image: imgPath.onboarding1,
    description:
      'Welcome to Indiglo Vibe — a safe space where empathy meets opportunity.',
  },
  {
    title: 'Connect, Understand, Thrive.',
    image: imgPath.onboarding2,
    description:
      'Find mentors, enjoy anonymity and build meaningful connections safely.',
  },
  {
    title: 'Empower Yourself and Others.',
    image: imgPath.onboarding3,
    description:
      'Whether you’re seeking support or want to give back, Indiglo Vibe is your platform to change lives and uplift spirits. Let’s create positivity together!',
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleContinue = () => {
    navigate.navigate('select-role-screen');
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.page}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={imgPath.backgroundImg}
      style={styles.backgroundImg}
      resizeMode="cover">
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleContinue}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Onboarding slides */}
      <FlatList
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        ref={flatListRef}
        removeClippedSubviews={false}
      />

      {/* Dots indicator */}
      <View style={styles.dotsContainerWrapper}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>
          <Text style={styles.continueText}>→</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
  },
  page: {
    width,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    width,
    height: height * 0.55,
    resizeMode: 'cover',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'left',
  },
  description: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'left',
    marginTop: 12,
    lineHeight: 24,
  },
  skipButton: {
    position: 'absolute',
    top: 70,
    right: 20,
    zIndex: 1,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skipText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    marginHorizontal: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    marginHorizontal: 4,
    opacity: 0.3,
  },
  activeDot: {
    width: 20,
    backgroundColor: colors.lightGray,
    opacity: 1,
  },
  continueButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 50,
    width: 62,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    fontSize: 24,
    color: colors.secondary,
  },
});

export default OnboardingScreen;
