import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../../components/Header';
import images from '../../assets/images';
import { COLORS, Fonts } from '../../utils/colors';
import AppText from '../../components/AppText';

const AMCDashBoard = ({ navigation }) => {
  const acTypes = [
    { name: 'Split AC', icon: images.SplitAMC, },
    { name: 'Window AC', icon: images.windowAc, },
    { name: 'Cassette AC', icon: images.casseteAc, },
    { name: 'VRV/VRF AC', icon: images.VRVac, },
    { name: 'Ducted AC', icon: images.ductedAc, },
    { name: 'Tower AC', icon: images.towerAc, },
  ];

  const services = [
    {
      title: 'new Booking',
      onPress: () => navigation.navigate('ReqBookingAMC'),
    },
    {
      title: 'Service Report',
      icon: images.reportIcon,
      onPress: () => navigation.navigate('ServiceReportscreen'),
    },
    {
      title: 'Bills',
      icon: images.BillsAMS,
      onPress: () => navigation.navigate('ListOfBill'),
    },
    {
      title: 'Warranty',
      icon: images.WarrantyIcon,
      onPress: () => navigation.navigate('ListOfBill'),
    },
    {
      title: 'Shop',
      icon: images.shopAMC,
      onPress: () => navigation.navigate('ListOfBill'),
    },
    {
      title: 'Payment', icon: images.PaymentIcon, onPress: () => navigation
        .navigate('PaymentlistScreen')
    },
  ];

  const stats = [
    { label: 'Total Servicing Per Unit', value: 4 },
    { label: 'Total Servicing Completed', value: 2 },
    { label: 'Remaining Servicing', value: 4 },
    { label: 'Total Repair Call', value: 4 },
  ];

  return (
    <View style={styles.mainContainer}>
      <Header title="AMC DashBoard" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        {/* Total AC Container */}
        <View style={styles.acBox}>
          <AppText style={styles.heading}>AC Under AMC</AppText>

          <View style={styles.acRow}>
            <FlatList
              data={acTypes}
              numColumns={3}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.acItem} onPress={() => navigation.navigate('ACUnderServiceList', { acType: item.name })}>
                  <View style={styles.acIconCircle}>
                    <Image source={item.icon} style={styles.acIcon} />
                  </View>
                  <AppText style={styles.acName}>{item.name}</AppText>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>

        {/* Services Section */}
        <AppText style={styles.serviceHeading}>Services</AppText>

        <View style={styles.serviceBox}>
          {services.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.serviceItem}
              onPress={item.onPress}
            >
              <View style={styles.serviceIconCircle}>
                <Image source={item.icon} style={styles.serviceIcon} />
                {item.title === 'new Booking' && (
                  <AppText style={styles.bookText}>15</AppText>
                )}
              </View>
              <AppText style={styles.serviceText}>{item.title}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <View style={{ marginBottom: hp('15%') }}>
          {stats.map((item, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statCircle}>
                <AppText style={styles.statNumber}>{item.value}</AppText>
              </View>
              <AppText style={styles.statLabel}>{item.label}</AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AMCDashBoard;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },

  // ------------------ Total AC Box ----------------------
  acBox: {
    backgroundColor: COLORS.white,
    margin: wp('4%'),
    borderRadius: 16,
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  heading: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
  },

  acRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },

  acItem: {
    alignItems: 'center',
    width: wp('28%'),
    paddingVertical: hp('1%'),
  },

  acIconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  acIcon: {
    width: wp('13%'),
    height: wp('13%'),
    resizeMode: 'contain',
  },

  acName: {
    marginTop: hp('1%'),
    fontSize: hp('1.4%'),
    fontFamily: Fonts.medium,
    color: '#333',
  },

  // ------------------ Services ----------------------
  serviceHeading: {
    marginLeft: wp('5%'),
    fontSize: hp('1.8%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
  },

  serviceBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    marginHorizontal: wp('4%'),
    padding: wp('2%'),
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  serviceItem: {
    width: '28%',
    backgroundColor: COLORS.white,
    paddingVertical: hp('2.5%'),
    alignItems: 'center',
    borderRadius: 12,
  },
  serviceIconCircle: {
    backgroundColor: '#fdecec',
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: wp('7.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIcon: {
    width: wp('12%'),
    height: wp('12%'),
    resizeMode: 'contain',
  },
  serviceText: {
    marginTop: hp('1%'),
    textAlign: 'center',
    fontSize: hp('1.4%'),
    fontFamily: Fonts.medium,
    color: COLORS.black,
  },
  bookText: {
    fontSize: hp('2%'),
    fontFamily: Fonts.bold,
    color: COLORS.red,
    marginTop: hp('-6%'),
    textAlignVertical: 'top',
  },

  // ------------------ Status Cards -------------------
  statCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: wp('4%'),
    marginTop: hp('2%'),
    borderRadius: 13,
    padding: wp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
  },

  statCircle: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('6%'),
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statNumber: {
    fontSize: hp('2%'),
    fontWeight: '700',
    color: '#2d7fd1',
  },

  statLabel: {
    marginLeft: wp('4%'),
    fontSize: hp('1.5%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
  },
});
