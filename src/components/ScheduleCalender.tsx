import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import {svgPath} from '../styles/svgPath';
import colors from '../styles/colors';

const Calendar = ({selectedDate, setSelectedDate}: any) => {
  const [currentMonth, setCurrentMonth] = useState(8); // September (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekOrder = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // total days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // first day of month (0 = Sun, 1 = Mon, ...)
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // create full grid: empty slots + days
  const daysArray = [
    ...Array(firstDay).fill(''), // empty slots before 1st
    ...Array.from({length: daysInMonth}, (_, i) => (i + 1).toString()),
  ];

  const renderItem = ({item}: {item: string}) => {
    if (item === '') {
      return <View style={[styles.dayBox]} />; // empty cell
    }

    const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(item).padStart(2, '0')}`;

    return (
      <TouchableOpacity
        style={[
          styles.dayBox,
          selectedDate === fullDate && styles.dayBoxActive,
        ]}
        onPress={() => setSelectedDate(fullDate)}>
        <Text
          style={[
            styles.dayText,
            selectedDate === fullDate && styles.dayTextActive,
          ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.calendarContainer}>
      {/* Month header */}
      <View style={styles.monthHeader}>
        <Text style={styles.monthText}>
          {monthNames[currentMonth]} {currentYear}
        </Text>
        <View style={styles.arrows}>
          <TouchableOpacity
            onPress={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}>
            <svgPath.BackArrow />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}>
            <svgPath.NextArrow />
          </TouchableOpacity>
        </View>
      </View>

      {/* Week header row */}
      <View style={styles.weekRow}>
        {weekOrder.map((day, index) => (
          <Text key={index} style={styles.weekText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Days grid */}
      <View style={styles.daysGridView}>
        <FlatList
          data={daysArray}
          keyExtractor={(_, index) => index.toString()}
          numColumns={7}
          renderItem={renderItem}
          contentContainerStyle={styles.daysGrid}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: colors.blueHue8,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    paddingBottom: 10,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  arrows: {
    flexDirection: 'row',
    gap: 15,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black4,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  weekText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.black4,
  },
  daysGrid: {
    paddingBottom: 10,
  },
  daysGridView: {
    alignItems: 'center',
  },
  dayBox: {
    width: 27,
    height: 27,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBoxActive: {
    backgroundColor: colors.primary,
    borderRadius: 25,
  },
  dayText: {
    fontSize: 13,
    color: colors.black4,
  },
  dayTextActive: {
    color: colors.blueHue8,
    fontWeight: '600',
  },
});

export default Calendar;
