import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {svgPath} from '../styles/svgPath';
import {colors} from '../styles/style';

export interface Call {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  time: string;
  type: 'incoming' | 'outgoing' | 'missed';
}

const CallIcon = ({type}: {type: 'incoming' | 'outgoing' | 'missed'}) => {
  switch (type) {
    case 'incoming':
      return <svgPath.Incoming width="24" height="24" />;
    case 'outgoing':
      return <svgPath.Outgoing width="24" height="24" />;
    case 'missed':
      return <svgPath.Incoming width="24" height="24" />;
    default:
      return null;
  }
};

const CallLogItem = ({call}: {call: Call}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={{uri: call.user.avatar}} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{call.user.name}</Text>
        <Text style={styles.time}>{call.time}</Text>
      </View>
      <CallIcon type={call.type} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorderLight,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
    color: colors.grayTextSecondary,
  },
});

export default CallLogItem;
