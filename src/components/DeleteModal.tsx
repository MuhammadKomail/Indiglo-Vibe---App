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
  bottonText?: string;
}

const DeleteModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  onSubmit,
  headerImage,
  imageStyling,
  title,
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
          <Text style={styles.title}>{title}</Text>
          <Image source={headerImage} style={imageStyling} />
          <View style={styles.buttonRow}>
            <Button
              title={bottonText}
              style={styles.buttonUser}
              backgroundGradient={[colors.blue, colors.blue2]}
              textColor={colors.silver}
              onPress={onClose}
            />
            <Button
              title="Delete"
              style={styles.deleteButton}
              backgroundGradient={[colors.red, colors.red]}
              textColor={colors.white}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.black20,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  buttonUser: {
    flex: 1,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 5,
    // backgroundColor: colors.silver,
  },
  deleteButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 5,
    backgroundColor: colors.red,
  },
});

export default DeleteModal;
