import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
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
import CunstomInput from '../../../components/CunstomInput';
import { isTablet } from '../../../components/TabletResponsiveSize';
import ACTypeSelector from '../../../customScreen/ACTypeSelector';
import Toast from 'react-native-simple-toast';
import { useDispatch } from 'react-redux';
import { setOtherCartMeta } from '../../../redux/slices/cartSlice';
import AppText from '../../../components/AppText';


const OtherScreen = ({ navigation }) => {
  const [isProblem, setIsProblem] = useState('Select Problem');
  const [ProblemReason, setProblemReason] = useState('');
  const dispatch = useDispatch();
  // list of prolbem
  const ProblemOptions = [
    { label: 'Water Leakage', value: 'Water Leakage' },
    { label: 'Noice Problem', value: 'Noice Problem' },
    { label: 'Gas topup', value: 'Gas topup' },
    { label: 'PCB fault', value: 'PCB fault' },
    { label: 'Remote fault', value: 'Remote fault' },
    { label: 'Fan/Blower fault', value: 'Fan/Blower fault' },
    { label: 'Fan Motor', value: 'Fan Motor' },
    { label: 'Outdoor fan fault', value: 'Outdoor fan fault' },
    { label: 'Outdoor fan Blade fault', value: 'Outdoor fan Blade fault' },
    { label: 'Outdoor fan motor fault', value: 'Outdoor fan motor fault' },
    { label: 'Others', value: 'Others' },
  ];

  const [formData, setFormData] = useState({
    isProblem: isProblem,
    reason: ProblemReason,
    // acType: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (formData.isProblem === null || formData.reason.trim() === '') {
      Toast.show('Please select a problem and describe the issue.');
      return;
    } else {
      dispatch(
        setOtherCartMeta({
          problem: formData.isProblem,
          reason: formData.reason,
        }),
      );
      navigation.navigate('OtherCartView');
    }
    // Reset form
    setIsProblem('Select Problem');
    setProblemReason('');
  };

  return (
    <View style={HomeScreenStyles.workcontainer}>
      <Header title="Other" onBack={() => navigation.goBack()} />

      <ScrollView
        style={HomeScreenStyles.workscrollstyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={HomeScreenStyles.worksliderview}>
          <Image source={images.bannerOne} style={HomeScreenStyles.workimage} />
        </View>

        {/* other card */}
        <View style={styles.card}>
          <AppText
            style={[
              HomeScreenStyles.workheadText,
              { paddingHorizontal: wp('3%'), marginTop: hp('2%') },
            ]}
          >
            Other Services
          </AppText>
          <View style={styles.boderLine} />
          <View style={[styles.flexView, { marginTop: hp('1%') }]}>
            <FastImage source={images.roundRightarrow} style={styles.icon} />
            <AppText style={styles.title}>
              Through cleaning and maintenance to keep your AC running smoothly.
            </AppText>
          </View>
          <View style={styles.flexView}>
            <FastImage source={images.roundRightarrow} style={styles.icon} />
            <AppText style={styles.title}>
              Expert AC troubleshooting and repair services for all brands and
              models.
            </AppText>
          </View>
          <View style={styles.flexView}>
            <FastImage source={images.roundRightarrow} style={styles.icon} />
            <AppText style={styles.title}>
              Energy-efficient AC solutions to help you save on cooling costs.
            </AppText>
          </View>
        </View>

        {/* Problem of ac */}
        <View style={styles.cardAdditional}>
          {/* <ACTypeSelector
            onChange={v => handleInputChange('acType', v)}
            headingText={'Add AC'}
            ShapeRADIUS={hp(3)}
          /> */}

          <View style={{ marginTop: hp(1) }}>
            <CustomPicker
              value={formData.isProblem}
              onChange={value => handleInputChange('isProblem', value)}
              items={ProblemOptions}
              width={isTablet ? wp(90) : wp(85)} // any width
              height={hp('5.5%')} // any height
              borderRadius={hp('4%')} // custom radius
            />
          </View>

          <CunstomInput
            placeholder="Describe your problem"
            multiline
            numberOfLines={5}
            value={formData.reason}
            onChangeText={val => handleInputChange('reason', val)}
            borderRadius={hp('1.5%')}
            MarginTop={hp(2)}
            MarginBottom={hp(2)}
            onSubmitEditing={() => Keyboard.dismiss()}
            containerStyle={{ width: isTablet ? wp(90) : wp('85%') }}
          />


          <CustomButton
            buttonName="Submit"
            margingTOP={hp('0%')}
            btnTextColor={COLORS.white}
            btnColor={COLORS.themeColor}
            onPress={() => handleSubmit()}
          />
        </View>

        <View style={HomeScreenStyles.worksliderview}>
          <Image source={images.bannerTwo} style={HomeScreenStyles.workimage} />
        </View>

        {/* Terms and Conditions */}
        <View
          style={[
            styles.card,
            { marginBottom: hp('10%'), marginTop: hp('1.5%') },
          ]}
        >
          <AppText
            style={[
              HomeScreenStyles.workheadText,
              { paddingHorizontal: wp('3%'), marginTop: hp('2%') },
            ]}
          >
            Terms and Conditions
          </AppText>
          <View style={styles.boderLine} />
          <View style={[styles.flexView, { marginTop: hp('1%') }]}>
            <FastImage source={images.roundRightarrow} style={styles.icon} />
            <AppText style={styles.title}>
              Service warranty is vaild for 30 days from the date of service.
            </AppText>
          </View>

          <View style={styles.flexView}>
            <FastImage source={images.roundRightarrow} style={styles.icon} />
            <AppText style={styles.title}>
              Additional parts or materials required for repairs will be charged
              separately.
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
  cardAdditional: {
    backgroundColor: COLORS.white,
    borderRadius: wp('3%'),
    marginBottom: hp('1%'),
    elevation: 2,
    borderColor: COLORS.lightSky,
    borderWidth: wp(0.2),
    padding: hp('1%'),
    paddingBottom: hp('2%'),
    alignItems: 'center',
    alignSelf: 'center',
  },
  boderLine: {
    borderColor: COLORS.lightSky,
    borderWidth: wp(0.1),
    marginVertical: hp('0.5%'),
  },
  icon: {
    width: isTablet ? wp(5) : wp(5.5),
    height: isTablet ? wp(5) : wp(5.5),
    marginRight: wp('3%'),
    alignItems: 'center',
    resizeMode: 'contain',
  },
  title: {
    width: isTablet ? wp(80) : wp(80),
    fontSize: isTablet ? wp(2.5) : wp('3%'),
    color: COLORS.black,
    fontFamily: Fonts.regular,
  },
  flexView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    marginBottom: hp('1%'),
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
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    color: '#333',
    height: hp(13),
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

export default OtherScreen;
