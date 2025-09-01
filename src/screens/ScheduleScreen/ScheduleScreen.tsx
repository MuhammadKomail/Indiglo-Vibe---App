import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/button';
import colors from '../../styles/colors';
import {svgPath} from '../../styles/svgPath';
import Calendar from '../../components/ScheduleCalender';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ScheduleScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const [method, setMethod] = useState<'call' | 'chat'>('call');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [time, setTime] = useState({hour: '00', minute: '00', period: 'AM'});
  const [notes, setNotes] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');

  const handleConfirm = (selectedDate: Date) => {
    setShowPicker(false);

    if (selectedDate) {
      let hours = selectedDate.getHours();
      let minutes = selectedDate.getMinutes();
      let period = hours >= 12 ? 'PM' : 'AM';

      setTime({
        hour: String(((hours + 11) % 12) + 1).padStart(2, '0'), // convert 24h -> 12h format
        minute: String(minutes).padStart(2, '0'),
        period,
      });
    }
  };

  const handleSchedule = () => {
    let isValid = true;

    // Reset all errors
    setDateError('');
    setTimeError('');

    if (!selectedDate) {
      setDateError('Please select a date');
      isValid = false;
    }

    if (!time.hour || !time.minute || !time.period) {
      setTimeError('Please select a valid time');
      isValid = false;
    }

    if (isValid) {
      navigation.navigate('PaymentScreen');
    }
  };

  const ListHeaderComponent = () => {
    return (
      <View>
        {/* Connection Method */}
        <View style={styles.section}>
          <View style={styles.headerBox}>
            <Text style={styles.headerTitle}>
              Choose Your Connection Method
            </Text>
            <Text style={styles.headerDescription}>
              Select how you'd like to connect with your mentor.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.methodBox,
              method === 'call' && styles.methodBoxActive,
            ]}
            onPress={() => setMethod('call')}>
            <View style={styles.methodLeft}>
              <svgPath.Phone
                fill={method === 'call' ? colors.primary : colors.lightGray5}
              />
              <Text
                style={[
                  styles.methodText,
                  {
                    color:
                      method === 'call' ? colors.blueHue : colors.lightGray5,
                  },
                ]}>
                Call
              </Text>
            </View>
            <View style={styles.methodLeft}>
              <Text style={styles.price}>$20/30 min</Text>
              <View
                style={[
                  styles.checkbox,
                  method === 'call' && styles.checkboxActive,
                ]}>
                {method === 'call' && (
                  <Text style={styles.checkmark}>✓</Text> // ✅ check tick inside
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodBox,
              method === 'chat' && styles.methodBoxActive,
            ]}
            onPress={() => setMethod('chat')}>
            <View style={styles.methodLeft}>
              <svgPath.Message
                fill={method === 'chat' ? colors.primary : colors.lightGray5}
              />
              <Text
                style={[
                  styles.methodText,
                  {
                    color:
                      method === 'chat' ? colors.blueHue : colors.lightGray5,
                  },
                ]}>
                Chat
              </Text>
            </View>
            <View style={styles.methodLeft}>
              <Text style={styles.price}>$10/30 min</Text>
              <View
                style={[
                  styles.checkbox,
                  method === 'chat' && styles.checkboxActive,
                ]}>
                {method === 'chat' && (
                  <Text style={styles.checkmark}>✓</Text> // ✅ check tick inside
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Calendar Title */}
        <View style={styles.sectionDates}>
          <View style={styles.headerBox}>
            <Text style={styles.headerTitle}>Select the Dates</Text>
            <Text style={styles.headerDescription}>
              Tap on dates to add your session. Each selected date is one
              session.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const ListFooterComponent = () => {
    return (
      <View>
        {/* Time Selection */}
        <View style={styles.sectionDates}>
          <View style={styles.headerBox}>
            <Text style={styles.headerTitle}>Select A Time</Text>
            <Text style={styles.headerDescription}>
              Please select your convenient time to connect with your mentor.
            </Text>
          </View>

          <View style={styles.timeContainer}>
            {/* Show picker on tap */}
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.timeTextContainer}>
              <Text style={styles.timeText}>
                {time.hour} : {time.minute}
              </Text>
            </TouchableOpacity>

            {/* AM / PM toggle */}
            <View style={styles.periodContainer}>
              <TouchableOpacity
                style={[
                  styles.periodBtn,
                  time.period === 'AM' && styles.periodActive,
                ]}
                onPress={() => setTime({...time, period: 'AM'})}>
                <Text
                  style={[
                    styles.periodText,
                    {
                      color:
                        time.period === 'AM' ? colors.white : colors.blueHue9,
                    },
                  ]}>
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.periodBtn,
                  time.period === 'PM' && styles.periodActive,
                ]}
                onPress={() => setTime({...time, period: 'PM'})}>
                <Text
                  style={[
                    styles.periodText,
                    {
                      color:
                        time.period === 'PM' ? colors.white : colors.blueHue9,
                    },
                  ]}>
                  PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}

        {/* Notes */}
        <View style={styles.sectionDates}>
          <View style={styles.headerBox}>
            <Text style={styles.headerTitle}>Additional Information</Text>
            <Text style={styles.headerDescription}>
              Tell your mentors what you want to talk about, so they can bring
              their best advice!
            </Text>
          </View>
          <TextInput
            style={styles.bioInput}
            multiline
            numberOfLines={4}
            placeholder="Tell the user about yourself"
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
            placeholderTextColor={colors.black20}
          />
        </View>

        {/* Button */}
        <Button
          title="Schedule Appointment"
          style={styles.buttonUser}
          backgroundGradient={[colors.blue, colors.blue2]}
          textColor={colors.silver}
          onPress={() => handleSchedule()}
        />
        <DateTimePickerModal
          isVisible={showPicker}
          mode="time"
          date={
            new Date(
              2025,
              0,
              1,
              time.period === 'PM'
                ? (parseInt(time.hour) % 12) + 12
                : parseInt(time.hour) % 12,
              parseInt(time.minute),
            )
          }
          is24Hour={false}
          onConfirm={handleConfirm}
          onCancel={() => setShowPicker(false)}
        />
      </View>
    );
  };

  return (
    <>
      <AppHeader title="Schedule" height={140} />
      <KeyboardAvoidingView style={{flex: 1}} keyboardVerticalOffset={80}>
        <FlatList
          data={[]} // remove days array here
          keyExtractor={() => 'dummy'}
          ListHeaderComponent={ListHeaderComponent}
          renderItem={null}
          ListFooterComponent={
            <>
              <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
              {dateError ? (
                <Text style={styles.errorText}>{dateError}</Text>
              ) : null}
              <ListFooterComponent />
            </>
          }
        />
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  headerBox: {
    width: '90%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 16,
    gap: 4,
  },
  headerDescription: {
    color: colors.blueHue,
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
  },
  headerTitle: {
    color: colors.blueHue,
    fontSize: 16,
    fontWeight: '500',
  },
  methodBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    marginBottom: 10,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodBoxActive: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: colors.primaryActive,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.blueHue,
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
  sectionDates: {
    marginHorizontal: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
    backgroundColor: colors.blueHue8,
    borderRadius: 10,
    padding: 20,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  timeTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  periodContainer: {
    flexDirection: 'row',
  },
  periodBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  periodActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    color: colors.blueHue9,
    fontWeight: '500',
    fontSize: 18,
  },
  bioInput: {
    height: 100,
    borderWidth: 1,
    borderColor: colors.blueHue4,
    borderRadius: 8,
    marginBottom: 24,
    padding: 10,
    textAlignVertical: 'top',
  },
  buttonUser: {
    width: '95%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    // marginTop: 5,
    marginLeft: 25,
  },
});

export default ScheduleScreen;
