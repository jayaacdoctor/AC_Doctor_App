import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../../components/Header';
import { COLORS, Fonts } from '../../utils/colors';
import CustomButton from '../../components/CustomButton';
import CustomDateTimePicker from '../../components/CustomDateTimePicker';
import AppText from '../../components/AppText';

const ReqBookingAMC = ({ navigation }) => {
  const [selectedSlot, setSelectedSlot] = useState('first');

  return (
    <View style={styles.container}>
      <Header title="Request AMC Booking" onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: wp('4%') }}
      >
        {/* USER CARD */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={{ width: '50%' }}>
              <AppText style={styles.label}>Name</AppText>
              <AppText style={styles.value}>Irshad Khan</AppText>
            </View>

            <View style={{ width: '50%', alignItems: 'flex-end' }}>
              <AppText style={styles.label}>Phone Number</AppText>
              <AppText style={styles.value}>9876543210</AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View style={{ width: '70%' }}>
              <AppText style={styles.areaTitle}>Vijay Nagar</AppText>
              <AppText style={styles.address}>
                149-B, Vijay Nagar, Near by C21 mall,{'\n'}
                Indore, Madhya Pradesh 452016
              </AppText>
            </View>

            <TouchableOpacity style={styles.changeBtn}>
              <AppText style={styles.changeText}>Change</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* DATE & TIME CARD */}
        <CustomDateTimePicker
          activeColor={COLORS.themeColor}
          daysArray={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
          onDateChange={d => console.log('DATE:', d)}
          onSlotChange={s => console.log('SLOT:', s)}
        />

        {/* BUTTON */}
        <TouchableOpacity style={styles.bookBtn}>
          <CustomButton
            buttonName="Book Now"
            margingTOP={hp('0%')}
            btnTextColor={COLORS.white}
            btnColor={COLORS.themeColor}
            onPress={() => navigation.navigate('ConfirmService')}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ReqBookingAMC;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
    // padding: wp("4%"),
  },

  card: {
    backgroundColor: COLORS.white,
    padding: wp('4%'),
    borderRadius: 16,
    marginBottom: hp('2.5%'),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: hp('1.6%'),
    color: '#888',
  },

  value: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.semiBold,
    marginTop: hp('0.7%'),
    color: '#000',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: hp('2%'),
  },

  areaTitle: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.semiBold,
    color: '#000',
  },

  address: {
    marginTop: hp('0.6%'),
    fontSize: hp('1.6%'),
    color: COLORS.gray,
    lineHeight: hp('2.2%'),
  },

  changeBtn: {
    alignSelf: 'flex-start',
    paddingVertical: hp('0.7%'),
    paddingHorizontal: wp('3%'),
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.themeColor,
  },

  changeText: {
    color: COLORS.themeColor,
    fontSize: hp('1.6%'),
    fontFamily: Fonts.semiBold,
  },

  // DATE & TIME
  cardTitle: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.semiBold,
    marginBottom: hp('1.5%'),
    color: '#000',
  },

  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },

  navArrow: {
    backgroundColor: '#F1F4F8',
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    fontSize: hp('2.5%'),
    color: '#444',
  },

  monthText: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.semiBold,
    color: '#333',
  },

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('1%'),
  },

  dateItem: {
    alignItems: 'center',
    width: wp('12%'),
  },

  dateDay: {
    fontSize: hp('1.7%'),
    color: COLORS.gray,
    marginBottom: hp('0.8%'),
  },

  dateCircle: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F4F8',
  },

  dateNumber: {
    color: '#333',
    fontSize: hp('1.9%'),
  },

  // SLOT BOX
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  slotBox: {
    width: '48%',
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    backgroundColor: '#F8FAFD',
  },

  slotActive: {
    borderColor: COLORS.themeColor,
  },

  slotActiveSecond: {
    borderColor: COLORS.themeColor,
  },

  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  slotTitle: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.semiBold,
    color: '#333',
  },

  slotTitleActive: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.semiBold,
    color: '#333',
  },

  slotTime: {
    marginTop: hp('0.8%'),
    fontSize: hp('1.3%'),
    color: COLORS.gray,
  },

  slotTimeActive: {
    marginTop: hp('0.8%'),
    fontSize: hp('1.3%'),
    color: COLORS.gray,
  },

  radioOuter: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    borderRadius: wp('2.3%'),
    borderWidth: 1,
    borderColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterActive: {
    borderColor: COLORS.themeColor,
  },

  radioInner: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('7%'),
    borderWidth: 1,
    backgroundColor: COLORS.darkGray,
    borderColor: COLORS.darkGray,
  },

  radioInnerActive: {
    backgroundColor: COLORS.themeColor,
    borderRadius: wp('1%'),
  },

  // BOOK BUTTON
  bookBtn: {
    alignItems: 'center',
    marginTop: hp('2%'),
    // marginBottom: hp("3%"),
  },

  bookText: {
    color: COLORS.white,
    fontSize: hp('2%'),
    fontFamily: Fonts.semiBold,
  },
});
