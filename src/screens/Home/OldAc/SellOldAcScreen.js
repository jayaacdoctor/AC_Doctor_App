import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
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
import MultipleUploadPhotos from '../../../components/MultipleUploadPhotos';
import ACTonnageModal from '../../../customScreen/ACTonnageModal';
import TonnageModal from '../../../customScreen/TonnageModal';
import AgeofAcModal from '../../../customScreen/AgeofAcModal';
import ConditionModal from '../../../customScreen/ConditionModal';
import CustomModal from '../../../components/CustomModal';
import PickerLabelUi from '../../../components/PickerLabelUi';
import CunstomInput from '../../../components/CunstomInput';
import WorkInfo from '../../../customScreen/WorkInfo';
import { isTablet } from '../../../components/TabletResponsiveSize';
import { store } from '../../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { postOldAcRequest } from '../../../api/homeApi';
import AppText from '../../../components/AppText';
import { getPresignedUrl, uploadImageToS3 } from '../../../api/profileApi';


const SellOldAcScreen = ({ navigation }) => {
  const defaultAcTypes = [
    { name: 'Bad' },
    { name: 'Average' },
    { name: 'Good' },
    { name: 'Very Good' },
    { name: 'Working' },
    { name: 'Non-working' },
  ];
  const defaultInverter = [{ name: 'Inverter' }, { name: 'Non-Inverter' }];
  const MAX_AC_LIMIT = 5;

  const [formData, setFormData] = useState({
    brand: '',
    acType: '',
    tonnage: '',
    ageOfAc: '',
    condition: '',
    technology: '',
    modelName: '',
    photos: [],
    dateTime: '',
    slotTime: '',
  });

  const [allAcList, setAllAcList] = useState([]);
  const [showAddMorePopup, setShowAddMorePopup] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const [modalSlotVisible, setModalSlotVisible] = useState(false); //booktime
  const [selectdate, setSelectDate] = useState('Select date');
  const [successPopupVisible, setSuccessPopupVisible] = useState(false); //successPopup
  const [AcTonageModalVisible, setAcTonageModalVisible] = useState(false);
  const [selectedAcTonage, setSelectedAcTonage] = useState('');
  const [TonageModalVisible, setTonageModalVisible] = useState(false);
  const [selectedTonage, setSelectedTonage] = useState('');
  const [ConditionModalVisible, setConditionModalVisible] = useState(false);
  const [InverterVisible, setInverterVisible] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [AgeofAcModalVisible, setAgeofAcModalVisible] = useState(false);
  const [selectAgeofAc, setSelectedAgeofAc] = useState('');
  const [selectedBrands, setSelectedBrands] = useState('');
  const [selectNumberAC, setSelectNumberAC] = useState('');
  const [addAcStatus, setAddAcStatus] = useState(true);
  const [selectAddress, setSelectedAddress] = useState(null);
  const userData = store?.getState()?.auth?.user;
  const [createdEnquiryId, setCreatedEnquiryId] = useState(null);
  const [allOldAcDetails, setAllOldAcDetails] = useState([]); //multiple ACs store
  const [showAddMoreOption, setShowAddMoreOption] = useState(false); //show Add Another AC option


  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };



  // Selected brand list
  useFocusEffect(
    useCallback(() => {
      const getBrand = async () => {
        const brand = await AsyncStorage.getItem('selectedBrand');
        if (brand) {
          setSelectedBrands(brand);
          handleChange('brand', brand);
        }
      };
      getBrand();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        AsyncStorage.removeItem('selectedBrand');
      };
    }, []),
  );

  useEffect(() => {
    console.log("Parent uploadedPhotos:", formData.uploadedPhotos);
  }, [formData.uploadedPhotos]);

  const handleContinue = () => {
    setShowAddMorePopup(false);
    setModalVisible(true);
  };



  // handle goback and clear brand from async storage
  const handelGoBack = async () => {
    try {
      await AsyncStorage.setItem('selectedBrand', '');
    } catch (error) {
      console.error('Error saving brand:', error);
    }
    navigation.goBack();
  };

  // time slot selection
  const handleSlotSelection = (slot) => {
    if (!slot) return;

    const { date, monthNumber, year, time, Timeslot } = slot;

    // ✅ Backend format: YYYY-MM-DD
    const formattedDate = `${year}-${String(monthNumber).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

    // ✅ Backend slot format
    const formattedSlot =
      time === 'morning' || time === 'firstHalf'
        ? 'FIRST_HALF'
        : 'SECOND_HALF';

    handleChange('dateTime', formattedDate);
    handleChange('slotTime', formattedSlot);
  };


  // add ac
  const handleAddAnotherAc = () => {
    setAllAcList(prev => [
      ...prev,
      { ...formData, photos: [...formData.uploadedPhotos] }
    ]);


    // 👇 Full reset
    setFormData({
      brand: '',
      acType: '',
      tonnage: '',
      ageOfAc: '',
      condition: '',
      technology: '',
      modelName: '',
      photos: [],
      dateTime: '',
      slotTime: ''
    });
    setShowAddMorePopup(false);
  };

  // handle confirm btn
  const handleConfirmClick = () => {
    const { brand, acType, tonnage, ageOfAc, condition, technology, dateTime } =
      formData;

    const requiredFields = [
      brand,
      acType,
      tonnage,
      ageOfAc,
      condition,
      technology,
    ];

    if (requiredFields.some(field => !field || field.trim() === "")) {
      Alert.alert("Validation", "Please fill all AC details first.");
      return;
    }

    if (!dateTime || !dateTime) {
      Alert.alert("Validation", "Please select inspection date & time.");
      return;
    }

    if (allAcList.length >= MAX_AC_LIMIT - 1) {
      setModalVisible(true); // directly open address
    } else {
      setShowAddMorePopup(true);
    }
  };

  //After the address selecting call api
  const handleAddressSelect = selectedAddress => {
    setSelectedAddress(selectedAddress);   // ✅ store address
    setModalVisible(false);

    setTimeout(() => {
      handleRequestConsultation(selectedAddress); // pass directly
    }, 300);
  };

  const uploadPhotosToS3 = async (photos = []) => {
    const uploadedUrls = [];

    for (let photo of photos) {
      if (!photo?.uri) continue;

      const fileName =
        photo?.filename || photo.uri.split('/').pop();

      const fileType =
        photo?.mime || 'image/jpeg';

      try {
        const presRes = await getPresignedUrl(fileName, fileType);
        const presignedUrl = presRes?.data;

        if (presignedUrl) {
          const uploadRes = await uploadImageToS3(
            presignedUrl,
            photo.uri,
            fileType
          );

          const cleanUrl = uploadRes?.url?.split('?')[0];

          if (cleanUrl) {
            uploadedUrls.push(cleanUrl);
          }
        }
      } catch (err) {
        console.log('Upload error:', err);
      }
    }

    return uploadedUrls;
  };
  // continue btn
  const handleRequestConsultation = async (selectedAddress) => {
    try {
      setLoading(true);

      // 🔥 Upload current AC photos
      const currentUploadedPhotos = await uploadPhotosToS3(
        formData.uploadedPhotos
      );

      // 🔥 Upload photos for multiple ACs (if any)
      const updatedAllAcList = await Promise.all(
        allAcList.map(async (ac) => {
          const uploaded = await uploadPhotosToS3(ac.uploadedPhotos || []);
          return {
            ...ac,
            photos: uploaded,
          };
        })
      );

      const finalAcData = [
        ...updatedAllAcList,
        {
          ...formData,
          photos: currentUploadedPhotos,
        },
      ];

      const payload = {
        user_id: userData?._id,
        name: userData?.name,
        addressId: selectedAddress,
        date: formData.dateTime,
        slot: formData.slotTime,
        type: 'QUOTE_REQUEST',
        subType: 'OLD_AC',
        oldAcDetails: finalAcData,
      };

      console.log("Submitting Payload:", payload);

      const response = await postOldAcRequest(payload);
      console.log(" oldAcDetails Payload:", response.data);

      setCreatedEnquiryId(response?.data?.enquiry?._id)
      if (response?.status) {
        setSuccessPopupVisible(true);

        // ✅ Reset form
        setFormData({
          brand: '',
          acType: '',
          tonnage: '',
          ageOfAc: '',
          condition: '',
          technology: '',
          modelName: '',
          photos: [],
          dateTime: '',
          slotTime: '',
        });

        setAllAcList([]);
        setSelectDate('Select date');
      }

    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={screenStyles.workcontainer}>
      <Header title="Old AC" onBack={() => handelGoBack()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 120,
            paddingHorizontal: 16,
          }}
          keyboardShouldPersistTaps="handled"
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
              Fill your AC details
            </AppText>

            <View style={styles.FromStyle}>
              {/* Brand */}
              <PickerLabelUi
                label="Brand"
                value={formData.brand || "Select Brand"}
                placeholder="Select Brand"
                droparraw={true}
                onPress={() => {
                  setFormData(prev => ({
                    ...prev,
                    brand: "Daikin"
                  }));
                  navigation.navigate('BrandScreen', {
                    from: 'SellOldAcScreen',
                  })
                }
                }
                style={{ width: '100%' }}
                BorderRadius={hp(4)}
              />

              {/* Modal */}
              <CunstomInput
                value={formData.modelName}
                onChangeText={val => handleChange('modelName', val)}
                label="Model (Optional)"
                placeholder="LGUS-Q19YNZE"
                borderRadius={hp('2.5%')}
                MarginTop={hp('2.5%')}
                containerStyle={{ width: isTablet ? wp('92%') : wp('90%') }}
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              {/* Type of AC */}
              <PickerLabelUi
                label="AC Type"
                value={formData.acType || "Select Type"}
                placeholder="Select AC"
                droparraw={true}
                marginTop={hp('2.5%')}
                style={{ width: '100%' }}
                onPress={() => setAcTonageModalVisible(true)}
                BorderRadius={hp(4)}
              />

              {/* Tonnage */}
              <PickerLabelUi
                label="Tonnage"
                value={formData.tonnage || "Select Tonnage"}
                placeholder="Select Tonnage"
                droparraw={true}
                marginTop={hp('2.5%')}
                style={{ width: '100%' }}
                onPress={() => setTonageModalVisible(true)}
                BorderRadius={hp(4)}
              />

              {/* Age of Ac*/}
              <View style={[styles.twoColumnRow]}>
                <PickerLabelUi
                  label="Age of AC"
                  value={formData.ageOfAc || "Select Years"}
                  placeholder="Select Years"
                  style={{ flex: 1, marginRight: wp(6) }}
                  marginTop={hp('2.5%')}
                  onPress={() => setAgeofAcModalVisible(true)}
                  BorderRadius={hp(4)}
                />
                <PickerLabelUi
                  label="AC Condition"
                  value={formData.condition || "Select Condition"}
                  placeholder="Select Condition"
                  style={{ flex: 1 }}
                  marginTop={hp('2.5%')}
                  onPress={() => setConditionModalVisible(true)}
                  BorderRadius={hp(4)}
                />
              </View>

              {/* Ac Technologes */}
              <PickerLabelUi
                label="AC Technology"
                value={formData.technology || "Select Technology"}
                placeholder="Select Technology"
                droparraw={true}
                marginTop={hp('2.5%')}
                marginBottom={hp('1.8%')}
                style={{ width: '100%' }}
                onPress={() => {
                  setInverterVisible(true);
                }}
                BorderRadius={hp(4)}
              />

              {/* Upload Photos */}
              <MultipleUploadPhotos
                imagesData={formData.uploadedPhotos}
                onChange={value => handleChange('uploadedPhotos', value)}
                OptionalText="(Front & Back of AC, and its Serial Number)"
              />


              {/* Select Date & Time */}
              <View style={styles.inputGroup}>
                <AppText style={styles.label}>
                  Preferred Inspection Date & Time
                </AppText>
                <TouchableOpacity
                  style={styles.pickerWrapper}
                  onPress={() => {
                    setModalSlotVisible(true);
                  }}
                >
                  <AppText
                    style={[{ flex: 1, marginLeft: wp(4) }, styles.uploadText]}
                  >
                    {formData.dateTime || "Select Date & Time"}
                  </AppText>
                  <Image
                    source={images.Calendar}
                    style={styles.customIcon}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              </View>



              <TouchableOpacity
                style={styles.RowView}
                onPress={() => {
                  setModalVisible(true);
                  setAddAcStatus(false);
                }}
              >
                <AppText style={[styles.labelInput]}>Bulk Add ↑</AppText>
              </TouchableOpacity>
              <AppText
                style={[
                  styles.labelInput,
                  {
                    fontSize: hp(1.5),
                    marginVertical: wp(2),
                    width: wp(88),
                    alignSelf: 'center',
                  },
                ]}
              >
                Note: You can add up to 5 ACs manually. If you have more than 5
                ACs, please use Bulk Add option for a faster process.
              </AppText>
            </View>

            <WorkInfo Homwork={false} needHelp={false} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Confirm Button */}
      <View style={styles.BtnView}>
        <CustomButton
          buttonName={loading ? "Submitting..." : "Continue"}
          margingTOP={hp(0)}
          btnTextColor={COLORS.white}
          btnColor={COLORS.themeColor}
          onPress={() => handleConfirmClick()}
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
        HeadText="Wooohoo!"
        message1="Your bulk AC request has been submitted successfully!"
        message2="Our team will inspect and contact you soon."
        buttonCount={2}
        firstButtonText="View Request"
        secondButtonText="Done"
        HeadTextColor={COLORS.black}
        onSecondButtonPress={() => {
          setSuccessPopupVisible(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Tab', params: { screen: 'Home' } }],
          });
        }}
        onClose={() => {
          setSuccessPopupVisible(false);
          navigation.navigate('OldACRequest', {
            CreatedenquiryId: createdEnquiryId,
          });
        }}
      />

      {/* add AC and contine */}
      <SuccessPopupModal
        visible={showAddMorePopup}
        HeadText="Multiple ACs to Sell?"
        message1="Planning to sell more than one air conditioner? Add another now to list them together."
        firstButtonText="Add Another AC"
        secondButtonText="Continue"
        buttonCount={2}
        HeadTextColor={COLORS.black}
        onSecondButtonPress={handleContinue}
        onClose={handleAddAnotherAc}
      />

      <ACTonnageModal
        visible={AcTonageModalVisible}
        onClose={() => setAcTonageModalVisible(false)}
        onSelect={value => {
          handleChange('acType', value);
          setAcTonageModalVisible(false);
        }}
      />

      <TonnageModal
        visible={TonageModalVisible}
        onClose={() => setTonageModalVisible(false)}
        onSelect={value => {
          handleChange('tonnage', value);
          setTonageModalVisible(false);
        }}
      />

      <AgeofAcModal
        visible={AgeofAcModalVisible}
        onClose={() => setAgeofAcModalVisible(false)}
        onSelect={value => {
          setSelectedAgeofAc(value);
          setFormData(prev => ({ ...prev, ageOfAc: value }));
          setAgeofAcModalVisible(false);
        }}
      />

      <ConditionModal
        visible={ConditionModalVisible}
        onClose={() => setConditionModalVisible(false)}
        onSelect={value => {
          setSelectedCondition(value);
          setFormData(prev => ({ ...prev, condition: value }));
          setConditionModalVisible(false);
        }}
        data={defaultAcTypes}
        title="Select Condition of AC"
      />

      <ConditionModal
        visible={InverterVisible}
        onClose={() => setInverterVisible(false)}
        onSelect={value => {
          setFormData(prev => ({ ...prev, technology: value }));
          setInverterVisible(false);
        }}
        data={defaultInverter}
        title="Select AC Type"
      />

      <CustomModal
        numberofAC={selectNumberAC}
        addAcStatus={addAcStatus}
        handleInputChange={handleChange}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        setSelectedAddress={setSelectedAddress}
        onProceed={selectedAddress => {
          handleAddressSelect(selectedAddress._id);
        }}
        setNumberofAC={setSelectNumberAC}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginTop: hp('1%'),
    marginHorizontal: wp('2%'),
  },
  label: {
    fontSize: hp('1.6%'),
    color: COLORS.black,
    marginBottom: hp('1.5%'),
    fontFamily: Fonts.semiBold,
  },
  labelInput: {
    fontSize: hp('1.6%'),
    color: '#585656ff',
    fontFamily: Fonts.medium,
  },
  AddAcBtn: {
    fontSize: hp('1.7%'),
    color: COLORS.white,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    borderRadius: wp('9%'),
    borderWidth: hp(0.1),
    borderColor: '#ddd',
    overflow: 'hidden',
    height: hp('5%'),
    width: wp(88),
    alignSelf: 'center',
  },

  customIcon: {
    width: wp('5%'),
    height: hp('4%'),
    marginHorizontal: hp(2),
  },
  FromStyle: {
    backgroundColor: 'white',
    borderRadius: wp('4%'),
    paddingVertical: wp('4%'),
    paddingHorizontal: wp('1%'),
    marginBottom: hp('2%'),
    alignSelf: 'center',
    width: '100%',
    // alignSelf: 'center',
  },

  uploadText: {
    fontSize: hp('1.8%'),
    color: '#666',
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
  BtnViewStyle: {
    marginTop: hp(2),
    borderRadius: wp(6),
    paddingVertical: hp(1.8),
    backgroundColor: COLORS.themeColor,
  },
  twoColumnRow: {
    flexDirection: 'row',
    width: '97%',
    alignSelf: 'center',
    marginTop: hp(1),
  },
  RowView: {
    width: '100%',
    marginTop: hp(2),
    // paddingHorizontal: wp(1),
    alignSelf: 'center',
  },
});
export default SellOldAcScreen;
