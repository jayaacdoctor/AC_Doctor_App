import React from 'react';
import { View, TextInput, StyleSheet, Text, Keyboard } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../utils/colors';
import { isTablet } from "../components/TabletResponsiveSize"
import AppText from "./AppText";

const CustomPhoneInput = ({
  countryCode,
  setCountryCode,
  setCallingCode,
  callingCode,
  phoneNumber,
  setPhoneNumber,
  error,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* PHONE INPUT BOX */}
      <View style={styles.flexContain}>
        <View style={styles.container}>
          {/* COUNTRY PICKER */}
          <CountryPicker
            withFlag
            withCallingCode={false}
            withFilter
            countryCode={countryCode}
            onSelect={country => {
              setCountryCode(country.cca2);
              setCallingCode(`+${country.callingCode[0]}`);
            }}
            containerButtonStyle={styles.countryPicker}
          />

          {/* CALLING CODE */}
          <AppText style={styles.callingCode}>{callingCode}</AppText>
        </View>
        <View style={[styles.container, { width: isTablet ? wp(70) : wp(62) }]}>
          {/* PHONE INPUT */}
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            placeholderTextColor={COLORS.textColor}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="number-pad"
            maxLength={10}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            allowFontScaling={false}
            includeFontPadding={false}
          />
        </View>
      </View>

      {/* ERROR MESSAGE */}
      {error && <AppText style={styles.errorText}>{error}</AppText>}
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: hp('1%'),
  },
  flexContain: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: wp('3%'),
    height: hp('5%'),
    width: isTablet ? wp(18) : wp(25)
  },

  countryPicker: {
    marginRight: wp('2%'),
  },

  callingCode: {
    fontSize: hp('1.7%'),
    // fontSize: hp('1.7%'),
    color: COLORS.black,
    fontFamily: Fonts.medium,
    // fontWeight: '500',
    marginRight: wp('2%'),
  },

  input: {
    flex: 1,
    fontSize: hp('1.7%'),
    color: COLORS.black,
    fontFamily: Fonts.medium,
    paddingVertical: 0, // important for iOS
  },

  errorText: {
    marginTop: hp('0.8%'),
    color: COLORS.errorRed,
    fontSize: hp('1.4%'),
  },
});

export default CustomPhoneInput;
