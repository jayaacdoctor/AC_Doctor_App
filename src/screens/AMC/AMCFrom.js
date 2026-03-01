import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

import Header from '../../components/Header';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import images from '../../assets/images';
import screenStyles from '../Home/HomeScreenStyles';
import { COLORS, Fonts } from '../../utils/colors';
import ACTypeSelector from '../../customScreen/ACTypeSelector';
import CustomButton from '../../components/CustomButton';
import PlaceTypeSelector from '../../components/PlaceTypeSelector';
import RequestConfirm from '../../customScreen/RequestConfirm';
import CunstomInput from '../../components/CunstomInput';
import { isTablet } from '../../components/TabletResponsiveSize';
import { set } from 'react-hook-form';
import { store } from '../../redux/store';
import { postAMCRequest } from '../../api/homeApi';
import Toast from 'react-native-simple-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppText from '../../components/AppText';
import HomeScreenStyles, { faqData } from '../Home/HomeScreenStyles';

const AMCFrom = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editStatus, setEditStatus] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = store?.getState()?.auth?.user;

  const [formData, setFormData] = useState({
    name: userId?.name || '',
    phoneNumber: userId?.phoneNumber || '',
    address: '',
    addAc: '',
    placeType: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async () => {
    // validation
    if (!formData.name.trim()) {
      Toast.show('Please enter your name');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      Toast.show('Please enter your phone number');
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      Toast.show('Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.placeType.trim()) {
      Toast.show('Please select place type');
      return;
    }
    if (!formData.address.trim()) {
      Toast.show('Please enter your address');
      return;
    }
    // convert addAc object to array
    const acDetails = Object.entries(formData.addAc || {}).map(
      ([acType, quantity]) => ({
        acType,
        quantity,
      }),
    );

    const bodyData = {
      username: formData.name,
      userId: userId?._id,
      phoneNumber: formData.phoneNumber,
      place: formData.placeType.toLowerCase(),
      address: formData.address.trim(),
      comment: formData.comment || '',
      quantity: acDetails.reduce((sum, item) => sum + item.quantity, 0),
      acDetails: acDetails,
    };
    try {
      setLoading(true);
      // API Call can be made here with formData
      const response = await postAMCRequest(bodyData);
      setLoading(false);
      console.log('AMC Request Response:', response);
      setSuccessVisible(true);
    } catch (error) {
      setLoading(false);
      console.log('Error submitting AMC request:', error);

      Toast.show(getErrorMessage(error));
    }
    finally {
      setLoading(false);
    }
  };
  // FAQ's Toggle
  const toggleExpand = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <Header title="AMC" onBack={() => navigation.goBack()} onHelp={false} />

      {/* Only TextInputs move with keyboard */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.containView,
          { paddingBottom: hp(12) },
        ]}

      >
        <KeyboardAwareScrollView

        >
          {/* <View style={styles.containView}> */}
          <View style={screenStyles.worksliderview}>
            <Image source={images.bannerAmc} style={screenStyles.workimage} />
          </View>
          <AppText style={[screenStyles.workheadText]}>Customer Details</AppText>
          {/* Name */}
          <CunstomInput
            label="Name"
            placeholder="Enter Your Name"
            value={formData.name}
            onChangeText={val => handleInputChange('name', val)}
            borderRadius={hp('1%')}
            MarginTop={hp('1%')}
            containerStyle={{ width: isTablet ? wp(90) : wp(86) }}
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {/* Phone */}
          <View style={styles.inputGroup}>
            <AppText style={styles.label}>Phone No.</AppText>

            {!editStatus && (
              <Pressable
                style={[styles.styleofText, styles.rowView]}
                onPress={() => setEditStatus(true)}
              >
                <AppText
                  style={[
                    styles.phonefont,
                    {
                      width: isTablet ? wp(83) : wp(75),
                    },
                  ]}
                >
                  {formData.phoneNumber}
                </AppText>
                <Image source={images.edit} style={styles.editImg} />
              </Pressable>
            )}

            {editStatus && (
              <CunstomInput
                placeholder="Enter Your Number"
                keyboardType="default"
                value={formData.phoneNumber}
                onChangeText={val => handleInputChange('phoneNumber', val)}
                borderRadius={hp('1%')}
                containerStyle={{ width: isTablet ? wp(92) : wp(90) }}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            )}
          </View>
          {/* Place Type */}
          <PlaceTypeSelector
            headingText="Place Type*"
            onChange={value => handleInputChange('placeType', value)}
            stylesContain={{
              marginHorizontal: hp(2),
              width: isTablet ? wp(92) : wp(88),
            }}
          />
          {/* Address */}
          <View
            style={{
              marginHorizontal: hp(4),
            }}
          >
            <CunstomInput
              label="Address"
              placeholder="Type here..."
              value={formData.address}
              onChangeText={val => handleInputChange('address', val)}
              borderRadius={hp('1%')}
              MarginTop={hp('1%')}
              multiline={true}
              numberOfLines={2}
              containerStyle={{ width: isTablet ? wp(90) : wp(88) }}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
          {/* AC Type */}
          <AppText style={[screenStyles.workheadText, { margin: hp(1) }]}>
            Related to AC
          </AppText>
          <ACTypeSelector
            onChange={v => handleInputChange('addAc', v)}
            headingText={'Add AC'}
            ShapeRADIUS={hp(1)}
            HeadingStyle={{ marginLeft: isTablet ? wp(2) : wp(2) }}
          />
          {/* </View> */}
          <View style={[HomeScreenStyles.worksliderview]}>
            <Image
              source={images.bannerTwo}
              style={[HomeScreenStyles.workimage, { width: '89%' }]}
            />
          </View>

          <AppText style={[HomeScreenStyles.workheadText, { margin: hp('1%') }]}>
            FAQs
          </AppText>

          {/* FAQ Items */}
          {faqData.map((item, index) => (
            <View key={index} style={HomeScreenStyles.faqItem}>
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                style={HomeScreenStyles.faquestionContainer}
              >
                <AppText style={HomeScreenStyles.faquestionText}>
                  {item.question}
                </AppText>
                <AppText style={HomeScreenStyles.faqarrow}>
                  {expandedIndex === index ? '︿' : '﹀'}
                </AppText>
              </TouchableOpacity>
              {expandedIndex === index && (
                <AppText style={HomeScreenStyles.faqanswerText}>{item.answer}</AppText>
              )}
            </View>
          ))}
        </KeyboardAwareScrollView>


      </ScrollView>

      {/* FIXED BOTTOM BUTTON */}
      <View style={styles.footerButton}>
        <CustomButton
          buttonName="Submit"
          btnTextColor={COLORS.white}
          btnColor={COLORS.themeColor}
          onPress={onSubmit}
        />
      </View>

      <RequestConfirm
        visible={successVisible}
        onClose={() => {
          setSuccessVisible(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Tab', params: { screen: 'Home' } }],
          });
        }}
        onViewRequest={() => {
          setSuccessVisible(false);
          setTimeout(() => {
            navigation.navigate('AMCRequestFrom');
          }, 150);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  containView: {
    marginHorizontal: hp(2),
    marginBottom: hp(2),

  },
  inputGroup: {
    marginTop: hp('1.5%'),
    marginHorizontal: wp(2.5),
  },
  label: {
    fontSize: hp('1.5%'),
    color: COLORS.black,
    marginBottom: hp('1%'),
    fontFamily: Fonts.medium,
  },
  textInputInner: {
    fontSize: hp('1.6%'),
    color: COLORS.inputColour,
    paddingHorizontal: wp('4%'),
    backgroundColor: COLORS.white,
    height: hp(4.5),
    borderRadius: hp(1),
  },
  styleofText: {
    borderColor: COLORS.lightGray,
    borderWidth: hp(0.1),
    height: hp(4.7),
    borderRadius: hp(1),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  notesInput: {
    height: hp('10%'),
    textAlignVertical: 'top',
    paddingTop: hp('1.5%'),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editImg: {
    width: wp(5),
    height: hp(2),
    resizeMode: 'contain',
  },
  phonefont: {
    fontSize: hp('1.8%'),
    color: COLORS.inputColour,
  },

  /** FIXED BOTTOM BUTTON */
  footerButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? hp(3) : hp(3),
    paddingHorizontal: wp(5),
    backgroundColor: COLORS.white,
    paddingTop: hp(1.5),
  },
});

export default AMCFrom;
