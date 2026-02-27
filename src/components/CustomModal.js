import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Platform,
  FlatList,
  Keyboard,
  TextInput,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../utils/colors';
import images from '../assets/images';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { store } from '../redux/store';
import { getAddress } from '../api/addressApi';
import { useDispatch } from 'react-redux';
import { setAddress, setUser } from '../redux/slices/authSlice';
import CustomLoader from './CustomLoader';
import { getUserDeatil } from '../api/profileApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from './AppText';

const CustomModal = ({
  visible,
  onClose,
  onProceed,
  setSelectedAddress,
  addAcStatus,
  setvalue, // ✅ setter from parent
  numberofAC, // ✅ value from parent
  fromScreen,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userDetail = store?.getState()?.auth?.user;
  const selectedAddressRedux = store?.getState()?.auth?.address;
  const [loading, setLoading] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // 🔹 Fetch address on focus
  useFocusEffect(
    useCallback(() => {
      fetchAddress();
      refreshUserDetails();
    }, []),
  );
  const [name, setName] = useState('');

  const refreshUserDetails = async () => {
    try {
      // setLoading(true);
      const response = await getUserDeatil(userDetail?._id);
      if (response?.success === true) {
        console.log(response?.data?.name);
        dispatch(setUser({ user: response?.data }));
        setName(response?.data?.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userNme = AsyncStorage.getItem('UserName');


  const fetchAddress = async () => {
    try {
      setLoading(true);
      const res = await getAddress(userDetail?._id);
      if (res?.status) {
        const data = res.data || [];
        setSavedAddresses(data);
        if (selectedAddressRedux?._id) {
          setSelectedId(selectedAddressRedux._id);
        } else if (data.length > 0) {
          const lastAddress = data[data.length - 1];
          setSelectedId(lastAddress._id);
          dispatch(setAddress({ address: lastAddress }));
        }
      }
    } catch (error) {
      console.log('Fetch address error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = address => {
    setSelectedId(address._id);
    dispatch(setAddress({ address }));
  };

  const handleProceedPress = () => {
    if (!selectedId) return;
    const selectedAddress = savedAddresses.find(
      item => item._id === selectedId,
    );
    if (selectedAddress && setSelectedAddress) {
      setSelectedAddress(selectedAddress);
    }
    onProceed(selectedAddress);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.modalContent,
            { maxHeight: addAcStatus === false ? hp('80%') : hp(80) },
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* 🔹 Old AC Input */}
          {addAcStatus === false && (
            <View style={styles.inputGroup}>
              <AppText style={styles.label}>Old AC do you want to sell</AppText>

              <TextInput
                value={numberofAC}
                onChangeText={setvalue}
                keyboardType="number-pad"
                placeholder="Enter number of AC"
                placeholderTextColor={COLORS.TextColor}
                style={styles.numberInput}
                allowFontScaling={false}
                includeFontPadding={false}
              />
            </View>
          )}

          {/* 🔹 Header */}
          <View style={styles.inFlexrow}>
            <AppText style={styles.headerText}>Saved Addresses</AppText>

            <TouchableOpacity
              onPress={() => {
                onClose();

                setTimeout(() => {
                  navigation.navigate('AddAddress', { from: fromScreen });
                }, 300); // wait for modal close animation
              }}
            >
              <AppText style={styles.addButtonText}>+ Add new</AppText>
            </TouchableOpacity>
          </View>

          {/* 🔹 Address List */}
          <View style={{ maxHeight: addAcStatus === false ? hp(26) : hp(33) }}>
            {loading ? (
              <CustomLoader size="large" />
            ) : savedAddresses.length === 0 ? (
              <AppText style={styles.emptyText}>
                Please Add Your Address
              </AppText>
            ) : (
              <FlatList
                data={savedAddresses}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = selectedId === item._id;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.addressContainer,
                        isSelected && styles.selectedAddress,
                      ]}
                      onPress={() => {
                        handleAddressSelect(item);
                      }}
                    >
                      <Image
                        source={isSelected ? images.onbutton : images.offbutton}
                        style={styles.showiconStyle}
                      />

                      <View style={{ width: wp(78) }}>
                        <View style={styles.inFlexrow}>
                          <AppText style={styles.addressName}>{name}</AppText>
                          {isSelected && (
                            <AppText style={styles.defaultTag}>Default</AppText>
                          )}
                        </View>

                        <AppText allowFontScaling={false} style={styles.addressDetails}>
                          {item?.street}, {item?.city}, {item?.state},{' '}
                          {item?.zipcode}
                        </AppText>

                        <AppText allowFontScaling={false} style={styles.addressPhone}>
                          {userDetail?.phoneNumber}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>

          {/* 🔹 Proceed */}
          {savedAddresses.length > 0 && (
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={() => {
                const isNameEmpty =
                  !userDetail?.name || userDetail?.name.trim() === '';
                // if (isNameEmpty) {
                //   navigation.navigate('ProfileDetail');
                // } else {
                handleProceedPress();
                // }
              }}
            >
              <AppText style={styles.proceedButtonText}>Proceed</AppText>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgb(249, 252, 252)',
    paddingHorizontal: hp('2%'),
    paddingVertical: hp('2%'),
    borderTopLeftRadius: wp('6.5%'),
    borderTopRightRadius: wp('6.5%'),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    minHeight: hp(50),
    alignSelf: 'center',
    width: wp('100%'),
    paddingBottom: hp(Platform.OS === 'android' ? 4 : 4),
    marginBottom: hp(0),
  },
  headerText: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.TextColor,
    marginBottom: hp(0),
  },
  inFlexrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
    flexWrap: 'wrap',
  },
  addButtonText: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.bold,
    color: COLORS.themeColor,
  },
  inputGroup: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: hp('1.6%'),
    fontFamily: Fonts.semiBold,
    marginBottom: hp(0.5),
    color: COLORS.black,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: wp(2),
    padding: hp(1),
    fontSize: hp('1.6%'),
    fontFamily: Fonts.regular,
    color: COLORS.black,
    backgroundColor: COLORS.white,
    marginTop: hp('0.5%'),
  },
  addressContainer: {
    // width: wp('95%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: hp(1.2),
    marginVertical: hp('0.5%'),
    borderRadius: wp('3%'),
    backgroundColor: COLORS.white,
    alignSelf: 'center',
  },
  markstyle: {
    color: COLORS.black,
    fontWeight: '400',
    fontSize: hp(1.4),
    textAlign: 'center',
    backgroundColor: COLORS.lightSky,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
    marginBottom: hp('0.5%'),
  },
  selectedAddress: {
    borderRadius: wp('3%'),
    backgroundColor: COLORS.white,
    alignItems: 'center',
    alignSelf: 'center',
    padding: hp(1.2),
  },
  addressName: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
    marginTop: hp(-1),
  },
  addressDetails: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.textHeading,
  },

  addressPhone: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.medium,
    color: COLORS.textHeading,
  },
  defaultTag: {
    backgroundColor: COLORS.lightSky,
    color: '#00aaff',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
    fontSize: hp(1.5),
    marginTop: hp(-2),
  },
  showiconStyle: {
    width: wp('5%'),
    height: hp('3%'),
    resizeMode: 'contain',
    marginRight: wp(2),
  },
  icons: {
    flexDirection: 'row',
    gap: wp(2.5),
  },
  emptyText: {
    fontSize: hp(2),
    textAlign: 'center',
    color: COLORS.TextColor,
    marginTop: hp(2),
  },
  darkIcon: {
    color: '#333',
  },
  lightIcon: {
    color: '#ccc',
  },
  proceedButton: {
    backgroundColor: COLORS.themeColor,
    padding: hp(1),
    borderRadius: wp(6),
    alignItems: 'center',
    width: wp('90%'),
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp(3),
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
});

export default CustomModal;
