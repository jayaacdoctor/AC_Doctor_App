import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/Header';
import { COLORS } from '../../utils/colors';
import AppText from '../../components/AppText';


const ServiceReportscreen = ({ navigation }) => {
  const orderList = [
    {
      orderId: '#12345',
      status: 'Pending',
      category: 'AMC Service',
      issue: 'Water leakage',
      date: '15/03/2026',
      amount: '3540',
      paymentStatus: 'Pending',
      paymentMode: 'Online',
    },
    {
      orderId: '#12345',
      status: 'Completed',
      category: 'AMC Service',
      issue: 'Water leakage',
      date: '15/03/2026',
      amount: '3540',
      paymentStatus: 'complete',
      paymentMode: 'Cash',
    },
  ];

  return (
    <View style={styles.container}>
      {/* ------ Header ------- */}
      <Header title="Service Report" onBack={() => navigation.goBack()} />

      <FlatList
        data={orderList}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: hp('1%') }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* --- Remove Header from here --- */}

            <View style={styles.headerRow}>
              <>
                <AppText style={styles.label}>Order Id {' '}
                  <AppText style={styles.value}>{item.orderId}</AppText></AppText>
              </>
              <View style={[styles.badge, { backgroundColor: item.status === 'Pending' ? COLORS.pendingBg : item.paymentStatus === 'complete' ? COLORS.completedBg : COLORS.onHoldBg }]}>
                <AppText style={[styles.label, { color: item.paymentStatus === 'Pending' ? COLORS.pendingText : item.paymentStatus === 'complete' ? COLORS.completedText : COLORS.onHoldText }]}>{item.paymentStatus}</AppText>
              </View>
            </View>


            {/* Row 1 */}
            <View style={styles.row}>
              <View>
                <AppText style={styles.label}>Category</AppText>
                <AppText style={styles.value}>{item.category}</AppText>
              </View>
              <View>
                <AppText style={styles.label}>Total AC Service</AppText>
                <AppText style={styles.value}>1</AppText>
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.row}>
              <View>
                <AppText style={styles.label}>Issue</AppText>
                <AppText style={styles.value}>{item.issue}</AppText>
              </View>
              <View>
                <AppText style={styles.label}>Date</AppText>
                <AppText style={styles.value}>{item.date}</AppText>
              </View>
            </View>

            {/* Row 3 */}
            <View style={styles.row}>
              <View>
                <AppText style={styles.label}>Total Amount</AppText>
                <AppText style={styles.value}>₹{item.amount}</AppText>
              </View>
              <View>
                <AppText style={styles.label}>Payment Status</AppText>
                <AppText style={styles.value}>{item.paymentStatus}</AppText>
              </View>
            </View>

            {/* Row 4 */}
            <View style={{ marginTop: hp('1%') }}>
              <AppText style={styles.label}>Payment Mode</AppText>
              <AppText style={styles.value}>{item.paymentMode}</AppText>
            </View>
          </View>
        )}
      />
    </View>
  );
};

// ================= STYLES ===================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FB',
  },
  card: {
    width: wp('92%'),
    backgroundColor: '#fff',
    borderRadius: hp('1.3%'),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignSelf: 'center',
    paddingHorizontal: hp('2%'),
    paddingBottom: hp('2%'),
    marginBottom: hp('2%'),
  },

  headerRow: {
    width: wp('91.6%'),
    borderTopLeftRadius: hp('1.3%'),
    borderTopRightRadius: hp('1.3%'),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightSky,
    padding: hp('1%'),
    marginBottom: hp('1.5%'),
    alignItems: 'center',
  },
  orderId: {
    fontSize: hp('1.7%'),
    color: '#6C6C6C',
  },
  orderNumber: {
    fontSize: hp('1.7%'),
    fontWeight: '600',
    color: '#000',
  },
  badge: {
    paddingVertical: hp('0.4%'),
    paddingHorizontal: wp('3%'),
    borderRadius: hp('2%'),
  },
  badgeText: {
    fontSize: hp('1.6%'),
    fontWeight: '600',
  },
  pending: {
    backgroundColor: '#FFF5D6',
  },
  completed: {
    backgroundColor: '#E1FFDA',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.6,
    borderColor: '#E5E5E5',
    paddingBottom: hp('1.3%'),
    marginBottom: hp('1.3%'),
  },
  label: {
    fontSize: hp('1.55%'),
    color: '#898989',
  },
  value: {
    fontSize: hp('1.8%'),
    fontWeight: '600',
    color: '#000',
  },
});

export default ServiceReportscreen;

