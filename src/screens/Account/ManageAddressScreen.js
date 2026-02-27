import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../utils/colors';
import images from '../../assets/images';
import Header from '../../components/Header';
import { store } from '../../redux/store';
import { deleteAddress, getAddress } from '../../api/addressApi';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';
import { setAddress } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import CustomLoader from '../../components/CustomLoader';
import { ScrollView } from 'react-native-gesture-handler';
import AppText from '../../components/AppText';

const ManageAddressScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState(null);
  const [selectedId, setSelectedId] = useState(null); //seleted id store
  const userDetail = store?.getState()?.auth?.user;
  const dispatch = useDispatch();
  const selectedAddressRedux = store?.getState()?.auth?.address;

  const handleSelect = id => {
    const selectedAddress = addresses.find(item => item._id === id);
    dispatch(setAddress({ address: selectedAddress }));
    setSelectedId(id);
    Toast.show('This address is now selected!');
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, []),
  );

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const res = await getAddress(userDetail?._id);
      if (res?.status) {
        const data = res.data;
        setAddresses(data);
        // CASE 1: User already selected an address manually → keep same
        if (selectedAddressRedux?._id) {
          const exist = data.find(a => a._id === selectedAddressRedux._id);
          if (exist) {
            setSelectedId(exist._id);
            return;
          }
        }

        // CASE 2: No previous selection → select the last one
        if (data.length > 0) {
          const lastAddress = data[data.length - 1];
          setSelectedId(lastAddress._id);
          dispatch(setAddress({ address: lastAddress }));
        }
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // edit address
  const handleEdit = id => {
    const selectedAddress = addresses.find(item => item._id === id);
    navigation.navigate('AddAddress', {
      from: 'ManageAddressScreen',
      addressData: selectedAddress,
    });
  };

  // delete address
  const handleDelete = addressId => {
    Alert.alert('Delete Address', 'Are you sure you want to delete?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          // Call API
          try {
            setLoading(true);

            const res = await deleteAddress(addressId);
            if (res?.status) {
              Toast.show(res?.message);
              setLoading(prev => !prev);
              fetchAddress();
            } else {
              Toast.show('Delete failed, try again!');
            }
          } catch (error) {
            console.log('Delete error =>', error);
            Toast.show('Something went wrong');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // list of address
  const renderAddressItem = ({ item }) => {
    const isSelected = selectedId === item._id;

    return (
      <TouchableOpacity
        style={styles.addressCard}
        onPress={() => handleSelect(item._id)}
        activeOpacity={0.7}
      >
        {/* Radio Button */}
        <View style={styles.radioContainer}>
          <View
            style={[
              styles.radio,
              item._id === selectedId && styles.radioSelected,
            ]}
          >
            {item._id === selectedId && <View style={styles.radioDot} />}
          </View>
        </View>

        {/* Address Details */}
        <View style={styles.details}>
          <View style={styles.headerRow}>
            <AppText style={styles.name}>{userDetail.name}</AppText>
            <AppText style={[styles.type, { backgroundColor: item.landmark !== '' ? COLORS.lightSky : '' }]}>{item.landmark}</AppText>
            {item._id === selectedId && (
              <View style={styles.defaultBadge}>
                <AppText style={styles.defaultAppText}>Default</AppText>
              </View>
            )}
          </View>

          <AppText style={styles.address}>
            {item.street}, {item.city} {item.state},{item.zipcode}
          </AppText>
          <AppText style={styles.phone}>
            {userDetail.countryCode} {userDetail.phoneNumber}
          </AppText>

          {/* Edit & Delete Icons */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => handleEdit(item._id)}
              style={styles.iconBtn}
            >
              <Image source={images.editIcon} style={styles.editstyIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
              style={styles.iconBtn}
            >
              <Image
                source={images.delete}
                style={[styles.actionIcon, { tintColor: COLORS.red }]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Manage Address" onBack={() => navigation.goBack()} />

      <ScrollView style={{ paddingHorizontal: wp(4) }}>
        <AppText style={styles.title}>Saved Address</AppText>

        {loading ? (
          <CustomLoader size="large" />
        ) : (
          <FlatList
            scrollEnabled={false}
            data={addresses}
            keyExtractor={item => item._id}
            renderItem={renderAddressItem}
            style={{ marginBottom: 10 }}
            showsVerticalScrollIndicator={false}
          // contentContainerStyle={styles.list}
          />
        )
        }
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddAddress')}
        >
          <Image source={images.Plusicon} style={styles.plusIcon} />
          <AppText style={styles.addText}>Add New Address</AppText>
        </TouchableOpacity>
        {/* Add New Address Button */}

      </ScrollView >
    </View >
  );
};

// ====================== STYLES ======================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: hp(1.8),
    fontFamily: Fonts.semiBold,
    color: COLORS.textHeading,
    marginTop: hp(2),
  },
  list: {
    // paddingBottom: hp(5),
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: wp(4),
    borderRadius: wp(3),
    marginVertical: hp(1),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  // Radio
  radioContainer: {
    justifyContent: 'center',
    marginRight: wp(3),
  },
  radio: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: COLORS.themeColor,
  },
  radioDot: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
    backgroundColor: COLORS.themeColor,
  },

  // Details
  details: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  name: {
    fontSize: hp(1.7),
    fontWeight: '600',
    color: COLORS.black,
    marginRight: wp(2),
  },
  type: {
    fontSize: hp(1.4),
    color: COLORS.textColor,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    borderRadius: wp(1),
    marginRight: wp(2),
  },
  defaultBadge: {
    backgroundColor: COLORS.themeColor,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    right: -wp(5.5),
    top: -hp(0),
  },
  defaultText: {
    color: COLORS.white,
    fontSize: hp(1.2),
    fontWeight: 'bold',
  },
  address: {
    fontSize: hp(1.5),
    color: COLORS.textHeading,
    fontFamily: Fonts.medium,
    lineHeight: hp(2.7),
  },
  phone: {
    fontSize: hp(1.5),
    color: COLORS.black,
    fontFamily: Fonts.medium,
    marginBottom: hp(1),
  },

  // Actions
  actions: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    bottom: hp(0),
  },
  iconBtn: {
    marginLeft: wp(3),
  },
  actionIcon: {
    width: wp(5),
    height: wp(5),
  },
  editstyIcon: {
    width: wp(7.5),
    height: wp(5.5),
  },

  // Add Button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 20,
    paddingVertical: hp(1.5),
    borderRadius: wp(10),
    borderWidth: wp(0.1),
    borderColor: COLORS.black,
    elevation: 3,
  },
  plusIcon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(2),
  },
  addText: {
    fontSize: hp(1.7),
    color: COLORS.black,
    fontWeight: '600',
  },
});

export default ManageAddressScreen;
