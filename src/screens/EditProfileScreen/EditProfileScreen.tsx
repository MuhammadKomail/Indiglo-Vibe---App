import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  Text,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ThemedView} from '../../components/ThemedComponents';
import colors from '../../styles/colors';
import AppHeader from '../../components/AppHeader';
import {svgPath} from '../../styles/svgPath';
import imagePath from '../../styles/imgPath';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {ThemedText} from '../../components/ThemedText';
import Input from '../../components/Input';
import InputTextPhoneNumber from '../../components/InputTextPhoneNumber';
import Button from '../../components/button';
import {specialties} from '../../utils/data';
import {launchImageLibrary} from 'react-native-image-picker';

const EditProfileScreen = () => {
  const {user} = useSelector((state: RootState) => state.auth);

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<any>(imagePath.profileUser);
  const [imageError, setImageError] = useState('');

  // Error states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [bioError, setBioError] = useState('');
  const [interestsError, setInterestsError] = useState('');

  const handlePhoneInputChange = (
    newCountryCode: string,
    newPhoneNumber: string,
  ) => {
    setCountryCode(newCountryCode);
    setPhoneNumber(newPhoneNumber);
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

  const validateForm = () => {
    let isValid = true;

    // Reset all errors
    setUsernameError('');
    setEmailError('');
    setPhoneError('');
    setBioError('');
    setInterestsError('');
    setImageError('');

    // Profile image validation
    if (!profileImage?.uri) {
      setImageError('Profile image is required');
      isValid = false;
    }

    // Username validation
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Phone validation
    if (!phoneNumber.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (phoneNumber.length < 10) {
      setPhoneError('Phone number must be at least 10 digits');
      isValid = false;
    }

    // Mentor bio validation
    if (user?.role === 'mentor' && !bio.trim()) {
      setBioError('Bio is required for mentors');
      isValid = false;
    }

    // User interests validation
    if (user?.role === 'user' && selectedTags.length === 0) {
      setInterestsError('Please select at least one interest');
      isValid = false;
    }

    return isValid;
  };

  const handleUpdate = () => {
    if (validateForm()) {
      // Submit logic (API call or navigate back)
      navigation.goBack();
    }
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          return response.didCancel;
        } else if (response.errorCode) {
          return response.errorCode;
        } else if (response.assets && response.assets.length > 0) {
          const selected = response.assets[0];

          // Validate size (e.g., max 5MB)
          if (selected.fileSize && selected.fileSize > 5 * 1024 * 1024) {
            setImageError('Image must be less than 5MB');
            return;
          }

          // Validate type (only jpg/png allowed)
          if (
            selected.type &&
            !['image/jpeg', 'image/jpg', 'image/png'].includes(selected.type)
          ) {
            setImageError('Only JPG or PNG images are allowed');
            return;
          }

          setImageError('');
          setProfileImage({uri: selected.uri});
        }
      },
    );
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} keyboardVerticalOffset={80}>
      <ThemedView style={styles.mainContainer}>
        <AppHeader title="Edit Profile" height={205} />
        <View style={styles.profileContainer}>
          <Image source={profileImage} style={styles.profileImage} />
          <TouchableOpacity style={styles.editIcon} onPress={openGallery}>
            <svgPath.EditProfile width={15} height={15} fill={colors.white} />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.errorContainer}>
            {imageError ? (
              <Text style={styles.errorText2}>{imageError}</Text>
            ) : null}
          </View>
          <View style={styles.headerContainer}>
            <ThemedText style={styles.headerTitle}>Ben Harvey</ThemedText>
            <ThemedText style={styles.headerSubTitle}>
              benharvey@gmail.com
            </ThemedText>
          </View>
          <Input
            title="Username"
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            error={usernameError}
          />
          {user?.role === 'mentor' && (
            <View style={styles.bioContainer}>
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
                <Text style={styles.errorText2}>{bioError}</Text>
              ) : null}
            </View>
          )}
          <Input
            title="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
          />
          <InputTextPhoneNumber
            textLable="Phone Number"
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            onChangeText={handlePhoneInputChange}
            error={phoneError}
          />
          {user?.role === 'mentor' ? (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate('SetSpecialityScreen')}>
                <ThemedText style={styles.setSpecialties}>
                  Set Specialties
                </ThemedText>
              </TouchableOpacity>
              <Button
                title="Set Schedule"
                style={styles.buttonUser}
                backgroundGradient={[colors.blue, colors.blue2]}
                textColor={colors.silver}
                onPress={() => navigation.navigate('EditAvailabilityScreen')}
              />
            </>
          ) : (
            <>
              <Text style={styles.sectionHeader}>Edit Interests</Text>
              <View style={styles.sectionBlock}>
                <FlatList
                  data={specialties}
                  keyExtractor={(tag, index) => index.toString()}
                  renderItem={renderTagItem}
                  horizontal={false}
                  numColumns={2}
                  columnWrapperStyle={{gap: 8}}
                  contentContainerStyle={{gap: 8}}
                  scrollEnabled={false}
                />
              </View>
              {user?.role === 'user' && interestsError ? (
                <Text style={styles.errorText}>{interestsError}</Text>
              ) : null}
            </>
          )}
          <Button
            title="Update"
            style={styles.buttonUser}
            backgroundGradient={[colors.blue, colors.blue2]}
            textColor={colors.silver}
            onPress={handleUpdate}
          />
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -80,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderColor: colors.white,
    borderRadius: 150,
    borderWidth: 2,
  },
  editIcon: {
    position: 'absolute',
    bottom: 4,
    right: '34%',
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 15,
    marginTop: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black3,
    textAlign: 'center',
  },
  headerSubTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.blueHue4,
    textAlign: 'center',
  },
  setSpecialties: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 30,
  },
  buttonUser: {
    width: '95%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 15,
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.black2,
    marginTop: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionBlock: {
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 20,
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 6,
    color: colors.blueHue,
  },
  bioInput: {
    height: 100,
    borderWidth: 1,
    borderColor: colors.blueHue4,
    borderRadius: 8,
    // marginBottom: 14,
    padding: 10,
    textAlignVertical: 'top', // ensure this is also here
  },
  bioContainer: {
    marginHorizontal: 20,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 20,
  },
  errorText2: {
    color: colors.red,
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    alignItems: 'center',
  },
});
