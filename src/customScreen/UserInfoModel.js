import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { COLORS, Fonts } from '../utils/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppText from '../components/AppText';

const UserInfoModel = ({ visible, onClose, onProceed }) => {
  const navigation = useNavigation();

  const [userInfo, setUserInfo] = useState({
    name: '',
    number: '',
    address: '',
  });

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleProceedPress = () => {
    if (!userInfo.name || !userInfo.number || !userInfo.address) {
      alert('Please fill in all fields');
      return;
    }
    onProceed(userInfo);
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* DARK BACKGROUND */}
      <View style={styles.backdrop}>
        {/* PRESS OUTSIDE TO CLOSE */}
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* BOTTOM SHEET */}
        <View style={styles.modalContent}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraHeight={60}
            extraScrollHeight={60}
            keyboardOpeningTime={0}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inFlexrow}>
              <AppText style={styles.headerText}>Enter Your Details</AppText>

              <TouchableOpacity
                onPress={() => {
                  onClose();
                  navigation.navigate('AddAddress', { from: 'UserInfoModel' });
                }}
              >
                <AppText style={styles.addAddressText}>Add New Address</AppText>
              </TouchableOpacity>
            </View>

            <AppText style={styles.TitleheadText}>Name</AppText>
            <TextInput
              placeholder="Enter your Name"
              style={styles.inputContainer}
              value={userInfo.name}
              onChangeText={t => handleInputChange('name', t)}
              onSubmitEditing={() => Keyboard.dismiss()}
              allowFontScaling={false}
              includeFontPadding={false}
            />

            <AppText style={styles.TitleheadText}>Number</AppText>
            <TextInput
              placeholder="Enter your Number"
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.inputContainer}
              value={userInfo.number}
              onChangeText={t => handleInputChange('number', t)}
              onSubmitEditing={() => Keyboard.dismiss()}
              allowFontScaling={false}
              includeFontPadding={false}
            />

            <AppText style={styles.TitleheadText}>Address</AppText>
            <TextInput
              placeholder="Enter your Address / state / pincode"
              multiline
              style={[styles.inputContainer, { height: hp('10%') }]}
              textAlignVertical="top"
              value={userInfo.address}
              onChangeText={t => handleInputChange('address', t)}
              onSubmitEditing={() => Keyboard.dismiss()}
              allowFontScaling={false}
              includeFontPadding={false}
            />

            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleProceedPress}
            >
              <AppText style={styles.proceedButtonText}>Proceed</AppText>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#f5fcfcff',
    paddingHorizontal: hp('2%'),
    paddingVertical: hp('2%'),
    borderTopLeftRadius: wp('7%'),
    borderTopRightRadius: wp('7%'),
    maxHeight: hp('80%'), // IMPORTANT — prevents modal from jumping!
  },

  inFlexrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.textHeading,
  },

  addAddressText: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.regular,
    color: COLORS.themeColor,
  },

  TitleheadText: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.semiBold,
    marginTop: hp(2),
    marginBottom: hp(0.8),
  },

  inputContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    padding: hp(1.4),
    alignSelf: 'center',
    fontSize: hp('1.7%'),
  },

  proceedButton: {
    backgroundColor: COLORS.themeColor,
    padding: hp(1.5),
    borderRadius: wp(6),
    alignItems: 'center',
    marginTop: hp(3),
  },

  proceedButtonText: {
    color: COLORS.white,
    fontSize: hp('2%'),
    fontFamily: Fonts.bold,
  },
});

export default UserInfoModel;
