import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground,
  TextInput,
  Keyboard,
  BackHandler,
} from 'react-native';
import Header from '../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts, STATUS_CONFIG } from '../../../utils/colors';
import images from '../../../assets/images';
import BookingSlotModal from '../../../customScreen/BookingSlotModal';
import HomeScreenStyles from '../HomeScreenStyles';
import SuccessPopupModal from '../../../customScreen/SuccessPopupModal';
import DeclineModal from '../../../customScreen/DeclineModal';
import CustomButton from '../../../components/CustomButton';
import FastImage from 'react-native-fast-image';
import { isTablet } from '../../../components/TabletResponsiveSize';
import acDetailData from '../../../customScreen/customArray';
import { useFocusEffect } from '@react-navigation/native';
import styles from './OldRequestStyles';
import { store } from '../../../redux/store';
import { getUserOldAcRequest, postOldAcRequest, RescheduleEnquiryRequest } from '../../../api/homeApi';
import Toast from 'react-native-simple-toast';
import AppText from '../../../components/AppText'

const OldACRequest = ({ navigation, route }) => {
  const [reqStatus, setReqStatus] = useState(null); //Schedule, RESCHEDULED, BOOKING_CREATED, QUOTE_ACCEPTED, Decline
  const [detailStatus, setDetailStatus] = useState(null); // 'Request', 'Quote', 'Payment'
  const [PaymentStatus, setPaymentStatus] = useState('paydetail');
  const [modalSlotVisible, setModalSlotVisible] = useState(false);
  const [AcceptVisible, setAcceptVisible] = useState(false);
  const [confirmAcceptVisible, setConfirmAcceptVisible] = useState(false);
  const [selectdate, setSelectDate] = useState('Select date');
  const [selectTime, setSelectTime] = useState('First Half');
  const [selectReason, setSelectReason] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [successResheduleVisible, setSResheduleVisible] = useState(false);
  const [confirmPopupVisible, setConfirmPopupVisible] = useState(false);
  const [DeclineVisible, setDeclineVisible] = useState(false);
  const [selectPay, setSelectedPay] = useState('bank');
  const [upiId, setupiId] = useState('');
  const [expandedAC, setExpandedAC] = useState(null);
  const [loading, setLoading] = useState(false);
  const userData = store?.getState()?.auth?.user;
  const addressId = store?.getState()?.auth?.address;
  const { CreatedenquiryId } = route.params;
  const [enquiryData, setEnquiryData] = useState(null);

  // api to fetch request details and status
  useFocusEffect(
    useCallback(() => {
      fetchRequestDetails();
    }, [CreatedenquiryId])
  );


  const fetchRequestDetails = async () => {
    try {
      const response = await getUserOldAcRequest(CreatedenquiryId);

      console.log("Enquiry Details:", response);

      if (response?.status) {
        setEnquiryData(response?.data);
      }
      //  set the status here
      if (response?.status && response?.data) {
        const data = response.data;
        setEnquiryData(data);

        const statusFromApi = data?.status || '';
        handleStatusFlow(statusFromApi);

        // set schedule data
        if (data?.schedule?.date) {
          const dateObj = new Date(data.schedule.date);
          const formattedDate = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;

          setSelectDate(formattedDate);
          setSelectTime(
            data.schedule.slot === 'FIRST_HALF'
              ? 'FIRST_HALF'
              : 'SECOND_HALF'
          );
        }
      }


    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEnquiry = async () => {
    try {
      setLoading(true);
      const response = await cancelEnquiryRequest(CreatedenquiryId);
      if (response?.status) {
        Toast.show("Enquiry cancelled successfully");
        setReqStatus('CANCELLED');
        fetchRequestDetails();
      }

    } catch (error) {
      console.log("Cancel Error:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleStatusFlow = (status) => {
    setReqStatus(status);

    if (
      status === 'REQUESTED' ||
      status === 'SCHEDULED' ||
      status === 'CANCELLED' ||
      status === 'RESCHEDULED'
    ) {
      setDetailStatus('Request');
    }
    else if (
      status === 'BOOKING_CREATED' ||
      status === 'QUOTE_ACCEPTED' ||
      status === 'QUOTE_REJECTED'
    ) {
      setDetailStatus('Quote');
    }
    else if (status === 'PAYMENT_PENDING') {
      setDetailStatus('Payment');
    }
  };

  const toggleExpand = acName => {
    setExpandedAC(expandedAC === acName ? null : acName);
  };

  // selected slot detail
  const handleSlotSelection = slot => {
    if (slot) {
      const { date, monthNumber, year, time, Timeslot, reason } = slot;
      const formattedDate = `${String(date).padStart(2, '0')}/${String(
        monthNumber,
      ).padStart(2, '0')}/${year}`;
      const formattedTime =
        time === 'morning' || time === 'firstHalf' ? 'First Half' : Timeslot;
      const formattedReason = reason
      setSelectDate(formattedDate);
      setSelectTime(formattedTime);
      setRescheduleReason(formattedReason)
      handleReschedule()
    }
  };


  // on Tab press
  const getTabStyle = status => {
    // Step 1: Check current status
    const isRequest = detailStatus === 'Request';
    const isQuote = detailStatus === 'Quote';
    const isPayment = detailStatus === 'Payment';

    // Step 2: Decide kaun-kaun tab active hoga (red background + white text)
    const isTabActive =
      (status === 'Request' && (isRequest || isQuote || isPayment)) ||
      (status === 'Quote' && (isQuote || isPayment)) ||
      (status === 'Payment' && isPayment);
    return {
      color: isTabActive ? COLORS.white : COLORS.textHeading,
      backgroundColor: isTabActive ? COLORS.red : 'transparent',
      borderColor: isTabActive ? COLORS.red : COLORS.textHeading,
      borderWidth: isTabActive ? 0 : hp(0.1),
      borderRadius: hp(4),
      marginHorizontal: wp(1),
    };
  };

  // on back press
  const handleBackPress = () => {
    if (detailStatus === 'Payment') {
      setDetailStatus('Quote');
      return true; // stop default back
    }

    if (detailStatus === 'Quote') {
      setDetailStatus('Request');
      return true; // stop default back
    }

    return false; // allow normal back (exit screen)
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        const handled = handleBackPress();
        if (!handled) {
          navigation.goBack();
        }
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      return () => subscription.remove(); // ✅ correct way
    }, [detailStatus])
  );

  const handleReschedule = async () => {
    try {
      setLoading(true);

      const payload = {
        enquiryId: CreatedenquiryId,
        newDate: selectdate,
        newSlot: selectTime,
        reason: rescheduleReason || "Not available",
      };

      console.log("Reschedule Payload:", payload);

      const response = await RescheduleEnquiryRequest(payload);
      console.log("Reschedule Payload:", response);

      if (response?.status) {
        Toast.show(response.message);
        setReqStatus("RESCHEDULED");

      }

    } catch (error) {
      console.log("Reschedule Error:", error);
    } finally {
      setLoading(false);
    }
  };


  const getStatusStyle = status => {
    return STATUS_CONFIG[status] || { bg: '#f0f0f0', text: '#666' };
  };
  const { bg, text } = getStatusStyle(enquiryData.status);
  return (
    <View style={styles.container}>
      <Header
        title="AC Request Details"
        onBack={() => {
          const handled = handleBackPress();
          if (!handled) {
            navigation.goBack();
          }
        }}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <View style={styles.tab}>
            <AppText style={[styles.tabNumber, getTabStyle('Request')]}>1</AppText>
            <AppText style={styles.tabText}>Request</AppText>
          </View>
          <AppText style={[styles.tabText, { color: '#cececeff' }]}>────</AppText>
          <View style={styles.tab}>
            <AppText style={[styles.tabNumber, getTabStyle('Quote')]}>2</AppText>
            <AppText style={styles.tabText}>Quote</AppText>
          </View>
          <AppText style={[styles.tabText, { color: '#cececeff' }]}>────</AppText>
          <View style={styles.tab}>
            <AppText style={[styles.tabNumber, getTabStyle('Payment')]}>3</AppText>
            <AppText style={styles.tabText}>Payment details</AppText>
          </View>
        </View>

        {/* Inspection Details  Schedule Section */}
        {detailStatus === 'Quote' && (
          <AppText style={[styles.label]}>
            Request ID{' '}
            <AppText style={[styles.label, { color: COLORS.black }]}>#{enquiryData?.enquiryId}</AppText>
          </AppText>
        )}
        {detailStatus === 'Request' && (
          <TouchableOpacity onPress={() => setReqStatus('Schedule')}>
            <AppText style={[styles.label, { color: COLORS.black }]}>
              Inspection Details
            </AppText>
          </TouchableOpacity>
        )}
        {detailStatus === 'Request' && (
          <>
            <View style={styles.section}>
              <View style={styles.statusBar}>
                <View style={styles.statusBarRow}>
                  <View style={styles.statusInfo}>
                    <Image source={images.copperIcon} style={styles.icon} />
                    <AppText style={styles.statusText}>Old AC</AppText>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: bg
                      },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.statusBadgeText,
                        {
                          color: text
                        },
                      ]}
                    >
                      {enquiryData?.status}
                    </AppText>
                  </View>
                </View>
                <View style={styles.statusInfo}>
                  <AppText style={styles.label}>Request ID</AppText>
                  <AppText style={[styles.value, { marginLeft: hp(1) }]}>
                    #{enquiryData?.enquiryId}
                  </AppText>
                </View>
              </View>

              <View style={styles.copperRow}>
                <View style={styles.detailRow}>
                  <AppText style={styles.label}>
                    {reqStatus === 'SCHEDULED'
                      ? 'Inspection Date & Time'
                      : 'Submitted On'}
                  </AppText>
                  <AppText style={styles.value}>
                    {reqStatus === 'SCHEDULED'
                      ? `${selectdate} - ${selectTime}`
                      : enquiryData?.createdAt
                        ? new global.Date(enquiryData.createdAt).toLocaleDateString()
                        : '-'}
                  </AppText>
                </View>
                <View style={[styles.detailRow, { paddingRight: hp(0) }]}>
                  <AppText style={styles.label}>Requested Service Details</AppText>
                  {enquiryData?.oldAcDetails?.map((ac) => (
                    <View key={ac._id}><AppText style={styles.value}>{ac.brand}</AppText>
                    </View>))}
                </View>
              </View>
              {reqStatus !== 'Schedule' && (
                <View style={styles.copperRow}>
                  <View style={styles.detailRow}>
                    <AppText style={styles.label}>Number of AC</AppText>
                    <AppText style={styles.value}>{enquiryData?.noOfAc}</AppText>
                  </View>
                  <View style={[styles.detailRow, { paddingRight: hp(7.5) }]}>
                    <AppText style={styles.label}>Agent Assigned</AppText>
                    <AppText style={styles.value}>
                      {reqStatus === 'BOOKING_CREATED' ? 'Mohan Verma' : '-'}
                    </AppText>
                  </View>
                </View>
              )}
              {reqStatus === 'BOOKING_CREATED' && (
                <View style={styles.copperRow}>
                  <View style={styles.detailRow}>
                    <AppText style={styles.label}>Final Offer</AppText>
                    <AppText style={styles.value}>₹ 650000/-</AppText>
                  </View>
                  <View style={[styles.detailRow, { paddingRight: hp(1) }]}>
                    <AppText style={styles.label}>Status</AppText>
                    <AppText style={styles.value}>Pending</AppText>
                  </View>
                </View>
              )}
              {/* Additional Note */}
              {reqStatus === 'BOOKING_CREATED' && (
                <>
                  <AppText style={styles.noteText}>
                    Note : Lorem ipsum dolor sit amet consectetur. Neque orci
                    lorem sed in. Lectus aliquet mattis condimentum eu tempus ac
                    lorem.
                  </AppText>
                </>
              )}

              {/* Assigned Agent */}
              {reqStatus === 'SCHEDULED' && (
                <>
                  <AppText style={styles.sectionTitle}>Assigned Agent</AppText>
                  <View style={styles.agentContainer}>
                    <View style={styles.agentInfo}>
                      <Image
                        source={images.userphoto}
                        style={styles.agentImage}
                      />
                      <View style={styles.agentText}>
                        <View
                          style={[
                            styles.agentHeader,
                            { marginLeft: wp(-1), marginBottom: hp(1) },
                          ]}
                        >
                          <Image
                            source={images.profile}
                            style={[styles.icon, { resizeMode: 'contain' }]}
                          />
                          <AppText style={styles.agentName}>Mohan Verma</AppText>
                        </View>
                        <AppText style={styles.agentTitle}>AC Doctor agent</AppText>
                      </View>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.viewProfileButton}>
                        <AppText style={styles.viewProfileText}>View Profile</AppText>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.chatButton}>
                        <Image
                          source={images.chatIcon}
                          style={styles.chatIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          </>
        )}

        {detailStatus === 'Payment' && (
          <>
            <AppText style={[styles.label, { color: COLORS.black }]}>
              {' '}
              Request ID #1234
            </AppText>
            <View style={[styles.section]}>
              <View style={styles.copperRow}>
                <AppText style={styles.label}>Dakin</AppText>
                <AppText style={[styles.value, { fontFamily: Fonts.semiBold }]}>
                  ₹ 25000/-
                </AppText>
              </View>
              <AppText style={[styles.label, { paddingTop: hp(1) }]}>
                Dakin 9Q12YTYG
              </AppText>

              <View style={styles.copperRow}>
                <AppText style={styles.label}>Split 1.5Ton</AppText>
                <AppText
                  style={[
                    styles.label,
                    {
                      textDecorationLine: 'underline',
                      color: COLORS.themeColor,
                      textAlign: 'center',
                    },
                  ]}
                >
                  Download Offer Agreement
                </AppText>
              </View>
            </View>
          </>
        )}

        {/*  Payment mode selection */}
        {detailStatus === 'Payment' && (
          <>
            <AppText style={[styles.label, { color: COLORS.black }]}>
              {' '}
              Payment mode selection
            </AppText>
            <View style={[styles.section]}>
              <TouchableOpacity
                style={styles.statusInfo}
                onPress={() => setSelectedPay('bank')}
                activeOpacity={0.5}
              >
                <Image
                  source={
                    selectPay === 'bank' ? images.onbutton : images.offbutton
                  }
                  style={styles.IconImage}
                />
                <AppText style={styles.label}>{'  '}Bank Transfer</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statusInfo}
                onPress={() => setSelectedPay('upi')}
                activeOpacity={0.5}
              >
                <Image
                  source={
                    selectPay === 'upi' ? images.onbutton : images.offbutton
                  }
                  style={styles.IconImage}
                />
                <AppText style={styles.label}>{'  '}UPI</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statusInfo}
                onPress={() => setSelectedPay('Pickup')}
                activeOpacity={0.5}
              >
                <Image
                  source={
                    selectPay === 'Pickup' ? images.onbutton : images.offbutton
                  }
                  style={styles.IconImage}
                />
                <AppText style={styles.label}>{'  '}Cash on Pickup</AppText>
              </TouchableOpacity>

              <AppText
                style={[
                  styles.label,
                  { marginVertical: wp(1.5), color: COLORS.black },
                ]}
              >
                Enter your UPI ID
              </AppText>
              <View
                style={{
                  borderRadius: hp(5),
                  borderWidth: wp(0.3),
                  borderColor: COLORS.lightGray,
                  padding: Platform.OS === 'ios' ? hp(1.5) : hp(0),
                  paddingHorizontal: Platform.OS === 'ios' ? hp(1.7) : hp(2.5),
                  marginVertical: wp(1.5),
                }}
              >
                <TextInput
                  placeholder="Type here..."
                  placeholderTextColor={COLORS.textColor}
                  keyboardType="default"
                  value={upiId}
                  onChange={txt => setupiId(txt)}
                  style={styles.label}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  allowFontScaling={false}
                  includeFontPadding={false}
                />
              </View>
            </View>
          </>
        )}

        {/* Status Section */}
        {(detailStatus === 'Quote' ||
          (detailStatus !== 'Payment' &&
            ['QUOTE_ACCEPTED', 'QUOTE_REJECTED'].includes(reqStatus))) && (
            <View style={[styles.section]}>
              {(reqStatus === 'QUOTE_ACCEPTED' ||
                detailStatus !== 'Payment' ||
                reqStatus === 'QUOTE_REJECTED') && (
                  <View style={styles.copperRow}>
                    <AppText style={styles.label}>Status</AppText>
                    {reqStatus === 'QUOTE_ACCEPTED' && (
                      <AppText
                        style={[
                          styles.value,
                          {
                            color: COLORS.darkgreen,
                            fontFamily: Fonts.semiBold,
                            backgroundColor: COLORS.lightgreen,
                          },
                        ]}
                      >
                        {' '}
                        ✅ Accepted
                      </AppText>
                    )}
                    {reqStatus === 'QUOTE_REJECTED' && (
                      <AppText
                        style={[
                          styles.value,
                          {
                            color: COLORS.red,
                            fontFamily: Fonts.semiBold,
                            backgroundColor: COLORS.Lightred,
                          },
                        ]}
                      >
                        {' '}
                        ❌ Declined
                      </AppText>
                    )}
                  </View>
                )}

              <View style={styles.copperRow}>
                <AppText style={styles.label}>Offer Amount</AppText>
                <AppText
                  style={[
                    styles.value,
                    { color: COLORS.themeColor, fontFamily: Fonts.semiBold },
                  ]}
                >
                  ₹ 25000/-
                </AppText>
              </View>
              <View style={styles.copperRow}>
                <AppText style={styles.label}>Condition</AppText>
                <AppText style={styles.value}>Good</AppText>
              </View>
              {enquiryData?.oldAcDetails?.map((ac) => (<View style={styles.copperRow} key={ac._id}>
                <AppText style={styles.label}>Type of AC</AppText>
                <AppText style={styles.value}>{ac.brand}</AppText>
              </View>))}
              <View style={styles.copperRow}>
                <AppText style={styles.label}>Age</AppText>
                <AppText style={styles.value}>3 Years</AppText>
              </View>
              <View style={styles.copperRow}>
                <AppText style={styles.label}>Inspection Remarks</AppText>
                <AppText style={styles.value}>Minor scratches, function</AppText>
              </View>
              {reqStatus === 'QUOTE_REJECTED' && (
                <View style={styles.copperRow}>
                  <AppText style={styles.label}>Reason for Decline</AppText>
                  <AppText style={[styles.value, { color: COLORS.red }]}>
                    {selectReason}
                  </AppText>
                </View>
              )}
              {/* <View style={[styles.copperRow, { justifyContent: 'center' }]}>
                <Text
                  style={[
                    styles.label,
                    {
                      textDecorationLine: 'underline',
                      color: COLORS.themeColor,
                      textAlign: 'center',
                    },
                  ]}
                >
                  View AC Details
                </Text>
              </View> */}

              {/* btn. */}
              {detailStatus === 'Quote' &&
                reqStatus !== 'QUOTE_ACCEPTED' &&
                reqStatus !== 'QUOTE_REJECTED' && (
                  <View style={styles.copperRow}>
                    <TouchableOpacity
                      style={[
                        styles.doneButton,
                        { backgroundColor: COLORS.white },
                      ]}
                      onPress={() => setDeclineVisible(true)}
                    >
                      <AppText
                        style={[
                          styles.doneButtonText,
                          { color: COLORS.textHeading },
                        ]}
                      >
                        Decline
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.doneButton, styles.secondButton]}
                      onPress={() => setAcceptVisible(true)}
                    >
                      <AppText style={styles.doneButtonText}>Accept</AppText>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          )}

        {detailStatus !== 'Payment' && (
          <View style={{ marginBottom: wp(15) }}>
            {detailStatus !== 'Quote' && (
              <View
                style={[
                  styles.copperRow,
                  { width: isTablet ? wp(90) : wp(90), alignSelf: 'center' },
                ]}
              >
                <AppText style={[styles.label, { color: COLORS.black }]}>
                  Your AC details
                </AppText>
                {/* {detailStatus === 'Request' && (
                  <TouchableOpacity
                    style={[styles.copperRow, { borderBottomColor: '#F5F7FA' }]}
                  >
                    <Image
                      source={images.editIcon}
                      style={styles.showiconStyle}
                    />
                    <Text
                      style={[
                        styles.label,
                        {
                          color: COLORS.themeColor,
                        },
                      ]}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
              )} */}
              </View>
            )}

            {/* AC Names List */}
            {enquiryData?.oldAcDetails?.map((ac) => (
              <View key={ac._id}>
                <TouchableOpacity
                  onPress={() => toggleExpand(ac._id)}
                  style={styles.acHeader}
                >
                  <AppText style={styles.acTitle}>
                    {ac.brand}
                  </AppText>
                  <AppText style={styles.arrow}>
                    {expandedAC === ac._id ? '▲' : '▼'}
                  </AppText>
                </TouchableOpacity>

                {expandedAC === ac._id && (
                  <View style={styles.acItem}>
                    <View style={styles.copperRow}>
                      <AppText style={styles.label}>AC Type</AppText>
                      <AppText style={styles.value}>{ac.acType}</AppText>
                    </View>

                    <View style={styles.copperRow}>
                      <AppText style={styles.label}>Tonnage</AppText>
                      <AppText style={styles.value}>{ac.tonnage}</AppText>
                    </View>

                    <View style={styles.copperRow}>
                      <AppText style={styles.label}>Condition</AppText>
                      <AppText style={styles.value}>{ac.condition}</AppText>
                    </View>

                    <View style={styles.copperRow}>
                      <AppText style={styles.label}>Technology</AppText>
                      <AppText style={styles.value}>{ac.technology}</AppText>
                    </View>
                    <View style={styles.copperRow}>
                      <AppText style={styles.label}>Preferred Inspection Date</AppText>
                      <AppText style={styles.value}>{selectdate}</AppText>
                    </View>
                    <View style={styles.copperRow}>
                      <AppText style={styles.label}>Preferred Inspection Time</AppText>
                      <AppText style={styles.value}>{selectTime}</AppText>
                    </View>
                    {ac?.photos?.length > 0 && (
                      <>
                        <AppText style={styles.label}>Photos</AppText>

                        <View style={styles.photosContainer}>
                          {ac.photos.map((item, index) => (
                            <View key={index} style={styles.imageWrapper}>
                              <FastImage
                                source={{ uri: item }}
                                style={styles.image}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            </View>
                          ))}
                        </View>
                      </>
                    )}

                  </View>
                )}
              </View>
            ))}

          </View>
        )}

        {/* Select Date & Time */}
        {detailStatus === 'Payment' && (
          <>
            <AppText style={[styles.label, { color: COLORS.black }]}>
              Schedule Pickup
            </AppText>
            <View style={styles.inputGroup}>
              <AppText style={styles.label}>Preferred Inspection Date & Time</AppText>
              <TouchableOpacity
                style={styles.pickerWrapper}
                onPress={() => setModalSlotVisible(true)}
              >
                <AppText
                  style={[{ marginHorizontal: wp(4), fontFamily: Fonts.regular, color: selectdate === 'Select date' ? COLORS.textColor : COLORS.black }]}
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
          </>
        )}

        {detailStatus === 'Payment' && (
          <View style={[styles.section, { marginBottom: hp(3) }]}>
            <View style={styles.copperRow}>
              <AppText style={styles.label}>Pickup Date</AppText>
              <AppText style={styles.value}>20/03/2025</AppText>
            </View>
            <View style={styles.copperRow}>
              <AppText style={styles.label}>Pickup Time</AppText>
              <AppText style={styles.value}>First Half</AppText>
            </View>
          </View>
        )}

        {/* banner image */}
        {detailStatus !== 'Request' && (
          <>
            {detailStatus === 'Quote' && (
              <View
                style={[
                  HomeScreenStyles.worksliderview,
                  { marginTop: detailStatus === 'Quote' ? -50 : 0 },
                ]}
              >
                <Image
                  source={images.bannerTwo}
                  style={HomeScreenStyles.workimage}
                />
              </View>
            )}

            <View
              style={[HomeScreenStyles.brandcont, { marginBottom: hp(15) }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={images.helpdesk}
                  style={HomeScreenStyles.smallimage}
                />
                <AppText style={HomeScreenStyles.needHelp}>Need Help?</AppText>
              </View>
              <Image
                source={images.chatIcon}
                style={HomeScreenStyles.chaticon}
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* Cancel and Reschedule Buttons */}
      {detailStatus === 'Request' && (
        <View style={styles.buttonContainer}>

          {/* 🔹 CASE 1: Show Cancel + Reschedule */}
          {(reqStatus === '' ||
            reqStatus === 'REQUESTED' ||
            reqStatus === 'SCHEDULED') && (
              <>
                <TouchableOpacity
                  style={[styles.doneButton, { backgroundColor: COLORS.white }]}
                  onPress={() => {
                    handleCancelEnquiry()
                  }}
                >
                  <AppText
                    style={[styles.doneButtonText, { color: COLORS.textHeading }]}
                  >
                    Cancel Request
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.doneButton, styles.secondButton]}
                  onPress={() => {
                    setSResheduleVisible(true);
                    setReqStatus('RESCHEDULED'); // mark as RESCHEDULED
                  }}
                >
                  <AppText style={styles.doneButtonText}>Reschedule</AppText>
                </TouchableOpacity>
              </>
            )}

          {/* 🔹 CASE 2 & 3: After Reschedule OR BOOKING_CREATED */}
          {/* {(reqStatus === 'RESCHEDULED' ||
            reqStatus === 'BOOKING_CREATED') && (
              <TouchableOpacity
                style={[styles.doneButton, styles.secondButton]}
                onPress={() => {
                  if (reqStatus === 'RESCHEDULED') {
                    // First Next → mark BOOKING_CREATED
                    setReqStatus('BOOKING_CREATED');
                  } else if (reqStatus === 'BOOKING_CREATED') {
                    // Second Next → go to Quote tab
                    setDetailStatus('Quote');
                  }
                }}
              >
                <AppText style={styles.doneButtonText}>Next</AppText>
              </TouchableOpacity>
            )} */}

        </View>
      )}


      {detailStatus === 'Payment' && (
        <View style={[HomeScreenStyles.servicesSection, { minHeight: hp(8) }]}>
          <CustomButton
            buttonName="Submit"
            margingTOP={hp('0%')}
            btnTextColor={COLORS.white}
            btnColor={COLORS.themeColor}
            onPress={() => navigation.navigate('PaymentScreen')}
          />
        </View>
      )}
      {reqStatus === 'QUOTE_ACCEPTED' &&
        (detailStatus === 'Quote' || detailStatus === 'Payment') && (
          <View style={HomeScreenStyles.servicesSection}>
            <CustomButton
              buttonName="Proceed to payment Details"
              margingTOP={hp('0%')}
              btnTextColor={COLORS.white}
              btnColor={COLORS.themeColor}
              onPress={() => {
                setDetailStatus('Payment'),
                  detailStatus === 'Payment' &&
                  navigation.navigate('PaymentScreen');
              }}
            />
          </View>
        )}

      {/* {reqStatus === 'RESCHEDULED' && (
        <View style={HomeScreenStyles.servicesSection}>
          <CustomButton
            buttonName="Next"
            margingTOP={hp('0%')}
            btnTextColor={COLORS.white}
            btnColor={COLORS.themeColor}
            onPress={() => setReqStatus('BOOKING_CREATED')}
          />
        </View>
      )} */}

      {reqStatus === 'BOOKING_CREATED' && detailStatus === 'Request' && (
        <View style={HomeScreenStyles.servicesSection}>
          <CustomButton
            buttonName="Next"
            margingTOP={hp('0%')}
            btnTextColor={COLORS.white}
            btnColor={COLORS.themeColor}
            onPress={() => setDetailStatus('Quote')}
          />
        </View>
      )}

      {/* are oyu reschedule */}
      <SuccessPopupModal
        visible={successResheduleVisible}
        onClose={() => {
          setSResheduleVisible(false), setModalSlotVisible(true);
        }}
        setIcon={images.questionMark}
        HeadTextColor="black"
        HeadText="Are you sure?"
        message1=""
        message2="Do you really want to cancel this request?"
        buttonCount={2}
        firstButtonText="Reschedule"
        secondButtonText="Cancel Reschedule"
        onSecondButtonPress={() => {
          setSResheduleVisible(false), setSuccessPopupVisible(true);
        }}
      />
      {/* cancel request Popup */}
      <SuccessPopupModal
        visible={successPopupVisible}
        onClose={() => {
          setSuccessPopupVisible(false);
        }}
        setIcon={images.questionMark}
        HeadTextColor="black"
        HeadText="Are you sure?"
        message1=""
        message2="Do you really want to cancel this request?"
        buttonCount={2}
        firstButtonText="Not Now"
        secondButtonText="Yes i'm"
        onSecondButtonPress={() => {
          setSuccessPopupVisible(false), setConfirmPopupVisible(true);
        }}
      />
      {/* confirm cancel request Popup */}
      <SuccessPopupModal
        visible={confirmPopupVisible}
        onClose={() => {
          setConfirmPopupVisible(false);
          handleCancelEnquiry()
        }}
        HeadTextColor="black"
        HeadText="Cancelled!"
        message2="You request has been successfully cancelled."
      />


      {/* accept detail popup */}
      <SuccessPopupModal
        visible={AcceptVisible}
        onClose={() => {
          setAcceptVisible(false);
        }}
        setIcon={images.processDone}
        HeadTextColor="green"
        HeadText="Yeah!"
        message1="Are you sure you want to proceed"
        message2="with this offer?"
        buttonCount={2}
        secondButtonText="confirm"
        firstButtonText="No"
        onSecondButtonPress={() => {
          setAcceptVisible(false),
            setConfirmAcceptVisible(true),
            setReqStatus('Schedule');
        }}
      />

      {/* offer Accepted*/}
      <SuccessPopupModal
        visible={confirmAcceptVisible}
        onClose={() => {
          setConfirmAcceptVisible(false);
          setReqStatus('QUOTE_ACCEPTED');
        }}
        HeadText="Offer Accepted!"
        message1="Your request has been submitted."
        message2="Our team will connect with for further process."
        buttonCount={1}
        firstButtonText="Done"
      />

      {/* 'Decline popup*/}
      <DeclineModal
        visible={DeclineVisible}
        onClose={() => setDeclineVisible(false)}
        HeadTextColor={COLORS.red}
        setIcon={images.processReject}
        HeadText="Decline"
        message1="Are you sure you want to decline the offer"
        message2="for your AC?"
        buttonCount={2}
        firstButtonText="Confirm Decline"
        onFirstButtonPress={reason => {
          setDeclineVisible(false);
          setReqStatus('QUOTE_REJECTED');
        }}
        secondButtonText="No"
        onSecondButtonPress={() => {
          setDeclineVisible(false);
        }}
        onReasonSelect={reason => {
          setSelectReason(reason);
        }}
      />

      {/* Booking Slot Modal */}
      <BookingSlotModal
        visible={modalSlotVisible}
        onClose={() => setModalSlotVisible(false)}
        setSelectedSlot={handleSlotSelection}
        onBookProcess={() => setModalSlotVisible(false)}
        isReschedule={true}
      />
    </View>
  );
};

export default OldACRequest;
