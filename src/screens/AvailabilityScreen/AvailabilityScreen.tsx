import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  ImageBackground,
  FlatList,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import colors from '../../styles/colors';
import Button from '../../components/button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigationTypes';
import imagePath from '../../styles/imgPath';

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

type AvailabilityType = Record<
  DayKey,
  {
    enabled: boolean;
    from: string;
    to: string;
  }
>;

const days = [
  {label: 'Monday', key: 'mon'},
  {label: 'Tuesday', key: 'tue'},
  {label: 'Wednesday', key: 'wed'},
  {label: 'Thursday', key: 'thu'},
  {label: 'Friday', key: 'fri'},
  {label: 'Saturday', key: 'sat'},
  {label: 'Sunday', key: 'sun'},
];

const AvailabilityScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'availability-screen'>
> = ({route, navigation}) => {
  const {role} = route.params;

  const [availability, setAvailability] = useState<AvailabilityType>({
    mon: {enabled: true, from: '00:00', to: '23:59'},
    tue: {enabled: true, from: '00:00', to: '23:59'},
    wed: {enabled: false, from: '00:00', to: '23:59'},
    thu: {enabled: false, from: '00:00', to: '23:59'},
    fri: {enabled: true, from: '00:00', to: '23:59'},
    sat: {enabled: false, from: '00:00', to: '23:59'},
    sun: {enabled: true, from: '00:00', to: '23:59'},
  });

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerDayKey, setPickerDayKey] = useState<DayKey>('mon');
  const [pickerField, setPickerField] = useState<'from' | 'to'>('from');

  const handleToggle = (dayKey: DayKey) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {...prev[dayKey], enabled: !prev[dayKey].enabled},
    }));
  };

  const showPicker = (dayKey: DayKey, field: 'from' | 'to') => {
    setPickerDayKey(dayKey);
    setPickerField(field);
    setPickerVisible(true);
  };

  const handleConfirm = (date: Date) => {
    const timeString = moment(date).format('HH:mm');
    setAvailability(prev => ({
      ...prev,
      [pickerDayKey]: {...prev[pickerDayKey], [pickerField]: timeString},
    }));
    setPickerVisible(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (role === 'user') {
      navigation.navigate('availability-screen', {role: role});
    } else {
      navigation.navigate('availability-screen', {role: role});
    }
  };

  const headerComponent = () => {
    return (
      <>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons
            name="arrow-back-ios"
            size={16}
            color={colors.blueHue}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.containerView}>
          <Text style={styles.header}>Set Availability</Text>
          <Text style={styles.sub}>
            Set your availability so that mentees can reach out to you at the
            right time.
          </Text>
        </View>
      </>
    );
  };

  const renderItem = ({item}: {item: (typeof days)[0]}) => {
    const current = availability[item.key as DayKey];
    return (
      <View style={styles.renderView}>
        <View key={item.key} style={styles.dayRow}>
          <View style={styles.dayTitleWrapper}>
            <Text style={styles.dayTitle}>{item.label}</Text>
            <Switch
              value={current.enabled}
              onValueChange={() => handleToggle(item.key as DayKey)}
              trackColor={{false: colors.lightGray4, true: colors.primary}}
              thumbColor={colors.white}
            />
          </View>
          {current.enabled && (
            <View>
              <View style={styles.timeRow}>
                <Text style={[styles.timeLabel, {marginLeft: 14}]}>From</Text>
                <TouchableOpacity
                  onPress={() => showPicker(item.key as DayKey, 'from')}
                  style={styles.timeInput}>
                  <Text>{current.from}</Text>
                </TouchableOpacity>
                <Text style={[styles.timeLabel, {marginLeft: 14}]}>To</Text>
                <TouchableOpacity
                  onPress={() => showPicker(item.key as DayKey, 'to')}
                  style={styles.timeInput}>
                  <Text>{current.to}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={styles.divider} />
        </View>
      </View>
    );
  };

  const FooterComponent = () => {
    return (
      <View style={styles.renderView}>
        <Button
          title={'Update Schedule'}
          style={styles.buttonUser}
          backgroundGradient={[colors.blue, colors.blue2]}
          textColor={colors.silver}
          onPress={handleNext}
        />

        <DateTimePickerModal
          isVisible={pickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={() => setPickerVisible(false)}
          is24Hour={true}
        />
      </View>
    );
  };

  return (
    <ImageBackground
      source={imagePath.backgroundImage2}
      style={styles.backgroundImg}
      resizeMode="cover">
      <FlatList
        data={days}
        keyExtractor={(item: (typeof days)[0]) => item.key}
        contentContainerStyle={styles.container}
        ListHeaderComponent={headerComponent}
        renderItem={renderItem}
        ListFooterComponent={FooterComponent}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  containerView: {
    marginTop: 120,
    flex: 1,
    marginHorizontal: 20,
  },
  renderView: {
    flex: 1,
    marginHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    borderColor: colors.lightGray10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    marginLeft: 7,
  },
  header: {
    color: colors.blueHue,
    fontSize: 16,
    fontWeight: '500',
  },
  sub: {
    color: colors.blueHue,
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
    marginBottom: 20,
    marginTop: 5,
  },
  dayRow: {marginBottom: 10},
  dayTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeLabel: {
    fontSize: 14,
    color: colors.blueHue,
    fontWeight: '400',
    marginRight: 14,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: colors.lightGray4,
    borderRadius: 40,
    width: 105,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  divider: {height: 1, backgroundColor: colors.lightGray4, marginTop: 5},
  buttonUser: {
    width: '98%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 10,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 25,
  },
});

export default AvailabilityScreen;
