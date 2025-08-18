import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  I18nManager,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import colors from '../styles/colors';
import {RootStackParamList} from '../types/navigationTypes';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import {useTranslation} from 'react-i18next';
import {svgPath} from '../styles/svgPath';
import LinearGradient from 'react-native-linear-gradient';
import {useAppSelector} from '../redux/store';
import {RootState} from '../redux/store';

const {width} = Dimensions.get('window');
const Tab = createBottomTabNavigator<RootStackParamList>();

const getIconComponent = (routeName: string, focused: boolean) => {
  switch (routeName) {
    case 'Mentors': {
      console.log('svgPath.MentorsBottom:', svgPath.MentorsBottom);
      const IconComponent = svgPath.MentorsBottom;
      return (
        <IconComponent
          width={24}
          height={24}
          fill={focused ? colors.blueHue5 : colors.blueHue5}
        />
      );
    }
    case 'Chat': {
      const IconComponent = svgPath.ChatBottom;
      return (
        <IconComponent
          width={24}
          height={24}
          fill={focused ? colors.blueHue5 : colors.blueHue5}
        />
      );
    }
    case 'Appointment': {
      const IconComponent = svgPath.CalendarBottom;
      return (
        <IconComponent
          width={24}
          height={24}
          fill={focused ? colors.blueHue5 : colors.blueHue5}
        />
      );
    }
    case 'Thread': {
      const IconComponent = svgPath.threadBottom;
      return (
        <IconComponent
          width={24}
          height={24}
          fill={focused ? colors.blueHue5 : colors.blueHue5}
        />
      );
    }
    default:
      return null;
  }
};

const getMentorIconComponent = (routeName: string, focused: boolean) => {
  switch (routeName) {
    case 'Home': {
      const IconComponent = svgPath.HomeMentor;
      return (
        <IconComponent
          width={24}
          height={24}
          fill={focused ? colors.blueHue5 : colors.blueHue5}
        />
      );
    }
    case 'Chat': {
      const IconComponent = svgPath.ChatBottom;
      return (
        <IconComponent
          width={24}
          height={24}
          fill={focused ? colors.blueHue5 : colors.blueHue5}
        />
      );
    }
    case 'Appointment': {
      const IconComponent = svgPath.CalendarBottom;
      return (
        <IconComponent
          width={24}
          height={24}
          fill={focused ? colors.blueHue5 : colors.blueHue5}
        />
      );
    }
    case 'Profile': {
      const IconComponent = svgPath.ProfileBottom;
      return (
        <IconComponent
          width={24}
          height={24}
          fill={focused ? colors.blueHue5 : colors.blueHue5}
        />
      );
    }
    default:
      return null;
  }
};

const CustomTabBar = (props: BottomTabBarProps) => {
  const {state, descriptors, navigation} = props;
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const {user} = useAppSelector((state: RootState) => state.auth);
  console.log('user', user);
  return (
    <View
      style={[
        styles.tabContainer,
        {flexDirection: isRTL ? 'row-reverse' : 'row'},
      ]}>
      {state.routes
        .filter(
          (route: any) => descriptors[route.key].options.tabBarButton == null,
        )
        .map((route: {key: string; name: string}, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              (navigation as any).navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.name}
              onPress={onPress}
              style={styles.tabButton}>
              <View style={styles.iconWrapper}>
                {user?.role === 'mentor'
                  ? getMentorIconComponent(route.name, isFocused)
                  : getIconComponent(route.name, isFocused)}
              </View>
              <Text style={[styles.tabText, isFocused && styles.focusedText]}>
                {t(route.name)}
              </Text>
            </TouchableOpacity>
          );
        })}

      <TouchableOpacity
        onPress={() => navigation.navigate('Profile', undefined)}
        style={[
          styles.middleButtonContainer,
          {
            [!isRTL ? 'right' : 'left']: width / 2 - 37,
          },
        ]}>
        <LinearGradient
          colors={['#122187', '#1D2BC5']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.middleButton}>
          {user?.role === 'mentor' ? (
            <svgPath.AddBottom width={24} height={24} fill={colors.white} />
          ) : (
            <svgPath.HomeBottom width={24} height={24} fill={colors.white} />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const BottomTab = () => {
  const {user} = useAppSelector((state: RootState) => state.auth);

  return user?.role === 'mentor' ? (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <CustomTabBar {...props} />}>
      {/* Visible tabs */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Thread" component={HomeScreen} />
      <Tab.Screen name="Appointment" component={ProfileScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  ) : (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <CustomTabBar {...props} />}>
      {/* Visible tabs */}
      <Tab.Screen name="Mentors" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Appointment" component={ProfileScreen} />
      <Tab.Screen name="Thread" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    elevation: 5,
    height: 90,
    paddingBottom: 10,
    position: 'relative',
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    paddingHorizontal: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  middleButtonContainer: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: colors.white,
    borderRadius: 80,
    padding: 5,
    zIndex: 10,
  },
  middleButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  tabText: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 5,
  },
  middleText: {
    color: colors.gray,
    fontSize: 12,
    // marginTop: 5,
    textAlign: 'center',
  },
  focusedText: {
    color: colors.primary,
    // fontWeight: 'bold',
  },
  iconWrapper: {
    position: 'relative',
  },
});

export default BottomTab;
