import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import images from '../../assets/images';
import Header from '../../components/Header';
import { COLORS, Fonts } from '../../utils/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AppText from '../../components/AppText';




const ListOfBill = ({ navigation }) => {
  const data = [
    { id: 1, ticket: "8998598540", status: "In Progress", icon: images.BillsAMS },
    { id: 2, ticket: "8998598540", status: "On Hold", icon: images.BillsAMS },
    { id: 3, ticket: "8998598540", status: "Completed", icon: images.BillsAMS },
    { id: 4, ticket: "8998598540", status: "In Progress", icon: images.BillsAMS },
    { id: 5, ticket: "8998598540", status: "On Hold", icon: images.BillsAMS },
    { id: 6, ticket: "8998598540", status: "In Progress", icon: images.BillsAMS },
  ];
  const STATUS_COLORS = {
    "In Progress": { bg: COLORS.pendingBg, text: COLORS.pendingBgText },
    "On Hold": { bg: COLORS.onHoldBg, text: COLORS.onHoldText },
    "Completed": { bg: COLORS.completedBg, text: COLORS.completedText },
  };

  const TicketCard = ({ status, item }) => {
    const statusStyle = STATUS_COLORS[status] || STATUS_COLORS["In Progress"];

    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BillViewScreen', { ticketId: item })}>
        {/* LEFT ICON */}
        <View style={styles.leftIconBox}>
          <Image
            source={item.icon}
            style={styles.iconStyle}
          />
        </View>

        {/* MIDDLE CONTENT */}
        <View style={{ flex: 1 }}>
          <AppText style={styles.label}>Ticket ID</AppText>
          <AppText style={styles.ticketId}>{item.ticket}</AppText>
        </View>

        {/* STATUS BADGE */}
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <AppText style={[styles.statusText, { color: statusStyle.text }]}>
            {status}
          </AppText>
        </View>

        {/* ARROW */}
        <Image source={images.rightArrow} style={styles.arrowStyle} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.screen}>
      <Header title="List Of Bills" onBack={() => navigation.goBack()} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TicketCard
            item={item}
            status={item.status}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.lightBackground, // optional
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: hp('1%'),
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: hp('1%'),
    shadowOffset: { width: 0, height: hp('0.5%') },
  },

  leftIconBox: {
    borderRadius: hp('3%'),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp('3%'),
  },

  label: {
    fontSize: hp('1.4%'),
    fontFamily: Fonts.medium,
    color: "#8C8C8C",
  },

  ticketId: {
    fontSize: hp('1.8%'),
    fontFamily: Fonts.semiBold,
    color: "#333",
    marginTop: hp('0.2%'),
  },

  statusBadge: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: hp('2%'),
    marginRight: wp('3%'),
  },

  statusText: {
    fontSize: hp('1.3%'),
    fontFamily: Fonts.medium,
  },

  arrow: {
    fontSize: hp('3%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.darkGray,
  },
  arrowStyle: {
    width: wp('4%'),
    height: wp('4%'),
    resizeMode: 'contain',
  },
  iconStyle: { width: hp('5%'), height: hp('4%'), resizeMode: 'contain' },
});

export default ListOfBill
