import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, I18nManager} from 'react-native';
import {colors, typography, defaultStyles} from '../../styles/style';
import CustomDropdown from '../../components/dropdown';
import icon from '../../assets/images/icon.png';
import Button from '../../components/button';
import navigate from '../../navigation/navigationService';
import {useAppDispatch} from '../../redux/store';
import {changeLanguage} from '../../redux/slices/translationSlice/translationSlice';
import {useTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart';
import {useTheme} from '../../theme/ThemeContext';
import {lightTheme} from '../../theme/theme';
import {tokenStorage} from '../../services/storage';

const LanguageSelection = () => {
  const {theme} = useTheme();
  // Language-related states
  const [languageSelection, setLanguageSelection] = useState<string | ''>('');

  // Translation hook
  const {t, i18n} = useTranslation();

  // Redux state and dispatch
  const dispatch = useAppDispatch();

  // Initial language load
  useEffect(() => {
    const loadSavedLanguage = async () => {
      const savedLang = tokenStorage.getToken();
      if (savedLang) {
        setLanguageSelection(savedLang);
        await i18n.changeLanguage(savedLang);
        I18nManager.forceRTL(savedLang === 'ar');
      }
    };
    loadSavedLanguage();
  }, []);

  // Language selection handler
  const handleSelect = (item: string) => {
    const languageMap: {[key: string]: string} = {
      English: 'en',
      Arabic: 'ar',
    };
    setLanguageSelection(languageMap[item as keyof typeof languageMap]);
  };

  // Language change effect
  useEffect(() => {
    if (languageSelection !== '') {
      const updateLanguage = async () => {
        // Pehle check karein ke current language different hai
        const currentLang = tokenStorage.getToken();
        if (currentLang === languageSelection) {
          return; // Agar same language hai to kuch na karein
        }

        await tokenStorage.saveToken(languageSelection);
        await i18n.changeLanguage(languageSelection);
        I18nManager.forceRTL(i18n.language === 'ar');
        dispatch(changeLanguage(languageSelection));

        // Sirf tab restart karein jab RTL/LTR change ho
        const needsRestart =
          (languageSelection === 'ar' && !I18nManager.isRTL) ||
          (languageSelection === 'en' && I18nManager.isRTL);
        if (needsRestart) {
          setTimeout(() => RNRestart.Restart(), 1000);
        }
      };
      updateLanguage();
    }
  }, [languageSelection, dispatch, i18n]);

  const handleContinue = () => {
    navigate.navigate('login-screen');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme === 'dark' ? lightTheme.background : colors.background,
        },
      ]}>
      <Image source={icon} style={defaultStyles.image} resizeMode="contain" />
      <Text
        style={[
          styles.title,
          {color: theme === 'dark' ? lightTheme.text : colors.secondary},
        ]}>
        {t('Choose Your Language')}
      </Text>
      <Text
        style={[
          styles.subtitle,
          {color: theme === 'dark' ? lightTheme.text : colors.gray},
        ]}>
        {t(
          'Please choose a language to continue. You can update your language preference anytime in the settings',
        )}
      </Text>
      <View
        style={[
          defaultStyles.mainContainer,
          {
            backgroundColor:
              theme === 'dark' ? lightTheme.background : undefined,
          },
        ]}>
        <Text
          style={[
            styles.languageHeader,
            {color: theme === 'dark' ? lightTheme.text : colors.black},
          ]}>
          {t('Select Your Preferred Language')}
        </Text>
        <View style={styles.dropdownContainer}>
          <CustomDropdown
            data={['English', 'Arabic']}
            onSelect={handleSelect}
            maxVisibleItems={3}
            width={320}
            defaultValue={languageSelection === 'ar' ? 'Arabic' : 'English'}
          />
        </View>
        <Button
          title={t('Continue')}
          onPress={handleContinue}
          style={{
            backgroundColor:
              theme === 'dark' ? lightTheme.border : colors.black,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    alignItems: typography.alignments.center,
    justifyContent: typography.alignments.center,
  },
  title: {
    fontSize: typography.fontSizes.extraLarge,
    fontWeight: typography.fontWeights.bold,
    marginBottom: 20,
    textAlign: typography.alignments.center,
    color: colors.secondary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: typography.alignments.center,
    marginBottom: 40,
    color: colors.gray,
  },
  languageHeader: {
    fontSize: 16,
    fontWeight: typography.fontWeights.regular600,
    marginBottom: 15,
    color: colors.black,
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
});

export default LanguageSelection;
