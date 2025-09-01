import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';
import imagePath from '../../styles/imgPath';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigationTypes';
import colors from '../../styles/colors';
import Button from '../../components/button';
import {sections} from '../../utils/data';
import AuthHeader from '../../components/AuthHeader';
import {loginUser} from '../../redux/actions/authAction/authAction';
import {useAppDispatch} from '../../redux/store';

const ProfileSetupScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'profile-setup-screen'>
> = ({route, navigation}) => {
  const {role, name, password} = route.params;

  const dispatch = useAppDispatch();

  const [bio, setBio] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // error states
  const [bioError, setBioError] = useState('');
  const [tagsError, setTagsError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setBioError('');
    setTagsError('');

    if (role === 'mentor') {
      if (!bio.trim()) {
        setBioError('Bio is required');
        isValid = false;
      } else if (bio.trim().length < 20) {
        setBioError('Bio must be at least 20 characters long');
        isValid = false;
      }
    }

    if (selectedTags.length === 0) {
      setTagsError(
        role === 'user'
          ? 'Please select at least one topic you need help with'
          : 'Please select at least one area you can help with',
      );
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      if (role === 'user') {
        dispatch(loginUser({data: {name: name!, password: password!, role}}));
      } else {
        navigation.navigate('availability-screen', {
          name: name!,
          password: password!,
          role,
        });
      }
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
        removeClippedSubviews={false}
      />
    </View>
  );

  const headerComponent = () => {
    return (
      <>
        <AuthHeader />
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
                style={[
                  styles.bioInput,
                  {borderColor: bioError ? colors.red : colors.blueHue4},
                ]}
                multiline
                numberOfLines={4}
                placeholder="Tell the user about yourself"
                value={bio}
                onChangeText={setBio}
                textAlignVertical="top"
                placeholderTextColor={colors.black20}
              />
              {bioError ? (
                <Text style={styles.errorText}>{bioError}</Text>
              ) : null}

              <Text style={styles.title2}>
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
        {tagsError ? <Text style={styles.errorText}>{tagsError}</Text> : null}
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
        // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
        <FlatList
          data={sections}
          keyExtractor={(item, index) => item.title + index}
          renderItem={renderSectionItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={headerComponent}
          ListFooterComponent={footerComponent}
          removeClippedSubviews={false}
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
  title: {
    color: colors.blueHue,
    fontSize: 16,
    fontWeight: '500',
  },
  title2: {
    marginTop: 24,
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
    color: colors.blueHue,
  },
  bioInput: {
    flex: 1,
    height: 100, // or any value like 120, depending on your design
    borderWidth: 1,
    borderColor: colors.blueHue4,
    borderRadius: 8,
    padding: 10,
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
    marginTop: 25,
    marginBottom: 25,
  },
  errorText: {color: colors.red, marginTop: 4, marginLeft: 4, fontSize: 12},
});

export default ProfileSetupScreen;
