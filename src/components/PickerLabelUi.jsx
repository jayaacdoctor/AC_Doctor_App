import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import { COLORS, Fonts } from '../utils/colors';
import images from '../assets/images';
import AppText from './AppText';

const PickerLabelUi = ({
  label = '',
  value = '',
  placeholder = 'Select',
  onPress,
  style,
  required = false,
  droparraw = false,
  icon = images.arrowdown,
  marginBottom = 0,
  marginTop = 0,
  BorderRadius = 0,
}) => {
  return (
    <View style={[styles.container, style, { marginTop, marginBottom }]}>
      {label ? (
        <AppText style={styles.label}>
          {label}
          {required && <AppText style={{ color: 'red' }}>*</AppText>}
        </AppText>
      ) : null}

      <TouchableOpacity
        style={[styles.pickerWrapper, { borderRadius: BorderRadius }]}
        onPress={onPress}
      >
        <AppText
          style={[
            styles.pickerText,
            { color: value ? COLORS.black : '#676767' },
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </AppText>

        {droparraw && (
          <FastImage
            source={icon}
            style={styles.arrowIcon}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center', // Parent controls width
  },

  label: {
    fontSize: hp(1.5),
    color: COLORS.black,
    marginBottom: hp(0.8),
    fontFamily: Fonts.semiBold,
  },

  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: hp(1.6),
    borderWidth: hp(0.1),
    borderColor: '#ddd',
    height: hp(5),
    paddingHorizontal: wp(3),
    width: '100%', // Always follow parent
  },

  pickerText: {
    fontSize: hp(1.6),
    fontFamily: Fonts.medium,
    flex: 1,
  },

  arrowIcon: {
    width: wp(4.5),
    height: hp(3),
    tintColor: COLORS.themeColor,
  },
});

export default PickerLabelUi;
