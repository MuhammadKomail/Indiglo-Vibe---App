import React from 'react';
import {View, Text, Animated, StyleSheet, PanResponder} from 'react-native';
import colors from '../styles/colors';
import Button from '../components/button';

interface BottomPanelProps {
  slideAnim: Animated.Value;
  panelType: 'chat' | 'call' | null;
  chatPrice: number;
  callPrice: number;
  closePanel: () => void;
}

const BottomPanel = ({
  slideAnim,
  panelType,
  chatPrice,
  callPrice,
  closePanel,
}: BottomPanelProps) => {
  const panelHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) slideAnim.setValue(1 - g.dy / 200);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 50) closePanel();
      else
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
    },
  });

  return (
    <Animated.View
      style={[styles.bottomPanel, {height: panelHeight}]}
      {...panResponder.panHandlers}>
      <View style={styles.panelContent}>
        <View>
          <Text style={styles.panelHeading}>Total Price</Text>
          <Text style={styles.price}>
            ${panelType === 'chat' ? chatPrice : callPrice}
            <Text style={styles.priceSub}> /30 min</Text>
          </Text>
        </View>
        <Button
          title={panelType === 'chat' ? 'Chat Now' : 'Call Now'}
          style={styles.panelBtn}
          backgroundGradient={[colors.blue, colors.blue2]}
          textColor={colors.silver}
          onPress={() =>
            console.log(panelType === 'chat' ? 'Chat Now' : 'Call Now')
          }
        />
      </View>
    </Animated.View>
  );
};

export default BottomPanel;

const styles = StyleSheet.create({
  bottomPanel: {
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 20,
    elevation: 5,
    zIndex: 2,
  },
  panelContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panelHeading: {fontSize: 10, fontWeight: '400', color: colors.gray3},
  price: {fontSize: 18, fontWeight: 'bold'},
  priceSub: {fontSize: 14, fontWeight: 'normal', color: colors.gray},
  panelBtn: {
    width: 175,
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 15,
  },
});
