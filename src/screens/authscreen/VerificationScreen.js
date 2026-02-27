import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../utils/colors';
import OTPTextInput from 'react-native-otp-textinput';
import FastImage from 'react-native-fast-image';
import images from '../../assets/images';
import CustomButton from '../../components/CustomButton';
import { resendOTP, VerifyOTP } from '../../api/authApi';
import useCountdown from '../../utils/hooks/useCountdown';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../redux/slices/authSlice';
import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isTablet } from '../../components/TabletResponsiveSize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from '../../components/AppText';

const VerificationScreen = ({ navigation, route }) => {
  const { phoneNumber, callingCode, otp: serverOtp, userId } = route.params;
  const [serverOtpState, setServerOtpState] = useState(serverOtp);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const intervalRef = useRef(null);
  const { time, startCountdown, resetCountdown, status, formatTime } =
    useCountdown();
  const dispatch = useDispatch();
  const [Loader, setLoader] = useState(false);
  useEffect(() => {
    startCountdown(30);
  }, [startCountdown]);


  const handleVerify = async () => {
    setLoader(true);
    if (otp.length !== 4) {
      setError('Please enter a 4-digit OTP');
      return;
    }

    const postdata = {
      otp: Number(otp),
      userId: userId,
    };
    try {
      const res = await VerifyOTP(postdata);
      if (res?.data?.status === true) {
        try {
          await AsyncStorage.setItem(
            'accessToken',
            res?.data?.data?.refreshToken,
          );
          dispatch(setUser({ user: res?.data?.data }));
          dispatch(setToken({ accessToken: res?.data?.data?.refreshToken }));

          Toast.show(res?.data?.message || 'Verified Successfully');
          await AsyncStorage.setItem('token', res?.data?.data?.refreshToken);
          await AsyncStorage.setItem('hasSetOTP', 'true');
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'ServiceScreen',
              },
            ],
          });
          Keyboard.dismiss();
          setLoader(false);
        } catch (error) {
          Toast.show('Auth Not Found');

          console.log('Error saving token', error);
        }
      }
      // failed case (but server returned status 200)
      else {
        Toast.show(res?.data?.message || 'Invalid OTP');
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);

      console.log('Catch Error:', error);

      // SERVER SENT ERROR MESSAGE (like status 410)
      if (error?.response?.data?.message) {
        Toast.show(error?.response?.data?.message);
        setLoader(false);
      }
      // If message missing show default
      else {
        setLoader(false);

        Toast.show('Something went wrong');
      }
    } finally {
      setLoader(false);
    }
  };

  // resend otp
  const handleResendOTP = async () => {
    try {
      let data = {
        // phoneNumber: phoneNumber,
        // countryCode: callingCode,
        userId: userId,
      };
      const result = await resendOTP(data);
      if (result?.status) {
        Toast.show('OTP Resend');
        Alert.alert('This is your Resend OTP', result?.otpπ)
        setServerOtpState(result?.otp);
        // Timer
        resetCountdown();
        startCountdown(30);

        // Save in Redux
        dispatch(setUser({ user: result?.data }));
        dispatch(setToken({ accessToken: result?.data?.refreshToken }));
      }
    } catch (error) {
      console.log('handleResendOTP:', error);
    }
  };

  const onOtpChange = text => {
    // sirf numbers allow
    const cleaned = text.replace(/\D/g, '');

    // max 4 digit hi rakho
    const otpValue = cleaned.slice(0, 4);

    setOtp(otpValue);

    // 4 digit complete hote hi keyboard band
    if (otpValue.length === 4) {
      Keyboard.dismiss();
    }
  };


  return (
    <SafeAreaView style={styles.SafeAreaViewContainer}>
      <StatusBar barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={hp('8%')}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack('')}
            >
              <FastImage
                source={images.backArrow}
                style={styles.backImg}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
            <AppText style={styles.title}>Verification code</AppText>
            <FastImage
              source={images.otpIcon}
              style={styles.image}
              resizeMode={FastImage.resizeMode.contain}
            />
            <AppText style={styles.otptitle}>Enter OTP to Verify</AppText>
            <AppText style={styles.subtitle}>
              We've sent a 4-digit code to {callingCode}{' '}
              {phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1XXXX$3')}
            </AppText>

            <OTPTextInput
              inputCount={4}
              keyboardType="number-pad"
              autoFocus={false}
              handleTextChange={onOtpChange}
              defaultValue={otp}
              containerStyle={styles.otpContainer}
              textInputStyle={styles.otpInput}
              tintColor={COLORS.themeColor}
              offTintColor={COLORS.borderColor}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              onPress={() => {
                status !== 'running' && handleVerify();
              }}
            >

              <AppText style={[styles.resendTitle, { color: COLORS.black }]}>
                {status === 'running' ? formatTime(time) : 'Resend OTP'}
              </AppText>

              <CustomButton
                buttonName="Submit"
                margingTOP={hp('3%')}
                btnTextColor={COLORS.white}
                btnColor={
                  otp.length === 4 ? COLORS.themeColor : COLORS.disabledGrey
                }
                onPress={handleVerify}
                disabled={otp.length !== 4}
                Loader={Loader}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    flex: 1,
    // padding: wp('5%'),
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginBottom: hp('2%'),
  },
  title: {
    fontSize: hp('2.5%'),
    fontFamily: Fonts.bold,
    textAlign: 'center',
    color: COLORS.black,
  },
  image: {
    width: wp('35%'),
    height: hp('20%'),
    alignSelf: 'center',
    resizeMode: 'contain',
    marginVertical: hp('4%'),
  },
  backImg: {
    width: wp('5%'),
    height: hp('5%'),
    resizeMode: 'contain',
    marginTop: hp('1.5%'),
  },
  subtitle: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.semiBold,
    textAlign: 'left',
    color: COLORS.textHeading,
    marginBottom: hp('1%'),
  },
  otptitle: {
    fontSize: hp('1.4%'),
    fontFamily: Fonts.medium,
    textAlign: 'left',
    marginBottom: hp('1%'),
    color: COLORS.black,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  resendTitle: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
    color: COLORS.themeColor,
  },
  otpContainer: {
    alignSelf: 'center',
    marginBottom: hp('1%'),
    marginTop: hp('0.5%'),
    // height
  },
  otpInput: {
    // height
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 20,
    width: isTablet ? wp(6) : wp('13%'),
    // height: Platform.OS === 'android' ? hp('6%') : hp('5%'),
    height: hp(6),

    fontSize: hp('2.5%'),
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.errorRed,
    fontSize: hp('1.8%'),
    marginVertical: hp('1%'),
    textAlign: 'center',
  },
});

export default VerificationScreen;
