import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  Image,
} from 'react-native';
import Header from '../../components/Header';
import Homestyles from '../Home/HomeScreenStyles';
import images from '../../assets/images';
import FastImage from 'react-native-fast-image';
import CustomButton from '../../components/CustomButton';
import { COLORS } from '../../utils/colors';
import CustomPhoneInput from '../../components/CustomPhoneInput';
import CustomPicker from '../../components/CustomPicker';
import ImagePickerModal from '../../components/ImagePickerModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CunstomInput from '../../components/CunstomInput';
import Toast from 'react-native-simple-toast';
import {
  getPresignedUrl,
  getUserDeatil,
  getUserProfile,
  updateUserProfile,
  uploadImageToS3,
} from '../../api/profileApi';
import { isTablet } from '../../components/TabletResponsiveSize';
import { setUser } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { store } from '../../redux/store';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from '../../components/AppText';

const ProfileDetail = ({ navigation }) => {
  const dispatch = useDispatch();
  const userId = store?.getState()?.auth?.user;
  const [countryCode, setCountryCode] = useState('IN');
  const [callingCode, setCallingCode] = useState('+91');
  const [phoneNumber, setphoneNumber] = useState('');
  const [userName, setuserName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');
  const [showModal, setShowModal] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (userId?._id) {
        fetchProfile();
      }
    }, [userId?._id])
  );

  // get profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile(userId?._id);
      if (res?.status || res?.success) {
        const data = res.data;
        console.log('Profile data----', data)
        setCallingCode(data?.countryCode);
        setuserName(data?.name);
        setphoneNumber(data?.phoneNumber);
        setEmail(data?.email);
        setGender(data?.gender);
        setSelectedImageUri(
          data?.profilePhoto
            ? `${data.profilePhoto}?t=${new Date().getTime()}`
            : ''
        );
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // update profile api
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Name Validation
      if (!userName?.trim()) {
        Toast.show('Please enter your name');
        setLoading(false);
        return;
      }
      if (!userId?._id) {
        Toast.show("User ID not found");
        setLoading(false);
        return;
      }


      let cleanImageUrl = "";
      if (selectedImageUri) {
        const fileName = selectedImageUri.split('/').pop();
        const fileType = selectedFileType || 'image/jpeg';
        const presRes = await getPresignedUrl(fileName, fileType);
        const presignedUrl = presRes?.data;

        if (presignedUrl) {
          const fileType = selectedFileType || 'image/jpeg';
          const uploadRes = await uploadImageToS3(presignedUrl, selectedImageUri, fileType);
          cleanImageUrl = uploadRes?.url?.split('?')[0];
        }
      }

      const body = {
        userId: String(userId?._id),
        userName: String(userName),
        email: email || null,
        gender: gender || null,
        profilePhotoUrl: cleanImageUrl || "" || null,
      };
      const res = await updateUserProfile(body);
      if (res?.status || res?.success) {
        Toast.show('Profile updated successfully');
        await refreshUserDetails();
        navigation.goBack();
      }
    } catch (error) {
      const errorMessage =
        error?.res?.data?.message ||
        error?.message ||
        'Something went wrong';
      Toast.show(String(errorMessage));
    } finally {
      setLoading(false);
    }
  };


  const refreshUserDetails = async () => {
    try {
      setLoading(true);
      const response = await getUserDeatil(userId?._id)
      console.log('User Detail Response--->', response);
      if (response?.status) {
        await AsyncStorage.setItem('UserName', response?.data?.name);

        dispatch(setUser({ user: response?.data }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={Homestyles.workcontainer}>
      <Header title="Profile Detail" onBack={() => navigation.goBack()} />

      {loading ? (
        <AppText style={{ textAlign: 'center', marginTop: 20 }}>Loading...</AppText>
      ) : (
        <>
          <ScrollView
            style={Homestyles.workscrollstyle}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              activeOpacity={6}
              onPress={() => setShowModal(true)}
            >
              <ImageBackground
                source={
                  selectedImageUri
                    ? { uri: selectedImageUri }
                    : images.userProfile
                }
                imageStyle={Homestyles.profilestyle}
                style={Homestyles.profileDetailBg}
              >
                <Image
                  source={images.profileCamera}
                  style={Homestyles.cameraStyle}
                />
              </ImageBackground>
            </TouchableOpacity>

            {/* User Name */}
            <CunstomInput
              label="User Name"
              placeholder="User Name"
              keyboardType="default"
              placeholderTextColor={COLORS.textColor}
              value={userName}
              onChangeText={txt => setuserName(txt)}
              borderRadius={hp('14%')}
              MarginBottom={hp('0.5%')}
              MarginTop={isTablet ? hp(8) : hp(5)}
              onSubmitEditing={() => Keyboard.dismiss()}
            />

            {/* Mobile Number */}
            <View style={Homestyles.profileDetailInfoContainer}>
              <AppText style={Homestyles.profileDetailName}>Mobile Number</AppText>
              <CustomPhoneInput
                countryCode={countryCode}
                callingCode={callingCode}
                setCountryCode={setCountryCode}
                setCallingCode={setCallingCode}
                phoneNumber={phoneNumber}
                setPhoneNumber={val => {
                  setphoneNumber(val);
                }}
              />
            </View>

            {/* Email Address */}
            <CunstomInput
              label="Email Address"
              placeholder="Enter Email"
              keyboardType="email-address"
              value={email}
              onChangeText={txt => setEmail(txt)}
              borderRadius={hp('14%')}
              MarginBottom={hp('1%')}
              MarginTop={isTablet ? hp(3) : hp(2)}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            {/* Gender */}
            <CustomPicker
              label="Gender"
              value={gender}
              onChange={value => setGender(value)}
              items={[
                { label: 'MALE', value: 'MALE' },
                { label: 'FEMALE', value: 'FEMALE' },
                { label: 'OTHER', value: 'OTHER' },
              ]}
              width={wp(95)}
              height={hp('5%')}
              borderRadius={hp('4%')}
            />
          </ScrollView>
        </>
      )}

      <View style={[Homestyles.servicesSection, { minHeight: hp(8) }]}>
        <CustomButton
          buttonName="Update"
          margingTOP={hp('0%')}
          btnTextColor={COLORS.white}
          btnColor={COLORS.themeColor}
          onPress={handleUpdateProfile}
        />
      </View>
      <ImagePickerModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onImageSelect={(uri, mime) => {
          console.log('Image Path:', uri, mime);
          setSelectedImageUri(uri);
          setSelectedFileType(mime);
        }}
      />
    </View>
  );
};

export default ProfileDetail;
const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.themeColor,
    marginRight: 10,
    marginTop: 7,
  },
});
