import React, { useState, useEffect, useCallback, useRef, useEffectEvent, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Platform,
  useColorScheme,
  Animated, Easing,
  StatusBar,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import images from '../../assets/images';
import { COLORS, Fonts } from '../../utils/colors';
import CustomSlider from '../../components/CustomSlider';
import LinearGradient from 'react-native-linear-gradient';
import styles, { productData, testimonialData } from './HomeScreenStyles';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'; // Use SafeAreaView instead of SafeAreaProvider
import { getAuthpatner, getServiceList, getBanner, getFeaturedProducts } from '../../api/homeApi';
import { useNavigation, useRoute } from '@react-navigation/native';
import GetLoaction from '../../components/GetLoaction';
import { useDispatch, useSelector } from 'react-redux';
import { setAddress, setCelcius } from '../../redux/slices/authSlice';
import OnTopScreen from '../../components/OnTopScreen';
import CustomLoader from '../../components/CustomLoader';
import { isTablet } from '../../components/TabletResponsiveSize';
import { setServiceData } from '../../redux/slices/serviceSlice';
import AppText from '../../components/AppText';
import Toast from 'react-native-simple-toast';


const HomeScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const serviceDetails = useSelector(state => state.cart.items);
  const [productData, setProductData] = useState([]);   // ✅
  const [allProducts, setAllProducts] = useState([]);
  const {
    latitude,
    longitude,
    addressText,
    getLocation,
  } = GetLoaction();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  // Dynamic styles based on scheme
  const dynamicStyles = {
    safeArea: {
      backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#F4F8FE',
    },
    backText: {
      color: scheme === 'dark' ? '#ffffff' : '#000000',
    },
    title: {
      color: scheme === 'dark' ? '#ffffff' : '#000000',
    },
    helpIcon: {
      tintColor: scheme === 'dark' ? '#ffffff' : '#000000',
    },
    extraIcon: {
      tintColor: scheme === 'dark' ? '#ffffff' : '#000000',
    },
  };

  const { locationData } = route.params || {};
  // const handleSellOldAC = () => {
  //   Toast.show(
  //     'This feature is currently under development. It will be available soon.',
  //     Toast.SHORT
  //   );
  // };
  const handleSellOldAC = () => navigation.navigate('SellOldAcScreen');
  const handleAMC = () => navigation.navigate('AMCFrom');
  // const handleCopperPipe = () => navigation.navigate('CopperPipeScreen');
  const handleCopperPipe = () => {
    Toast.show(
      'This feature is currently under development. It will be available soon.',
      Toast.SHORT
    );
  };
  const handleCalulator = () => navigation.navigate('TonnageCalculatorScreen');
  const handleErrorcode = () => navigation.navigate('ErrorCodeScreen');
  const handleFreeConsult = () => navigation.navigate('FreeConsultant');
  // const handleProComparison = () =>
  //   navigation.reset({
  //     index: 0,
  //     routes: [{ name: 'Tab', params: { screen: 'Shop' } }],
  //   });
  const handleProComparison = () => {
    Toast.show(
      'This feature is currently under development. It will be available soon.',
      Toast.SHORT
    );
  };

  // Data arrays (unchanged)
  const requestQuote = [
    {
      label: 'Sell Old AC',
      icon: images.sellAcIcon,
      action: handleSellOldAC
    },
    {
      label: 'AMC',
      icon: images.AMCicon,
      action: handleAMC,
    },
    {
      label: 'Free Consultancy',
      icon: images.consultancyIcon,
      action: handleFreeConsult,
    },
    {
      label: 'Copper Pipe',
      icon: images.copperIcon,
      action: handleCopperPipe
    },
  ];

  const utilities = [
    {
      label: 'Tonnage Calculator',
      icon: images.calculateIcon,
      action: handleCalulator,
    },
    {
      label: 'Error Codes',
      icon: images.errorCodeIcon,
      action: handleErrorcode,
    },
    {
      label: 'Product Comparison',
      icon: images.productIcon,
      action: handleProComparison,
    },
  ];
  const [Authpartner, setAuthpartner] = useState([]);
  const [bookServices, setBookServices] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const chunkArray = (array = [], size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };
  const activeData = Authpartner.filter(item => item.isActive === 1);
  const pages = chunkArray(activeData, 2);
  const [Loader, setLoader] = useState(true);
  const [addresslocation, setAddressTextLocation] = useState('');
  const [WeatherLoader, setWeatherLoader] = useState(true);
  const [WeatherData, setWeatherData] = useState();


  const normalizeAddress = (data) => {
    if (!data) return null;

    // 🔹 Case 1: Coming from AddAddress screen (has "address")
    if (data.address) {
      return {
        fullAddress: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }

    // 🔹 Case 2: fullAddress is string
    if (typeof data.fullAddress === 'string') {
      return {
        fullAddress: data.fullAddress,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }

    // 🔹 Case 3: fullAddress is object
    if (typeof data.fullAddress === 'object') {
      return {
        fullAddress: data.fullAddress.fullAddress,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }

    return null;
  };

  useEffect(() => {
    // ✅ CASE 1: Address from route params (HIGH PRIORITY)
    if (route?.params?.selectedAddress) {

      const formatted = normalizeAddress(route.params.selectedAddress);

      if (formatted) {
        setLoader(false);
        setAddressTextLocation(formatted);
        dispatch(setAddress({ address: formatted }));

        if (formatted.latitude && formatted.longitude) {
          getWeather(formatted.latitude, formatted.longitude);
        }
      }

      return;
    }

    // ✅ CASE 2: Address from Redux / previous screen
    if (locationData) {

      const formatted = normalizeAddress(locationData);

      if (formatted) {
        setLoader(false);
        setAddressTextLocation(formatted);

        if (formatted.latitude && formatted.longitude) {
          getWeather(formatted.latitude, formatted.longitude);
        }
      }

      return;
    }

    // ✅ CASE 3: Fetch current location
    setLoader(true);

    getLocation((data) => {

      const formatted = {
        fullAddress: data?.address || '',
        latitude: data?.latitude,
        longitude: data?.longitude,
      };

      setAddressTextLocation(formatted);
      dispatch(setAddress({ address: formatted }));

      if (formatted.latitude && formatted.longitude) {
        getWeather(formatted.latitude, formatted.longitude);
      }

      setLoader(false);
    });

  }, [route?.params]);

  const getWeather = async (lat, lon) => {
    setWeatherLoader(true);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${String(
          lat,
        )}&longitude=${String(lon)}&current_weather=true`,
      );
      const data = await response.json();
      // return data;
      setWeatherLoader(false);
      setWeatherData(data);
      dispatch(setCelcius({ celcius: data }));
      console.log(data.current_weather_units.temperature, 'weather');
    } catch (error) {
      setWeatherLoader(false);

      console.log(error);
    }
  };

  // all fetch api calling
  useEffect(() => {
    getauthservice();
    getBookService();
    getBannerImg();
    fetchFeaturedProducts();
  }, [])



  const getauthservice = async () => {
    try {
      setLoading(true);
      const res = await getAuthpatner();
      setAuthpartner(res?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const scrollX = useRef(0);
  const logos = [...(Authpartner || []), ...(Authpartner || [])];

  useEffect(() => {
    if (!logos.length) return;

    const itemWidth = 100; // match your image width
    const originalWidth = itemWidth * (logos.length / 2);

    const interval = setInterval(() => {
      scrollX.current += 1; // speed control here 👈 increase for faster

      if (scrollX.current >= originalWidth) {
        scrollX.current = 0;
        flatListRef.current?.scrollToOffset({
          offset: 0,
          animated: false,
        });
      } else {
        flatListRef.current?.scrollToOffset({
          offset: scrollX.current,
          animated: false,
        });
      }
    }, 60); // 20 = smooth & safe (not heavy like 16)

    return () => clearInterval(interval);
  }, [logos]);

  const getBookService = async () => {
    try {
      setLoading(true);
      const res = await getServiceList();
      setBookServices(res?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const
    fetchFeaturedProducts = async () => {
      try {
        const res = await getFeaturedProducts(1, 20);

        const mapped = res.data.map(item => ({
          id: item._id,              // 👈 REAL BACKEND ID
          name: item.name,
          image: { uri: item.image },
          mrp: `₹ ${item.mrp}`,
          price: `₹ ${item.customerPrice}`,
          discount: item.discountedPercentage
            ? `${item.discountedPercentage}% off`
            : 'Hot Deal',
          rating: item.rating || '4.0',
          reviews: item.offerLabel || 'Limited time deal',
        }));
        setAllProducts(mapped);
        setProductData(mapped.slice(0, 10));
      } catch (e) {
        console.log('fetchFeaturedProducts error', e);
      }
    };

  // show view all text after 10 item list of product
  const listData =
    allProducts.length > 10
      ? [...productData, { id: 'VIEW_ALL' }]
      : productData;

  //  booking navigation
  const screens = {
    STERILIZATION: 'GasChargeScreen',
    REPAIR: 'GasChargeScreen',
    INSTALLATION: 'GasChargeScreen',
    COMPRESSOR: 'GasChargeScreen',
    GAS_CHARGING: 'GasChargeScreen',
    OTHER: 'OtherScreen',
  };
  const handleServiceNavigation = service => {
    if (service.name === 'Other') {
      dispatch(setServiceData({
        serviceId: service._id,
        serviceKey: service.key,
      }));
      navigation.navigate('OtherScreen');
    }
    else {
      navigation.navigate('GasChargeScreen', {
        screenName: service.name,
        serviceId: service?._id,
        source: 'HOME',
      });
    }
  };

  // getBanner list
  const getBannerImg = async () => {
    try {
      // setLoading(true);
      const res = await getBanner();
      setBannerImages(res?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(true);
    }
  };
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!pages?.[0]?.length) return;

    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;

      if (nextIndex >= pages[0].length) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 2500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const truncateWords = (text = '', limit = 20) => {
    if (typeof text !== 'string') return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '...';
  };


  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: dynamicStyles.safeArea.backgroundColor },
      ]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        translucent={true}
      />
      {serviceDetails.length === 0 ? (
        <></>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("ViewCart")} style={styles.cartViewIcon}>

          <AppText style={styles.TotalcoutnCart}>{serviceDetails.length}</AppText>
          <Image source={images.cart} style={{ width: wp(7), height: wp(7) }} resizeMode='contain' />
        </TouchableOpacity>
      )

      }

      <OnTopScreen>
        {/* Header with Location Icon and Add Location Text */}
        <View style={styles.header}>
          <AppText style={styles.locationtitle}>Location</AppText>
          <View style={styles.addressRow}>
            {Loader ? (
              <>
                <CustomLoader size="small" />
              </>
            ) : (
              <View style={styles.locationContainer}>
                <Image
                  source={images.homeLocation}
                  style={styles.locationIcon}
                  resizeMode="contain"
                />
                <AppText
                  style={[styles.locationText, { width: wp(55), marginLeft: wp(1.5) }]}
                  numberOfLines={1}
                >
                  {truncateWords(addresslocation?.fullAddress?.fullAddress, 6)}
                </AppText>
              </View>
            )}
            <View style={styles.wheatherContainer}>
              <Image
                source={images.wheatherIcon}
                style={styles.locationIcon}
                resizeMode="contain"
              />
              {WeatherLoader ? (
                <>
                  <CustomLoader size="small" />
                  <AppText
                    style={styles.locationText}
                  >Loading...</AppText>
                </>
              ) : (
                <AppText
                  style={styles.locationText}
                >{WeatherData ? `${WeatherData?.current_weather?.temperature} ${WeatherData?.current_weather_units?.temperature}` :
                  'Loading...'}</AppText>
              )}
            </View>
          </View>
        </View>


        {/* Banner Image */}
        <View style={{ minHeight: isTablet ? hp(30) : hp(18) }}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <CustomLoader size="large" />
            </View>
          ) : (
            <CustomSlider images={bannerImages} />
          )}
        </View>



        {/* Book a service */}
        <View style={[styles.reqcontainer, { minHeight: isTablet ? hp(33) : hp(28) }]}>
          <AppText style={styles.reqtitle}>Book AC Services</AppText>

          <View style={{ flex: 1 }}>
            {loading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <CustomLoader size="large" />
              </View>
            ) : (
              <View style={styles.reqgrid}>
                {bookServices
                  .filter(item => !['COPPER_PIPING', 'AMC', 'COMMERCIAL_AC'].includes(item.key))
                  .map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.bookcard}
                      onPress={() => handleServiceNavigation(item)}
                    >
                      <FastImage
                        source={{ uri: item.icon }}
                        style={styles.reqicon}
                      />
                      <AppText style={styles.reqlabel} numberOfLines={1}>{item.name}</AppText>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </View>
        </View>



        {/* Request a Quote */}
        <View style={[styles.reqcontainer, { minHeight: isTablet ? hp(21) : hp(17) }]}>
          <AppText style={styles.reqtitle}>Request a Quote</AppText>
          <View style={styles.reqgrid}>
            {requestQuote.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reqoption}
                onPress={item.action}
              >
                <FastImage source={item.icon} style={styles.reqicon} />
                <AppText style={styles.reqlabel} numberOfLines={1}>{item.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <LinearGradient
          colors={['#ecd5d0ff', '#ede3dbff', '#b9d4e7ff']}
          style={styles.uticontainer}
        >
          <AppText style={[styles.utititle, { marginTop: hp(1) }]}>Utilities</AppText>
          <View style={styles.utigrid}>
            {utilities.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.utilityView]}
                onPress={item.action}
              >
                <FastImage source={item.icon} style={styles.utiicon} />
                <AppText style={styles.utilabel}>{item.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        {/* OEM Partner */}
        <View style={[styles.reqcontainer, { minHeight: isTablet ? hp(30) : hp(13) }]}>
          <AppText style={styles.reqtitle}>OEM Partner</AppText>

          {loading ? (
            <View style={{ marginTop: '5%' }}>
              <CustomLoader />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={logos}
              horizontal
              scrollEnabled={false} // 👈 IMPORTANT
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => `logo-${index}`}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item?.logo }}
                  style={{
                    width: 120,
                    height: 60,
                    marginRight: 10,
                  }}
                  resizeMode="contain"
                />
              )}

            />

          )}
        </View>


        {/* Feature Product */}
        <View style={[styles.uticontainer, { padding: wp('0%') }]}>
          <View style={styles.topRow}>
            <AppText
              style={[
                styles.reqtitle,
                { marginLeft: hp('1.5%') },
                dynamicStyles.title,
              ]}
            >
              Feature Product
            </AppText>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FeaturedProductsScreen')}
            >
              <AppText
                style={[
                  styles.accountBlueText,
                  { marginRight: hp('1.5%'), fontSize: hp('1.6%'), },
                ]}
              >
                View All
              </AppText>
            </TouchableOpacity>
          </View>

          {listData && listData.length > 0 ? (<FlatList
            data={listData}
            horizontal
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              if (item.id === 'VIEW_ALL') {
                return (
                  <TouchableOpacity
                    style={{ alignSelf: 'center' }}
                    onPress={() =>
                      navigation.navigate('FeaturedProductsScreen')
                    }
                  >
                    <AppText style={[styles.accountBlueText, { textDecorationLine: 'underline', textDecorationStyle: 'solid', textDecorationColor: COLORS.themeColor }]}>View All</AppText>
                  </TouchableOpacity>
                );
              }
              return (<View style={styles.productCard}>
                <View style={[styles.boderinercard, { height: hp('15%') }]}>
                  <View style={styles.topRow}>
                    <View style={styles.discountBadge}>
                      <AppText style={styles.discountText}>{item.discount}</AppText>
                    </View>
                  </View>

                  <Image source={item?.image} style={[styles.image, { height: '80%' }]} resizeMode='contain' />
                </View>

                <View style={styles.dealRow}>
                  <View style={styles.dealTag}>
                    <AppText style={styles.dealText}>{item?.reviews}</AppText>
                  </View>
                  {/* <StarRating
                    maxStars={5}
                    starSize={18}
                    rating={item.rating}
                  /> */}
                </View>

                <AppText style={styles.name} numberOfLines={1}>
                  {item.name}
                </AppText>



                <View style={styles.bottomRow}>
                  <AppText style={styles.price}>{item.price} {'  '}</AppText>

                  <AppText style={[styles.mrp, { textDecorationLine: 'line-through' }]}>
                    {item.mrp}
                  </AppText>

                </View>
                <TouchableOpacity
                  style={styles.productView}
                  onPress={() =>
                    navigation.navigate('ProductDetails', {
                      productId: item.id,
                    })
                  }
                >
                  <AppText
                    style={styles.interestText}
                  >
                    View Details
                  </AppText>
                </TouchableOpacity>

              </View>)
            }}
          />) : (
            // 👇 Empty cart / no data UI
            <View
              style={styles.emptyCard}
            >
              <AppText
                style={{
                  fontSize: 14,
                  color: '#888',
                  fontFamily: Fonts.medium,
                }}
              >
                No featured ACs right now 😕 {'\n'}
                Cool deals coming soon! ❄️
              </AppText>
            </View>)}

        </View>
        {/* who trust Us */}
        <View style={styles.uticontainer}>
          <Text style={[styles.utititle, dynamicStyles.title]}>
            Who Trust Us
          </Text>
          <FlatList
            data={testimonialData}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: hp('1%') }}
            renderItem={({ item }) => (
              <View style={styles.testacard}>
                <View style={styles.testaquoteContainer}>
                  <View style={styles.testaratingContainer}>
                    <Text style={styles.testaquote}>“</Text>
                  </View>
                  <Text style={styles.testarating}>⭐ {item.rating}</Text>
                </View>
                <Text style={styles.testimonialText} numberOfLines={4}>
                  {item.text}
                </Text>
                <Text style={styles.testalocation}>{item.location}</Text>
                <Text style={styles.testauthor}>{item.author}</Text>
              </View>
            )}
          />
        </View>
        {/* Impact on Society */}
        <View style={styles.impcard}>
          <View style={[styles.impgrid, { alignItems: 'center' }]}>
            <View style={styles.borderSmall} />
            <Text style={styles.imptitle}>Impact on Society</Text>
            <View style={styles.borderSmall} />
          </View>
          <View style={styles.impgrid}>
            <TouchableOpacity style={styles.impstatCard} activeOpacity={0.8}>
              <Image source={images.clientIcon} style={styles.impicon} />
              <View>
                <Text style={styles.impstatTitle}>Precious Clients</Text>
                <Text style={styles.impstatValue}>12,345+</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.impstatCard} activeOpacity={0.8}>
              <Image source={images.acService} style={styles.impicon} />
              <View>
                <Text style={styles.impstatTitle}>Ac Serviced</Text>
                <Text style={styles.impstatValue}>8,900+</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.impstatCard} activeOpacity={0.8}>
              <Image source={images.greenGasIcon} style={styles.impicon} />
              <View>
                <Text style={styles.impstatTitle}>Saved Green Gas</Text>
                <Text style={styles.impstatValue}>52 MT</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.impstatCard} activeOpacity={0.8}>
              <Image source={images.co2Icon} style={styles.impicon} />
              <View>
                <Text style={styles.impstatTitle}>Saved CO2</Text>
                <Text style={styles.impstatValue}>0.7m MT</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Image source={images.homebanner} style={styles.bannerStyle} resizeMode='contain' />
        <View style={styles.sercard}>
          <AppText style={[styles.utititle, dynamicStyles.title]}>
            Service Guarantee
          </AppText>
          <View
            style={[
              styles.sergrid,
              { marginBottom: hp(Platform.OS === 'android' ? '2%' : '2%') },
            ]}
          >
            <TouchableOpacity style={styles.serstatCard} activeOpacity={0.8}>
              <Image
                source={images.remoteIcon}
                style={[styles.sericon, dynamicStyles.extraIcon]}
              />
              <View>
                <AppText style={[styles.serstatTitle, dynamicStyles.title]}>
                  Rework Assurance
                </AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serstatCard} activeOpacity={0.8}>
              <Image
                source={images.satisfactIcon}
                style={[styles.sericon, dynamicStyles.extraIcon]}
              />
              <View>
                <AppText style={[styles.serstatTitle, dynamicStyles.title]}>
                  100% Satisfaction
                </AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serstatCard} activeOpacity={0.8}>
              <Image
                source={images.certifiedIcon}
                style={[styles.sericon, dynamicStyles.extraIcon]}
              />
              <View>
                <AppText style={[styles.serstatTitle, dynamicStyles.title]}>
                  Certified Engineers
                </AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serstatCard} activeOpacity={0.8}>
              <Image
                source={images.copyRightIcon}
                style={[styles.sericon, dynamicStyles.extraIcon]}
              />
              <View>
                <AppText style={[styles.serstatTitle, dynamicStyles.title]}>
                  Copyright 2023
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </OnTopScreen>
      {/* </ScrollView> */}


    </SafeAreaView>
  );
};

export default HomeScreen;


