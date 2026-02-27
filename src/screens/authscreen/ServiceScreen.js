import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../utils/colors';
import FastImage from 'react-native-fast-image';
import images from '../../assets/images';
import { useNavigation } from '@react-navigation/native';
import { isTablet } from '../../components/TabletResponsiveSize';
import Geolocation from '@react-native-community/geolocation';
import GetLoaction from '../../components/GetLoaction';
import CustomLoader from '../../components/CustomLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from '../../components/AppText';

const ServiceScreen = () => {
  const navigation = useNavigation();
  const [isFetching, setIsFetching] = useState(false);
  const retryIntervalRef = useRef(null);
  const retryCountRef = useRef(0);


  useEffect(() => {
    Geolocation.requestAuthorization();
  }, []);

  const { latitude, longitude, addressText, loading, error, getLocation } = GetLoaction();

  const handleUseCurrentLocation = () => {
    if (isFetching) return;

    setIsFetching(true);
    retryCountRef.current = 0;

    retryIntervalRef.current = setInterval(() => {
      retryCountRef.current += 1;

      getLocation(async locationData => {
        if (locationData?.address || locationData?.formattedAddress) {

          clearInterval(retryIntervalRef.current);
          retryIntervalRef.current = null;

          setIsFetching(false);
          retryCountRef.current = 0;

          await AsyncStorage.setItem('hasSelectedLocation', 'true');

          navigation.reset({
            index: 0,
            routes: [{ name: 'Tab' }],
          });

        }
      });

      // Stop after 5 retries
      if (retryCountRef.current >= 5) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
        setIsFetching(false);
        retryCountRef.current = 0;
        // Alert.alert("Unable to fetch location. Please try again.");
      }

    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
      }
    };
  }, []);


  return (
    <View style={styles.container}>
      <AppText style={styles.title}>Find Services Near You</AppText>

      <FastImage
        source={images.service}
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
      <AppText style={styles.subtitle}>
        Quickly detect your location for better service!
      </AppText>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => handleUseCurrentLocation()}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={images.locationIcon}
            style={styles.backImg}
            resizeMode={'contain'}
          />
          <AppText style={styles.locationText}>{isFetching ? "Fetching Location..." : "Use Current Location"}</AppText>
          {isFetching ? <CustomLoader size="small" color='white' /> : null}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.locationManualButton}
        onPress={() => navigation.navigate('AddAddress', { from: 'ServiceScreen' })}
      >
        <AppText style={[styles.locationText, { color: COLORS.black }]}>
          Enter Location Manually
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: hp('2%'),
  },
  backImg: {
    width: isTablet ? wp(3.5) : wp(6),
    height: isTablet ? hp(3.5) : hp(6),
    resizeMode: 'contain',
    marginHorizontal: hp('1%'),
  },
  title: {
    fontSize: hp('2.5%'),
    fontFamily: Fonts.bold,
    textAlign: 'center',
    color: COLORS.black,
    marginBottom: hp('2%'),
  },
  image: {
    width: wp('60%'),
    height: hp('30%'),
    alignSelf: 'center',
    marginVertical: hp('2%'),
    marginBottom: hp('8%'),
  },
  subtitle: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.medium,
    textAlign: 'center',
    color: COLORS.black,
  },
  locationManualButton: {
    height: hp('5.4%'),
    borderColor: COLORS.black,
    borderWidth: hp('0.1%'),
    borderRadius: 25,
    width: wp('90%'),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('3%'),
  },
  locationButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: hp('5.4%'),
    backgroundColor: COLORS.themeColor,
    borderRadius: 25,
    width: wp('90%'),
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: hp('4%'),
  },
  locationText: {
    color: COLORS.white,
    fontSize: hp('1.8%'),
    fontFamily: Fonts.medium,
    // marginLeft: wp('2%'),
    textAlign: 'center',
    marginRight: 10,
  },
  errorText: {
    color: COLORS.errorRed,
    fontSize: hp('1.8%'),
    marginTop: hp('1%'),
    textAlign: 'center',
  },
});

export default ServiceScreen;
