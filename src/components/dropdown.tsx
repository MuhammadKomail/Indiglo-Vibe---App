import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  FlatList,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const CustomDropdown = ({
  data,
  onSelect,
  maxVisibleItems = 4,
  width = '80%',
  defaultValue = 'English',
}: {
  data: string[];
  onSelect: (item: string) => void;
  maxVisibleItems?: number;
  width?: number | `${number}%`;
  defaultValue?: string;
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(defaultValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const arrowRotation = useRef(new Animated.Value(0)).current;

  const ITEM_HEIGHT = 40;
  const MAX_HEIGHT = maxVisibleItems * ITEM_HEIGHT;

  useEffect(() => {
    setSelectedItem(defaultValue);
  }, [defaultValue]);

  const handleSelect = async (item: string) => {
    if (isAnimating) return;

    setSelectedItem(item);
    onSelect(item);

    setIsAnimating(true);
    Animated.parallel([
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(arrowRotation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
      setIsAnimating(false);
    });
  };

  const toggleDropdown = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (isOpen) {
      // Close dropdown
      Animated.parallel([
        Animated.timing(dropdownHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(arrowRotation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsOpen(false);
        setIsAnimating(false);
      });
    } else {
      // Open dropdown
      Animated.parallel([
        Animated.timing(dropdownHeight, {
          toValue: MAX_HEIGHT,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(arrowRotation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsOpen(true);
        setIsAnimating(false);
      });
    }
  };

  return (
    <View style={[styles.container, {width}]}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={toggleDropdown}
        activeOpacity={0.8}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.selectedText}>
          {selectedItem}
        </Text>
        <Animated.View
          style={{
            transform: [
              {
                rotate: arrowRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#000" />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.dropdownContainer,
          {
            height: dropdownHeight,
            opacity: dropdownHeight.interpolate({
              inputRange: [0, MAX_HEIGHT],
              outputRange: [0, 1],
            }),
          },
        ]}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelect(item)}
              disabled={isAnimating}
              activeOpacity={0.7}>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
          removeClippedSubviews={false}
        />
      </Animated.View>
    </View>
  );
};

const COLORS = {
  white: '#fff',
  gray: '#ccc',
  dark: '#333',
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  dropdownHeader: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between', // Keeps text and icon aligned
    marginHorizontal: 15,
    paddingHorizontal: 15,
  },
  selectedText: {
    color: COLORS.dark,
    flex: 1, // Allows text to shrink if necessary
    fontSize: 16,
  },
  dropdownContainer: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderRadius: 8,
    marginTop: 5,
    overflow: 'hidden',
    position: 'absolute',
    top: 55,
    left: 15,
    right: 15,
    zIndex: 1000,
  },
  item: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  itemText: {
    color: COLORS.dark,
    fontSize: 16,
  },
});

export default CustomDropdown;
