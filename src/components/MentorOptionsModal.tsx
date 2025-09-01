// MentorOptionsModal.tsx
import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import colors from '../styles/colors';
import imgPath from '../styles/imgPath';
import {findMentorData} from '../utils/data';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const MentorOptionsModal: React.FC<Props> = ({visible, onClose}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const renderItem = ({item}: {item: (typeof findMentorData)[0]}) => (
    <TouchableOpacity
      style={[
        styles.option,
        selectedOption === item.key && styles.selectedOption,
      ]}
      onPress={() => setSelectedOption(item.key)}>
      <View style={styles.optionRow}>
        <Text
          style={[
            styles.optionTitle,
            selectedOption === item.key && {fontWeight: '500'},
          ]}>
          {item.title}
        </Text>
        <View
          style={[
            styles.checkbox,
            selectedOption === item.key && styles.checkboxActive,
          ]}>
          {selectedOption === item.key && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </View>
      <Text style={styles.optionDesc}>{item.desc}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <View />
      </Pressable>

      {/* Bottom Sheet */}
      <View style={styles.container}>
        <Image source={imgPath.FindMentorPopup} style={styles.imageTop} />
        <Text style={styles.title}>
          How would you like to connect with your Mentor?
        </Text>
        <Text style={styles.subtitle}>Connect with your mentor instantly.</Text>
        <Text style={styles.subtitle2}>Choose an option</Text>

        {/* Options with FlatList */}
        <FlatList
          data={findMentorData}
          keyExtractor={item => item.key}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 16}}
        />

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={{color: colors.gray}}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.confirmBtn,
              !selectedOption && {backgroundColor: colors.lightGray},
            ]}
            disabled={!selectedOption}
            onPress={() => {
              onClose();
            }}>
            <Text style={{color: colors.white}}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MentorOptionsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.black60,
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.gray3,
    marginBottom: 16,
  },
  subtitle2: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.primary,
    marginBottom: 16,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.lightGray100,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.blueHue,
  },
  optionDesc: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.lightGray15,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.lightGray8,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginLeft: 8,
  },
  imageTop: {
    width: 38,
    height: 38,
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 8,
    backgroundColor: colors.gray4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.white3,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
