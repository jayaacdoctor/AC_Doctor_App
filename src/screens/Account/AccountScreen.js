import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar as RNStatusBar,
  StyleSheet,
  Alert,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Homestyles, { menuData } from '../Home/HomeScreenStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../assets/images';
import { COLORS } from '../../utils/colors';
import { useDispatch } from 'react-redux';
import { store } from '../../redux/store';
import { getUserProfile, logoutUser } from '../../api/profileApi';
import Toast from 'react-native-simple-toast';
import { logout } from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomLoader from '../../components/CustomLoader';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppText from '../../components/AppText';

const AccountScreenComponent = () => {
  const scheme = useColorScheme();
  const navigation = useNavigation()
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
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);
  const dispatch = useDispatch();
  const userId = store?.getState()?.auth?.user;
  const addressText = store?.getState()?.auth?.address;
  const weatherData = store?.getState()?.auth?.celcius;
  const [booking, setBooking] = useState([]);
  console.log('user id ---', userId?._id);


  useFocusEffect(
    useCallback(() => {
      if (userId?._id) {
        fetchProfile();
      }
    }, [userId?._id])
  );


  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile(userId?._id);

      if (res?.status || res?.success) {
        const data = res.data;
        setStoreData({
          ...data,
          profilePhoto: data?.profilePhoto
            ? `${data.profilePhoto}?v=${Date.now()}`
            : null,
        });
      }
      const data = await AsyncStorage.getItem('TotalBooking');

      if (data !== null) {
        const parsedData = JSON.parse(data);
        // Alert.alert(String(parsedData));
        setBooking(parsedData); // or set state
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuPress = async screen => {
    const underDevelopmentScreens = ['AMC', 'PayNow', 'RateUs'];
    if (underDevelopmentScreens.includes(screen)) {
      Toast.showWithGravity(
        'This feature is currently under development. It will be available soon.',
        Toast.CENTER,
        Toast.TOP,
      );
      return;
    }
    if (screen === 'Logout') {
      Alert.alert('Logout', 'Are you sure?', [
        { text: 'Cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const res = await logoutUser(userId?._id);
              console.log('Logout Response:', userId);
              if (res?.status) {
                try {
                  await AsyncStorage.removeItem('accessToken');
                  Toast.show(res?.message);
                  dispatch(logout());

                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                  await AsyncStorage.removeItem('token');
                  await AsyncStorage.removeItem('hasSelectedLocation');
                  await AsyncStorage.removeItem('hasSetOTP');
                } catch (e) {
                  console.log('Error removing token', e);
                }
              }
            } catch (error) {
              Toast.show(error);
            }
          },
        },
      ]);
    } else {
      navigation.navigate(screen);
    }
  };
  const truncateText = (text = '', charLimit = 40) => {
    if (typeof text !== 'string') {
      text = String(text ?? '');
    }
    if (text.length <= charLimit) return text;
    return text.slice(0, charLimit).trim() + '...';
  };



  return (
    <SafeAreaView
      style={[
        Homestyles.safeArea,
        { backgroundColor: 'white' },
      ]}
    >
      <StatusBar
        barStyle='dark-content'
        // backgroundColor="transparent"
        translucent={true}
      />
      {/* Header with Location Icon and Add Location Text */}
      <View style={Homestyles.header}>
        <AppText style={Homestyles.locationtitle}>Location</AppText>
        <View style={Homestyles.addressRow}>
          <TouchableOpacity style={Homestyles.locationContainer} activeOpacity={1}>
            <Image
              source={images.homeLocation}
              style={Homestyles.locationIcon}
              resizeMode='contain'
            />
            <AppText style={Homestyles.locationText}>
              {addressText?.fullAddress?.fullAddress
                ? truncateText(addressText.fullAddress?.fullAddress, 25)
                : 'Select Location'}
            </AppText>


          </TouchableOpacity>
          <View style={Homestyles.wheatherContainer}>
            <Image
              source={images.wheatherIcon}
              style={Homestyles.locationIcon}
              resizeMode='contain'
            />
            <AppText
              style={Homestyles.locationText}
            >{weatherData ?
              `${weatherData?.current_weather?.temperature} ${weatherData?.current_weather_units?.temperature}`
              : 'Loading…'
              }</AppText>
          </View>
        </View>
      </View>

      {/* profile Detail */}
      <TouchableOpacity activeOpacity={1}
        style={Homestyles.accountMaincontainer}
        onPress={() => navigation.navigate('ProfileDetail')}
      >
        {loading ? (
          <>
            <CustomLoader size="small" />
          </>
        ) : (
          <>
            <View style={Homestyles.accountcontainer}>
              <Image
                source={
                  storeData?.profilePhoto
                    ? { uri: storeData.profilePhoto }
                    : images.userProfile
                }
                style={Homestyles.accountbg}
                resizeMode="contain"
              />

            </View>
            <View style={Homestyles.accountcontainer}>
              <AppText style={Homestyles.accounttitle}>
                {storeData?.name || 'No user Name'}
              </AppText>
              <View style={Homestyles.accountline}>
                <Image
                  source={images.Call}
                  style={Homestyles.callIcon}
                  resizeMode="contain"
                />
                <AppText style={Homestyles.accountNumber}>
                  {storeData?.countryCode || 'Not Available'} {storeData?.phoneNumber || ''}
                </AppText>
              </View>
              <AppText
                style={[Homestyles.accountNumber, { color: COLORS.themeColor }]}
              >
                {'Complete your profile >'}
              </AppText>
            </View>
          </>
        )}
      </TouchableOpacity>

      {/* service booked */}
      <View
        style={[
          Homestyles.accountMaincontainer,
          { justifyContent: 'space-evenly' },
        ]}
      >
        <View style={{ alignItems: 'center' }}>
          <AppText style={Homestyles.accountBlueText}>{booking || 0}</AppText>
          <AppText style={Homestyles.accountNumber}>Services Booked</AppText>
        </View>
        <View
          style={{
            alignItems: 'center',
            borderLeftWidth: wp('0.2%'),
            borderLeftColor: COLORS.themeColor,
          }}
        >
          <AppText style={Homestyles.accountBlueText}> ₹ 0</AppText>
          <AppText style={[Homestyles.accountNumber, { marginLeft: wp(6) }]}>
            Earned through refer
          </AppText>
        </View>
      </View>

      {/* Menu List */}
      <View style={styles.container}>
        <FlatList
          data={menuData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={1}
              style={Homestyles.acccontainer}
              onPress={() => handleMenuPress(item.screen)}
            >
              <View>
                <Image source={item.icon} style={Homestyles.accicon} />
              </View>
              <AppText style={Homestyles.acctitle}>{item.title}</AppText>
              <Image source={images.rightArrow} style={Homestyles.accarrow} />
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
};

export default AccountScreenComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: wp(2),
    paddingBottom: hp(3),
  },
});
