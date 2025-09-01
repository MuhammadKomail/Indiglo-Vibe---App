import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {ThemedView} from '../../components/ThemedComponents';
import colors from '../../styles/colors';
import AppHeader from '../../components/AppHeader';
import {svgPath} from '../../styles/svgPath';
import imgPath from '../../styles/imgPath';
import Button from '../../components/button';

interface AppointmentDetailProps {
  route: any;
  navigation: any;
}

const AppointmentDetailScreen = ({
  route,
  navigation,
}: AppointmentDetailProps) => {
  const {name, date, time, activeTab, type, status} = route.params;

  const getStatusColor = () => {
    if (activeTab === 'upcoming' && status === 'Call Now') return colors.green2;
    if (activeTab === 'upcoming') return colors.brown;
    if (activeTab === 'completed' || activeTab === 'requested')
      return colors.lightGray5;
    return colors.primary;
  };

  return (
    <>
      <AppHeader title="Appointment Details" height={140} />
      <ThemedView style={styles.container}>
        {/* User Info */}
        <View style={styles.userCard}>
          <Image source={imgPath.ProfileImage2} style={styles.avatar} />
          <View style={{flex: 1}}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.metaContainer}>
              <Text style={styles.subText}>
                {type?.charAt(0).toUpperCase() + type?.slice(1)}
              </Text>
              <Text style={[styles.subText, {color: getStatusColor()}]}>
                {activeTab === 'upcoming' && status === 'Call Now'
                  ? 'Accepted'
                  : activeTab === 'upcoming' && status === 'Call'
                    ? 'Pending'
                    : activeTab === 'upcoming' && status === 'Chat'
                      ? 'Pending'
                      : activeTab === 'completed'
                        ? 'Completed'
                        : 'Requested'}
              </Text>
            </View>
          </View>
          <View style={styles.iconWrap}>
            {type === 'call' ? (
              <svgPath.Phone width={22} height={22} />
            ) : (
              <svgPath.Message width={22} height={22} />
            )}
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.metaRow}>
          <svgPath.CalendarBottom
            width={16}
            height={18}
            fill={colors.blueHue}
          />
          <Text style={styles.metaText}>{date}</Text>
        </View>
        <View style={styles.metaRow}>
          <svgPath.Clock width={16} height={16} />
          <Text style={styles.metaText}>{time}</Text>
        </View>

        {/* Additional Info */}
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <Text style={styles.desc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          facilisi. Sed vel sapien vel felis convallis tincidunt. Fusce auctor,
          magna a aliquet varius, odio justo convallis felis, nec convallis
          augue turpis at elit.
        </Text>

        {/* Package */}
        <Text style={styles.sectionTitle}>Your Package</Text>
        <View style={styles.packageCard}>
          <View>
            <View style={styles.metaContainer}>
              <Text style={styles.packageTitle}>
                {type?.charAt(0).toUpperCase() + type?.slice(1)}
              </Text>
              <Text style={styles.packageTime}>
                {type === 'Call' ? '$20/30 mins' : '$10/30 mins'}
              </Text>
            </View>
            <Text style={styles.packageDesc}>
              {type === 'Call'
                ? 'Speak directly with your mentor for immediate support.'
                : 'Start a conversation via text for flexible communication.'}
            </Text>
          </View>
          <View style={[styles.checkbox, styles.checkboxActive]}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        {/* Bottom Button */}
        {activeTab === 'upcoming' && status === 'Call Now' ? (
          <Button
            title="Join Now"
            style={styles.buttonUser}
            backgroundGradient={[colors.blue, colors.blue2]}
            textColor={colors.silver}
            onPress={() => navigation.goBack()}
          />
        ) : activeTab === 'upcoming' ? (
          <TouchableOpacity
            style={[styles.button]}
            disabled={true}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Join Now</Text>
          </TouchableOpacity>
        ) : (
          <Button
            title="Home"
            style={styles.buttonUser}
            backgroundGradient={[colors.blue, colors.blue2]}
            textColor={colors.silver}
            onPress={() => navigation.navigate('BottomTabs')}
          />
        )}
      </ThemedView>
    </>
  );
};

export default AppointmentDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.silver,
  },
  avatar: {
    width: 82,
    height: 97,
    borderRadius: 8,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.blueHue,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subText: {
    fontSize: 14,
    marginTop: 4,
    color: colors.black,
  },
  iconWrap: {
    backgroundColor: colors.blueHue50,
    padding: 8,
    borderRadius: 50,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaText: {
    marginLeft: 6,
    color: colors.blueHue3,
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 6,
    fontSize: 18,
    fontWeight: '500',
    color: colors.black6,
  },
  desc: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.black,
    lineHeight: 18,
  },
  packageCard: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 18,
    marginTop: 8,
    backgroundColor: colors.primaryActive,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  packageTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.blueHue,
  },
  packageTime: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
    color: colors.blueHue,
  },
  packageDesc: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.gray2,
    width: '80%',
  },
  button: {
    marginTop: 30,
    backgroundColor: colors.gray5,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  buttonUser: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 10,
    borderRadius: 15,
    marginTop: 30,
    marginBottom: 30,
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 8,
    backgroundColor: colors.gray4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.white3, // white tick when active
    fontSize: 10,
    fontWeight: 'bold',
  },
});
