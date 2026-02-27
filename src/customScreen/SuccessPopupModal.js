import React from 'react';
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
import { isTablet } from '../components/TabletResponsiveSize';
import AppText from '../components/AppText';

const SuccessPopupModal = ({
  visible,
  onClose,
  message1,
  HeadText,
  message2,
  setIcon = images.correctIcon,
  HeadTextColor,
  buttonCount = 1, // Default to 1 button
  firstButtonText = 'Done',
  secondButtonText = 'View Request', // Default text for second button
  onSecondButtonPress = onClose, // Default action for second button
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Checkmark Icon */}
          <View style={styles.iconContainer}>
            <Image
              source={setIcon}
              style={styles.checkmarkIcon}
              resizeMode="contain"
            />
          </View>

          {/* Success Message */}
          <AppText style={[styles.title, { color: HeadTextColor }]}>
            {HeadText}
          </AppText>
          <AppText style={styles.message}>{message1}</AppText>
          <AppText style={styles.message}>{message2}</AppText>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* First Button */}
            <TouchableOpacity
              style={[
                styles.doneButton,
                buttonCount === 1 && styles.singleButton,
                buttonCount === 2 && styles.primaryHalfButton,
              ]}
              onPress={onClose}
            >
              <AppText style={styles.primaryText} numberOfLines={1}>
                {firstButtonText}
              </AppText>
            </TouchableOpacity>

            {/* Second Button */}
            {buttonCount === 2 && (
              <TouchableOpacity
                style={[styles.doneButton, styles.secondaryHalfButton]}
                onPress={onSecondButtonPress}
              >
                <AppText style={styles.secondaryText} numberOfLines={0}>
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
    width: isTablet ? wp(50) : wp(85),
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: hp(3),
    paddingHorizontal: wp(6),
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 15,
  },
  checkmarkIcon: {
    width: isTablet ? wp(12) : wp(22),
    height: isTablet ? wp(12) : wp(22),
  },
  title: {
    fontSize: isTablet ? hp(2.5) : hp(2.8),
    textAlign: 'center',
    fontFamily: Fonts.extraBold,
    color: COLORS.black,
    marginBottom: 10,
  },

  message: {
    fontSize: isTablet ? hp(1.6) : hp(1.6),
    fontFamily: Fonts.medium,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp(2.5),
  },
  doneButton: {
    // paddingVertical: isTablet ? wp(1.5) : 8.5,
    paddingVertical: hp(0.8),            // responsive vertical padding
    paddingHorizontal: wp(3),
    alignItems: 'center',
    borderRadius: wp(10),
  },
  secondButton: {
    backgroundColor: COLORS.themeColor,
    borderColor: COLORS.textHeading,
    borderWidth: wp(0.2),
    borderRadius: hp(10),
  },

  singleButton: {
    maxWidth: wp('70%'),
    alignSelf: 'center',
    backgroundColor: COLORS.themeColor,
  },
  primaryHalfButton: {
    width: wp('38%'),
    marginRight: wp(2),
    backgroundColor: COLORS.themeColor,
  },
  secondaryHalfButton: {
    width: wp('38%'),
    // marginLeft: wp(2),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.themeColor,
  },
  primaryText: {
    color: '#fff',
    fontSize: hp(1.8),
    fontWeight: '500',
    textAlign: 'center',
  },
  secondaryText: {
    color: COLORS.themeColor,
    fontSize: hp(1.8),
    fontWeight: '500',
    textAlign: 'center',
  },

});

export default SuccessPopupModal;
