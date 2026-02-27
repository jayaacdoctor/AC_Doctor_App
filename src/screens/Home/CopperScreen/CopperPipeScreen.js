import React, { useState, useEffect } from 'react';
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
  FlatList,
  Keyboard,
} from 'react-native';
import Header from '../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../../utils/colors';
import images from '../../../assets/images';
import FastImage from 'react-native-fast-image';
import screenStyles, { faqData } from '../HomeScreenStyles';
import CustomButton from '../../../components/CustomButton';
import BookingSlotModal from '../../../customScreen/BookingSlotModal';
import SuccessPopupModal from '../../../customScreen/SuccessPopupModal';
import ACTypeSelector from '../../../customScreen/ACTypeSelector';
import MultipleUploadPhotos from '../../../components/MultipleUploadPhotos';
import HomeScreenStyles, { works } from '../HomeScreenStyles';
import PropertySelectionModal from '../../../customScreen/PropertySelectionModal';
import OutdoorSelectionModal from '../../../customScreen/OutdoorSelectionModal';
import PickerLabelUi from '../../../components/PickerLabelUi';
import CunstomInput from '../../../components/CunstomInput';
import { isTablet } from '../../../components/TabletResponsiveSize';
import AppText from '../../../components/AppText';

const CopperPipeScreen = ({ navigation }) => {
  const [modalSlotVisible, setModalSlotVisible] = useState(false); //booktime
  const [selectdate, setSelectDate] = useState('Select date');
  const [successPopupVisible, setSuccessPopupVisible] = useState(false); // successPopup
  const [propertyModalVisible, setPropertyModalVisible] = useState(false); // prpertyPopup
  const [selectedProperty, setSelectedProperty] = useState('');
  const [outLocationModalVisible, setOutLocationModalVisible] = useState(false); // prpertyPopup
  const [selectOutDoor, setSelectedOutDoor] = useState('');

  const [formData, setFormData] = useState({
    propertyType: selectedProperty,
    acTypes: '',
    orderLocation: selectOutDoor,
    pipeNumber: '',
    dateTime: selectdate,
    additionalNotes: '',
    uploadedPhotos: [],
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Sync states with formData
  useEffect(() => {
    handleInputChange('propertyType', selectedProperty);
  }, [selectedProperty]);

  useEffect(() => {
    handleInputChange('orderLocation', selectOutDoor);
  }, [selectOutDoor]);

  useEffect(() => {
    handleInputChange('dateTime', selectdate);
  }, [selectdate]);

  // Function to handle slot selection
  const handleSlotSelection = slot => {
    if (slot) {
      const { date, monthNumber, year, time, Timeslot } = slot;
      const formattedDate = `${String(date).padStart(2, '0')}/${String(
        monthNumber,
      ).padStart(2, '0')}/${year}`;
      const formattedTime =
        time === 'morning' || time === 'firstHalf' ? 'First Half' : Timeslot;
      const formattedDateTime = `${formattedDate}, ${formattedTime}`; // e.g., "10/03/2025, First Half"
      setSelectDate(formattedDateTime);
      handleInputChange('dateTime', formattedDateTime);
    }
  };

  const handleSelectProperty = type => {
    setSelectedProperty(type);
  };
  const handleSelectOutdoor = type => {
    setSelectedOutDoor(type);
  };
  // Handle form submission
  const handleRequestConsultation = () => {
    setSuccessPopupVisible(true);
  };

  return (
    <View style={screenStyles.workcontainer}>
      <Header
        title="Copper Piping"
        onBack={() => navigation.goBack()}
        onHelp={true}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          style={screenStyles.workscrollstyle}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: hp('10%') }}>
            <View style={screenStyles.worksliderview}>
              <Image
                source={images.BannerFive}
                style={screenStyles.workimage}
              />
            </View>

            <AppText style={[screenStyles.workheadText]}>
              Fill Copper Piping details
            </AppText>

            <View style={styles.FromStyle}>
              {/* Property Type */}
              <PickerLabelUi
                label="Property Type"
                value={selectedProperty || 'Select Property'}
                placeholder="Select Property'"
                droparraw={true}
                BorderRadius={hp(4)}
                onPress={() => setPropertyModalVisible(true)}
                style={{ width: isTablet ? wp(90) : wp(90) }}
              />

              {/* Type of AC */}
              <ACTypeSelector
                onChange={value => handleInputChange('acTypes', value)}
                headingText={'Tye of AC'}
                ShapeRADIUS={hp(3)}
              />
              {/* Outdoor Condenser Location*/}
              <PickerLabelUi
                label="Outdoor Condenser Location"
                value={selectOutDoor || 'Select the Outdoor'}
                placeholder="Select the Outdoor"
                droparraw={true}
                marginTop={hp(1)}
                BorderRadius={hp(4)}
                style={{ width: isTablet ? wp(90) : wp(90) }}
                onPress={() => setOutLocationModalVisible(true)}
              />

              {/* Pipe Run Length */}
              <View style={styles.inputGroup}>
                <AppText style={styles.label}>
                  Pipe Run Length{' '}
                  <AppText style={styles.labelInput}>(Optional)</AppText>
                </AppText>
              </View>
              <CunstomInput
                placeholder="Enter number of length"
                keyboardType="name-phone-pad"
                value={formData.pipeNumber}
                onChangeText={value => handleInputChange('pipeNumber', value)}
                borderRadius={hp('14%')}
                MarginBottom={hp('0.5%')}
                containerStyle={{ width: wp('88%') }}
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              {/* Upload Photos */}
              <MultipleUploadPhotos
                onChange={value => handleInputChange('uploadedPhotos', value)}
              />

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
                lablestyle={{ marginLeft: isTablet ? wp(2.5) : wp(3) }}
                placeholder="Type here..."
                multiline
                numberOfLines={5}
                value={formData.additionalNotes}
                onChangeText={val => handleInputChange('additionalNotes', val)}
                borderRadius={hp('1.5%')}
                MarginTop={hp('1%')}
                containerStyle={{ width: isTablet ? wp(90) : wp(90) }}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            {/* How it works? */}
            <View
              style={[HomeScreenStyles.workitem, { marginBottom: hp('10%') }]}
            >
              <AppText style={HomeScreenStyles.utititle}>How it works?</AppText>
              <View style={HomeScreenStyles.workContain}>
                <FlatList
                  data={works}
                  keyExtractor={(_, index) => `work-${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={HomeScreenStyles.workoption}
                      onPress={item.action}
                    >
                      <FastImage
                        source={item.icon}
                        style={HomeScreenStyles.workicon}
                      />
                      <AppText
                        style={[
                          HomeScreenStyles.utilabel,
                          { color: COLORS.white },
                        ]}
                      >
                        {item.text}
                      </AppText>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.BtnView}>
        <CustomButton
          buttonName="Submit"
          margingTOP={hp('0%')}
          btnTextColor={COLORS.white}
          btnColor={COLORS.themeColor}
          onPress={handleRequestConsultation}
        />
      </View>
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
          setSuccessPopupVisible(false), navigation.navigate('RequestDetail');
        }}
        HeadText="Wooohoo!"
        message1="Your request has been submitted."
        message2="Our team will connect with for further process."
        buttonCount={2}
        secondButtonText="Done"
        firstButtonText="View Request"
        onSecondButtonPress={() => setSuccessPopupVisible(false)}
      />

      <PropertySelectionModal
        visible={propertyModalVisible}
        onClose={() => setPropertyModalVisible(false)}
        onSelect={handleSelectProperty}
      />

      <OutdoorSelectionModal
        visible={outLocationModalVisible}
        onClose={() => setOutLocationModalVisible(false)}
        onSelect={handleSelectOutdoor}
      />
      {/* </KeyboardAvoidingView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginTop: hp('1%'),
    marginHorizontal: wp('2%'),
  },
  label: {
    fontSize: hp('1.5%'),
    color: COLORS.black,
    marginBottom: hp('1.5%'),
    fontFamily: Fonts.semiBold,
  },
  labelInput: {
    flex: 1,
    fontSize: hp('1.5%'),
    color: '#969494ff',
    marginLeft: hp('1%'),
    fontFamily: Fonts.medium,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp('9%'),
    borderWidth: hp(0.1),
    borderColor: '#ddd',
    overflow: 'hidden',
    height: hp('5%'),
  },
  customIcon: {
    width: wp('5%'),
    height: hp('4%'),
    marginHorizontal: hp(2),
  },
  FromStyle: {
    backgroundColor: COLORS.white,
    borderRadius: wp('4%'),
    paddingVertical: wp('4%'),
    paddingHorizontal: wp('1%'),
    marginBottom: hp('2%'),
  },
  textInput: {
    height: hp('5%'),
    backgroundColor: COLORS.white,
    borderRadius: wp('9%'),
    borderWidth: hp(0.1),
    borderColor: '#ddd',
    paddingHorizontal: wp('4%'),
    fontSize: hp('1.4%'),
    color: '#333',
  },
  textInputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp('9%'),
    borderWidth: hp(0.1),
    borderColor: '#ddd',
    height: hp('5%'),
  },
  textInputInner: {
    flex: 1,
    fontSize: hp('1.6%'),
    color: COLORS.inputColour,
    paddingHorizontal: wp('4%'),
  },
  uploadContainer: {
    height: hp('10%'),
    backgroundColor: '#eaf0f7ff',
    borderRadius: wp('3%'),
    borderWidth: hp(0.2),
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: hp('1.5%'),
    color: '#666',
  },
  notesInput: {
    height: hp('15%'),
    textAlignVertical: 'top',
    paddingTop: hp('1.5%'),
    borderRadius: wp('3%'),
  },
  BtnView: {
    width: '100%',
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
    backgroundColor: COLORS.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: wp('90%'),
    height: hp('4.5%'),
    fontSize: hp('1.6%'),
    color: '#333',
    fontFamily: Fonts.medium,
    paddingVertical: Platform.OS === 'ios' ? hp('1%') : 0,
    paddingHorizontal: wp('4%'),
  },
  inputAndroid: {
    width: wp('90%'),
    height: hp('4.5%'),
    fontSize: hp('1.8%'),
    color: '#333',
    fontFamily: Fonts.bold,
    paddingHorizontal: wp('4%'),
  },
  iconContainer: {
    top: hp('0.5%'),
    right: wp('2%'),
  },
});

export default CopperPipeScreen;
