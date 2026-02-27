import React, { useState } from 'react';
import {
  View,
  Pressable,
  TextInput,
  StyleSheet,
  Modal,
  Image,
  Keyboard,
} from 'react-native';
import { COLORS, Fonts } from '../utils/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import images from '../assets/images';
import AppText from './AppText';

const PlaceTypeSelector = ({
  headingText = 'Place Type',
  onChange = () => { },
  stylesContain,
}) => {
  const [selectedType, setSelectedType] = useState('');
  const [customType, setCustomType] = useState('');
  const [showModal, setShowModal] = useState(false);

  const placeOptions = ['Residential', 'Commercial'];

  const handleSelect = value => {
    setSelectedType(value);
    setShowModal(false);

    if (value === 'Other') {
      onChange(''); // wait for custom input
    } else {
      onChange(value);
      setCustomType('');
    }
  };

  return (
    <View style={[styles.container, stylesContain]}>
      <AppText style={styles.label}>{headingText}</AppText>

      {/* When NOT Other → Show Dropdown */}
      {selectedType !== 'Other' && (
        <Pressable
          style={[styles.dropdown, styles.row]}
          onPress={() => setShowModal(true)}
        >
          <AppText style={styles.dropdownText}>
            {selectedType || 'Select Any One'}
          </AppText>
          <Image source={images.dropdown} style={styles.arrowStyle} />
        </Pressable>
      )}

      {/* When Other → Show Text Input */}
      {selectedType === 'Other' && (
        <TextInput
          placeholder="Enter Place Type"
          placeholderTextColor={COLORS.inputColour}
          style={[styles.dropdown, styles.inputBox]}
          value={customType}
          onChangeText={txt => {
            setCustomType(txt);
            onChange(txt);
          }}
          onSubmitEditing={() => Keyboard.dismiss()}
          allowFontScaling={false}
          includeFontPadding={false}
        />
      )}

      {/* Modal for Selection */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            {placeOptions.map(item => (
              <Pressable
                key={item}
                style={styles.optionBtn}
                onPress={() => handleSelect(item)}
              >
                <AppText style={styles.optionText}>{item}</AppText>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PlaceTypeSelector;

const styles = StyleSheet.create({
  container: {
    marginTop: hp(1.5),
    alignSelf: 'center',
  },
  label: {
    fontSize: hp(1.6),
    color: COLORS.black,
    marginBottom: hp(1),
    fontFamily: Fonts.medium,
  },
  dropdown: {
    borderWidth: hp(0.1),
    borderColor: COLORS.lightGray,
    borderRadius: hp(1),
    height: hp(4.7),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: COLORS.white,
  },
  row: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  dropdownText: {
    flex: 1,
    fontSize: hp(1.7),
    color: COLORS.black,
    fontFamily: Fonts.regular,
    textAlign: 'left',
  },
  inputBox: {
    fontSize: hp(1.7),
    paddingHorizontal: wp(4),
  },
  arrowStyle: {
    width: wp(5),
    height: hp(1),
    resizeMode: 'contain',
    tintColor: 'black',
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '75%',
    backgroundColor: COLORS.white,
    borderRadius: hp(1.4),
    padding: hp(2),
  },
  optionBtn: {
    paddingVertical: hp(1.3),
  },
  optionText: {
    fontSize: hp(1.8),
    color: COLORS.black,
    fontFamily: Fonts.medium,
    borderRadius: hp(1),
    borderBottomColor: COLORS.themeColor,
    borderBottomWidth: wp(0.1),
  },
});
