import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import imagePath from '../../styles/imgPath';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigationTypes';
import colors from '../../styles/colors';
import Button from '../../components/button';

const sections = [
  {
    title: 'Emotional wellness',
    tags: [
      'Anxiety',
      'Depression',
      'Self-love',
      'Self-esteem',
      'Emotional Balance',
      'Loneliness',
    ],
  },
  {
    title: 'Trauma & Healing',
    tags: [
      'Trauma Recovery',
      'Grief Support',
      'Inner Child Work',
      'Abuse Headling',
      'Emotional Healing',
    ],
  },
  {
    title: 'Stress & Life Balance',
    tags: [
      'Stress Relief',
      'Burnout Recovery',
      'Mindfulness',
      'Work Life Balance',
      'Life Transitions',
    ],
  },
  {
    title: 'Relationships & Communication',
    tags: [
      'Relationships',
      'Conflict Resolution',
      'Boundaries',
      'Family Dynamics',
      'Workplace Dynamics',
    ],
  },
  {
    title: 'Identity & Purpose',
    tags: [
      'Self Discovery',
      'Spiritual Guidance',
      'Chakra Balancing',
      'LGBTQIA Support',
      'Purpose Finding',
    ],
  },
];

const ProfileSetupScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'profile-setup-screen'>
> = ({route, navigation}) => {
  const {role} = route.params;
  const [bio, setBio] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (role === 'user') {
      // navigation.navigate('availability-screen', { role: role });
    } else {
      navigation.navigate('availability-screen', {role: role});
    }
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
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons
            name="arrow-back-ios"
            size={16}
            color={colors.blueHue}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.title}>
            {role === 'user'
              ? 'Tell Us What You Need Help With'
              : 'Tell the users about yourself.'}
          </Text>
          <Text style={styles.subtitle}>
            {role === 'user'
              ? 'Choose topics or areas you’d like support in. We’ll match you with mentors who specialize in what matters to you.'
              : 'Provide details and gain trust!'}
          </Text>

          {role === 'mentor' && (
            <>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={styles.bioInput}
                multiline
                numberOfLines={4}
                placeholder="Tell the user about yourself"
                value={bio}
                onChangeText={setBio}
                textAlignVertical="top"
                placeholderTextColor={colors.black20}
              />
              <Text style={styles.title}>
                Tell Users What You Can Help With
              </Text>
              <Text style={styles.subtitle}>
                Choose topics or areas you’d like to provide support in. We’ll
                match you with mentees who need your help.
              </Text>
            </>
          )}
        </View>
      </>
    );
  };

  const footerComponent = () => {
    return (
      <View style={styles.renderContainer}>
        <Button
          title={role === 'user' ? 'Get Started' : 'Next'}
          style={styles.buttonUser}
          backgroundGradient={[colors.blue, colors.blue2]}
          textColor={colors.silver}
          onPress={handleNext}
        />
      </View>
    );
  };

  return (
    <ImageBackground
      source={imagePath.backgroundImage2}
      style={styles.backgroundImg}
      resizeMode="cover">
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
  },
  container: {
    marginTop: 120,
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
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    borderColor: colors.lightGray10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    marginLeft: 7,
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
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
    color: colors.blueHue,
  },
  tagButton: {
    borderColor: colors.black60,
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagButtonSelected: {
    borderColor: colors.primary,
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

export default ProfileSetupScreen;
