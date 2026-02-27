import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../../utils/colors';
import images from '../../../assets/images';
import FastImage from 'react-native-fast-image';
import Header from '../../../components/Header';
import HomeScreenStyles from '../HomeScreenStyles';
import CustomButton from '../../../components/CustomButton';
import CustomPicker from '../../../components/CustomPicker';
import { getBrandlist, postErrorCode } from '../../../api/homeApi';
import Toast from 'react-native-simple-toast';
import { handleApiError } from "../../../utils/apiErrorHandler";
import DetailsCard from "../../../customScreen/DetailsCard";
import CustomLoader from '../../../components/CustomLoader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppText from '../../../components/AppText';


const ErrorCodeScreen = ({ navigation }) => {
  const [brandArray, setBrandArray] = useState([]);
  const [brandValue, setBrandValue] = useState('');
  const [isPlace, setIsPlace] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [loading, setLoading] = useState(false);


  const PlaceOptions = [
    { label: 'Split', value: 'Split' },
    { label: 'Window', value: 'Window' },
    { label: 'Ducted', value: 'Ducted' },
    { label: 'VRV/VRF', value: 'VRV/VRF' },
    { label: 'Concealed', value: 'Concealed' },
    { label: 'Tower', value: 'Tower' },
  ];

  useEffect(() => {
    getBrandList();
  }, []);

  const getBrandList = async () => {
    try {
      setLoading(true);
      const res = await getBrandlist();

      const formatted = res?.data?.map(item => ({
        label: item.name,
        value: item._id,
      }));

      setBrandArray(formatted);   // <-- dropdown list
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //   on Calulate button press
  const handleSubmit = async () => {
    try {
      if (!brandValue) return Toast.show("Please select brand");
      if (!errorValue) return Toast.show("Please enter error code");
      if (!isPlace) return Toast.show("Please select AC type");

      setLoading(true);

      const payload = {
        brandId: String(brandValue),
        errorCode: String(errorValue || "E101"),
        acType: String(isPlace),
      };
      const res = await postErrorCode(payload);
      console.log("API Response:", res?.data);

      const selectedBrand = brandArray.find(
        item => item.value === brandValue
      );

      navigation.navigate('ErrorDetails', {
        errorData: JSON.stringify(res?.data || {}),
        brandName: selectedBrand?.label || '',
      });

    } catch (error) {
      Toast.show(error?.message || 'Something went wrong');
      // Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={HomeScreenStyles.workcontainer}>
      <Header title="Error Code" onBack={() => navigation.goBack()} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={[HomeScreenStyles.workscrollstyle, { marginBottom: hp(4) }]}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAwareScrollView>

          <View style={HomeScreenStyles.worksliderview}>
            <Image source={images.ErrorImg} style={HomeScreenStyles.workimage} />
          </View>

          {/* Problem of ac */}
          <View
            style={[styles.card, { paddingVertical: hp('1.5%'), alignItems: 'center' }]}
          >
            <CustomPicker
              label={!loading && brandArray.length !== 0 ? "Select Brand" : "No brands available"}
              value={brandValue}
              items={brandArray}
              onChange={value => setBrandValue(value)}
              width={wp('85%')}
              height={hp('5%')}
              borderRadius={hp('4%')}
            />

            <CustomPicker
              label="Select AC Type"
              value={isPlace}
              onChange={value => setIsPlace(value)}
              items={PlaceOptions}
              width={wp('85%')}
              height={hp('5%')}
              borderRadius={hp('4%')}
            />

            <View style={{
              width: '100%',
              paddingHorizontal: wp('5%'),
            }}>
              <AppText style={styles.label}>Enter your code</AppText>
              <TextInput
                placeholder="Error Code"
                placeholderTextColor="#aaa"
                value={errorValue}
                onChangeText={setErrorValue}
                style={[styles.normalInput]}
                onSubmitEditing={() => Keyboard.dismiss()}
                underlineColorAndroid="transparent"
                allowFontScaling={false}
                includeFontPadding={false}
              />
            </View>


            <CustomButton
              buttonName={loading ? <CustomLoader size='small' /> : "Submit Error Code"}
              btnTextColor={COLORS.white}
              btnColor={COLORS.themeColor}
              onPress={handleSubmit}
              margingTOP={hp('3%')}
              width={wp('85%')}
            />
          </View>

          <View style={HomeScreenStyles.worksliderview}>
            <Image source={images.bannerTwo} style={HomeScreenStyles.workimage} />
          </View>

          {/* Details card */}
          <DetailsCard
            title="Details"
            icon={images.roundRightarrow} />
        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: wp('3%'),
    marginBottom: hp('1%'),
    elevation: 2,
    borderColor: COLORS.lightSky,
    borderWidth: wp(0.2),
  },
  boderLine: {
    borderColor: COLORS.lightSky,
    borderWidth: wp(0.1),
    marginVertical: hp('0.5%'),
  },
  icon: {
    width: wp('7%'),
    height: wp('7%'),
    marginRight: wp('3%'),
    resizeMode: 'contain',
    tintColor: COLORS.themeColor,
  },
  title: {
    flex: 1,
    fontSize: wp('3%'),
    color: COLORS.black,
    fontFamily: Fonts.regular,
  },
  flexView: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: hp('1%'),
  },

  normalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(6),
    paddingHorizontal: hp(2),
    backgroundColor: COLORS.lightWhite,
    fontSize: hp('1.8%'),
    height: hp(5),
    color: COLORS.textHeading
  },
  label: {
    fontSize: hp('1.8%'),
    marginBottom: hp('1%'),
    color: COLORS.black,
    fontFamily: Fonts.medium
  },
});

export default ErrorCodeScreen;
