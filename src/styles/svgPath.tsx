// Centralized SVG path/component exports for consistent usage
// Usage: import { svgPath } from '../styles/svgPath';
// Then use: <svgPath.home width={24} height={24} />

import MentorsBottom from '../assets/images/svg/mentorsBottom.svg';
import ChatBottom from '../assets/images/svg/ChatBottom.svg';
import CalendarBottom from '../assets/images/svg/CalendarBottom.svg';
import threadBottom from '../assets/images/svg/threadBottom.svg';
import Home from '../assets/images/svg/Home.svg';
import ProfileBottom from '../assets/images/svg/profileBottom.svg';
import AddBottom from '../assets/images/svg/AddBottom.svg';
import HomeMentor from '../assets/images/svg/homeMentor.svg';
import MyBalance from '../assets/images/svg/MyBalance.svg';
import Notification from '../assets/images/svg/Notification.svg';
import Forward from '../assets/images/svg/Forward.svg';
import EditProfile from '../assets/images/svg/editProfile.svg';
import RightArrow from '../assets/images/svg/rightArrow.svg';
import Available from '../assets/images/svg/available.svg';
import EditProfileSetting from '../assets/images/svg/editProfileSetting.svg';
import GoAnonymous from '../assets/images/svg/GoAnonymous.svg';
import MyArticle from '../assets/images/svg/MyArticle.svg';
import NotificationSetting from '../assets/images/svg/notificationSetting.svg';
import ChangePassword from '../assets/images/svg/ChangePassword.svg';
import MyEarnings from '../assets/images/svg/MyEarnings.svg';
import TermsOfService from '../assets/images/svg/TermsOfService.svg';
import PrivacyPolicy from '../assets/images/svg/PrivacyPolicy.svg';
import Logout from '../assets/images/svg/Logout.svg';
import DeleteAccount from '../assets/images/svg/DeleteAccount.svg';
import FilterIcon from '../assets/images/svg/filterIcon.svg';
import Coins from '../assets/images/svg/coins.svg';
import Message from '../assets/images/svg/message.svg';
import Phone from '../assets/images/svg/phone.svg';
import Menu from '../assets/images/svg/Menu.svg';
import Clock from '../assets/images/svg/Clock.svg';
import Date from '../assets/images/svg/Date.svg';

export const svgPath = {
  MentorsBottom: MentorsBottom,
  ChatBottom: ChatBottom,
  CalendarBottom: CalendarBottom,
  threadBottom: threadBottom,
  HomeBottom: Home,
  ProfileBottom: ProfileBottom,
  AddBottom: AddBottom,
  HomeMentor: HomeMentor,
  MyBalance: MyBalance,
  Notification: Notification,
  Forward: Forward,
  EditProfile: EditProfile,
  RightArrow: RightArrow,
  Available: Available,
  EditProfileSetting: EditProfileSetting,
  GoAnonymous: GoAnonymous,
  MyArticle: MyArticle,
  NotificationSetting: NotificationSetting,
  ChangePassword: ChangePassword,
  MyEarnings: MyEarnings,
  TermsOfService: TermsOfService,
  PrivacyPolicy: PrivacyPolicy,
  Logout: Logout,
  DeleteAccount: DeleteAccount,
  FilterIcon: FilterIcon,
  Message: Message,
  Coins: Coins,
  Phone: Phone,
  Menu: Menu,
  Clock: Clock,
  Date: Date,
} as const;

export type SvgPath = keyof typeof svgPath;

// Type for image paths to enable autocomplete and type checking
export type ImagePath = (typeof svgPath)[keyof typeof svgPath];
