import React, { useState } from 'react';
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
import AppText from '../../../components/AppText';

const TonnageCalculatorScreen = ({ navigation }) => {
  const [isPlace, setIsPlace] = useState('Select Place first');
  const [withValue, setWithValue] = useState('');
  const [heightValue, setHeightValue] = useState('');
  const [totalTon, setTotalTon] = useState('');
  const [showTon, setShowTon] = useState(false);

  const PlaceOptions = [
    { label: 'Residential', value: 'Residential' },
    { label: 'Commercial', value: 'Commercial' },
  ];


  //   on Calulate button press
  const handleSubmit = () => {
    const width = parseFloat(withValue) || 0;
    const height = parseFloat(heightValue) || 0;

    if (isPlace === null || isPlace === undefined) {
      Alert.alert('Missing Selection', 'Please select a place.');
      return;
    }
    if (width <= 0 || height <= 0) {
      Alert.alert(
        'Invalid input',
        'Please enter positive numbers for width and height.',
      );
      return;
    }
    // 2. Area in square feet
    const areaSqFt = width * height;
    let tonnage = 0;

    if (isPlace === 'Residential') {

      // Residential formula
      tonnage = areaSqFt / 100;   // 1 ton per 120 sq.ft
    } else if (isPlace === 'Commercial') {
      // Commercial formula
      tonnage = areaSqFt / 83.33;   // 1 ton per 100 sq.ft
    }

    setTotalTon(tonnage.toFixed(2));
    setShowTon(true);
  };

  return (
    <View style={HomeScreenStyles.workcontainer}>
      <Header title="Tonnage Calculator" onBack={() => navigation.goBack()} />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={HomeScreenStyles.workscrollstyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={HomeScreenStyles.worksliderview}>
          <Image source={images.calculatorImg} style={HomeScreenStyles.workimage} />
        </View>

        {/* Problem of ac */}
        <View
          style={[styles.card, { padding: hp('2%'), paddingBottom: hp('2%') }]}
        >
          <CustomPicker
            value={isPlace}
            onChange={value => setIsPlace(value)}
            items={PlaceOptions}
            width={wp('85%')} // any width
            height={hp('5%')} // any height
            borderRadius={hp('4%')} // custom radius
          />

          <View
            style={[
              styles.flexView,
              {
                justifyContent: 'space-between',
                width: wp('90%'),
                alignSelf: 'center',
              },
            ]}
          >
            <TextInput
              placeholder="20 (ft)"
              placeholderTextColor="#aaa"
              value={withValue}
              onChangeText={setWithValue}
              keyboardType='number-pad'
              style={styles.normalInput}
              onSubmitEditing={() => Keyboard.dismiss()}
              allowFontScaling={false}
              includeFontPadding={false}
            />
            <TextInput
              placeholder="20 (ft)"
              placeholderTextColor="#aaa"
              value={heightValue}
              onChangeText={setHeightValue}
              keyboardType='number-pad'
              style={styles.normalInput}
              onSubmitEditing={() => Keyboard.dismiss()}
              allowFontScaling={false}
              includeFontPadding={false}
            />
          </View>

          {showTon && (
            <View style={{ marginTop: hp('2%') }}>
              <AppText style={styles.reasonInput}>
                {' '}
                Total AC tonnage needed:{' '}
                <AppText style={{ fontFamily: Fonts.bold }}>{totalTon}</AppText> ton
              </AppText>
            </View>
          )}

          <CustomButton
            buttonName="Calculate "
            margingTOP={hp('1%')}
            btnTextColor={COLORS.white}
            btnColor={COLORS.themeColor}
            width={wp('85%')}
            onPress={() => handleSubmit()}
          />
        </View>

        <View style={HomeScreenStyles.worksliderview}>
          <Image source={images.bannerTwo} style={HomeScreenStyles.workimage} />
        </View>

        {/* Details card */}
        <View style={styles.card}>
          <AppText
            style={[
              HomeScreenStyles.workheadText,
              { paddingHorizontal: wp('3%'), marginTop: hp('2%') },
            ]}
          >
            Details
          </AppText>
          <View style={styles.boderLine} />
          <View style={[styles.flexView]}>
            <FastImage source={images.roundRightarrow} style={styles.icon} />
            <AppText style={styles.title}>
              Tonnage calculator helps you determine the appropriate cooling
              capacity required for your space based on its size and other
              factors.
            </AppText>
          </View>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    resizeMode: 'contain',
    tintColor: COLORS.themeColor,
  },
  title: {
    flex: 1,
    fontSize: wp('3.5%'),
    color: COLORS.black,
    fontFamily: Fonts.regular,
  },
  flexView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    marginVertical: hp('1%'),
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.themeColor,
    marginRight: 10,
    marginTop: 7,
  },
  reasonInput: {
    borderWidth: hp(0.1),
    borderColor: '#ddd',
    borderRadius: wp(3),
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    color: '#333',
  },
  normalInput: {
    borderWidth: hp(0.1),
    borderColor: '#ddd',
    borderRadius: wp(3),
    padding: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    color: '#333',
    width: hp(18),
    alignItems: 'flex-start',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    ...HomeScreenStyles.profileDetailInput,
    paddingRight: 40, // arrow ke liye space
    color: COLORS.black,
  },
  inputAndroid: {
    ...HomeScreenStyles.profileDetailInput,
    paddingRight: 40,
    color: COLORS.black,
  },
  placeholder: {
    color: '#999',
  },
  iconContainer: {
    top: 15,
    right: 10,
  },
};

export default TonnageCalculatorScreen;
