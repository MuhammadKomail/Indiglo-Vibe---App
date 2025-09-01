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
import AnotherCard from '../assets/images/anotherCard.png';
import Mastercard from '../assets/images/mastercard.png';
import cardAddedSuccess from '../assets/images/cardAddedSuccess.png';
import DeleteAccount from '../assets/images/DeleteAccount.png';
import PaymentCardImage from '../assets/images/paymentCardImage.png';
import PaymentSuccess from '../assets/images/PaymentSuccess.png';
import AddBank from '../assets/images/AddBank.png';
import Article1 from '../assets/images/Article1.png';
import UploadImage from '../assets/images/UploadImage.png';
import ArticleImage from '../assets/images/ArticleImage.png';
import ContentUpdate from '../assets/images/ContentUpdate.png';
import DeleteModal from '../assets/images/DeleteModal.png';
import Discover1 from '../assets/images/Discover1.png';
import Discover2 from '../assets/images/Discover2.png';
import Discover3 from '../assets/images/Discover3.png';
import Discover4 from '../assets/images/Discover4.png';
import PopupBg from '../assets/images/PopupBg.png';
import FindMentorPopup from '../assets/images/findMentorPopup.png';

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
  AnotherCard: AnotherCard,
  Mastercard: Mastercard,
  CardAddedSuccess: cardAddedSuccess,
  DeleteAccount: DeleteAccount,
  PaymentCardImage: PaymentCardImage,
  PaymentSuccess: PaymentSuccess,
  AddBank: AddBank,
  Article1: Article1,
  UploadImage: UploadImage,
  ArticleImage: ArticleImage,
  ContentUpdate: ContentUpdate,
  DeleteModal: DeleteModal,
  Discover1: Discover1,
  Discover2: Discover2,
  Discover3: Discover3,
  Discover4: Discover4,
  PopupBg: PopupBg,
  FindMentorPopup: FindMentorPopup,
} as const;

export default imagePath;

// Type for image paths to enable autocomplete and type checking
export type ImagePath = (typeof imagePath)[keyof typeof imagePath];
