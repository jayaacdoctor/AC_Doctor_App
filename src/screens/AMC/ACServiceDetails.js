import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Header from '../../components/Header';
import { COLORS, Fonts } from '../../utils/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CustomButton from '../../components/CustomButton';
import images from '../../assets/images';
import AppText from '../../components/AppText';
// import images from '../../assets/images';

const ACServiceDetails = ({ route, navigation }) => {
  const { data } = route.params;
  // render
  return (
    <View style={styles.mainContainer}>
      <Header title={data.name} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainBox}>
          <AppText style={styles.textSty}>{data.model} 3 star</AppText>
          <View style={styles.rowview}>
            <Image
              source={images.Calendar}
              style={[styles.imagesty, { tintColor: COLORS.blue }]} />
            <AppText style={styles.textSty}>
              Last service: {data.lastService} months ago
            </AppText>
          </View>
          <View style={styles.rowview}>
            <Image
              source={images.Alertoctagon}
              style={[styles.imagesty]} />
            <AppText style={styles.textSty}>Overdue by: {data.overdue} months</AppText>
          </View>
        </View>

      </ScrollView>
      <View style={styles.servicesSection}>
        <CustomButton
          buttonName={'Request Booking'}
          btnTextColor={COLORS.white}
          // margingTOP={hp(5)}
          onPress={() => navigation.navigate('PaymentScreen')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  textSty: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
    marginVertical: wp('0.5%'),
  },
  mainBox: {
    backgroundColor: COLORS.white,
    marginVertical: wp('1.5%'),
    marginHorizontal: wp('3%'),
    paddingHorizontal: wp('3%'),
    paddingBottom: hp('1%'),
    borderRadius: 10,
    marginTop: hp('2%'),
  },
  servicesSection: {
    alignItems: 'center',
    paddingHorizontal: hp('2.5%'),
    paddingVertical: hp('1.5%'),
    paddingBottom: hp('4%'),
    backgroundColor: COLORS.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  rowview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('0.5%'),
  },
  imagesty: {
    width: wp('5%'),
    height: hp('3%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
});

export default ACServiceDetails;
