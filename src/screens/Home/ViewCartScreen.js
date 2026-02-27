import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
} from 'react-native';
import Header from '../../components/Header';
import images from '../../assets/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../utils/colors';
import FastImage from 'react-native-fast-image';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import { useNavigation } from '@react-navigation/native';
import BookingSlotModal from '../../customScreen/BookingSlotModal';
import { isTablet } from '../../components/TabletResponsiveSize';
import { store } from '../../redux/store';
import { getServiceList, postBookingRequest } from '../../api/homeApi';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, updateQuantity } from '../../redux/slices/cartSlice';
import Toast from 'react-native-simple-toast';
import OrderSummaryModel from '../../customScreen/OrderSummaryModel';
import { rf } from '../../components/Resposive';
import AppText from '../../components/AppText';

const ViewCartScreen = ({ route }) => {
  const serviceDetails = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalSlotVisible, setModalSlotVisible] = useState(false);
  const [modalUserVisible, setModalUserVisible] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [numberofAC, setNumberofAC] = useState('');
  const [bookServices, setBookServices] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const routeAddress = route.params?.selectedAddress;
  const userDetails = store?.getState()?.auth?.user;

  useEffect(() => {
    if (route?.params?.proceed) {
      setProceed(true);
      setShowSummary(true)
    }
    if (route?.params?.selectedSlot) {
      setSelectedSlot(route.params.selectedSlot);
    }
    console.log('selected slot on book-->', selectedSlot)
  }, [route?.params]);

  // get service list on mount
  useEffect(() => {
    getBookService();
  }, []);
  const getBookService = async () => {
    try {
      setLoading(true);
      const res = await getServiceList();
      const list = res?.data || [];
      //  remove unwanted items
      const filteredList = list.filter(item =>
        !['Amc', 'Copper Piping', 'Commercial AC', 'Other'].includes(item.name)
      );
      setBookServices(filteredList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // get selected location and other details
  const locationText = routeAddress
    ? [routeAddress?.name, routeAddress?.address]
      .filter(Boolean)
      .join(', ')
    : [
      userDetails?.name,
      selectedAddress?.street,
      selectedAddress?.city,
      selectedAddress?.state,
      selectedAddress?.zipcode,
    ]
      .filter(Boolean)
      .join(', ');
  const phoneText = `${userDetails?.countryCode} ${userDetails?.phoneNumber}`;

  const slotText = `${selectedSlot?.date}-${selectedSlot?.month}-${selectedSlot?.day}, (${selectedSlot?.Timeslot ==
    "First Half" ? '1st Half' : '2nd Half'})`;

  // Define the goToService function for service navigation
  const SERVICE_ROUTE_MAP = {
    SERVICE: 'GasChargeScreen',
    REPAIR: 'GasChargeScreen',
    INSTALLATION: 'GasChargeScreen',
    COMMERCIAL_AC: 'CommericalAc',
    GAS_CHARGING: 'GasChargeScreen',
    OTHER: 'OtherScreen',
    COMPRESSOR: 'GasChargeScreen',
  };

  const BLOCKED_SERVICE_KEYS = [
    'COPPER_PIPING',
    'AMC',
    'COMMERCIAL_AC',
    'OTHER',
  ];

  const handleProceedToCart = service => {
    if (BLOCKED_SERVICE_KEYS.includes(service.key)) {
      Toast.show('This feature is on the way. Stay tuned!');
      return;
    }
    const routeName = SERVICE_ROUTE_MAP[service.key];
    if (!routeName) {
      Toast.show('No route defined for this service');
      return;
    }
    navigation.replace(routeName, {
      screenName: service.name,
      serviceId: service._id,
      source: 'VIEW_CART',
    });
  };

  // Group services by serviceType listing their AC types
  const groupedServices = useMemo(() => {
    if (!Array.isArray(serviceDetails) || !serviceDetails.length) return [];

    return serviceDetails.reduce((acc, item) => {
      if (!item.serviceType || !item.acType) return acc;

      let service = acc.find(s => s.serviceType === item.serviceType);

      const acObj = {
        name: item.acType,
        quantity: item.quantity,
        service_id: item.service_id,
      };

      if (!service) {
        service = {
          serviceType: item.serviceType,
          acTypes: [],
        };
        acc.push(service);
      }

      service.acTypes.push(acObj);

      return acc;
    }, []);
  }, [serviceDetails]);

  const handleIncrement = (serviceType, acType) => {
    dispatch(updateQuantity({ serviceType, acType, delta: 1 }));
  };

  const handleDecrement = (serviceType, acType) => {
    dispatch(updateQuantity({ serviceType, acType, delta: -1 }));
  };


  // post data
  const useSubmitBooking = async () => {
    if (!userDetails || !serviceDetails?.length) {
      Toast.show('Please select ACs before submitting.');
      return;
    }
    const formattedDate = `${selectedSlot?.year}-${selectedSlot?.monthNumber}-${selectedSlot?.date}`;

    const bodyData = {
      user_id: userDetails._id,
      addressId: selectedAddress._id,
      name: userDetails?.name,
      date: formattedDate,
      slot:
        selectedSlot?.Timeslot === 'First Half'
          ? 'FIRST_HALF'
          : selectedSlot?.Timeslot === 'SECOND_HALF'
            ? 'SECOND_HALF'
            : 'SECOND_HALF',
      amount: 0,
      serviceDetails: serviceDetails.map(item => ({
        service_id: item.service_id,
        acType: item.acType,
        quantity: item.quantity,
        serviceType: item.serviceType.toUpperCase(),
      })),
    };
    try {
      const response = await postBookingRequest(bodyData);
      if (response?.status === true) {
        // Toast.show(response?.message || 'Booking submitted successfully!');
        setShowSummary(false)
        navigation.replace('BookingSuccessScreen');
        dispatch(clearCart());
      } else if (response?.status === false) {
        Toast.show(
          response?.message || 'Failed to submit booking. Please try again.',
        );
      }
    } catch (error) {
      Toast.show(error?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Your Cart" onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scrollstyle}
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={[styles.ordercontainer]}>
          <Image source={images.tag} style={styles.carticon} />
          <Text style={styles.viewCartText}>Saving ₹150 on this order</Text>
        </View> */}

        {/* Actype */}
        {groupedServices.map((service, serviceIndex) => {
          const showAddMore = service.acTypes.length > 5;
          const visibleACs = showAddMore
            ? service.acTypes.slice(0, 5)
            : service.acTypes;

          return (
            <View key={serviceIndex}>
              <AppText style={[styles.headText, { marginBottom: hp('1%'), marginTop: 18 }]}>
                {service.serviceType}
              </AppText>

              {visibleACs.length > 0 && (
                <View style={[
                  styles.workItem,
                  visibleACs.length <= 2 && styles.fixedCart,
                ]}>
                  {visibleACs.map((ac, acIndex) => (
                    <View key={acIndex} style={styles.serviceView}>
                      <AppText style={styles.workText}>{ac.name}</AppText>

                      <View style={styles.workButtonContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            handleDecrement(service.serviceType, ac.name)
                          }
                        >
                          <Image
                            source={images.minusicon}
                            style={styles.decreaIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>

                        <AppText style={styles.workCount}>{ac.quantity}</AppText>

                        <TouchableOpacity
                          onPress={() =>
                            handleIncrement(service.serviceType, ac.name)
                          }
                        >
                          <Image
                            source={images.plusicon}
                            style={styles.inscreIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}


              {/* {showAddMore && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AddMoreACScreen', {
                      serviceType: service.serviceType,
                      acTypes: service.acTypes,
                    })
                  }
                >
                  <Text style={styles.addText}>Add More</Text>
                </TouchableOpacity>
              )} */}
            </View>
          );
        })}


        {/* CouponScreen */}
        {/* <TouchableOpacity
          // onPress={() => navigation.navigate('CouponScreen')}
          style={[
            styles.ordercontainer,
            { justifyContent: 'space-between', borderColor: COLORS.themeColor },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={images.Offer} style={styles.carticon} />
            <AppText
              style={[
                styles.viewCartText,
                { color: COLORS.black, fontFamily: Fonts.regular },
              ]}
            >
              Coupons
            </AppText>
          </View>
          <AppText
            style={[
              styles.viewCartText,
              { color: COLORS.themeColor, marginRight: wp('4%') },
            ]}
          >
            {'2 Offers >'}
          </AppText>
        </TouchableOpacity> */}



        {/* Payment Summary */}
        {/* <View
          style={[
            styles.utioption,
            {
              width: wp('93%'),
              alignItems: 'flex-start',
              paddingHorizontal: wp('3%'),
              paddingTop: wp('3%'),
            },
          ]}
        >
          <Text style={styles.headText}>Payment Summary</Text>

          <View style={styles.flewView}>
            <Text style={[styles.workText, { fontSize: hp('1.5%') }]}>
              Item Total
            </Text>
            <Text
              style={[
                styles.workText,
                { fontSize: hp('1.5%'), color: COLORS.black },
              ]}
            >
              ₹ 3680
            </Text>
          </View>
          <View style={styles.flewView}>
            <Text style={[styles.workText, { fontSize: hp('1.5%') }]}>
              Item Discount
            </Text>
            <Text
              style={[
                styles.workText,
                { fontSize: hp('1.5%'), color: COLORS.black },
              ]}
            >
              -₹ 150
            </Text>
          </View>
          <View style={styles.flewView}>
            <Text style={[styles.workText, { fontSize: hp('1.5%') }]}>
              Taxes and Fee
            </Text>
            <Text
              style={[
                styles.workText,
                { fontSize: hp('1.5%'), color: COLORS.black },
              ]}
            >
              ₹ 69
            </Text>
          </View>

          <View
            style={[
              styles.workItem,
              styles.flewView,
              {
                borderBottomWidth: 1,
                borderBottomColor: '#E0E0E0',
                borderTopWidth: 1,
                borderTopColor: '#E0E0E0',
              },
            ]}
          >
            <Text
              style={[
                styles.workText,
                { fontSize: hp('1.5%'), color: COLORS.black },
              ]}
            >
              Total
            </Text>
            <Text
              style={[
                styles.workText,
                { fontSize: hp('1.5%'), color: COLORS.black },
              ]}
            >
              ₹ 3540
            </Text>
          </View>

          <View style={styles.yayView}>
            <Image source={images.tag} style={styles.carticon} />
            <Text
              style={[
                styles.viewCartText,
                { color: COLORS.themeColor, fontFamily: Fonts.regular },
              ]}
            >
              Yay! you have saved ₹ 150 on final bill
            </Text>
          </View>
        </View> */}

        {/* CANCELLATION */}
        {/* <View
          style={styles.cancelView}>
          <AppText style={styles.headText}>Cancellation policy</AppText>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: hp('1%'),
              alignItems: 'center',
              alignSelf: 'flex-start'
            }}
          >
            <Image source={images.timeLight} style={styles.smallImag} />
            <AppText style={styles.cancelTextStyle}>
              Orders cannot be cancelled within 2 hours of the scheduled service
              time.
            </AppText>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <AppText style={[styles.workText, { fontSize: hp('1.5%') }]}> ₹</AppText>
            <AppText style={[styles.cancelTextStyle, { marginLeft: hp(1.5) }]}>
              In case of unexpected delays or issues, a refund will be
              provided.
            </AppText>
          </View>
        </View> */}

        {/* Frequently Added Together */}
        <AppText style={[styles.headText, { marginVertical: hp(1) }]}>Add Together</AppText>
        <FlatList
          data={bookServices}
          keyExtractor={(_, index) => `work-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={[styles.utioption, { width: wp('27%'), zIndex: 9999 }]}
              onPress={() => handleProceedToCart(item)}
            >
              <FastImage source={{ uri: item.icon }} style={styles.utiicon} />
              <AppText
                style={[
                  styles.headText,
                  {
                    fontSize: wp(3.2),
                    textAlign: 'center',
                    // height: hp('4.5%'),
                  },
                ]}
              >
                {item.name}
              </AppText>
              <View style={styles.addBtn}>
                <AppText style={[styles.workText, { fontSize: hp('1.3%') }]}>
                  Add
                </AppText>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      <View
        style={[
          styles.servicesSection,
          { height: hp('10%') },
        ]}
      >
        {proceed && (
          <>
            <OrderSummaryModel
              visible={showSummary}
              onClose={() => setShowSummary(false)}
              locationText={locationText}
              phoneText={phoneText}
              slotText={slotText}
              images={images}
              hp={hp}
              styles={styles}
              OnPressBtn={() => useSubmitBooking()}
            />
          </>
        )}

        <CustomButton
          buttonName={'Add Address & Slot'}
          // margingTOP={hp('0%')}
          btnTextColor={COLORS.white}
          btnColor={COLORS.themeColor}
          onPress={() => {
            setModalUserVisible(true);
          }}
        />

      </View>

      {/* Present address */}
      <CustomModal
        visible={modalUserVisible}
        onClose={() => setModalUserVisible(false)}
        onProceed={() => {
          setModalUserVisible(false);
          setTimeout(() => {
            setModalSlotVisible(true);
          }, 300);
        }}
        numberofAC={numberofAC}
        setvalue={setNumberofAC}
        addAcStatus={true}
        fromScreen={'ViewCart'}
        setSelectedAddress={setSelectedAddress}
      />

      <BookingSlotModal
        visible={modalSlotVisible}
        onClose={() => setModalSlotVisible(false)}
        setSelectedSlot={setSelectedSlot}
        onBookProcess={() => {
          setModalSlotVisible(false);
          setTimeout(() => {
            setProceed(true);
            setTimeout(() => {
              setShowSummary(true)
            }, 200);
          }, 300);
        }}
      />

      {/* <ConfirmationModal
        visible={confirmModalVisible}
        onClose={() => {
          setConfirmModalVisible(false);
          setProceed(true);
          setTimeout(() => {
            setShowSummary(true)
          }, 200);
        }}
        selectedAddress={selectedAddress}
        selectedSlot={selectedSlot}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollstyle: { flex: 1, paddingHorizontal: wp('3%'), marginBottom: hp(10) },
  ordercontainer: {
    flexDirection: 'row',
    width: wp('95%'),
    borderColor: COLORS.themeColor,
    borderRadius: wp('2%'),
    borderWidth: wp('0.2%'),
    backgroundColor: COLORS.white,
    marginVertical: hp('1%'),
    marginTop: hp('2%'),
    alignSelf: 'center',
    alignItems: 'center',

  },
  viewCartText: {
    fontSize: wp('3%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.peacock,
  },
  carticon: {
    width: wp('5%'),
    height: hp('5%'),
    resizeMode: 'contain',
    marginHorizontal: hp('1%'),
  },
  headText: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
    // marginTop: hp(2)
  },

  workItem: {
    paddingHorizontal: hp('1%'),
    paddingTop: wp(2.5),
    backgroundColor: COLORS.white,
    borderRadius: wp('2%'),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    marginTop: hp(0.6)
  },
  fixedCart: {
    minHeight: hp('10%'),
    justifyContent: 'center',
  },
  serviceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: wp(3.6),
    width: '100%',
    alignItems: 'center',
  },
  workText: {
    fontSize: hp('1.6%'),
    color: "#5A5E68",
    fontFamily: Fonts.semiBold,
  },
  cancelTextStyle: {
    fontSize: hp('1.5%'),
    color: COLORS.black,
    fontFamily: Fonts.medium,
  },
  workButtonContainer: {
    borderWidth: 1,
    borderRadius: hp('5%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 2,
    paddingHorizontal: 10,
    // alignSelf: 'center',
    borderColor: '#ddd',
  },
  workButton: {
    borderWidth: 1,
    borderRadius: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    width: isTablet ? wp(6) : wp(7.5),
    height: isTablet ? wp(6) : wp(7.5),
    alignSelf: 'center',
    borderColor: '#ddd',
  },
  decreaIcon: { width: wp(3), height: wp(3), marginRight: 4 },
  inscreIcon: { width: wp(2.5), height: wp(2.5), marginLeft: 4 },
  workButtonText: {
    fontSize: isTablet ? wp(3) : wp(3),
    color: COLORS.black,
    // textAlignVertical: 'top',
    fontFamily: Fonts.medium,
    // marginBottom: Platform.OS === 'ios' ? hp('0.5%') : wp('2%'),
    // position: 'absolute',
  },
  workCount: {
    fontSize: rf(15),
    color: COLORS.themeColor,
    fontFamily: Fonts.semiBold,
    marginHorizontal: wp('2%'),
  },
  addText: {
    marginVertical: hp('1%'),
    fontSize: hp('1.4%'),
    color: COLORS.themeColor,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

  utioption: {
    marginVertical: wp('1%'),
    borderRadius: wp('3%'),
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: 'center',
    marginRight: hp('1%'),
  },
  cancelView: {
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('3%'),
    marginVertical: wp('2%'),
    borderRadius: wp('3%'),
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  utiicon: {
    width: wp('11%'),
    height: wp('11%'),
    resizeMode: 'contain',
    marginTop: wp(4),
    marginBottom: wp(1)
  },
  addBtn: {
    width: wp('23%'),
    alignItems: 'center',
    padding: hp('0.2%'),
    paddingVertical: hp('0.6%'),
    borderWidth: wp('0.4%'),
    borderColor: '#E0E0E0',
    borderRadius: wp('4%'),
    marginVertical: wp('2%'),
  },
  flewView: {
    flexDirection: 'row',
    width: wp('83%'),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: hp('1%'),
  },
  yayView: {
    flexDirection: 'row',
    width: wp('93%'),
    alignItems: 'center',
    alignSelf: 'center',
    borderBottomLeftRadius: wp('3%'),
    borderBottomRightRadius: wp('3%'),
    backgroundColor: COLORS.lightSky,
  },
  servicesSection: {
    alignItems: 'center',
    paddingHorizontal: hp('2.5%'),
    paddingVertical: hp('2%'),
    backgroundColor: COLORS.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  smallImag: {
    width: isTablet ? wp(3) : wp(4),
    height: isTablet ? hp(1.9) : hp(1.9),
    resizeMode: 'contain',
    marginRight: hp('1%'),
    tintColor: COLORS.black
  },
  normalImag: {
    width: isTablet ? wp(4) : wp(5),
    height: isTablet ? wp(4) : wp(5),
    resizeMode: 'contain',
  },
  textBottom: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.medium,
    color: COLORS.textHeading,
    width: wp('70%'),
    marginHorizontal: hp('2%'),
  },
});

export default ViewCartScreen;
