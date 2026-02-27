import React, { useState, useEffect, useCallback } from 'react';
import images from '../../../assets/images';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS } from '../../../utils/colors';
import { getBrandlist } from '../../../api/homeApi';
import CustomLoader from '../../../components/CustomLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from '../../../components/AppText';

const BrandScreen = ({ route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const cameFrom = route?.params?.from;
  const [brandsArry, setBrandsArry] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBrandList();
  }, []);

  const getBrandList = async () => {
    try {
      setLoading(true);
      const res = await getBrandlist();
      console.log('Brand List Response:', res);
      setBrandsArry(res?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brandsArry.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleSelectBrand = async selectedBrand => {
    try {
      await AsyncStorage.setItem('selectedBrand', selectedBrand);

      if (cameFrom === 'SellOldAcScreen') {
        navigation.goBack();
      } else if (cameFrom === 'CompareACScreen') {
        navigation.navigate('SelectACmodel', {
          fromCompare: true,
          Sname: selectedBrand,
        });
      }
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const BrandItem = ({ item, onSelect }) => (
    <TouchableOpacity
      style={styles.brandItem}
      onPress={() => onSelect(item.name)}
    >
      <Image
        source={item?.image ? { url: item?.image } : images.lgLogo}
        style={styles.logo}
      />
      <AppText style={styles.brandName}>{item.name}</AppText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp('0.5%') : hp('1%')}
      >
        <Header title="Brand" onBack={() => navigation.goBack()} />
        <View style={[styles.header, styles.searchInput]}>
          <Image source={images.searchIcon} style={styles.serachStyle} />
          <TextInput
            placeholder="Search..."
            placeholderTextColor={COLORS.textColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => Keyboard.dismiss()}
            allowFontScaling={false}
            includeFontPadding={false}
          />
        </View>
        <View style={styles.borderContainer}>
          <AppText style={styles.headerText}>Which is your favorite BRAND ?</AppText>
          {loading ? (
            <CustomLoader size="large" />
          ) : (
            <FlatList
              data={filteredBrands}
              keyExtractor={(item) => item._id}
              numColumns={3}
              renderItem={({ item }) => (
                <BrandItem item={item} onSelect={handleSelectBrand} />
              )}
              contentContainerStyle={styles.listContent}
              nestedScrollEnabled={true}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    margin: hp(1),
    alignItems: 'center',
  },
  serachStyle: {
    width: wp(10),
    height: hp(3),
    resizeMode: 'contain',
  },
  borderContainer: {
    // margin:hp(1.5),
    // backgroundColor: '#fefcfcff',
    // borderRadius:hp(2),
    padding: hp(2),
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: hp(1.5),
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: hp(7),
    padding: wp(1),
  },
  brandItem: {
    borderRadius: hp(1),
    alignItems: 'center',
    padding: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    marginRight: hp(0.8),
    marginBottom: hp(1),
    alignSelf: 'center',
  },
  logo: {
    width: wp(25.5),
    height: hp(9),
    resizeMode: 'contain',
    marginBottom: hp(0.8),
  },
  brandName: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.TextColor,
  },
  listContent: {
    // padding: 16,
  },
});

export default BrandScreen;
