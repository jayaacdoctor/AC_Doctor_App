import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../../assets/images';
import Header from '../../components/Header';
import { COLORS, Fonts } from '../../utils/colors';
import CustomButton from '../../components/CustomButton';
import { isTablet } from '../../components/TabletResponsiveSize';
import AppText from '../../components/AppText';

const PaymentScreen = ({ navigation, route }) => {
  const { selectedAddress, selectedSlot } = route.params || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [openCard, setOpenCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const amount = 750; // Placeholder amount

  const paymentMethods = [
    { id: 'cod', label: 'Cash on Delivery', icon: images.Cash },
    {
      id: 'card',
      label: 'Credit/Debit Card',
      icon: images.Cards,
      arrow: images.rightArrow,
    },
    { id: 'upi', label: 'UPI', icon: images.UPI, arrow: images.rightArrow },
    {
      id: 'netbanking',
      label: 'Net Banking',
      icon: images.NB,
      arrow: images.rightArrow,
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: images.Wallet,
      arrow: images.rightArrow,
    },
  ];

  const toggleCardDetails = methodId => {
    if (methodId === 'card') {
      setOpenCard(prev => !prev);
    } else {
      setOpenCard(false); // Close card details if another method is selected
    }
    setSelectedPaymentMethod(methodId);
  };

  const handleSubmit = () => {
    navigation.navigate('BookingSuccessScreen');
    // if (selectedPaymentMethod === 'card') {
    //   if (
    //     cardNumber.length === 16 &&
    //     cardholderName &&
    //     expiryDate.length === 5 &&
    //     cvv.length === 3
    //   ) {
    //     alert(
    //       `Payment of ₹${amount} with card ending ${cardNumber.slice(-4)} confirmed!`,
    //     );
    //     navigation.navigate('BookingSuccess', {
    //       selectedAddress,
    //       selectedSlot,
    //     });
    //   } else {
    //     alert('Please enter valid card details');
    //   }
    // } else if (selectedPaymentMethod) {
    //   alert(`Payment of ₹${amount} via ${selectedPaymentMethod} confirmed!`);
    //   navigation.navigate('BookingSuccess', { selectedAddress, selectedSlot });
    // } else {
    //   alert('Please select a payment method');
    // }
  };

  return (
    <View style={styles.container}>
      <Header title="Payment" onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scrollStyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.paymentContainer}>
          <AppText style={styles.sectionLabel}>Select Payment Mode</AppText>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPaymentMethod === method.id && styles.selectedPayment,
              ]}
              onPress={() => toggleCardDetails(method.id)}
            >
              <View style={styles.paymentRow}>
                <View style={styles.paymentInfo}>
                  <Image source={method.icon} style={styles.paymentIcon} />
                  <AppText style={styles.paymentLabel}>{method.label}</AppText>
                </View>
                {method.arrow && (
                  <Image source={method.arrow} style={styles.paymentArrow} />
                )}
              </View>
              {method.id === 'card' && openCard && (
                <View style={styles.cardDetailsContainer}>
                  <AppText style={styles.saveCardText}>Saved Cards</AppText>
                  <View style={styles.saveCardRow}>
                    <Image source={images.vista} style={styles.saveCardIcon} />
                    <Image
                      source={images.punjabcart}
                      style={styles.saveCardIcon}
                    />
                    <TouchableOpacity style={styles.addNewStyle}>
                      <AppText style={styles.label}>+ Add new</AppText>
                    </TouchableOpacity>
                  </View>
                  <AppText style={styles.label}>Cardholder Name</AppText>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputText}
                      value={cardholderName}
                      onChangeText={setCardholderName}
                      placeholder="John Doe"
                      autoCapitalize="words"
                      onSubmitEditing={() => Keyboard.dismiss()}
                      allowFontScaling={false}
                      includeFontPadding={false}
                    />
                    <Image
                      source={images.UserFilled}
                      style={styles.inputIcon}
                    />
                  </View>
                  <AppText style={styles.label}>Card Number</AppText>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputText}
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      placeholder="1234 5678 9012 3456"
                      keyboardType="numeric"
                      maxLength={16}
                      onSubmitEditing={() => Keyboard.dismiss()}
                      allowFontScaling={false}
                      includeFontPadding={false}
                    />
                    <Image source={images.Cardsnum} style={styles.inputIcon} />
                  </View>
                  <View style={styles.rowContainer}>
                    <View style={styles.halfInput}>
                      <AppText style={styles.label}>Expiry Date (MM/YY)</AppText>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.inputText}
                          value={expiryDate}
                          onChangeText={setExpiryDate}
                          placeholder="MM/YY"
                          keyboardType="numeric"
                          maxLength={5}
                          onSubmitEditing={() => Keyboard.dismiss()}
                          allowFontScaling={false}
                          includeFontPadding={false}
                        />
                        <Image
                          source={images.Calendar}
                          style={styles.inputIcon}
                        />
                      </View>
                    </View>
                    <View style={styles.halfInput}>
                      <AppText style={styles.label}>CVV</AppText>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.inputText}
                          value={cvv}
                          onChangeText={setCvv}
                          placeholder="123"
                          keyboardType="numeric"
                          maxLength={3}
                          onSubmitEditing={() => Keyboard.dismiss()}
                          allowFontScaling={false}
                          includeFontPadding={false}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
          <CustomButton
            buttonName="Make Payment"
            margingTOP={isTablet ? hp(35) : hp(40)}
            btnTextColor={COLORS.white}
            btnColor={COLORS.themeColor}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  scrollStyle: {
    flex: 1,
    paddingHorizontal: wp('4%'),
  },
  paymentContainer: {
    paddingVertical: hp('2%'),
  },
  sectionLabel: {
    fontSize: hp('1.8%'),
    color: COLORS.black,
    fontFamily: Fonts.medium,
    marginBottom: hp('2%'),
  },
  paymentOption: {
    padding: wp('2.8%'),
    borderWidth: 0.5,
    borderColor: COLORS.themeColor,
    borderRadius: wp('2.5%'),
    marginBottom: hp('1.5%'),
    backgroundColor: COLORS.white,
  },
  selectedPayment: {
    borderColor: '#1a73e8',
    backgroundColor: COLORS.white,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: wp('5%'),
    height: hp('2%'),
    marginRight: wp('3%'),
  },
  paymentArrow: {
    width: wp('4%'),
    height: hp('2%'),
  },
  paymentLabel: {
    fontSize: hp('1.6%'),
    color: COLORS.black,
    fontFamily: Fonts.regular,
  },
  cardDetailsContainer: {
    marginTop: hp('0.3%'),
    padding: wp('4%'),
    backgroundColor: COLORS.white,
    borderRadius: wp('2%'),
    width: wp('90%'),
    alignSelf: 'center',
  },
  saveCardText: {
    fontSize: hp('1.5%'),
    color: COLORS.textHeading,
    fontFamily: Fonts.medium,
    marginBottom: hp('1.5%'),
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  saveCardIcon: {
    width: wp('15%'),
    height: hp('5%'),
    resizeMode: 'contain',
    marginRight: wp('3%'),
  },
  addNewStyle: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    padding: hp('1%'),
    alignItems: 'center',
  },
  label: {
    fontSize: hp('1.5%'),
    color: '#666',
    fontFamily: Fonts.medium,
    marginBottom: hp('1%'),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('6%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp(Platform.OS === 'ios' ? '1%' : '0%'),
    marginBottom: hp('2%'),
  },
  inputText: {
    flex: 1,
    fontSize: hp('1.6%'),
    fontFamily: Fonts.regular,
    color: COLORS.black,
  },
  inputIcon: {
    width: wp('5%'),
    height: hp('2.3%'),
    marginLeft: wp('2%'),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: wp('2%'),
  },
});

export default PaymentScreen;
