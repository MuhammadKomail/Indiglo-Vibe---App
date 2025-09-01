import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  ImageBackground,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ThemedView} from '../../components/ThemedComponents';
import colors from '../../styles/colors';
import AppHeader from '../../components/AppHeader';
import {svgPath} from '../../styles/svgPath';
import imagePath from '../../styles/imgPath';
import Button from '../../components/button';
import {launchImageLibrary} from 'react-native-image-picker';
import {useRoute} from '@react-navigation/native';
import SuccessModal from '../../components/SuccessModal';

const categories = [
  'Self-Help Articles',
  'Motivation',
  'Wellness',
  'Lifestyle',
];

const AddContentScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const route = useRoute<any>();

  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [editButtons, setEditButtons] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);

  React.useEffect(() => {
    if (route.params) {
      const {title, article, selectedCategory, imageUri} = route.params;

      if (title) setTitle(title);
      if (article) setArticle(article);
      if (selectedCategory) setSelectedCategory(selectedCategory);
      if (imageUri) setImageUri(imageUri);
      setEditButtons(true);
    }
  }, [route.params]);

  const handleImageUpload = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      response => {
        if (response.didCancel) {
          return response.didCancel;
        } else if (response.errorCode) {
          return response.errorCode;
        } else if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri || null);
        }
      },
    );
  };

  const handlePreview = () => {
    if (!title.trim() || !article.trim() || !selectedCategory || !imageUri) {
      Alert.alert('All fields are required!');
      return;
    }

    navigation.navigate('ArticleDetailsScreen', {
      title,
      article,
      selectedCategory,
      imageUri,
      author: 'Mason Eduard', // you can later make this dynamic
      date: new Date().toDateString(),
      views: Math.floor(Math.random() * 5000), // fake views for now
    });
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} keyboardVerticalOffset={80}>
      <ThemedView style={styles.mainContainer}>
        <AppHeader title="Add Content" height={140} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Upload Image */}
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handleImageUpload}>
            {imageUri ? (
              <Image source={{uri: imageUri}} style={styles.uploadedImage} />
            ) : (
              <>
                <ImageBackground
                  source={imagePath.UploadImage}
                  style={styles.uploadBoxImage}>
                  <svgPath.ImageIcon />
                  <Text style={styles.uploadText}>Upload Image</Text>
                </ImageBackground>
              </>
            )}
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the title of your article"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={colors.black20}
            />
          </View>

          {/* Category Dropdown */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setDropdownVisible(!dropdownVisible)}>
              <Text
                style={{
                  color: selectedCategory ? colors.black : colors.blueHue,
                }}>
                {selectedCategory || 'Choose Category'}
              </Text>
              <svgPath.DownArrow
                width={18}
                height={18}
                stroke={colors.blueHue}
              />
            </TouchableOpacity>
            {dropdownVisible && (
              <View style={styles.dropdownList}>
                {categories.map((cat, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setDropdownVisible(false);
                    }}>
                    <Text style={styles.dropdownText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Article Content */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Article Content</Text>
            <TextInput
              style={styles.articleInput}
              multiline
              numberOfLines={6}
              placeholder="Share positivity....."
              value={article}
              onChangeText={setArticle}
              textAlignVertical="top"
              placeholderTextColor={colors.black20}
            />
          </View>

          {/* Preview Button */}
          {editButtons ? (
            <>
              <Button
                title="Update"
                style={styles.button}
                backgroundGradient={[colors.blue, colors.blue2]}
                textColor={colors.silver}
                onPress={() => setIsUpdateModalVisible(true)}
              />
              <TouchableOpacity
                style={[styles.button2, {backgroundColor: colors.red}]}
                onPress={() => setDeleteModal(true)}>
                <Text style={[styles.statusText, {color: colors.silver}]}>
                  {'Delete'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Button
              title="Preview"
              style={styles.button}
              backgroundGradient={[colors.blue, colors.blue2]}
              textColor={colors.silver}
              onPress={handlePreview}
            />
          )}
        </ScrollView>
      </ThemedView>
      <SuccessModal
        visible={isUpdateModalVisible}
        headerImage={imagePath.ContentUpdate}
        imageStyling={styles.headerImage}
        title={'Content Updated Successfully'}
        description={'See now how others will view it.'}
        onClose={() => {
          setIsUpdateModalVisible(false);
        }}
        bottonText={'Preview'}
        onSubmit={() => {
          navigation.navigate('ArticleDetailsScreen', {
            title,
            article,
            selectedCategory,
            imageUri,
            author: 'Mason Eduard', // you can later make this dynamic
            date: new Date().toDateString(),
            views: Math.floor(Math.random() * 5000), // fake views for now
            viewScreenProp: true,
          });
        }}
      />
      <SuccessModal
        visible={deleteModal}
        headerImage={imagePath.DeleteModal}
        imageStyling={styles.headerImage}
        title={'Content Deleted Successfully'}
        onClose={() => {
          setDeleteModal(false);
        }}
        bottonText={'Back'}
        onSubmit={() => {
          navigation.navigate('ArticlesScreen');
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default AddContentScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  uploadBox: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.black20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    gap: 10,
    backgroundColor: colors.black10,
  },
  uploadBoxImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.black20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // gap: 10,
    backgroundColor: colors.black10,
  },
  uploadText: {
    fontSize: 14,
    color: colors.white,
    marginTop: 8,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.black,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.black20,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.black20,
    borderRadius: 8,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.black10,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.black,
  },
  articleInput: {
    height: 150,
    borderWidth: 1,
    borderColor: colors.black20,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.black,
  },
  button: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 20,
  },
  button2: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 25,
    // marginHorizontal: 10,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 15,
  },
  headerImage: {
    width: 96,
    height: 96,
    marginBottom: 24,
  },
});
