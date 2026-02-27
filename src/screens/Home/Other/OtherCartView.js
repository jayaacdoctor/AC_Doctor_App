import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Header from '../../../components/Header';
import HomeScreenStyles from '../HomeScreenStyles';
import images from '../../../assets/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../../utils/colors';
import CustomButton from '../../../components/CustomButton';
import CustomModal from '../../../components/CustomModal';
import BookingSlotModal from '../../../customScreen/BookingSlotModal';
import { isTablet } from '../../../components/TabletResponsiveSize';
import { getServiceList, postBookingRequest } from '../../../api/homeApi';
import { useDispatch, useSelector, } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { clearCart, updateQuantity } from '../../../redux/slices/cartSlice';
import OrderSummaryModel from '../../../customScreen/OrderSummaryModel';
import { store } from '../../../redux/store';
import Toast from 'react-native-simple-toast';
import CustomLoader from '../../../components/CustomLoader';
import { clearServiceData } from '../../../redux/slices/serviceSlice';
import AppText from '../../../components/AppText';

const OtherCartView = ({ route }) => {
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const serviceDetails = useSelector(state => state.cart.items);
  const { items, meta } = useSelector(state => state.cart);
  const { problem, reason } = meta;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalSlotVisible, setModalSlotVisible] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [bookServices, setBookServices] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [proceed, setProceed] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const routeAddress = route.params?.selectedAddress; // add address screen
  const userDetails = store?.getState()?.auth?.user;

  // console.log('selected slot on book-->', selectedSlot)
  useEffect(() => {
    if (route?.params?.proceed) {
      setProceed(true);
      setShowSummary(true);
    }
  }, [route?.params?.proceed]);

  useEffect(() => {
    if (route?.params?.selectedSlot) {
      setSelectedSlot(route.params.selectedSlot);
    }
  }, [route?.params?.selectedSlot]);


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

  // navigate on view cart
  const SERVICE_ROUTE_MAP = {
    SERVICE: 'GasChargeScreen',
    REPAIR: 'GasChargeScreen',
    INSTALLATION: 'GasChargeScreen',
    COMMERCIAL_AC: 'CommericalAc',
    GAS_CHARGING: 'GasChargeScreen',
    OTHER: 'OtherScreen',
    COMPRESSOR: 'GasChargeScreen',
  };
  const handleScreenNavigation = service => {
    const routeName = SERVICE_ROUTE_MAP[service.key];
    if (!routeName) {
      Toast.show('No route defined for this service');
      return;
    }
    navigation.replace(routeName, {
      screenName: service.name,
      serviceId: service._id,
      source: 'OTHER_CART',
    });
  };

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

  // post data
  const { serviceId, serviceKey } = useSelector(state => state.service);

  const useSubmitBooking = async () => {
    if (!userDetails || !serviceDetails?.length) {
      Toast.show('Please select ACs before submitting.');
      return;
    }

    const formattedDate = `${selectedSlot?.year}-${selectedSlot?.monthNumber}-${selectedSlot?.date}`;

    const bodyData = {
      user_id: userDetails?._id,
      addressId: selectedAddress?._id,
      name: userDetails?.name,
      date: formattedDate,
      slot:
        selectedSlot?.Timeslot === 'First Half'
          ? 'FIRST_HALF'
          : 'SECOND_HALF',
      amount: 0,
      serviceDetails: serviceDetails.map(item => ({
        service_id: item.service_id,
        acType: item.acType,
        quantity: item.quantity,
        _id: serviceId,
        name: "Other",
        category: "OTHER",
        key: serviceKey, // ✅ FIXED
        comment: reason,
        otherService: problem,
        serviceType: item.serviceType.toUpperCase(),
      })),
    };

    try {
      const response = await postBookingRequest(bodyData);

      if (response?.status === true) {
        dispatch(clearCart());
        dispatch(clearServiceData());
        setShowSummary(false);
        navigation.replace('BookingSuccessScreen');
      } else {
        Toast.show(
          response?.message || 'Failed to submit booking. Please try again.',
        );
      }
    } catch (error) {
      Toast.show(error?.message || 'An error occurred. Please try again.');
    }
  };


  // render
  return (
    <View style={HomeScreenStyles.workcontainer}>
      <Header title="Cart View" onBack={() => navigation.goBack()} />

      <ScrollView
        style={HomeScreenStyles.workscrollstyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={HomeScreenStyles.worksliderview}>
          <Image source={images.bannerOne} style={HomeScreenStyles.workimage} />
        </View>

        {/* Actype */}
        {groupedServices.map((service, serviceIndex) => {
          const showAddMore = service.acTypes.length > 5;
          const visibleACs = showAddMore
            ? service.acTypes.slice(0, 5)
            : service.acTypes;

          return (
            <View key={serviceIndex}>
              <AppText style={[styles.headText, { marginTop: 10 }]}>
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

            </View>
          );
        })}

        {/* other and edit */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <AppText style={styles.title}>Other</AppText>
            {/* <Text style={[styles.title, { color: COLORS.themeColor }]}>
              Edit
            </Text> */}
          </View>
          <View style={styles.boderLine} />
          <AppText style={styles.headtitle}>
            Problem :<Text style={styles.Normaltitle}> {problem}</Text>
          </AppText>
          <AppText style={styles.headtitle}>
            Comments :<Text style={styles.Normaltitle}> {reason}</Text>
          </AppText>
        </View>

        {/*  Added Together */}
        <View style={{ marginBottom: hp('20%') }}>
          <AppText style={styles.title}>Add Together</AppText>
          <View style={[styles.card, { maxHeight: hp(20) }]}>
            {!Loading ? (<FlatList
              data={bookServices}
              keyExtractor={(_, index) => `work-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1}
                  style={styles.utioption}
                  onPress={() => {
                    handleScreenNavigation(item);
                  }}
                >
                  <Image source={{ uri: item.icon }} style={styles.Iconservices} />
                  <AppText style={styles.titleService}>{item.name}</AppText>
                  <View style={styles.addBtn}>
                    <AppText style={[styles.workText]}>
                      Add
                    </AppText>
                  </View>
                </TouchableOpacity>
              )}
            />) : (<CustomLoader size='large' />)}
          </View>
        </View>

      </ScrollView>
      <View style={styles.bottomBtn}>
        <CustomButton
          buttonName="Add Address & Slot"
          margingBottom={hp('5%')}
          btnTextColor={COLORS.white}
          btnColor={COLORS.themeColor}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onProceed={() => {
          setModalVisible(false);
          setTimeout(() => {
            setModalSlotVisible(true);
          }, 300);
        }}
        fromScreen={'OtherCart'}
        setSelectedAddress={setSelectedAddress}
      />

      <BookingSlotModal
        visible={modalSlotVisible}
        onClose={() => setModalSlotVisible(false)}
        setSelectedSlot={setSelectedSlot}
        onBookProcess={() => {
          setProceed(true);
          setModalSlotVisible(false);
          setShowSummary(true)
          setTimeout(() => {
            setTimeout(() => {
            }, 200);
          }, 300);
        }}
      />
      {proceed === true ? (
        <OrderSummaryModel
          visible={showSummary}
          onClose={() => setShowSummary(false)}
          locationText={locationText}
          phoneText={phoneText}
          slotText={slotText}
          images={images}
          hp={hp}
          styles={styles}
          OnPressBtn={() => {
            useSubmitBooking()
          }}
        />

      ) : null}

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: wp('3%'),
    marginBottom: hp('1%'),
    elevation: 2,
    borderColor: COLORS.lightSky,
    borderWidth: wp(0.2),
    marginTop: hp('1%'),
    padding: wp('2%'),
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  title: {
    fontSize: isTablet ? wp(2.4) : wp('3.5%'),
    color: COLORS.black,
    fontFamily: Fonts.semiBold,
  },
  headtitle: {
    fontSize: isTablet ? wp(2.3) : wp('3.4%'),
    color: COLORS.black,
    fontFamily: Fonts.medium,
    marginVertical: hp('1%'),
  },
  Normaltitle: {
    fontSize: isTablet ? wp(2.3) : wp('3.2%'),
    color: COLORS.textHeading,
    fontFamily: Fonts.regular,
    marginVertical: hp('1%'),
  },
  boderLine: {
    borderColor: COLORS.lightSky,
    borderWidth: wp(0.1),
    marginVertical: hp('0.5%'),
  },
  utioption: {
    marginVertical: wp('0.5%'),
    borderRadius: wp('3%'),
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: 'center',
    marginHorizontal: hp('0.5%'),
    marginRight: hp('1%'),
    paddingHorizontal: wp('3%'),
  },
  titleService: {
    fontSize: isTablet ? wp(2.5) : wp('3.2%'),
    color: COLORS.black,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
  Iconservices: {
    width: isTablet ? wp(9) : wp('12%'),
    height: hp('7%'),
    resizeMode: 'contain',
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
  fixedCart: {
    minHeight: hp('10%'),
    justifyContent: 'center',
  },
  bottomBtn: {
    position: 'absolute',
    bottom: hp('2%'),
    left: wp('5%'),
    right: wp('5%'),
  },
  workText: {
    fontSize: hp('1.5%'),
    color: "#5A5E68",
    fontFamily: Fonts.semiBold,
  },

  workCount: {
    fontSize: hp(1.6),
    color: COLORS.themeColor,
    fontFamily: Fonts.semiBold,
    marginHorizontal: wp('2%'),
  },
  headText: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
    // marginTop: hp(2)
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
  workItem: {
    paddingHorizontal: hp('1%'),
    paddingTop: wp(2.5),
    backgroundColor: COLORS.white,
    borderRadius: wp('2%'),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0,
    shadowRadius: 5,
    alignItems: 'center',
    marginTop: hp(0.9),
    marginBottom: wp(1),
  },
  serviceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: wp(3),
    width: '100%',
    alignItems: 'center',
  },
  decreaIcon: { width: wp(3), height: wp(3), marginRight: 4 },
  inscreIcon: { width: wp(2.5), height: wp(2.5), marginLeft: 4 },
});

export default OtherCartView;
