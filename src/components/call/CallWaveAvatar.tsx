import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, View} from 'react-native';
import colors from '../../styles/colors';

interface Props {
  avatarUrl?: string;
  size?: number;
  active?: boolean; // when true, shows pulsing waves
}

const CallWaveAvatar: React.FC<Props> = ({
  avatarUrl,
  size = 120,
  active = false,
}) => {
  const scale1 = useRef(new Animated.Value(0)).current;
  const scale2 = useRef(new Animated.Value(0)).current;
  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      scale1.stopAnimation();
      scale2.stopAnimation();
      opacity1.stopAnimation();
      opacity2.stopAnimation();
      scale1.setValue(0);
      scale2.setValue(0);
      opacity1.setValue(0);
      opacity2.setValue(0);
      return;
    }

    const makeWave = (
      scale: Animated.Value,
      opacity: Animated.Value,
      delay = 0,
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1,
              duration: 1400,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1400,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          // reset instantly to start values for next loop
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );

    opacity1.setValue(0.6);
    opacity2.setValue(0.6);
    const w1 = makeWave(scale1, opacity1, 0);
    const w2 = makeWave(scale2, opacity2, 500);

    w1.start();
    w2.start();

    return () => {
      w1.stop();
      w2.stop();
    };
  }, [active, opacity1, opacity2, scale1, scale2]);

  const waveSize = size + 36;

  return (
    <View style={[styles.container, {width: waveSize, height: waveSize}]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.wave,
          {
            opacity: opacity1,
            transform: [
              {
                scale: scale1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.3],
                }),
              },
            ],
            width: waveSize,
            height: waveSize,
            borderRadius: waveSize / 2,
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.wave,
          {
            opacity: opacity2,
            transform: [
              {
                scale: scale2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.3],
                }),
              },
            ],
            width: waveSize,
            height: waveSize,
            borderRadius: waveSize / 2,
          },
        ]}
      />
      <View
        style={[
          styles.avatarHolder,
          {width: size, height: size, borderRadius: size / 2},
        ]}>
        {avatarUrl ? (
          <Image
            source={{uri: avatarUrl}}
            style={{width: size, height: size, borderRadius: size / 2}}
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              {width: size, height: size, borderRadius: size / 2},
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
    backgroundColor: colors.iosBlue20,
  },
  avatarHolder: {
    overflow: 'hidden',
    backgroundColor: colors.grayEEE,
  },
  placeholder: {
    backgroundColor: colors.graySystem,
  },
});

export default CallWaveAvatar;
