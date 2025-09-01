import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import colors from '../../styles/colors';
import {svgPath} from '../../styles/svgPath';

const VerifyIdentityScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieTaken, setSelfieTaken] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleVerifyID = () => {
    // mock upload
    setIdUploaded(true);
  };

  const handleSelfie = () => {
    // mock selfie
    setSelfieTaken(true);
  };

  const handleVerifyIdentity = () => {
    if (idUploaded && selfieTaken) {
      Alert.alert('Identity verified successfully!');
    } else {
      Alert.alert('Please complete both steps.');
    }
  };

  return (
    <>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <svgPath.BackArrow width={14} height={14} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ID verification</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Verify Your Identity</Text>
        <Text style={styles.subHeading}>
          Verify your identity to make this platform a safe space and ensure
          you’re really you
        </Text>

        {/* Identity Document */}
        <View style={styles.cardBox}>
          <Text style={styles.cardTitle}>Identity Document</Text>
          <Text style={styles.cardText}>
            Proof of your residency via passport, national identity card or
            driver’s license
          </Text>
          <TouchableOpacity style={styles.cardButton} onPress={handleVerifyID}>
            <Text style={styles.buttonText}>Verify with ID</Text>
          </TouchableOpacity>
        </View>

        {/* Selfie Photo */}
        <View style={styles.cardBox}>
          <Text style={styles.cardTitle}>Selfie Photo</Text>
          <Text style={styles.cardText}>
            As a new user, please take a selfie using your front camera to
            verify your identity.
          </Text>
          <TouchableOpacity style={styles.cardButton} onPress={handleSelfie}>
            <Text style={styles.buttonText}>Take a verification photo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.bottomButton,
          !(idUploaded && selfieTaken) && {backgroundColor: colors.lightGray10},
        ]}
        disabled={!(idUploaded && selfieTaken)}
        onPress={handleVerifyIdentity}>
        <Text style={styles.bottomButtonText}>Verify My Identity</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 70,
    paddingHorizontal: 20,
  },
  backButton: {
    borderColor: colors.lightGray10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.blueHue,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.black,
  },
  subHeading: {
    fontSize: 14,
    color: colors.gray70,
    marginBottom: 20,
  },
  cardBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 13,
    color: colors.gray70,
    marginBottom: 14,
  },
  cardButton: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue,
  },
  bottomButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VerifyIdentityScreen;
