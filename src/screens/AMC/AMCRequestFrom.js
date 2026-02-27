import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
  Keyboard,
} from 'react-native';
import Header from '../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../utils/colors';
import images from '../../assets/images';
import BookingSlotModal from '../../customScreen/BookingSlotModal';
import HomeScreenStyles from '../Home/HomeScreenStyles';
import SuccessPopupModal from '../../customScreen/SuccessPopupModal';
import DeclineModal from '../../customScreen/DeclineModal';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';

const AMCRequestFrom = ({ navigation }) => {
  const [reqStatus, setReqStatus] = useState('Under Review'); // 'Scheduled', 'ReScheduled', 'Under Review'
  const [detailStatus, setDetailStatus] = useState('Request');
  const [PaymentStatus, setPaymentStatus] = useState('paydetail');
  const [modalSlotVisible, setModalSlotVisible] = useState(false);
  const [selectDate, setSelectDate] = useState('10/03/2025');
  const [selectTime, setSelectTime] = useState('First Half');
  const [successPopupVisible, setSuccessPopupVisible] = useState(false); // Accept successPopup
  const [confirmPopupVisible, setConfirmPopupVisible] = useState(false); // Offer confirm successPopup
  const [DeclineVisible, setDeclineVisible] = useState(false); // Offer confirm successPopup
  const [rescheduleReqVisible, setRescheduleReqVisible] = useState(false);
  const [cancelReqVisible, setCancelReqVisible] = useState(false);
  const [cancelConfirmVisible, setCancelConfirmVisible] = useState(false);
  const [expandedAC, setExpandedAC] = useState(null);

  const acData = {
    LG: {
      brand: { title: 'Total No. of AC', value: '5' },
      acType: { title: 'Condition', value: 'Good' },
      tonnage: { title: 'Ac Technology', value: 'Inverter' },
      age: { title: 'Age of AC', value: '2-4 Years' },
      condition: { title: 'Condition', value: 'Excellent' },
      technology: { title: 'AC Technology', value: 'Inverter' },
      inspectionDate: {
        title: 'Preferred Inspection Date',
        value: '15/03/2025',
      },
      inspectionTime: {
        title: 'Preferred Inspection Time',
        value: 'Second Half',
      },
    },
    Samsung: {
      brand: { title: 'Total No. of AC', value: '5' },
      acType: { title: 'Condition', value: 'Good' },
      tonnage: { title: 'Ac Technology', value: 'Inverter' },
      age: { title: 'Age of AC', value: '2-4 Years' },
      condition: { title: 'Condition', value: 'Excellent' },
      technology: { title: 'AC Technology', value: 'Inverter' },
      inspectionDate: {
        title: 'Preferred Inspection Date',
        value: '15/03/2025',
      },
      inspectionTime: {
        title: 'Preferred Inspection Time',
        value: 'Second Half',
      },
    },
  };

  const toggleExpand = acName => {
    setExpandedAC(expandedAC === acName ? null : acName);
  };
  const handleSlotSelection = slot => {
    if (slot) {
      const { date, monthNumber, year, time, Timeslot } = slot;
      const formattedDate = `${String(date).padStart(2, '0')}/${String(
        monthNumber,
      ).padStart(2, '0')}/${year}`;
      const formattedTime =
        time === 'morning' || time === 'firstHalf' ? 'First Half' : Timeslot;
      setSelectDate(formattedDate);
      setSelectTime(formattedTime);
      // setReqStatus('ReScheduled');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="View Request"
        onBack={() => navigation.goBack()}
      // onHelp={true}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* cooper Piping */}

        <View style={styles.section}>
          <View style={styles.statusBar}>
            <View style={styles.statusBarRow}>
              <View style={styles.statusInfo}>
                <Image source={images.AMCicon} style={styles.icon} />
                <AppText style={styles.statusText}>AMC</AppText>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      reqStatus === 'Scheduled'
                        ? '#FFE7CF'
                        : reqStatus === 'ReScheduled'
                          ? COLORS.lightSky
                          : reqStatus === 'complete'
                            ? '#ECFFE9'
                            : '#fff4c5ff',
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.statusBadgeText,
                    {
                      color:
                        reqStatus === 'Scheduled'
                          ? '#D26900'
                          : reqStatus === 'ReScheduled'
                            ? COLORS.themeColor
                            : reqStatus === 'complete'
                              ? '#128807'
                              : '#ee9937ff',
                    },
                  ]}
                >
                  {reqStatus === 'Scheduled'
                    ? 'Scheduled'
                    : reqStatus === 'ReScheduled'
                      ? 'Re Scheduled'
                      : reqStatus === 'complete'
                        ? 'Completed'
                        : 'Under Review'}
                </AppText>
              </View>
            </View>
            <View style={styles.statusInfo}>
              <AppText style={styles.label}>Request ID</AppText>
              <AppText style={[styles.value, { marginLeft: hp(1) }]}>#12345</AppText>
            </View>
          </View>

          <View style={styles.copperRow}>
            <View style={styles.detailRow}>
              <AppText style={styles.label}>Name</AppText>
              <AppText style={styles.value}>Sachin</AppText>
            </View>
            <View style={[styles.detailRow, { paddingRight: hp(3) }]}>
              <AppText style={styles.label}>Place Type</AppText>
              <AppText style={styles.value}>Residental</AppText>
            </View>
          </View>
          <View style={styles.copperRow}>
            <View style={styles.detailRow}>
              <AppText style={styles.label}>Address</AppText>
              <AppText style={styles.value}> 149, Vijay Nagar, Indore</AppText>
            </View>
          </View>

          {/* Assigned Agent */}
          {['Scheduled', 'ReScheduled'].includes(reqStatus) && (
            <>
              <AppText style={styles.sectionTitle}>Assigned Agent</AppText>
              <View style={styles.agentContainer}>
                <View style={styles.agentInfo}>
                  <Image source={images.userphoto} style={styles.agentImage} />
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
                    <Image source={images.chatIcon} style={styles.chatIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* AC Names List */}
          {Object.keys(acData).map(acName => (
            <>
              <TouchableOpacity
                key={'AC Names list'}
                onPress={() => toggleExpand(acName)}
                style={styles.acHeader}
              >
                <AppText style={[styles.label, { marginLeft: wp(1) }]}>
                  {acName}
                </AppText>
                <AppText style={styles.label}>
                  {expandedAC === acName ? '▲' : '▼'}
                </AppText>
              </TouchableOpacity>

              {expandedAC === acName ? (
                <View key={acName} style={styles.acItem}>
                  {Object.entries(acData[acName]).map(([key, detail]) => (
                    <>
                      <View key={key} style={styles.copperRow}>
                        <AppText style={styles.label}>
                          {detail.title
                            ? detail.title.charAt(0).toUpperCase() +
                            detail.title.slice(1)
                            : key}
                        </AppText>
                        <AppText
                          style={[styles.value, { fontFamily: Fonts.semiBold }]}
                        >
                          {detail.value}
                        </AppText>
                      </View>
                    </>
                  ))}
                </View>
              ) : (
                <View></View>
              )}
            </>
          ))}
        </View>
      </ScrollView>

      {/* Cancel and Reschedule Buttons */}
      {detailStatus === 'Request' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            // onPress={() =>
            //   setReqStatus(prev =>
            //     prev === 'Scheduled' ? 'complete' : 'Scheduled',
            //   )
            // }
            style={[styles.doneButton, { backgroundColor: COLORS.white }]}
          >
            <AppText
              style={[styles.doneButtonText, { color: COLORS.textHeading }]}
            >
              Cancel Request
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.doneButton, styles.secondButton]}
            onPress={() => setRescheduleReqVisible(true)}
          >
            <AppText style={styles.doneButtonText}>Reschedule</AppText>
          </TouchableOpacity>
        </View>
      )}

      {PaymentStatus === 'Confirm' && (
        <View style={HomeScreenStyles.servicesSection}>
          <CustomButton
            buttonName="Proceed To Payment Details"
            margingTOP={hp('0%')}
            btnTextColor={COLORS.white}
            btnColor={COLORS.themeColor}
            onPress={() => setPaymentStatus('paydetail')}
          />
        </View>
      )}

      {reqStatus === 'ReScheduled' && (
        <View style={HomeScreenStyles.servicesSection}>
          <CustomButton
            buttonName="Next"
            margingTOP={hp('0%')}
            btnTextColor={COLORS.white}
            btnColor={COLORS.themeColor}
            onPress={() => setReqStatus('complete')}
          />
        </View>
      )}

      {reqStatus === 'complete' && detailStatus === 'Request' && (
        <View style={HomeScreenStyles.servicesSection}>
          <CustomButton
            buttonName="Next"
            margingTOP={hp('0%')}
            btnTextColor={COLORS.white}
            btnColor={COLORS.themeColor}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Tab', params: { screen: 'Home' } }],
              })}
          />
        </View>
      )}

      {/* Reschedulerequest Popup */}
      <SuccessPopupModal
        visible={rescheduleReqVisible}
        onClose={() => {
          setRescheduleReqVisible(false), setCancelReqVisible(true);
        }}
        setIcon={images.questionMark}
        HeadTextColor="black"
        HeadText="Are you sure?"
        message1=""
        message2="Do you really want to cancel this request?"
        buttonCount={2}
        firstButtonText="Cancel Reschedule"
        secondButtonText="Reschedule"
        onSecondButtonPress={() => {
          setRescheduleReqVisible(false), setModalSlotVisible(true);
        }}
      />

      {/* cancel request Popup */}
      <SuccessPopupModal
        visible={cancelReqVisible}
        onClose={() => {
          setCancelReqVisible(false);
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
          setCancelReqVisible(false), setCancelConfirmVisible(true);
        }}
      />
      {/* confirm cancel request Popup */}
      <SuccessPopupModal
        visible={cancelConfirmVisible}
        onClose={() => {
          setCancelConfirmVisible(false);
          navigation.goBack()
        }}
        setIcon={images.cancelRed}
        HeadTextColor="black"
        HeadText="Cancelled!"
        message1=""
        message2="You request has been successfully cancelled."
      // buttonCount={2}
      // secondButtonText="Done"
      // firstButtonText="View Request"
      // onSecondButtonPress={() => {
      //   setCancelConfirmVisible(false);
      // }}
      />

      {/* Success Popup */}
      <SuccessPopupModal
        visible={successPopupVisible}
        onClose={() => {
          setSuccessPopupVisible(false);
        }}
        setIcon={images.processDone}
        HeadTextColor="green"
        HeadText="Yeah!"
        message1="Are you sure you want to proceed"
        message2="with this offer?"
        buttonCount={2}
        secondButtonText="Confirm"
        firstButtonText="No"
        onSecondButtonPress={() => {
          setSuccessPopupVisible(false), setConfirmPopupVisible(true);
        }}
      />

      {/* Booking Slot Modal */}
      <BookingSlotModal
        visible={modalSlotVisible}
        onClose={() => setModalSlotVisible(false)}
        setSelectedSlot={handleSlotSelection}
        onBookProcess={() => {
          setModalSlotVisible(false);
          setReqStatus('ReScheduled');
        }}
        isReschedule={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: hp(1),
  },
  section: {
    backgroundColor: COLORS.white,
    marginVertical: hp(1),
    borderRadius: wp(3),
    paddingHorizontal: hp(2),
    elevation: 2,
    paddingBottom: hp(2),
  },
  statusBar: {
    backgroundColor: '#e9f4fb',
    padding: hp(0.5),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    width: wp(95.5),
    alignSelf: 'center',
  },
  statusBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: wp(1),
  },
  icon: {
    width: wp(6),
    height: hp(1.5),
    resizeMode: 'cover',
  },
  statusText: {
    fontSize: hp(1.5),
    fontFamily: Fonts.medium,
    color: COLORS.textHeading,
    marginLeft: wp(1),
  },
  statusBadge: {
    backgroundColor: '#fff4c5ff',
    borderRadius: wp(1),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
    marginRight: wp(2),
    marginTop: hp(1),
  },
  statusBadgeText: {
    fontSize: hp(1.3),
    fontFamily: Fonts.medium,
    color: '#ee9937ff',
  },
  detailRow: {
    paddingVertical: hp(0.3),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  copperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(0.9),
    borderBottomColor: COLORS.lightGray,
    borderBottomWidth: wp(0.1),
  },
  label: {
    fontSize: hp(1.5),
    fontFamily: Fonts.medium,
    color: '#666',
    marginBottom: wp(1),
  },
  value: {
    fontSize: hp(1.4),
    fontFamily: Fonts.medium,
    color: COLORS.black,
  },
  sectionTitle: {
    fontSize: hp(1.6),
    fontFamily: Fonts.medium,
    color: COLORS.black,
    paddingVertical: hp(0.5),
  },
  photo: {
    width: wp(26),
    height: hp(12),
    borderRadius: wp(2.5),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderLeftWidth: wp(1.5),
    borderLeftColor: COLORS.red,
    backgroundColor: COLORS.white,
    width: wp('90%'),
    alignSelf: 'center',
    marginTop: wp(3),
  },
  acItem: {
    borderRadius: wp(2),
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    width: wp('90%'),
    padding: wp(3),
    marginTop: wp(2),
  },

  agentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: hp(1.5),
    borderRadius: wp(1),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: hp(1),
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentImage: {
    width: wp(13),
    height: wp(15),
    borderRadius: wp(2),
    marginRight: wp(3),
  },
  agentText: {
    flexShrink: 1,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  agentName: {
    fontSize: hp(1.5),
    fontFamily: Fonts.medium,
    color: COLORS.black,
    marginLeft: wp(1),
  },
  agentTitle: {
    fontSize: hp(1.3),
    color: '#666',
  },
  actionButtons: {
    alignItems: 'center',
  },
  viewProfileButton: {
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
  },
  viewProfileText: {
    fontSize: hp(1.4),
    color: COLORS.themeColor,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
    borderWidth: wp(0.1),
    borderColor: COLORS.themeColor,
  },
  chatIcon: {
    width: wp(9),
    height: hp(2.5),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: hp(2),
    backgroundColor: COLORS.white,
    paddingBottom: wp(6),
  },
  doneButton: {
    width: wp(42),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    borderWidth: wp(0.1),
    borderColor: COLORS.textHeading,
    borderRadius: wp(6),
  },
  secondButton: {
    backgroundColor: COLORS.themeColor,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: hp(1.7),
    fontFamily: Fonts.semiBold,
  },
});

export default AMCRequestFrom;
