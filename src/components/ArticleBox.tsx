import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import colors from '../styles/colors';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

interface ArticleBoxProps {
  image: any;
  title: string;
  description: string;
  date: string;
}

const ArticleBox: React.FC<ArticleBoxProps> = ({
  image,
  title,
  description,
  date,
}) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('ArticleDetailsScreen', {
          title,
          article: description,
          selectedCategory: 'Tips',
          imageUri: image,
          author: 'Mason Eduard', // you can later make this dynamic
          date: new Date().toDateString(),
          views: Math.floor(Math.random() * 5000), // fake views for now
          viewScreenProp: true,
        })
      }>
      {/* Thumbnail */}
      <Image source={image} style={styles.image} />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ArticleBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: colors.silver,
    backgroundColor: colors.white,
  },
  image: {
    width: 94,
    height: 62,
    borderRadius: 6,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black7,
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.black,
    opacity: 0.5,
  },
  description: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.black,
    opacity: 0.7,
    marginTop: 4,
  },
});
