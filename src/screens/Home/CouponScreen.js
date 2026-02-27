import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../utils/colors';
import Header from '../../components/Header';
import CustomLoader from '../../components/CustomLoader';
import AppText from '../../components/AppText';

const CouponScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);

  // 🔹 API CALL (replace with real API)
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      // mock api delay
      setTimeout(() => {
        setCoupons([
          {
            id: '1',
            code: '#12345',
            expiry: '31/12/2025',
            title: 'Special AC Care Offer',
            description:
              'Buy a new AC get 2 services free with 20% discount on installation.',
          },
          {
            id: '2',
            code: '#12346',
            expiry: '31/12/2025',
            title: 'Special AC Care Offer',
            description:
              'Buy a new AC get 2 services free with 20% discount on installation.',
          },
        ]);
        setLoading(false);
      }, 1200);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.rowBetween}>
        <View>
          <AppText style={styles.label}>Coupon Code</AppText>
          <AppText style={styles.code}>{item.code}</AppText>
        </View>
        <View>
          <AppText style={styles.label}>Exp Date</AppText>
          <AppText style={styles.expiry}>{item.expiry}</AppText>
        </View>
      </View>

      {/* Content */}
      <View style={styles.rowBtw}>
        <AppText style={styles.title}>{item.title}</AppText>
        <AppText style={styles.desc}>{item.description}</AppText>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <AppText style={styles.discount}>Discount</AppText>
        <TouchableOpacity style={styles.applyBtn}>
          <AppText style={styles.applyText}>Apply Coupon</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Your Coupon" onBack={() => navigation.goBack()} />

      <View style={styles.bgColor}>
        <AppText style={styles.headerText}>
          {coupons.length} Coupon’s available
        </AppText>
      </View>

      <View style={styles.screnContainer}>
        {loading ? (
          <CustomLoader size="large" />
        ) : (
          <FlatList
            data={coupons}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default CouponScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screnContainer: {
    padding: wp('4%'),
  },
  headerText: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.medium,
    marginBottom: hp('1%'),
    marginLeft: hp('2%'),
    borderBottomWidth: 2,
    borderBottomColor: COLORS.themeColor,
    width: wp('40%'),
  },
  bgColor: {
    backgroundColor: COLORS.white,
    marginTop: hp('1.5%'),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EEF6FA',
    padding: wp('3%'),
    borderRadius: wp('2%'),
  },
  rowBtw: {
    padding: wp('3%'),
  },
  label: {
    fontSize: hp('1.4%'),
    fontFamily: Fonts.regular,
    color: COLORS.textHeading,
  },

  code: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.semiBold,
    marginTop: hp('0.5%'),
  },

  expiry: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.semiBold,
  },

  title: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.semiBold,
    // marginTop: hp('2%'),
  },

  desc: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.regular,
    color: COLORS.textHeading,
    marginTop: hp('0.5%'),
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: hp('1.5%'),
  },

  discount: {
    fontSize: hp('1.5%'),
    color: COLORS.themeColor,
    textDecorationLine: 'underline',
    fontFamily: Fonts.medium,
  },

  applyBtn: {
    backgroundColor: COLORS.themeColor,
    paddingHorizontal: wp('5%'),
    restaurant: 50,
    paddingVertical: hp('1%'),
    borderRadius: wp('6%'),
  },

  applyText: {
    color: COLORS.white,
    fontFamily: Fonts.medium,
    fontSize: hp('1.5%'),
  },
});
