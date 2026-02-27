import React from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CustomTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  iconLeft,
  iconRight,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 4,
  borderColor = '#d9d9d9',
  backgroundColor = '#fff',
  borderRadius = hp('2%'),
  height = hp('6%'),
  width = '100%',
  textColor = '#333',
  placeholderTextColor = '#999',
}) => {
  return (
    <View style={[styles.container, { width }]}>
      {label && <Text allowFontScaling={false} style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            borderRadius,
            backgroundColor,
            minHeight: multiline ? hp('12%') : height,
            paddingVertical: multiline ? hp('1%') : 0,
          },
        ]}
      >
        {/* Left Icon */}
        {iconLeft && (
          <FastImage source={iconLeft} style={styles.leftIcon} resizeMode="contain" />
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              height: multiline ? '100%' : height,
              textAlignVertical: multiline ? 'top' : 'center',
            },
          ]}
          allowFontScaling={false}
          includeFontPadding={false}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={placeholderTextColor}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          onSubmitEditing={() => Keyboard.dismiss()}
        />

        {/* Right Icon */}
        {iconRight && (
          <FastImage source={iconRight} style={styles.rightIcon} resizeMode="contain" />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: hp('1.6%'),
    color: '#444',
    fontWeight: '600',
    marginBottom: hp('0.7%'),
  },
  inputWrapper: {
    borderWidth: hp(0.1),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
  },
  input: {
    flex: 1,
    fontSize: hp('1.8%'),
    paddingHorizontal: wp('2%'),
  },
  leftIcon: {
    width: wp('5%'),
    height: hp('3%'),
    marginRight: wp('2%'),
  },
  rightIcon: {
    width: wp('5%'),
    height: hp('3%'),
    marginLeft: wp('2%'),
  },
});

export default CustomTextInput;
