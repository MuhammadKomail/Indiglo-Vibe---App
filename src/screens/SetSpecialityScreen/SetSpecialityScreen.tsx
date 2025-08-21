import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import colors from '../../styles/colors';
import Button from '../../components/button';
import {sections} from '../../utils/data';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import AppHeader from '../../components/AppHeader';

const SetSpecialityScreen = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    navigation.goBack();
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const renderTagItem = ({item}: {item: string}) => {
    const selected = selectedTags.includes(item);
    return (
      <TouchableOpacity
        style={[styles.tagButton, selected && styles.tagButtonSelected]}
        onPress={() => handleTagToggle(item)}>
        <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
          {selected ? '− ' : '+ '}
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSectionItem = ({item}: {item: (typeof sections)[0]}) => (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionHeader}>{item.title}</Text>
      <FlatList
        data={item.tags}
        keyExtractor={(tag, index) => tag + index}
        renderItem={renderTagItem}
        horizontal={false}
        numColumns={2}
        columnWrapperStyle={{gap: 8}}
        contentContainerStyle={{gap: 8}}
        scrollEnabled={false}
      />
    </View>
  );

  const headerComponent = () => {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.title}>Tell Users What You Can Help With</Text>
          <Text style={styles.subtitle}>
            Choose topics or areas you’d like to provide support in. We’ll match
            you with mentees who need your help.
          </Text>
        </View>
      </>
    );
  };

  const footerComponent = () => {
    return (
      <View style={styles.renderContainer}>
        <Button
          title={'Update'}
          style={styles.buttonUser}
          backgroundGradient={[colors.blue, colors.blue2]}
          textColor={colors.silver}
          onPress={handleNext}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>
      <AppHeader title="Set Specialties" backIcon={handleBack} />
      <FlatList
        data={sections}
        keyExtractor={(item, index) => item.title + index}
        renderItem={renderSectionItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={headerComponent}
        ListFooterComponent={footerComponent}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    marginHorizontal: 20,
  },
  renderContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    color: colors.blueHue,
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    color: colors.blueHue,
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
    marginBottom: 20,
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  bioInput: {
    height: 100, // or any value like 120, depending on your design
    borderWidth: 1,
    borderColor: colors.blueHue4,
    borderRadius: 8,
    marginBottom: 24,
    padding: 10,
    textAlignVertical: 'top', // ensure this is also here
  },
  sectionBlock: {
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    color: colors.blueHue,
  },
  tagButton: {
    borderColor: colors.black60,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.silver,
  },
  tagText: {
    fontSize: 14,
    color: colors.black60,
  },
  tagTextSelected: {
    color: colors.primary,
  },
  buttonUser: {
    width: '98%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 10,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 25,
  },
});

export default SetSpecialityScreen;
