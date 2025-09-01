import React, {useState} from 'react';
import {StyleSheet, View, FlatList, TextInput} from 'react-native';
import colors from '../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import AppHeader from '../../components/AppHeader';
import {articles} from '../../utils/data'; // create dummy articles data
import ArticleBox from '../../components/ArticleBox';
import Icon from '@react-native-vector-icons/ionicons';
import {useRoute, RouteProp} from '@react-navigation/native';

type ArticlesScreenRouteProp = RouteProp<
  {
    Articles: {
      headerTitle?: string;
    };
  },
  'Articles'
>;

const ArticlesScreen = () => {
  const {params} = useRoute<ArticlesScreenRouteProp>();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [search, setSearch] = useState('');

  const filteredArticles = articles.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({item}: {item: (typeof articles)[0]}) => (
    <ArticleBox
      image={item.image}
      title={item.title}
      description={item.description}
      date={item.date}
    />
  );

  return (
    <>
      <AppHeader
        title={params?.headerTitle ? params?.headerTitle : 'Articles'}
        height={140}
        addIcon={!params?.headerTitle ? true : false}
        addIconClick={() => navigation.navigate('AddContentScreen')}
      />

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.iconContainer}>
          <Icon name="search" size={22} color={colors.blueHue4} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.grayDark}
        />
      </View>

      {/* Articles List */}
      <FlatList
        data={filteredArticles}
        keyExtractor={(item, index) => item.title + index}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContent}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingBottom: 20,
  },
  searchWrapper: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: colors.offWhite,
    borderRadius: 12,
    // paddingHorizontal: 12,
    // paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ArticlesScreen;
