// screens/MyRequestsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../utils/colors';
import { STATUS_CONFIG } from '../../utils/colors';
import Header from '../../components/Header';
import images from '../../assets/images';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { store } from '../../redux/store';
import { getAllOldAcRequest, getAMC, getConsultancy } from '../../api/homeApi';
import { isTablet } from '../../components/TabletResponsiveSize';
import AppText from '../../components/AppText';

const TABS = ['All', 'Scheduled', 'Completed', 'Cancelled'];

const MyRequestsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All');
  const user = store?.getState()?.auth?.user;
  const [data, setData] = useState([]);
  const [freeConsultancyList, setFreeConsultancyList] = useState([]);
  const [amcList, setAmcList] = useState([]);
  const [oldACList, setOldACList] = useState([]);


  useEffect(() => {
    getFreeConsultancy();
    getAMCDetail()
    getOLD_ACDetail()
  }, []);

  const getFreeConsultancy = async () => {
    try {
      const res = await getConsultancy(user?._id);
      // console.log('free consultancy ---', res.data)
      const updatedData =
        res?.data?.map(item => ({
          ...item,
          leadId: 'ACDEQ26022026-67',
          serviceName: 'Free Consultancy',
          status: 'REQUESTED',
          requestType: 'FREE_CONSULTANCY', // ✅ IMPORTANT
        })) || [];

      setFreeConsultancyList(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  const getAMCDetail = async () => {
    try {
      const res = await getAMC(user?._id);
      const updatedData =
        res?.data?.map(item => ({
          ...item,
          serviceName: 'AMC',
          status: 'REQUESTED',
          requestType: 'AMC', // ✅ IMPORTANT
        })) || [];

      setAmcList(updatedData);
    } catch (error) {
      console.log(error);
    }
  };
  const getOLD_ACDetail = async () => {
    try {
      const res = await getAllOldAcRequest();
      const updatedData =
        res?.data?.map(item => ({
          ...item,

          // 🔥 UI Required Fields
          serviceName: 'Old AC Purchase',
          requestType: 'OLD_AC',

          leadId: item?.enquiryId,   // UI me leadId use ho raha hai
          createdAt: item?.createdAt,
          slot: item?.schedule?.slot,
          place: item?.addressDetails?.saveAs,
          quantity: item?.noOfAc,

          status:
            item?.status === 'REQUESTED'
              ? 'REQUESTED'
              : item?.status === 'CANCELLED'
                ? 'CANCELLED'
                : item?.status,

        })) || [];

      setOldACList(updatedData);
    } catch (error) {
      console.log(error);
    }
  };


  const combinedList = [
    ...freeConsultancyList,
    ...amcList,
    ...oldACList,
  ].sort((a, b) => {
    const dateA = a?.createdAt ? new Date(a.createdAt) : 0;
    const dateB = b?.createdAt ? new Date(b.createdAt) : 0;
    return dateB - dateA;
  });// 🔥 latest first


  // Filter by Tab
  const filteredRequests = combinedList.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Scheduled')
      return ['SCHEDULED', 'RESCHEDULED'].includes(item.status);
    if (activeTab === 'Completed') return item.status === 'COMPLETE';
    if (activeTab === 'Cancelled') return item.status === 'CANCELLED';
    return false;
  });

  const getStatusStyle = status => {
    return STATUS_CONFIG[status] || { bg: '#f0f0f0', text: '#666' };
  };

  const renderRequestCard = ({ item }) => {
    const { bg, text } = getStatusStyle(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.skybluecard}>
          <View style={styles.cardHeader}>
            <View style={styles.serviceBadge}>
              {/* <Image source={images.icon} style={styles.icon} /> */}
              <AppText style={styles.serviceText}>{item.serviceName}</AppText>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: bg }]}>
              <AppText style={[styles.statusText, { color: text }]}>
                {item.status}
              </AppText>
            </View>
          </View>
          {/* Request ID */}
          <AppText style={styles.requestId}>Request ID :{item?.leadId}</AppText>
        </View>

        {/* Date & Time */}
        <View style={styles.row}>
          <View>
            <AppText style={styles.label}>
              {item.status === 'Cancelled'
                ? 'Cancellation Reason'
                : item.status === 'Completed'
                  ? 'Completion Date'
                  : item.status === 'REQUESTED'
                    ? 'Reviewed on'
                    : 'Inspection Date & Time'}
            </AppText>
            <AppText style={styles.value}>
              {item?.createdAt.split('T')[0]} {'\n'}{item.slot}
            </AppText>
          </View>
          <View style={{ width: wp(25) }}>
            <AppText style={styles.label}>Place Type</AppText>
            <AppText style={styles.value}>{item?.place}</AppText>
          </View>
        </View>

        {/* AC Count */}
        <View style={styles.row}>
          {item.acCount !== null && (
            <View>
              <AppText style={styles.label}>Number of AC</AppText>
              <AppText style={styles.value}>{item?.quantity}</AppText>
            </View>
          )}
          {item.agent && (
            <View style={{ width: wp(25) }}>
              <AppText style={styles.label}>Agent Assigned</AppText>
              <AppText style={styles.value}>
                {'-'}||{item.agent}
              </AppText>
            </View>
          )}
        </View>

        {/* Final Offer & Payment (Completed) */}
        {item.finalOffer && (
          <>
            <View style={styles.row}>
              <View>
                <AppText style={styles.label}>Final Offer</AppText>
                <AppText style={styles.value}>{item.finalOffer}</AppText>
              </View>
              <View style={{ width: wp(25) }}>
                <AppText style={styles.label}>Payment Status</AppText>
                <AppText style={styles.value}>{item.paymentStatus}</AppText>
              </View>
            </View>
          </>
        )}

        {/* Cancellation Reason */}
        {/* {item.cancellationReason && (
          <View style={styles.row}>
            <Text style={styles.label}>Cancellation Reason</Text>
            <Text style={styles.value}>{item.cancellationReason}</Text>
          </View>
        )} */}

        {/* Action Buttons */}
        {/* <View style={styles.actionRow}>
          {item.showReinitiate && (
            <View>
              <Text style={styles.reinitiateText}>Reinitiate Request</Text>
            </View>
          )}

          <View>
            <Text style={styles.reinitiateText}>
              {item.status === 'REQUESTED'
                ? 'Cancel Request'
                : item.status === 'Review' && 'Reschedule Request'}
            </Text>
          </View>

          {item.status === 'Completed' && (
            <View style={styles.ratingRow}>
              <Text style={styles.label}>Rate us</Text>
              <View style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Text
                    key={i}
                    style={
                      i < (item.rating || 0)
                        ? styles.starFilled
                        : styles.starEmpty
                    }
                  >
                    ⭐
                  </Text>
                ))}
              </View>
            </View>
          )}
          <View
            style={styles.viewDetailsBtn}
            onPress={() =>
              navigation.navigate('RequestDetails', { request: item })
            }
          >
            <Text style={styles.viewDetailsText}>View details</Text>
          </View>
        </View> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="My Requests" onBack={() => navigation.goBack()} />
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <AppText
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredRequests}
        keyExtractor={item => item._id}
        renderItem={renderRequestCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <AppText style={styles.emptyText}>
            No requests found in {activeTab.toLowerCase()}
          </AppText>
        }
      />
    </View>
  );
};

// ====================== STYLES ======================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginVertical: hp(1),
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tab: {
    paddingHorizontal: wp(4),
    minWidth: wp(15),
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
  },
  activeTab: {
    borderBottomColor: COLORS.themeColor,
    borderBottomWidth: 2,
    minWidth: wp(15),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(4),
  },
  tabText: {
    fontSize: hp(1.6),
    color: COLORS.textColor,
    fontFamily: Fonts.medium,
    paddingVertical: hp(1),
  },
  activeTabText: {
    color: COLORS.black,
    fontSize: hp(1.6),
    fontFamily: Fonts.semiBold,
    paddingVertical: hp(1),
  },
  list: {
    padding: wp(4),
  },
  emptyText: {
    textAlign: 'center',
    marginTop: hp(5),
    fontSize: hp(2),
    color: '#999',
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(4),
    paddingBottom: wp(4),
    borderRadius: wp(3),
    marginBottom: hp(2),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  skybluecard: {
    width: isTablet ? wp(93) : wp(92),
    backgroundColor: COLORS.lightSky,
    paddingHorizontal: wp(4),
    paddingTop: wp(1.8),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    marginBottom: hp(2),
    elevation: 2,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceText: {
    fontSize: hp(1.6),
    color: '#666',
    fontWeight: '600',
  },
  icon: {
    width: wp(6),
    height: hp(1.5),
    resizeMode: 'cover',
    marginRight: wp(2),
  },
  statusBadge: {
    paddingHorizontal: wp(2),
    paddingBottom: hp(0.5),
    borderRadius: wp(1),
    alignItems: "center"
  },
  statusText: {
    fontSize: hp(1.5),
    fontFamily: Fonts.semiBold,
    textAlign: 'center'
  },
  requestId: {
    fontSize: hp(1.3),
    fontFamily: Fonts.semiBold,
    color: COLORS.textColor,
    marginBottom: hp(1),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
    alignItems: 'flex-start',
  },
  label: {
    fontSize: hp(1.6),
    color: '#666',
    textAlign: 'left',
    marginBottom: hp(0.3),
  },
  value: {
    fontSize: hp(1.4),
    color: COLORS.black,
    fontWeight: '500',
    textAlign: 'left',
  },
  ratingRow: {
    alignItems: 'flex-start',
  },
  stars: {
    flexDirection: 'row',
  },
  starFilled: {
    color: '#FFD700',
    fontSize: hp(1.5),
  },
  starEmpty: {
    color: '#ddd',
    fontSize: hp(1.5),
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
    flexWrap: 'wrap',
    gap: wp(2),
  },
  reinitiateText: {
    color: COLORS.themeColor,
    fontSize: hp(1.7),
    fontFamily: Fonts.semiBold,
    borderBottomColor: COLORS.themeColor,
    borderBottomWidth: 1,
  },
  viewDetailsBtn: {
    backgroundColor: COLORS.themeColor,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(10),
  },
  viewDetailsText: {
    color: COLORS.white,
    fontSize: hp(1.6),
    fontWeight: '600',
  },
});

export default MyRequestsScreen;
