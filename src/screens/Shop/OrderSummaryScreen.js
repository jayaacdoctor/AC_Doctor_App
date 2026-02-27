import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import Header from '../../components/Header';
import Commonstyles from '../Home/HomeScreenStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../../assets/images';
import { COLORS, Fonts } from '../../utils/colors';
import FastImage from 'react-native-fast-image';
import AppText from '../../components/AppText';

const OrderSummaryScreen = ({ navigation }) => {
  const [listLike, setListLike] = useState({});
  const [count, setCount] = useState(1);

  const decrease = () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
    }
  };

  const increase = () => {
    const newCount = count + 1;
    setCount(newCount);
  };

  // list like or dislike
  const toggleLike = itemId => {
    setListLike(prev => ({
      ...prev,
      [itemId]: !prev[itemId], // Toggle
    }));
  };

  const isLiked = itemId => !!listLike[itemId];

  const products = [
    {
      id: '1',
      title:
        'Godrej 1.5 Ton 3 Star Inverter Split AC (Copper, 5-in-1 Convertible, 2023 Model)',
      price: 41990,
      mrp: 65900,
      discount: '36% off',
      image: images.ACimage,
      limitedDeal: true,
    },
    {
      id: '2',
      title:
        'Godrej 1.5 Ton 3 Star Inverter Split AC (Copper, 5-in-1 Convertible, 2023 Model)',
      price: 41990,
      mrp: 65900,
      discount: '36% off',
      image: images.ACimage,
      limitedDeal: true,
    },
  ];


  const ProductCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <FastImage
          source={item.image}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
        />

        <AppText style={styles.title} numberOfLines={1}>
          {item.title}
        </AppText>

        {item.limitedDeal && (
          <View style={styles.dealBadge}>
            <AppText style={styles.dealText}>Limited time deal</AppText>
          </View>
        )}

        <AppText style={styles.price}>
          ₹{item.price.toLocaleString('en-IN')}.00
        </AppText>

        <View style={styles.mrpRow}>
          <AppText style={styles.mrp}>M.R.P </AppText>
          <AppText style={styles.mrpPrice}>
            ₹{item.mrp.toLocaleString('en-IN')}
          </AppText>
        </View>

        <View style={styles.discountRow}>
          <AppText style={styles.discount}>{item.discount}</AppText>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => toggleLike(item.id)}
          >
            <FastImage
              source={isLiked(item.id) ? images.redHeart : images.heart}
              style={[Commonstyles.locationIcon]}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <AppText style={styles.addText}>Add to cart</AppText>
        </TouchableOpacity>
      </View>
    );
  };
  // render
  return (
    <View style={Commonstyles.container}>
      <Header title={'Order Summary'} onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Commonstyles.container}
        contentContainerStyle={{ paddingHorizontal: wp('2.5%') }}
      >
        <View style={[Commonstyles.allSideRadiusStyle]}>
          <View style={Commonstyles.faquestionContainer}>
            <View>
              <Image source={images.acFrame} style={styles.cardimage} />
            </View>
            <View style={{ width: wp(55) }}>
              <AppText
                style={[
                  Commonstyles.locationtitle,
                  { color: COLORS.black, lineHeight: 23 },
                ]}
              >
                WindFree Inverter Split AC AR18CY5APWK, 5.00kw (1.5T) 5 Star
              </AppText>
            </View>
          </View>
          <View style={Commonstyles.faquestionContainer}>
            <AppText style={Commonstyles.mediumText}>
              ₹32,290.00{'  '}
              <AppText
                style={[
                  Commonstyles.locationText,
                  { textDecorationLine: 'line-through', color: '#666' },
                ]}
              >
                ₹63,900.00
              </AppText>
            </AppText>
            <View style={styles.addContainer}>
              <TouchableOpacity onPress={decrease}>
                <AppText style={[Commonstyles.locationText]}> - </AppText>
              </TouchableOpacity>
              <AppText style={[Commonstyles.locationText]}>{count}</AppText>
              <TouchableOpacity onPress={increase}>
                <AppText style={[Commonstyles.locationText]}> + </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Frequently added together */}
        <AppText style={[Commonstyles.mediumText, { marginVertical: hp(1.5) }]}>
          Frequently added together
        </AppText>
        <View style={styles.container}>
          <FlatList
            data={products}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ProductCard item={item} />}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <View style={[Commonstyles.addressRow, { marginVertical: wp(3), backgroundColor: COLORS.white, padding: wp(1.5) }]}>
          <View style={[Commonstyles.addressRow,]}>
            <FastImage
              source={images.couponIcon}
              style={[Commonstyles.locationIcon]}
              resizeMode={FastImage.resizeMode.contain}
            />
            <AppText style={[Commonstyles.mediumText]}>Apply Coupon</AppText>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileDetail')}>
            <FastImage
              source={images.rightArrow}
              style={[Commonstyles.locationIcon]}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        </View>

        {/* Payment Summary */}
        <View style={[Commonstyles.allSideRadiusStyle, { borderRadius: 0 }]}>
          <AppText style={Commonstyles.mediumText}>Payment Summary</AppText>
          <View style={[Commonstyles.addressRow, { marginVertical: wp(1.5) }]}>
            <AppText style={styles.title}>Item total</AppText>
            <AppText style={styles.title}>36,000</AppText>
          </View>
          <View style={[Commonstyles.addressRow]}>
            <AppText style={styles.title}>Item discount</AppText>
            <AppText style={styles.title}>300</AppText>
          </View>
          <View style={[Commonstyles.addressRow, { marginVertical: wp(1) }]}>
            <AppText style={styles.title}>Taxes and fee</AppText>
            <AppText style={styles.title}>100</AppText>
          </View>
          <View style={Commonstyles.bottomLine} />
          <View style={[Commonstyles.addressRow]}>
            <AppText
              style={[Commonstyles.mediumText, { color: COLORS.themeColor }]}
            >
              Total
            </AppText>
            <AppText
              style={[Commonstyles.mediumText, { color: COLORS.themeColor }]}
            >
              ₹35,000
            </AppText>
          </View>
        </View>

        {/* contact detail */}
        <View style={[Commonstyles.addressRow, { marginTop: wp(3) }]}>
          <AppText style={[Commonstyles.mediumText]}>Contact Details</AppText>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileDetail')}>
            <FastImage
              source={images.edit}
              style={[Commonstyles.locationIcon]}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        </View>

        <View style={[Commonstyles.allSideRadiusStyle, { borderRadius: 0 }]}>
          <AppText style={styles.title}>Rahul Jain</AppText>
          <AppText style={styles.title}>09999999999</AppText>
          <AppText style={styles.title}>
            Address- um dolor sit amet consectetur. Egestas vulputate hac
            pulvinar scelerisque aliquam. Ipsum urna pellentesque eget urna
            tellus.
          </AppText>
        </View>

        <View
          style={{
            marginVertical: hp(10),
            alignItems: 'center',
            marginBottom: hp(15),
          }}
        >
          <AppText style={styles.title}>
            By proceeding you accept our{' '}
            <AppText
              style={[
                styles.title,
                {
                  color: COLORS.themeColor,
                  textDecorationLine: 'underline',
                  textAlign: 'center',
                },
              ]}
            >
              Terms & Conditions
            </AppText>
          </AppText>
        </View>
      </ScrollView>

      {/* bttn */}
      <View style={Commonstyles.servicesSection}>
        <TouchableOpacity
          style={[Commonstyles.viewCartButton, styles.payBtn]}
          onPress={() => navigation.navigate('PaymentScreen')}
        >
          <Image
            source={images.swipRight}
            style={[Commonstyles.chaticon, { width: wp(14) }]}
          />
          <AppText
            style={[
              Commonstyles.mediumText,
              {
                fontSize: hp('2%'),
                color: COLORS.white,
                flex: 0.5,
                borderRightColor: 'white',
                borderRightWidth: 1,
              },
            ]}
          >
            Pay
          </AppText>
          <AppText
            style={[
              Commonstyles.mediumText,
              {
                fontSize: hp('2%'),
                color: COLORS.white,
                textAlign: 'right',
                flex: 0.4,
              },
            ]}
          >
            35,000
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderSummaryScreen;

const styles = StyleSheet.create({
  cardimage: {
    width: wp(30),
    height: hp('10%'),
    borderRadius: 15,
    resizeMode: 'contain',
  },
  payBtn: {
    width: wp('90%'),
    alignSelf: 'center',
    paddingVertical: wp(1.5),
  },
  addContainer: {
    width: wp(20),
    borderRadius: wp(1),
    backgroundColor: COLORS.lightSky,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: wp(1.5),
    borderWidth: hp('0.1%'),
    borderColor: COLORS.themeColor,
  },
  container: {
    //   marginVertical: 16,
  },
  listContent: {
    // marginBottom: hp(15),
  },
  card: {
    width: wp('45%'),
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: hp(1.6),
    fontFamily: Fonts.medium,
    color: '#333',
    marginBottom: 6,
    lineHeight: 18,
  },
  dealBadge: {
    backgroundColor: '#ffebee',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
  },
  dealText: {
    fontSize: 11,
    color: COLORS.black,
    fontFamily: Fonts.medium,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 2,
  },
  mrpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mrp: {
    fontSize: 12,
    color: '#666',
  },
  mrpPrice: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  discount: {
    fontSize: 14,
    color: COLORS.green,
    fontFamily: Fonts.semiBold,
  },
  heartButton: {
    padding: 4,
  },
  heart: {
    fontSize: 20,
  },
  addButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.themeColor,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addText: {
    color: COLORS.themeColor,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});
