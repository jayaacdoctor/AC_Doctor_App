import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../utils/colors';
import AppText from './AppText';

const CunstomInput = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  keyboardType = 'default',
  secureTextEntry = false,
  borderColor = COLORS.lightGray,
  borderRadius = hp(1.6),
  MarginTop = 0,
  MarginBottom = 0,
  backgroundColor = '#fff',
  placeholderTextColor = COLORS.inputColour || '#999',
  style = {},
  containerStyle = {},
  multiline = false,
  numberOfLines = 1,
  leftIcon = null,
  rightIcon = null,
  showToggle = true,
  onSubmitEditing = () => {},
  returnKeyType = 'done',
  lablestyle,
  maxLength,
  secureTextToggleLabel = { show: 'Show', hide: 'Hide' },
}) => {
  const [secure, setSecure] = useState(secureTextEntry);

  return (
    <View
      style={[
        styles.wrapper,
        containerStyle, // ✅ parent controls width here
        { marginBottom: MarginBottom, marginTop: MarginTop },
      ]}
    >
      {label && <AppText style={[styles.label, lablestyle]}>{label}</AppText>}

      <View
        style={[
          multiline ? styles.textAreaWrapper : styles.inputRow,
          { borderColor, backgroundColor, borderRadius },
        ]}
      >
        {leftIcon && (
          <Image source={leftIcon} style={styles.icon} resizeMode="contain" />
        )}

        <TextInput
          allowFontScaling={false}
          includeFontPadding={false}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry ? secure : false}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          textAlignVertical={multiline ? 'top' : 'center'} // ✅ Android fix
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength ?? undefined}
          returnKeyType={returnKeyType}
          style={[styles.input, multiline && styles.multilineInput, style]}
        />

        {secureTextEntry && showToggle && (
          <TouchableOpacity onPress={() => setSecure(p => !p)}>
            <AppText style={styles.toggleText}>
              {secure ? secureTextToggleLabel.show : secureTextToggleLabel.hide}
            </AppText>
          </TouchableOpacity>
        )}

        {rightIcon && (
          <Image source={rightIcon} style={styles.icon} resizeMode="contain" />
        )}
      </View>
    </View>
  );
};

export default CunstomInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%', // ✅ takes parent width
    alignSelf: 'center',
  },

  label: {
    fontSize: hp(1.5),
    color: COLORS.black,
    marginBottom: hp(0.8),
    fontFamily: Fonts.semiBold,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: hp(0.1),
    height: hp(5.2),
    paddingHorizontal: wp(3),
    width: '100%', // ✅ relative to parent
  },

  textAreaWrapper: {
    borderWidth: hp(0.1),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    width: '100%', // ✅ relative to parent
  },

  input: {
    flex: 1,
    fontSize: hp('1.8%'),
    color: COLORS.black,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
  },

  multilineInput: {
    textAlignVertical: 'top',
    minHeight: hp(10),
  },

  icon: {
    width: wp(5),
    height: hp(3),
    marginRight: wp(2),
  },

  toggleText: {
    fontSize: hp(1.4),
    color: COLORS.themeColor,
  },
});
