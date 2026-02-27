import React from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../utils/colors';

const CustomSearchBar = ({ placeholder, value, onChangeText, keyboardType, icon }) => {

  return (
    <View style={styles.container}>
      {icon && <FastImage source={icon} style={styles.icon} resizeMode="contain" />}
      <TextInput
        style={[styles.input, icon && { paddingLeft: wp('8%') }]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        onSubmitEditing={() => Keyboard.dismiss()}
        allowFontScaling={false}
        includeFontPadding={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp('1%'),
    borderRadius: 25,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  input: {
    height: hp('5%'),
    paddingHorizontal: wp('3%'),
    fontSize: hp('1.8%'),
    color: COLORS.gray,
  },
  icon: {
    width: wp('4%'),
    height: hp('2%'),
    position: 'absolute',
    left: wp('3%'),
    top: hp('1.5%'),
  },
});

export default CustomSearchBar;