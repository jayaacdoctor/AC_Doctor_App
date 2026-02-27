import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
  Alert,
} from 'react-native';
import Header from '../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../utils/colors';
import images from '../../assets/images';
import FastImage from 'react-native-fast-image';
import screenStyles, { faqData } from './HomeScreenStyles';
import CustomButton from '../../components/CustomButton';
import BookingSlotModal from '../../customScreen/BookingSlotModal';
import SuccessPopupModal from '../../customScreen/SuccessPopupModal';
import ImagePickerModal from '../../components/ImagePickerModal';
import CustomPicker from '../../components/CustomPicker';
import CunstomInput from '../../components/CunstomInput';
import { store } from '../../redux/store';
import Toast from 'react-native-simple-toast';
import { getBrandlist, postConsultancy } from '../../api/homeApi';
import { setBrandList } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { isTablet } from '../../components/TabletResponsiveSize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getPresignedUrl, uploadImageToS3 } from '../../api/profileApi';
import CustomModal from '../../components/CustomModal';
import AppText from '../../components/AppText';

const FreeConsultant = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [modalSlotVisible, setModalSlotVisible] = useState(false); //booktime
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectdate, setSelectDate] = useState('Select date');
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [brandArray, setBrandArray] = useState([]);
  const user = store?.getState()?.auth?.user;
  const addressId = store?.getState()?.auth?.address;
  const [modalUserVisible, setModalUserVisible] = useState(false)

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    getBrandList();
  }, []);

  const getBrandList = async () => {
    try {
      setLoading(true);
      const res = await getBrandlist();
      // console.log('respondr og brand--', res);
      const formatted = res?.data?.map(item => ({
        label: item.name,
        value: item._id,
      }));
      setBrandArray(formatted);
      dispatch(setBrandList({ brandList: formatted }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    propertyType: '',
    brand: '',
    numberOfAC: '',
    alternateNumber: '',
    service: 'Select',
    dateTime: 'Select',
    additionalNotes: '',
    userId: user?._id,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to handle slot selection
  const handleSlotSelection = slot => {
    if (slot) {
      const { date, monthNumber, year, time, Timeslot } = slot;
      const formattedDate = `${year}-${monthNumber}-${date}`;
      const formattedTime =
        time === 'morning' || time === 'firstHalf' ? 'First Half' : Timeslot;
      setSelectDate(formattedDate);
      handleInputChange('dateTime', formattedTime); // Update formData.dateTime
    }
  };

  // FAQ's Toggle
  const toggleExpand = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Handle form submission
  const handleRequestConsultation = async () => {
    // VALIDATIONS
    if (!formData.propertyType)
      return Toast.show('Please select Property Type');

    if (!formData.numberOfAC || Number(formData.numberOfAC) <= 0)
      return Toast.show('Enter Number of Ac');

    // if (!formData.alternateNumber || Number(formData.alternateNumber) <= 0)
    //   return Toast.show('Enter valid Alternate Number');

    if (!formData.service) return Toast.show('Select your service');

    if (!formData.dateTime || formData.dateTime === 'Select')
      return Toast.show('Please select Time Slot');

    if (!selectdate) return Toast.show('Please select Date');
    if (!addressId?._id) {
      setModalUserVisible(true)

      return;
    }

    try {
      let documentUrl = '';

      // 1️⃣ If image selected → upload to S3
      // if (selectedImageUri) {
      //   const presRes = await getPresignedUrl();
      //   const presignedUrl = presRes?.data;

      //   if (!presignedUrl) {
      //     throw new Error('Presigned URL not received');
      //   }
      //   console.log('Image  selectedImage Uri Path:', selectedImageUri);
      //   await uploadImageToS3(presignedUrl, selectedImageUri);

      //   // clean S3 URL
      //   documentUrl = presignedUrl.split('?')[0];
      // }

      // 2️⃣ Build payload (addressId OPTIONAL)
      const payload = {
        user_id: formData.userId,
        addressId: addressId?._id,
        place: formData.propertyType,
        brandId: formData.brand,
        quantity: Number(formData.numberOfAC),
        alternatePhone: formData.alternateNumber,
        comment: formData.additionalNotes,
        slot: formData.dateTime === 'First Half' ? 'FIRST_HALF' : 'SECOND_HALF',
        date: selectdate,
        file: selectedImageUri,
        // documentURL: documentUrl,
      };
      if (addressId?._id) {
        payload.addressId = addressId._id;
      }

      // 3️⃣ API call
      const res = await postConsultancy(payload);
      // console.log('response of free  consultancy---', res)
      if (res?.status) {
        // Toast.show(res?.message);
        setSuccessPopupVisible(true);
      }
    } catch (error) {
      console.log('Error submitting:', error);
      Toast.show('Something went wrong');
    }
  };

  return (
    <View style={screenStyles.workcontainer}>
      <Header title="Free Consultation" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: hp(8) }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? hp(0) : 0}
        >
          <View
            style={{
              marginBottom: hp('10%'),
              paddingHorizontal: hp(1.5),
            }}
          >
            <View style={screenStyles.worksliderview}>
              <Image source={images.bannerOne} style={screenStyles.workimage} />
            </View>

            <AppText style={[screenStyles.workheadText, { marginBottom: hp(1) }]}>
              Get Free AC Consultation
            </AppText>

            {/* Property Type */}
            <CustomPicker
              label="Property Type"
              value={formData.propertyType}
              onChange={value => handleInputChange('propertyType', value)}
              items={[
                { label: 'Residential', value: 'Residential' },
                { label: 'Commercial', value: 'Commercial' },
                { label: 'Industrial', value: 'Industrial' },
              ]}
              width={isTablet ? wp(90) : wp(90)}
              height={isTablet ? hp(4.5) : hp(5)} // any height
              borderRadius={hp('4%')} // custom radius
            />

            {/* Brand */}
            <CustomPicker
              label="Brand"
              value={formData.brand}
              onChange={value => handleInputChange('brand', value)}
              items={brandArray}
              width={isTablet ? wp(90) : wp(90)}
              height={isTablet ? hp(4.5) : hp(5)} // any height
              borderRadius={hp('4%')} // custom radius
            />

            {/* Number of AC */}
            <CunstomInput
              label="Quantity (Number of AC)"
              placeholder="Enter number"
              keyboardType="phone-pad"
              value={formData.numberOfAC}
              // maxLength={2}
              onChangeText={value => handleInputChange('numberOfAC', value)}
              borderRadius={hp('14%')}
              MarginBottom={hp('0.5%')}
              MarginTop={hp('0.5%')}
              containerStyle={{ width: isTablet ? wp(90) : wp('88%') }}
              onSubmitEditing={() => Keyboard.dismiss()}
            />

            {/* Alternate Number */}
            <CunstomInput
              label="Alternate Mobile Number (Optional)"
              placeholder="Enter number"
              keyboardType="phone-pad"
              value={formData.alternateNumber}
              onChangeText={value =>
                handleInputChange('alternateNumber', value)
              }
              borderRadius={hp('14%')}
              MarginBottom={hp('0.5%')}
              MarginTop={hp('0.5%')}
              containerStyle={{ width: isTablet ? wp(90) : wp('88%') }}
              onSubmitEditing={() => Keyboard.dismiss()}
              maxLength={10}
            />

            {/* Select Service */}
            <CustomPicker
              label="Select Service"
              value={formData.service}
              onChange={value => handleInputChange('service', value)}
              items={[
                { label: 'Installation', value: 'Installation' },
                { label: 'Repair', value: 'Repair' },
                { label: 'Copper Piping', value: 'Copper Piping' },
                { label: 'New AC', value: 'New AC' },
              ]}
              mainViewwidth={isTablet ? wp(60) : wp('95%')} // any width
              height={hp('5%')} // any height
              borderRadius={hp('4%')} // custom radius
            />

            {/* Upload Photos */}
            <View style={styles.inputGroup}>
              <AppText style={styles.label}>Upload Photos</AppText>
              <TouchableOpacity
                onPress={() => setShowModal(true)}
                style={styles.uploadContainer}
              >
                {selectedImageUri ? (
                  <FastImage
                    source={selectedImageUri ? { uri: selectedImageUri } : null}
                    style={styles.imagePreview}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <>
                    <FastImage
                      source={images.Camera}
                      style={styles.customIcon}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <AppText style={styles.uploadText}>Add Photos/Video</AppText>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Select Date & Time */}
            <View style={styles.inputGroup}>
              <AppText style={styles.label}>Select Date & Time</AppText>
              <TouchableOpacity
                style={styles.pickerWrapper}
                onPress={() => setModalSlotVisible(true)}
              >
                <AppText
                  style={[{ flex: 1, marginLeft: wp(4) }, styles.uploadText]}
                >
                  {selectdate}
                </AppText>
                <FastImage
                  source={images.Calendar}
                  style={styles.customIcon}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>
            </View>

            {/* Additional Notes */}
            <CunstomInput
              label="Additional Notes (Optional)"
              placeholder="Type here..."
              multiline
              numberOfLines={5}
              value={formData.additionalNotes}
              onChangeText={val => handleInputChange('additionalNotes', val)}
              borderRadius={hp('1.5%')}
              MarginBottom={hp('1%')}
              containerStyle={{ width: isTablet ? wp(90) : wp('88%') }}
              onSubmitEditing={() => Keyboard.dismiss()}
            />

            <View style={[screenStyles.worksliderview]}>
              <Image
                source={images.bannerTwo}
                style={[screenStyles.workimage, { width: '90%' }]}
              />
            </View>

            <AppText style={[screenStyles.workheadText, { margin: hp('1%') }]}>
              FAQs
            </AppText>

            {/* FAQ Items */}
            {faqData.map((item, index) => (
              <View key={index} style={screenStyles.faqItem}>
                <TouchableOpacity
                  onPress={() => toggleExpand(index)}
                  style={screenStyles.faquestionContainer}
                >
                  <AppText style={screenStyles.faquestionText}>
                    {item.question}
                  </AppText>
                  <AppText style={screenStyles.faqarrow}>
                    {expandedIndex === index ? '︿' : '﹀'}
                  </AppText>
                </TouchableOpacity>
                {expandedIndex === index && (
                  <AppText style={screenStyles.faqanswerText}>{item.answer}</AppText>
                )}
              </View>
            ))}
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
      <View style={styles.BtnView}>
        <CustomButton
          buttonName="Request Consultation"
          margingTOP={hp('0%')}
          btnTextColor={COLORS.white}
          btnColor={COLORS.themeColor}
          onPress={handleRequestConsultation}
        />
      </View>
      {/* Present address */}
      <CustomModal
        visible={modalUserVisible}
        onClose={() => setModalUserVisible(false)}
        onProceed={() => {
          setModalUserVisible(false);
          // setTimeout(() => {
          //   setModalSlotVisible(true);
          // }, 300);
        }}
        // numberofAC={numberofAC}
        // setvalue={setNumberofAC}
        addAcStatus={true}
        fromScreen={'ViewCart'}
      // setSelectedAddress={setSelectedAddress}
      />

      {/* Booking Slot Modal */}
      <BookingSlotModal
        visible={modalSlotVisible}
        onClose={() => setModalSlotVisible(false)}
        setSelectedSlot={handleSlotSelection}
        onBookProcess={() => {
          setModalSlotVisible(false);
        }}
      />

      {/* Success Popup */}
      <SuccessPopupModal
        visible={successPopupVisible}
        onClose={() => {
          setSuccessPopupVisible(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Tab', params: { screen: 'Home' } }]
          });
        }}
        HeadText={'Successful...!'}
        firstButtonText="Done"
        message1={'Your Query has been successfully submitted.'}
        message2={'Our team will respond shortly.'}
      />

      <ImagePickerModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onImageSelect={uri => {
          console.log('Image Path:', uri);
          setSelectedImageUri('file://' + uri);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: hp('2%'),
    marginHorizontal: wp('2%'),
    width: isTablet ? wp(90) : wp('88%'),
    alignSelf: 'center',
  },
  label: {
    fontSize: hp(1.5),
    color: COLORS.black,
    marginBottom: hp('1%'),
    fontFamily: Fonts.regular,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: wp('9%'),
    borderWidth: hp(0.1),
    borderColor: COLORS.lightGray,
    overflow: 'hidden',
    height: hp('5%'),
  },
  customIcon: {
    width: wp('5%'),
    height: hp('4%'),
    marginHorizontal: hp(2),
  },
  textInput: {
    height: hp('5%'),
    backgroundColor: COLORS.white,
    borderRadius: wp('9%'),
    borderWidth: hp(0.1),
    borderColor: COLORS.lightGray,
    paddingHorizontal: wp('4%'),
    fontSize: hp('1.4%'),
    color: '#333',
  },
  uploadContainer: {
    height: hp('15%'),
    backgroundColor: '#eaf0f7ff',
    borderRadius: wp('3%'),
    borderWidth: hp(0.2),
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  imagePreview: {
    height: hp('15%'),
    width: wp('90%'),
    resizeMode: 'cover',
    borderRadius: wp('3%'),
    zIndex: 9999,
  },
  uploadText: {
    fontSize: hp('1.5%'),
    color: '#666',
  },

  BtnView: {
    width: '100%',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2.5),
    backgroundColor: COLORS.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default FreeConsultant;
