import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  CheckBox,
  Image,
  Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/Header';
import { COLORS, Fonts } from '../../utils/colors';
import images from '../../assets/images';
import CustomButton from '../../components/CustomButton';
import BookingSlotModal from '../../customScreen/BookingSlotModal';
import ConfirmationModal from '../../customScreen/ConfirmationModal';
import { dispatch, store } from '../../redux/store';
import { addOrEditAddress } from '../../api/addressApi';
import Toast from 'react-native-simple-toast';
import StateCityPicker from '../../components/StateCityPicker';
import CustomLoader from '../../components/CustomLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserProfile } from '../../api/profileApi';
import AppText from '../../components/AppText';


const AddAddress = ({ navigation, route }) => {
  const addressData = route?.params?.addressData;
  const { fromScreen, openModal } = route.params || {};
  const [searchBar, setSearchBar] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateName, setStateName] = useState('');
  const [addressType, setAddressType] = useState('');
  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [modalSlotVisible, setModalSlotVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = store?.getState()?.auth?.user;

  // const ALLOWED_PINCODES = [
  //   '453115', '453551', '453111', '453441', '452006', '453001', '453220', '452016',
  //   '453771', '452005', '452020', '453236', '453112', '453661', '452001', '452013',
  //   '452002', '452007', '452010', '452015', '452003', '452008', '452018', '453331',
  //   '453446', '453332', '452009', '452012', '452014', '452011'
  // ];
  //  const isServiceablePincode = () => {
  //   return ALLOWED_PINCODES.includes(pincode.trim());
  // };

  const GOOGLE_API_KEY = 'AIzaSyCnpSWXWK0qVlrprVD8SKHdO7J0LGUKkfs';
  const getLatLongFromAddress = async (fullAddress) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          fullAddress
        )}&key=${GOOGLE_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK') {
        return {
          latitude: data.results[0].geometry.location.lat,
          longitude: data.results[0].geometry.location.lng,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.log('Geocode error:', error);
      return null;
    }
  };


  // validation
  const validateFields = () => {
    if (!address.trim()) return 'Address is required';
    if (!city.trim()) return 'City is required';
    if (!stateName.trim()) return 'State is required';
    if (!pincode.trim()) return 'Pincode is required';
    if (!/^\d{5,6}$/.test(pincode.trim()))
      return 'Pincode must be 5 or 6 digits';
    // // 🔴 SERVICE AREA CHECK
    // if (!isServiceablePincode()) {
    //   return 'We apologize, but our services are not available in this area yet.Please try a different pincode.'
    // }
    return null;
  };

  useEffect(() => {
    if (addressData) {
      setAddress(addressData.street);
      setCity(addressData.city);
      setStateName(addressData.state);
      setPincode(addressData.zipcode);
    }
  }, [addressData]);


  const handleSubmit = async () => {
    setLoading(true)
    const payload = {
      userId: userId?._id,
      userName: name,
      email: "",
      gender: null,
      profilePhotoUrl:
        "",
    };
    console.log(payload)
    try {

      const res = await updateUserProfile(payload);
      console.log(res?.status, "Profile api -----")
      if (res?.status === true) {
        await refreshUserDetails()
        await handleSubmita()
      }
    } catch (error) {
      console.log(error, "error for upadte profile Api ")
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  }

  const refreshUserDetails = async () => {
    try {
      // setLoading(true);
      const response = await getUserDeatil(userId?._id)
      console.log('User Detail Response--->', response);
      if (response?.status) {

        dispatch(setUser({ user: response?.data }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmita = async () => {
    // HandleInputName()
    if (isSubmitting) return;

    try {
      const validationError = validateFields();
      if (validationError) {
        Alert.alert('Service Unavailable', validationError);
        return;
      }
      setIsSubmitting(true);
      // setLoading(true);
      // ✅ STEP 1 — Create Full Address
      const fullAddress = `${address}, ${city}, ${stateName} ${pincode}`;

      // ✅ STEP 2 — Get Lat/Lng
      const coords = await getLatLongFromAddress(fullAddress);

      if (!coords) {
        setLoading(false);
        setIsSubmitting(false);
        Alert.alert('Unable to detect location. Please check address.');
        return;
      }

      // ✅ STEP 3 — Create Address Object (now with lat/lng)
      const newAddress = {
        address: fullAddress,
        type: addressType,
        isDefault,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      setSelectedAddress(newAddress);
      console.log('selected addres s---', newAddress);


      const body = {
        addressId: addressData?._id || '',
        userId: userId,
        houseNumber: '1234567',
        street: address,
        state: stateName,
        city: city,
        zipCode: pincode,
        saveAs: addressType,
        landmark: addressType,
      };
      const res = await addOrEditAddress(body);
      console.log(' add address Response--->', res);
      if (res?.status) {
        Toast.show(res?.message);

        const cameFrom = route?.params?.from;
        const fromScreen = route?.params?.fromScreen;

        if (cameFrom === 'ServiceScreen') {
          await AsyncStorage.setItem('hasSelectedLocation', 'true');
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Tab',
                params: {
                  screen: 'Home',
                  params: {
                    selectedAddress: newAddress,
                  },
                },
              },
            ],
          });
          return;
        }
        if (cameFrom === 'CustomModal') {
          navigation.goBack();
          return;
        }

        if (cameFrom === 'UserInfoModel') {
          setModalSlotVisible(true);
          return;
        }

        // -------- FLOW 2 --------
        if (fromScreen === 'ViewCart') {
          navigation.navigate('ViewCart', {
            proceed: true,
            selectedAddress: newAddress,
          });
          return;
        }

        if (fromScreen === 'OtherCart') {
          navigation.navigate('OtherCartView', {
            proceed: true,
            selectedAddress: newAddress,
          });
          return;
        }
        else {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.log('Update Error:', error);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };
  console.log('name--->', name);


  return (
    <View style={styles.container}>
      <Header title="Add Address" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <AppText style={styles.label}>Enter Your Name</AppText>
        <TextInput
          placeholder="Name"
          value={name}
          keyboardType="default"
          placeholderTextColor={COLORS.textColor}
          onChangeText={(i) => setName(i)}
          style={styles.input}
          onSubmitEditing={() => Keyboard.dismiss()}
          allowFontScaling={false}
          includeFontPadding={false}
        />
        <AppText style={styles.label}>Street Address</AppText>
        <TextInput
          placeholder="Address"
          value={address}
          keyboardType="email-address"
          placeholderTextColor={COLORS.textColor}
          onChangeText={setAddress}
          style={styles.input}
          onSubmitEditing={() => Keyboard.dismiss()}
          allowFontScaling={false}
          includeFontPadding={false}
        />
        <StateCityPicker
          selectedState={stateName}
          selectedCity={city}
          onStateSelect={setStateName}
          onCitySelect={setCity}
        />
        <AppText style={styles.label}>Pincode</AppText>
        <TextInput
          placeholder="Pincode"
          placeholderTextColor={COLORS.textColor}
          value={pincode}
          maxLength={6}
          onChangeText={setPincode}
          keyboardType="number-pad"
          style={styles.input}
          onSubmitEditing={() => Keyboard.dismiss()}
          allowFontScaling={false}
          includeFontPadding={false}
        />
        <AppText style={styles.label}>Save address as</AppText>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              addressType === 'Home' && styles.selectedTypeButton,
            ]}
            onPress={() => setAddressType('Home')}
            activeOpacity={1}
          >
            <AppText
              style={[
                styles.typeButtonText,
                addressType === 'Home' && styles.selectedTypeButtonText,
              ]}
            >
              Home
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              addressType === 'Office' && styles.selectedTypeButton,
            ]}
            onPress={() => setAddressType('Office')}
          >
            <AppText
              style={[
                styles.typeButtonText,
                addressType === 'Office' && styles.selectedTypeButtonText,
              ]}
            >
              Office
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.typeButton,
              addressType === 'Other' && styles.selectedTypeButton,
            ]}
            onPress={() => setAddressType('Other')}
          >
            <AppText
              style={[
                styles.typeButtonText,
                addressType === 'Other' && styles.selectedTypeButtonText,
              ]}
            >
              Other
            </AppText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsDefault(!isDefault)}
          activeOpacity={1}
        >
          <Image
            source={isDefault ? images.check : images.uncheck}
            style={styles.checkBoxIcon}
          />
          <AppText style={styles.checkboxLabel}>Make this default address</AppText>
        </TouchableOpacity>

        {loading ? (
          <CustomLoader size={30} style={{ marginTop: hp(1) }} />
        ) : (<CustomButton
          buttonName="Continue"
          // margingTOP={hp('6%')}
          btnTextColor={COLORS.white}
          btnColor={COLORS.themeColor}
          onPress={() => handleSubmit()}
        />)}
      </ScrollView >

      <BookingSlotModal
        visible={modalSlotVisible}
        onClose={() => setModalSlotVisible(false)}
        setSelectedSlot={setSelectedSlot}
        onBookProcess={() => {
          setModalSlotVisible(false);
          setTimeout(() => {
            navigation.navigate('ViewCart', {
              proceed: true,
              selectedAddress: selectedAddress,
            });
          }, 300);
        }}
      />

      <ConfirmationModal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        selectedAddress={selectedAddress}
        selectedSlot={selectedSlot}
      />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: wp(4),
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  headerText: {
    fontSize: hp(1.7),
    textAlign: 'center',
    marginBottom: hp(2),
    color: COLORS.black,
    fontFamily: Fonts.semiBold,
  },

  searchInput: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(10),
    padding: wp(Platform.OS === 'ios' ? 2 : 1),
    marginBottom: hp(0.5),
    alignItems: 'center',
  },
  searchInputText: {
    fontSize: hp(1.5),
    fontFamily: Fonts.medium,
    color: COLORS.black,
    marginLeft: wp(2),
  },
  orText: {
    textAlign: 'center',
    marginVertical: hp(1),
    color: '#666',
    fontFamily: Fonts.medium,
    fontSize: hp(1.5),
  },
  label: {
    fontSize: hp(1.8),
    marginBottom: hp(1),
    marginTop: hp(1.3),
    color: COLORS.black,
    fontFamily: Fonts.semiBold,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(10),
    padding: wp(2.5),
    marginBottom: hp(0.5),
    fontSize: hp(1.5),
    fontFamily: Fonts.medium,
    color: COLORS.black,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  typeButton: {
    flex: 1,
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(1),
    padding: wp(2),
  },
  selectedTypeButton: {
    borderWidth: 1,
    borderColor: COLORS.themeColor,
    backgroundColor: COLORS.themeColor,
  },
  typeButtonText: {
    fontSize: hp(1.6),
    fontFamily: Fonts.medium,
    color: COLORS.textHeading,
  },
  selectedTypeButtonText: {
    fontSize: hp(1.6),
    fontFamily: Fonts.medium,
    color: COLORS.white,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  checkboxLabel: {
    marginLeft: wp(2),
    fontSize: hp(1.6),
    fontFamily: Fonts.medium,
    color: COLORS.black,
  },
  checkBoxIcon: {
    width: wp(5),
    height: hp(5),
    resizeMode: 'contain',
  },
});

export default AddAddress;
