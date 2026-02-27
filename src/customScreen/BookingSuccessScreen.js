import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import images from '../assets/images'; // Your check icon
import { COLORS, Fonts } from '../utils/colors';
import AppText from '../components/AppText';

const BookingSuccessScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Tab', params: { screen: 'Home' } }],
      });
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <FastImage
          source={images.SuccessIcon} // Replace with your blue check icon
          style={styles.checkIcon}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>

      {/* Title */}
      <AppText style={styles.title}>Booking Successful! 🎉</AppText>

      {/* Card */}
      <View style={styles.card}>
        {/* <Text style={styles.orderId}>Order ID : 2001</Text> */}
        <AppText style={styles.message}>
          Thank you for choosing us. Your booking has been confirmed, and our professional will get in touch with you very soon.
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkIcon: {
    width: 100,
    height: 100,
    tintColor: COLORS.white, // White checkmark
  },
  title: {
    fontSize: hp(2.5),
    fontFamily: Fonts.bold,
    color: COLORS.black,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    width: '100%',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  orderId: {
    fontSize: hp(1.6),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: Fonts.semiBold,
  },
});

export default BookingSuccessScreen;
