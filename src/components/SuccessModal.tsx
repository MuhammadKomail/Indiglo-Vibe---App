import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  StatusBar,
  Platform,
  ImageSourcePropType,
  Image,
  StyleProp,
  ImageStyle,
} from 'react-native';
import colors from '../styles/colors';
import Button from './button';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  headerImage: ImageSourcePropType;
  imageStyling?: StyleProp<ImageStyle>;
  title?: string;
  description?: string;
  bottonText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  onSubmit,
  headerImage,
  imageStyling,
  title,
  description,
  bottonText = 'Continue',
}) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(
        visible ? 'rgba(0, 0, 0, 0.5)' : colors.white,
      );
      StatusBar.setBarStyle(visible ? 'light-content' : 'dark-content');
    }

    return () => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(colors.white);
        StatusBar.setBarStyle('dark-content');
      }
    };
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.contentBox}>
          <Image source={headerImage} style={imageStyling} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Button
            title={bottonText}
            style={styles.buttonUser}
            backgroundGradient={[colors.blue, colors.blue2]}
            textColor={colors.silver}
            onPress={handleSubmit}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 44,
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black2,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.4,
  },
  buttonUser: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default SuccessModal;
