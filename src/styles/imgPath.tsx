// Define image paths as constants to maintain consistency and avoid typos
import bgImg from '../assets/images/BackgroundImage.png';
import menuIcon from '../assets/images/menu.png';
import search from '../assets/images/search.png';
import onboarding1 from '../assets/images/onboarding1.png';
import onboarding2 from '../assets/images/onboarding2.png';
import onboarding3 from '../assets/images/onboarding3.png';
import logo from '../assets/images/IndiGloVibeLogo.png';
import backgroundImage2 from '../assets/images/backgroundImage2.png';
import GoogleIcon from '../assets/images/google.png';
import resetPasswordSuccess from '../assets/images/resetPasswordSuccess.png';
import headerBackground from '../assets/images/headerBackground.png';
import profileUser from '../assets/images/profileUser.png';
import headerBackgroundWhite from '../assets/images/headerBackgroundWhite.png';
import HomeBannerBg from '../assets/images/HomeBannerBg.png';
import HomeBannerImage from '../assets/images/HomeBannerImage.png';
import ProfileImage2 from '../assets/images/profileImage2.png';

const imagePath = {
  // Logo and branding
  logo: logo,
  backgroundImage2: backgroundImage2,
  backgroundImg: bgImg,
  menuIcon: menuIcon,
  search: search,
  onboarding1: onboarding1,
  onboarding2: onboarding2,
  onboarding3: onboarding3,
  googleIcon: GoogleIcon,
  resetPasswordSuccess: resetPasswordSuccess,
  headerBackground: headerBackground,
  profileUser: profileUser,
  headerBackgroundWhite: headerBackgroundWhite,
  HomeBannerBg: HomeBannerBg,
  HomeBannerImage: HomeBannerImage,
  ProfileImage2: ProfileImage2,
} as const;

export default imagePath;

// Type for image paths to enable autocomplete and type checking
export type ImagePath = (typeof imagePath)[keyof typeof imagePath];
