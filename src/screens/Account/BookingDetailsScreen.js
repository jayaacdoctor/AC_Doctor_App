import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getBookingDetail } from '../../api/settingApi';
import Header from '../../components/Header';
import { COLORS, Fonts } from '../../utils/colors';
import CustomLoader from '../../components/CustomLoader';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../components/AppText';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';

const BookingDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const bookingData = route?.params?.bookingId;
  // console.log('bookingId---', bookingData)
  const [loading, setLoading] = useState(false);
  const [detailsData, setdetailsData] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getBrandList()
  }, [bookingData])

  const getBrandList = async () => {
    try {
      setLoading(true);
      const res = await getBookingDetail(bookingData);
      console.log('get data --->', res);
      // ✅ FIX HERE
      if (res?.success) {
        setdetailsData(res?.data);
      }
    } catch (error) {
      console.log('Booking Error:', error);
    } finally {
      setLoading(false);
    }
  };

  //  download pdf
  const downloadInvoice = async (url, bookingId) => {
    try {
      if (Platform.OS === 'android') {
        // Permission is only needed for Android 10 (API 29) and below
        if (Number(Platform.Version) < 30) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Permission Denied", "Storage access is required on your version of Android.");
            return;
          }
        }
      }

      const { dirs } = ReactNativeBlobUtil.fs;
      console.log('Download URL:', url);
      const fileName = `Invoice_${String(bookingId)}.pdf`;
      const filePath = `${dirs.DownloadDir}/${fileName}`;

      // 2. Download Logic
      ReactNativeBlobUtil.config({
        fileCache: false,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'Downloading Invoice...',
          mime: 'application/pdf',
          title: fileName,
          mediaScannable: true,
          storeInDownloads: true,
        },
      })
        .fetch('GET', url)
        .then((res) => {
          if (Platform.OS === 'ios') {
            Share.open({ url: `file://${res.path()}`, type: 'application/pdf' });
          } else {
            Toast.showWithGravity(
              'Download Complete, Invoice downloaded to your Downloads folder.',
              Toast.CENTER,
              Toast.TOP,
            );
          }
        })
        .catch((err) => {
          console.log("Download error:", err);
          Toast.show("Error", "Failed to download invoice.");
        });
    } catch (error) {
      Toast.show("Permission error:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <CustomLoader size="large" />
      </View>
    );
  }

  // render
  return (
    <View style={styles.container}>
      <Header title="Booking Details" onBack={() => navigation.goBack()} />
      {loading ? (
        <CustomLoader size="large" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollcontain}>
          <AppText style={styles.heading}>Booking Details</AppText>

          {/* Booking ID */}
          <View style={styles.section}>
            <AppText style={styles.label}>Booking ID:</AppText>
            <AppText style={styles.value}>{detailsData?.bookingId}</AppText>
          </View>

          {/* Status */}
          <View style={styles.section}>
            <AppText style={styles.label}>Status:</AppText>
            <AppText style={styles.value}>{detailsData?.status}</AppText>
          </View>

          {/* Service Date */}
          <View style={styles.section}>
            <AppText style={styles.label}>Service Date:</AppText>
            <AppText style={styles.value}>
              {new Date(detailsData?.date).toLocaleDateString()} , {detailsData?.slot}
            </AppText>
          </View>

          {/* Amount */}
          <View style={styles.section}>
            <AppText style={styles.label}>Amount:</AppText>
            <AppText style={styles.value}>₹{detailsData?.amount}</AppText>
          </View>

          {/* ================== SERVICE DETAILS ================== */}
          {detailsData?.serviceDetails?.length > 0 && (
            <>
              <AppText style={styles.subHeading}>Service Details</AppText>

              {detailsData.serviceDetails.map((service, index) => (
                <View key={index} style={styles.section}>
                  <AppText style={styles.label}>Service Type:</AppText>
                  <AppText style={styles.value}>{service?.service_name}</AppText>
                </View>
              ))}
            </>
          )}

          {/* ================== TECHNICIAN DETAILS ================== */}
          {detailsData?.technician_data && (
            <>
              <AppText style={styles.subHeading}>Technician Details</AppText>

              <View style={styles.section}>
                <AppText style={styles.label}>Name:</AppText>
                <AppText style={styles.value}>
                  {detailsData?.technician_data?.name}
                </AppText>
              </View>

              <View style={styles.section}>
                <AppText style={styles.label}>Phone:</AppText>
                <AppText style={styles.value}>
                  {detailsData?.technician_data?.phoneNumber}
                </AppText>
              </View>
            </>
          )}

          {/* ================== PAYMENT DETAILS ================== */}
          {detailsData?.status?.includes("PAYMENT") && (
            <>
              <AppText style={styles.subHeading}>Payment Details</AppText>

              <View style={styles.section}>
                <AppText style={styles.label}>Payment Status:</AppText>
                <AppText style={styles.value}>
                  {detailsData?.status}
                </AppText>
              </View>
            </>
          )}

          {/* Download Invoice Button */}
          {detailsData?.invoiceUrl && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.invoiceButton}
              onPress={() => downloadInvoice(detailsData.invoiceUrl, detailsData.bookingId)}
              disabled={downloading}
            >
              <AppText style={styles.invoiceText}>
                {downloading ? `Downloading ${progress}%` : 'Download Invoice'}
              </AppText>
            </TouchableOpacity>
          )}

        </ScrollView>

      )}
    </View>
  );
};

export default BookingDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollcontain: {
    paddingHorizontal: hp(1.5),
    paddingBottom: hp(20),
  },
  heading: {
    fontSize: hp('2%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.themeColor,
    marginVertical: hp('1.5%'),
  },

  subHeading: {
    fontSize: hp('2%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.themeColor,
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },

  section: {
    marginBottom: hp('1.5%'),
  },

  label: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
    marginBottom: hp('0.5%'),
  },

  value: {
    fontSize: hp('1.5%'),
    fontFamily: Fonts.medium,
    color: COLORS.TextColor
  },

  card: {
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: COLORS.white,
    borderRadius: wp('2.5%'),
    marginBottom: hp('1.5%'),
  },
  invoiceButton: {
    marginTop: 25,
    backgroundColor: COLORS.themeColor,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  invoiceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});
