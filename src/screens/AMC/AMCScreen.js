import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import Header from '../../components/Header';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import images from '../../assets/images';
import { COLORS, Fonts } from '../../utils/colors';
import WorkInfo from '../../customScreen/WorkInfo';
import { isTablet } from '../../components/TabletResponsiveSize';
import AppText from '../../components/AppText';

const AMCScreen = ({ navigation }) => {
  const items = [
    { id: 1, title: 'Selected AMC Option', value: 'Office' },
    { id: 2, title: 'Type of AMC', value: 'Comprehensive' },
    { id: 3, title: 'Selected AMC Option', value: 'Shop' },
    { id: 4, title: 'Type of AMC', value: 'Comprehensive' },
    { id: 5, title: 'Selected AMC Option', value: 'Home' },
    { id: 6, title: 'Type of AMC', value: 'Comprehensive' },
  ];

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('AMCDashBoard')}
    >
      <View style={styles.iconView}>
        <Image source={images.OfficeAMC} style={styles.icon} />
      </View>

      <AppText style={styles.title}>{item.title}</AppText>
      <AppText style={styles.value}>{item.value}</AppText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="AMC" onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        {/* Banner */}
        <Image source={images.bannerAmc} style={styles.bannerImg} />

        {/* FlatList Grid */}
        <FlatList
          data={items}
          renderItem={({ item }) => renderCard({ item })}
          keyExtractor={item => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          scrollEnabled={false}
        />

        <WorkInfo />
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        activeOpacity={0.8}
        // onPress={() => navigation.navigate("Chat")}
        accessibilityLabel="Open chat"
      >
        <Image source={images.amcCall} style={styles.chatIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default AMCScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },

  bannerImg: {
    width: isTablet ? wp(93) : wp(93),
    height: isTablet ? wp(45) : wp(45),
    borderRadius: wp(4),
    resizeMode: 'contain',
  },
  /* Grid */
  grid: {
    paddingHorizontal: wp(4),
  },
  card: {
    width: wp('29%'),
    backgroundColor: COLORS.white,
    borderRadius: wp(3),
    paddingVertical: hp(1),
    marginBottom: hp(2),
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOpacity: 0.07,
    shadowRadius: wp(2),
    shadowOffset: { width: 0, height: hp(0.5) },
    elevation: 1.5,
  },

  /* Icon Container */
  iconView: {
    borderRadius: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? hp(1) : hp(2),
  },

  /* Icon */
  icon: {
    width: isTablet ? wp(95) : wp(95),
    height: isTablet ? wp(10) : wp(15),
    resizeMode: 'contain',
  },

  /* Text inside card */
  title: {
    fontSize: hp(1.3),
    color: COLORS.TextColor,
    textAlign: 'center',
    fontFamily: Fonts.medium,
  },

  value: {
    fontSize: hp(1.5),
    fontFamily: Fonts.medium,
    color: COLORS.black,
    marginTop: hp(0.5),
    textAlign: 'center',
  },

  /* Floating Chat Button */
  chatButton: {
    position: 'absolute',
    bottom: hp(12),
    right: wp(4),
    width: wp(16), // previously 64px
    height: wp(16), // keeping it perfectly circular
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },

  chatIcon: {
    width: wp(15),
    height: wp(15),
    resizeMode: 'contain',
  },
});
