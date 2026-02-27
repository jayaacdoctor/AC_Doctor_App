import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import images from '../assets/images';
import { COLORS, Fonts } from '../utils/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppText from '../components/AppText';

const DeclineModal = ({
  visible,
  onClose,
  onReasonSelect,
  message1,
  HeadText,
  message2,
  setIcon = images.correctIcon,
  HeadTextColor,
  buttonCount = 1,
  firstButtonText = 'Done',
  onFirstButtonPress = onClose, // ← Sahi naam
  secondButtonText = 'View Request',
  onSecondButtonPress = onClose, // ← Sahi naam
  selectedReason: propReason,
}) => {
  const [select, setSelect] = useState('Expected a higher offer');
  const finalReason = propReason || select;

  const handleReasonSelect = (reason) => {
    setSelect(reason);
    onReasonSelect?.(reason);
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Image source={setIcon} style={styles.checkmarkIcon} resizeMode="contain" />
          </View>

          {/* Messages */}
          <AppText style={[styles.title, { color: HeadTextColor }]}>{HeadText}</AppText>
          <AppText style={styles.message}>{message1}</AppText>
          <AppText style={styles.message}>{message2}</AppText>

          {/* Reason Selection */}
          <View style={styles.reasonDelineStyle}>
            <AppText style={styles.message}>Let us know the reason for Decline</AppText>

            {['Expected a higher offer', 'Changed my mind', 'Want to sell later', 'Other'].map((reason) => (
              <TouchableOpacity
                key={reason}
                style={styles.flexOne}
                onPress={() => handleReasonSelect(reason)}
              >
                <Image
                  source={finalReason === reason ? images.onbutton : images.offbutton}
                  style={styles.checkOutIcon}
                />
                <AppText style={styles.textreson}>{reason}</AppText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Confirm Decline Button */}
            {buttonCount >= 1 && (
              <TouchableOpacity
                style={[
                  styles.doneButton,
                  {
                    width: buttonCount === 1 ? wp('70%') : wp('33%'),
                    backgroundColor: COLORS.themeColor,
                    marginRight: buttonCount === 2 ? 10 : 0,
                  },
                ]}
                onPress={() => {
                  onFirstButtonPress(finalReason); // ← Sirf ek call
                }}
              >
                <AppText style={[styles.doneButtonText, { color: COLORS.white }]}>
                  {firstButtonText}
                </AppText>
              </TouchableOpacity>
            )}

            {/* No Button */}
            {buttonCount >= 2 && (
              <TouchableOpacity
                style={[styles.doneButton, styles.secondButton, { backgroundColor: '#ffffff', width: wp('40%') }]}
                onPress={() => onSecondButtonPress(finalReason)}
              >
                <AppText style={[styles.doneButtonText, { color: '#676464ff' }]}>
                  {secondButtonText}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconContainer: {
    marginBottom: 15,
  },
  checkmarkIcon: {
    width: wp('40%'),
    height: hp(9),
  },
  title: {
    fontSize: hp(3),
    fontFamily: Fonts.extraBold,
    color: COLORS.black,
    marginBottom: 10,
  },
  message: {
    fontSize: hp(1.5),
    fontFamily: Fonts.medium,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons when 2 are present
    width: '100%',
    marginTop: 20,
  },
  doneButton: {
    paddingVertical: 8.5,
    alignItems: 'center',
    borderRadius: hp(10),
  },
  secondButton: {
    backgroundColor: COLORS.themeColor,
    borderColor: COLORS.textHeading,
    borderWidth: wp(0.2),
    borderRadius: hp(10),
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  reasonDelineStyle: {
    alignSelf: 'flex-start',
    marginVertical: hp(2),
  },
  flexOne: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textreson: {
    color: COLORS.black,
    fontSize: 12,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  checkOutIcon: {
    width: wp(5),
    height: hp(3.5),
    resizeMode: 'contain',
    marginRight: wp(2),
  },
});

export default DeclineModal;
