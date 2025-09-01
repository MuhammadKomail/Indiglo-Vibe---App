import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import AppHeader from '../../components/AppHeader';
import {ThemedView} from '../../components/ThemedComponents';
import colors from '../../styles/colors';
import {svgPath} from '../../styles/svgPath';
import Button from '../../components/button';

const SelectVerificationType = ({navigation}: any) => {
  const [selected, setSelected] = useState('Passport');

  const options = [
    {key: 'Passport', icon: <svgPath.Passport width={22} height={22} />},
    {key: 'National ID', icon: <svgPath.IdCard width={22} height={22} />},
    {
      key: 'Driver’s License',
      icon: <svgPath.DriverLicense width={22} height={22} />,
    },
  ];

  return (
    <>
      <AppHeader title="Select ID" height={100} />
      <ThemedView style={styles.container}>
        <Text style={styles.title}>What Type Of ID Will You Be Using?</Text>
        <Text style={styles.subTitle}>
          Provide information to confirm identity.
        </Text>

        {/* Options */}
        <View style={styles.list}>
          {options.map(item => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.option,
                selected === item.key && styles.optionActive,
              ]}
              onPress={() => setSelected(item.key)}>
              <View style={styles.icon}>{item.icon}</View>
              <Text
                style={[
                  styles.optionText,
                  selected === item.key && styles.optionTextActive,
                ]}>
                {item.key}
              </Text>
              <View style={styles.radioOuter}>
                {selected === item.key && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <Button
          title="Continue"
          style={styles.button}
          backgroundGradient={[colors.blue, colors.blue2]}
          textColor={colors.white}
          onPress={() =>
            navigation.navigate('VerifyIdentity', {idType: selected})
          }
        />
      </ThemedView>
    </>
  );
};

export default SelectVerificationType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: colors.gray2,
    marginBottom: 20,
  },
  list: {
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray4,
  },
  optionActive: {},
  icon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  optionTextActive: {
    color: colors.blue,
    fontWeight: '600',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
  },
  button: {
    marginTop: 40,
    borderRadius: 12,
    height: 56,
  },
});
