import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  StatusBar,
  useColorScheme,
} from 'react-native';
import Commonstyles, {
  productData,
  testimonialData,
} from '../Home/HomeScreenStyles';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../../assets/images';
import CustomSlider from '../../components/CustomSlider';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../utils/colors';
import { store } from '../../redux/store';
import OnTopScreen from '../../components/OnTopScreen';
import AppText from '../../components/AppText';


const ShopScreen = ({ navigation }) => {
  // const addressText = store?.getState()?.auth?.address;
  // console.log('addressText', addressText);

  const scheme = useColorScheme();
  // Dynamic styles based on scheme
  const dynamicStyles = {
    safeArea: {
      backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#ffffff',
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

  const handleAddressPress = () => {
    navigation.navigate('SelectLocation', { onUpdate: loadAddress });
  };
  //  banner slide
  const bannerImages = [images.shopFrame, images.acPoster, images.shopFrame];
  const bookServices = [
    {
      label: 'Window AC',
      icon: images.ac_window,
      action: () =>
        navigation.navigate('ProductListScreen', { screenName: 'Window Ac' }),
    },
    {
      label: 'Split AC',
      icon: images.ac_split,
      action: () =>
        navigation.navigate('ProductListScreen', { screenName: 'Split Ac' }),
    },
    {
      label: 'Cassette AC',
      icon: images.ac_cassette,
      action: () =>
        navigation.navigate('ProductListScreen', { screenName: 'Cassette Ac' }),
    },
    {
      label: 'Tower AC',
      icon: images.ac_tower,
      action: () =>
        navigation.navigate('ProductListScreen', { screenName: 'Tower Ac' }),
    },
    {
      label: 'Ducted AC',
      icon: images.ac_ducted,
      action: () =>
        navigation.navigate('ProductListScreen', { screenName: 'Ducted Ac' }),
    },
    {
      label: 'VRV/VRF',
      icon: images.ac_vrv,
      action: () =>
        navigation.navigate('ProductListScreen', { screenName: 'VRV/VRF' }),
    },
  ];

  const accessoriesItem = [
    {
      label: 'AC Stabilizer',
      icon: images.ac_stablizier,
      action: () =>
        navigation.navigate('ProductListScreen', {
          screenName: 'AC Stabilizer',
        }),
    },
    {
      label: 'Outdoor Stand',
      icon: images.ac_outdoor,
      action: () =>
        navigation.navigate('ProductListScreen', {
          screenName: 'Outdoor Stand',
        }),
    },
    {
      label: 'Indoor Unit',
      icon: images.AC_indoor,
      action: () =>
        navigation.navigate('ProductListScreen', { screenName: 'Indoor Unit' }),
    },
    {
      label: 'New Remote',
      icon: images.remote,
      action: () =>
        navigation.navigate('ProductListScreen', { screenName: 'New Remote' }),
    },
  ];

  const utilities = [
    {
      label: 'Tonage Calculator',
      icon: images.calculateIcon,
      action: handleCalulator,
    },
    {
      label: 'Product Comparison',
      icon: images.productIcon,
      action: handleProComparison,
    },
    {
      label: 'Free Consultancy',
      icon: images.consultancyIcon,
      action: handleFreeConsult,
    },
  ];
  const handleCalulator = () => navigation.navigate('TonnageCalculatorScreen');
  const handleFreeConsult = () => navigation.navigate('FreeConsultant');
  const handleProComparison = () => Alert.alert('Other clicked!');

  const Authpartner = [
    images.lgIcon,
    images.MITelectricIcon,
    images.daikinIcon,
    images.lgIcon,
    images.MITelectricIcon,
    images.daikinIcon,
    images.lgIcon,
    images.MITelectricIcon,
    images.daikinIcon,
  ];
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };
  const pages = chunkArray(Authpartner, 6);

  // render
  return (
    <SafeAreaView
      style={[
        Commonstyles.safeArea,
        { backgroundColor: dynamicStyles.safeArea.backgroundColor },
      ]}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />

      <OnTopScreen>
        {/* Header with Location Icon and Add Location Text */}
        <View style={Commonstyles.header}>
          <AppText style={Commonstyles.locationtitle}>Location</AppText>
          <View style={Commonstyles.addressRow}>
            <TouchableOpacity
              style={Commonstyles.locationContainer}
              onPress={handleAddressPress}
            >
              <FastImage
                source={images.homeLocation}
                style={Commonstyles.locationIcon}
                resizeMode={FastImage.resizeMode.contain}
              />

              {/* <Text style={Commonstyles.locationText}>
                   {`${addressText.house || 'Select house'}  ${
                     addressText.road || ''
                }, ${addressText.city}` || 'Select Location'}
                 </Text> */}

              <AppText style={Commonstyles.locationText}>
                Vijay nagar, 150 ft ring road,Bhopal
              </AppText>
            </TouchableOpacity>
            <View style={[Commonstyles.reqgrid]}>
              <TouchableOpacity>
                <FastImage
                  source={images.heart}
                  style={[
                    Commonstyles.locationIcon,
                    { marginHorizontal: wp(2) },
                  ]}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>

              <TouchableOpacity>
                <FastImage
                  source={images.shopIcon}
                  style={Commonstyles.locationIcon}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* header end */}

        {/* Rest of the content (unchanged) */}
        <CustomSlider images={bannerImages} />
        <View style={Commonstyles.reqcontainer}>
          <AppText style={Commonstyles.reqtitle}>AC Category</AppText>
          <View style={Commonstyles.reqgrid}>
            {bookServices.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={Commonstyles.bookcard}
                onPress={item.action}
              >
                <FastImage source={item.icon} style={Commonstyles.reqicon} />
                <AppText style={Commonstyles.reqlabel}>{item.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Accessories */}
        <View style={Commonstyles.reqcontainer}>
          <AppText style={Commonstyles.reqtitle}>Accessories</AppText>
          <View style={Commonstyles.reqgrid}>
            {accessoriesItem.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={Commonstyles.reqoption}
                onPress={item.action}
              >
                <FastImage source={item.icon} style={Commonstyles.reqicon} />
                <AppText style={Commonstyles.reqlabel}>{item.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FastImage
          source={images.Shop_Bottom}
          style={Commonstyles.bannerStyle}
        />

        {/* We sell all brands */}
        <View style={Commonstyles.reqcontainer}>
          <AppText style={Commonstyles.reqtitle}>We sell all brands</AppText>
          <FlatList
            data={pages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `page-${index}`}
            renderItem={({ item: page }) => (
              <View style={Commonstyles.authgrid}>
                {[0, 1, 2].map(row => (
                  <View
                    key={row}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginVertical: 3,
                    }}
                  >
                    {page.slice(row * 3, row * 3 + 3).map((icon, idx) => (
                      <View key={idx} style={Commonstyles.authoption}>
                        <FastImage
                          source={icon}
                          style={Commonstyles.authicon}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          />
        </View>

        {/* Utilities */}
        <LinearGradient
          colors={['#ecd5d0ff', '#ede3dbff', '#b9d4e7ff']}
          style={Commonstyles.uticontainer}
        >
          <AppText style={Commonstyles.utititle}>Utilities</AppText>
          <View style={Commonstyles.utigrid}>
            {utilities.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={Commonstyles.utioption}
                onPress={item.action}
              >
                <FastImage source={item.icon} style={Commonstyles.utiicon} />
                <AppText style={Commonstyles.utilabel}>{item.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        {/* Who Trust On Us */}

        <View style={[Commonstyles.uticontainer, { padding: wp('0%') }]}>
          <AppText style={[Commonstyles.utititle, dynamicStyles.title]}>
            Who Trust On Us
          </AppText>
          <FlatList
            data={testimonialData}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: hp('1%') }}
            renderItem={({ item }) => (
              <View style={Commonstyles.testacard}>
                <View style={Commonstyles.testaquoteContainer}>
                  <View style={Commonstyles.testaratingContainer}>
                    <AppText style={Commonstyles.testaquote}>“</AppText>
                  </View>
                  <AppText style={Commonstyles.testarating}>⭐ {item.rating}</AppText>
                </View>
                <AppText style={Commonstyles.testimonialText} numberOfLines={4}>
                  {item.text}
                </AppText>
                <AppText style={Commonstyles.testalocation}>{item.location}</AppText>
                <AppText style={Commonstyles.testauthor}>{item.author}</AppText>
              </View>
            )}
          />
        </View>

        {/* Service Guarantee */}
        <View
          style={[
            Commonstyles.sercard,
            {
              backgroundColor: COLORS.white,
              paddingTop: hp(1.5),
              borderRadius: hp(1),
              marginBottom: hp(15),
            },
          ]}
        >
          <AppText style={Commonstyles.utititle}>Service Guarantee</AppText>
          <View
            style={[
              Commonstyles.sergrid,
              { marginBottom: hp(Platform.OS === 'android' ? '2%' : '2%') },
            ]}
          >
            <TouchableOpacity
              style={Commonstyles.serstatCard}
              activeOpacity={0.8}
            >
              <Image source={images.remoteIcon} style={Commonstyles.sericon} />
              <View>
                <AppText style={Commonstyles.serstatTitle}>Rework Assurance</AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={Commonstyles.serstatCard}
              activeOpacity={0.8}
            >
              <Image
                source={images.satisfactIcon}
                style={Commonstyles.sericon}
              />
              <View>
                <AppText style={Commonstyles.serstatTitle}>100% Satisfaction</AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={Commonstyles.serstatCard}
              activeOpacity={0.8}
            >
              <Image
                source={images.certifiedIcon}
                style={Commonstyles.sericon}
              />
              <View>
                <AppText style={Commonstyles.serstatTitle}>
                  Certified Engineers
                </AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={Commonstyles.serstatCard}
              activeOpacity={0.8}
            >
              <Image
                source={images.copyRightIcon}
                style={Commonstyles.sericon}
              />
              <View>
                <AppText style={Commonstyles.serstatTitle}>Copyright 2023</AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* </ScrollView>
         */}
      </OnTopScreen>
    </SafeAreaView>
  );
};

export default ShopScreen;
