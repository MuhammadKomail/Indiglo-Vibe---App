import {
  StyleSheet,
  FlatList,
  Alert,
  View,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ThemedView} from '../../components/ThemedComponents';
import colors from '../../styles/colors';
import AppHeader from '../../components/AppHeader';
import SettingsRow from '../../components/SettingsRow';
import {svgPath} from '../../styles/svgPath';
import imagePath from '../../styles/imgPath';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/actions/authAction/authAction';
import {ThemedText} from '../../components/ThemedText';
import {RootState} from '../../redux/store';

type Role = 'mentor' | 'user';

interface OptionType {
  label: string;
  icon: any;
  type?: 'switch' | 'logout' | 'delete';
  screen?: string;
  state?: boolean;
  setState?: (val: boolean) => void;
}

const SettingScreen = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [availableNow, setAvailableNow] = useState(false);
  const [goAnonymous, setGoAnonymous] = useState(false);

  const backIcon = () => navigation.goBack();

  const mentorOptions: OptionType[] = [
    {
      label: 'Available Right Now',
      type: 'switch',
      state: availableNow,
      setState: setAvailableNow,
      icon: <svgPath.Available width={40} height={40} />,
    },
    {
      label: 'Go Anonymous',
      type: 'switch',
      state: goAnonymous,
      setState: setGoAnonymous,
      icon: <svgPath.GoAnonymous width={40} height={40} />,
    },
    {
      label: 'Edit Profile',
      screen: 'EditProfileScreen',
      icon: <svgPath.EditProfileSetting width={40} height={40} />,
    },
    {
      label: 'My Articles',
      screen: 'MyArticles',
      icon: <svgPath.MyArticle width={40} height={40} />,
    },
    {
      label: 'Notifications',
      screen: 'NotificationScreen',
      icon: <svgPath.NotificationSetting width={40} height={40} />,
    },
    {
      label: 'Change Password',
      screen: 'ChangePassword',
      icon: <svgPath.ChangePassword width={40} height={40} />,
    },
    {
      label: 'My Earning',
      screen: 'MyEarning',
      icon: <svgPath.MyEarnings width={40} height={40} />,
    },
    {
      label: 'Terms of Services',
      screen: 'Terms',
      icon: <svgPath.TermsOfService width={40} height={40} />,
    },
    {
      label: 'Privacy Policy',
      screen: 'Privacy',
      icon: <svgPath.PrivacyPolicy width={40} height={40} />,
    },
    {
      label: 'Log Out',
      type: 'logout',
      icon: <svgPath.Logout width={40} height={40} />,
    },
    {
      label: 'Delete Account',
      type: 'delete',
      icon: <svgPath.DeleteAccount width={40} height={40} />,
    },
  ];

  const userOptions: OptionType[] = [
    {
      label: 'Go Anonymous',
      type: 'switch',
      state: goAnonymous,
      setState: setGoAnonymous,
      icon: <svgPath.GoAnonymous width={40} height={40} />,
    },
    {
      label: 'Edit Profile',
      screen: 'EditProfileScreen',
      icon: <svgPath.EditProfileSetting width={40} height={40} />,
    },
    {
      label: 'Notifications',
      screen: 'NotificationScreen',
      icon: <svgPath.NotificationSetting width={40} height={40} />,
    },
    {
      label: 'Change Password',
      screen: 'ChangePassword',
      icon: <svgPath.ChangePassword width={40} height={40} />,
    },
    {
      label: 'Payment Details',
      screen: 'PaymentDetails',
      icon: <svgPath.MyEarnings width={40} height={40} />,
    },
    {
      label: 'Terms of Services',
      screen: 'Terms',
      icon: <svgPath.TermsOfService width={40} height={40} />,
    },
    {
      label: 'Privacy Policy',
      screen: 'Privacy',
      icon: <svgPath.PrivacyPolicy width={40} height={40} />,
    },
    {
      label: 'Log Out',
      type: 'logout',
      icon: <svgPath.Logout width={40} height={40} />,
    },
    {
      label: 'Delete Account',
      type: 'delete',
      icon: <svgPath.DeleteAccount width={40} height={40} />,
    },
  ];

  const data = user?.role === 'mentor' ? mentorOptions : userOptions;

  const handleAction = (item: OptionType) => {
    if (item.type === 'logout') {
      Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Log Out', onPress: () => dispatch(logout())},
      ]);
    } else if (item.type === 'delete') {
      Alert.alert(
        'Confirm Delete',
        'This action cannot be undone. Delete account?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => console.log('Account Deleted'),
          },
        ],
      );
    } else if (item.screen) {
      navigation.navigate(item.screen as never);
    }
  };

  const ListHeaderComponent = () => {
    return (
      <View style={styles.headerContainer}>
        <ThemedText style={styles.headerTitle}>Ben Harvey</ThemedText>
        <ThemedText style={styles.headerSubTitle}>
          benharvey@gmail.com
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <AppHeader backIcon={backIcon} />
      <View style={styles.profileContainer}>
        <Image source={imagePath.profileUser} style={styles.profileImage} />
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => navigation.navigate('EditProfileScreen' as never)}>
          <svgPath.EditProfile width={12} height={12} fill={colors.white} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        ListHeaderComponent={ListHeaderComponent}
        keyExtractor={item => item.label}
        ListFooterComponent={<View style={{height: 50}} />}
        renderItem={({item}) => (
          <SettingsRow
            icon={item.icon}
            label={item.label}
            isSwitch={item.type === 'switch'}
            value={item.type === 'switch' ? item.state : undefined}
            onToggle={
              item.type === 'switch' ? val => item.setState?.(val) : undefined
            }
            onPress={() => handleAction(item)}
          />
        )}
      />
    </ThemedView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
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
  profileContainer: {
    alignItems: 'center',
    marginTop: -70,
    // marginBottom: 20
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.white,
  },
  editIcon: {
    position: 'absolute',
    bottom: 4,
    right: '38%',
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 8,
  },
});
