import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Text,
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

type Role = 'mentor' | 'user';

const EditProfileScreen = () => {
  const {user} = useSelector((state: RootState) => state.auth);

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const backIcon = () => navigation.goBack();

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

  return (
    <KeyboardAvoidingView style={{flex: 1}} keyboardVerticalOffset={80}>
      <ThemedView style={styles.mainContainer}>
        <AppHeader backIcon={backIcon} title="Edit Profile" height={205} />
        <View style={styles.profileContainer}>
          <Image source={imagePath.profileUser} style={styles.profileImage} />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => navigation.goBack()}>
            <svgPath.EditProfile width={15} height={15} fill={colors.white} />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
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
          />
          <Input
            title="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
          <InputTextPhoneNumber
            textLable="Phone Number"
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            onChangeText={handlePhoneInputChange}
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
            </>
          )}
          <Button
            title="Update"
            style={styles.buttonUser}
            backgroundGradient={[colors.blue, colors.blue2]}
            textColor={colors.silver}
            onPress={() => navigation.goBack()}
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
});
