import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import colors from '../../styles/colors';
import AppHeader from '../../components/AppHeader';
import imagePath from '../../styles/imgPath';
import Button from '../../components/button';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

const ArticleDetailsScreen = () => {
  const route = useRoute<any>();
  const {
    title,
    article,
    selectedCategory,
    imageUri,
    author,
    date,
    views,
    viewScreenProp,
  } = route.params;
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const {user} = useSelector((state: RootState) => state.auth);
  const [viewScreen, setViewScreen] = useState(false);

  useEffect(() => {
    if (viewScreenProp) {
      setViewScreen(true);
    }
  }, [viewScreenProp]);

  return (
    <>
      {/* Header */}
      <AppHeader
        height={140}
        editButton={
          user?.role === 'mentor' ? (viewScreen ? true : false) : false
        }
        editButtonClick={() =>
          navigation.navigate('AddContentScreen', {
            title,
            article,
            selectedCategory,
            imageUri,
            author,
            date,
            views,
          })
        }
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 40}}>
        {/* Cover Image */}
        <Image
          source={
            user?.role === 'mentor' ? {uri: imageUri} : imagePath.ArticleImage
          }
          style={styles.coverImage}
        />

        <View style={styles.metaWrapper}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{selectedCategory}</Text>
          </View>
          <Text style={styles.metaText}>
            {date} • {views} views
          </Text>
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.authorWrapper}>
          <Image source={imagePath.profileUser} style={styles.authorImage} />
          <Text style={styles.authorText}>
            By: <Text style={styles.authorName}>{author}</Text>
          </Text>
        </View>

        <Text style={styles.content}>{article}</Text>
        {!viewScreen && (
          <>
            <Button
              title="Publish"
              style={styles.button}
              backgroundGradient={[colors.blue, colors.blue2]}
              textColor={colors.silver}
              onPress={() => setViewScreen(true)}
            />
            <TouchableOpacity
              style={[styles.button2, {backgroundColor: colors.green2}]}
              onPress={() =>
                navigation.navigate('AddContentScreen', {
                  title,
                  article,
                  selectedCategory,
                  imageUri,
                  author,
                  date,
                  views,
                })
              }>
              <Text style={[styles.statusText, {color: colors.silver}]}>
                {'Edit'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  coverImage: {
    width: '90%',
    height: 200,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 20,
  },
  metaWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: colors.lightGray13,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 8,
    color: colors.black,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '300',
    color: colors.gray2,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.black7,
    marginHorizontal: 20,
    marginTop: 12,
  },
  authorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
  },
  authorImage: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
  },
  authorText: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.black6,
  },
  authorName: {
    color: colors.black6,
    textDecorationLine: 'underline',
  },
  content: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.black7,
    lineHeight: 22,
    marginHorizontal: 20,
    marginTop: 8,
  },
  button: {
    width: '94%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 10,
  },
  button2: {
    width: '89%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 25,
    marginHorizontal: 20,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 15,
  },
});

export default ArticleDetailsScreen;
