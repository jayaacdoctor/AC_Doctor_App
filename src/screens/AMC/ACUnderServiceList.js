import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Header from '../../components/Header';
import { COLORS, Fonts } from '../../utils/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import images from '../../assets/images';
import CustomSearchBar from '../../components/CustomSearchBar';
import AppText from '../../components/AppText';

const ACUnderServiceList = ({ route, navigation }) => {
  const { acType } = route.params;
  const services = [
    {
      id: 1,
      acType: 'Split AC',
      upcomingList: [
        {
          name: 'Living Room',
          model: 'Samsung 1 Ton',
          lastService: 5,
          overdue: 1,
        },
        {
          name: 'Store Room',
          model: 'Voltas 1 Ton',
          lastService: 4,
          overdue: 0,
        },
      ],
      completedList: [
        {
          name: 'Bedroom',
          model: 'Voltas 1.5 Ton',
          lastService: 8,
          overdue: 0,
        },
        { name: 'Office Room', model: 'LG 1 Ton', lastService: 10, overdue: 0 },
      ],
    },
    {
      id: 2,
      acType: 'Cassette AC',
      upcomingList: [
        {
          name: 'Living Room',
          model: 'Samsung 1 Ton',
          lastService: 5,
          overdue: 1,
        },
        {
          name: 'Store Room',
          model: 'Voltas 1 Ton',
          lastService: 4,
          overdue: 0,
        },
      ],
      completedList: [
        {
          name: 'Bedroom',
          model: 'Voltas 1.5 Ton',
          lastService: 8,
          overdue: 0,
        },
        { name: 'Office Room', model: 'LG 1 Ton', lastService: 10, overdue: 0 },
      ],
    },
    {
      id: 3,
      acType: 'Window AC',
      upcomingList: [
        {
          name: 'Living Room',
          model: 'Samsung 1 Ton',
          lastService: 5,
          overdue: 1,
        },
        {
          name: 'Store Room',
          model: 'Voltas 1 Ton',
          lastService: 4,
          overdue: 0,
        },
      ],
      completedList: [
        {
          name: 'Bedroom',
          model: 'Voltas 1.5 Ton',
          lastService: 8,
          overdue: 0,
        },
        { name: 'Office Room', model: 'LG 1 Ton', lastService: 10, overdue: 0 },
      ],
    },
  ];
  //  fliter datalist rendering
  const currentAC = services.find(item => item.acType === acType);
  const upcoming = currentAC?.upcomingList || [];
  const completed = currentAC?.completedList || [];

  //   seraching functionality
  const [searchText, setSearchText] = useState('');
  const filteredUpcoming = upcoming.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const filteredCompleted = completed.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.mainContainer}>
      <Header
        title={`${acType} Under AMC`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <CustomSearchBar
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
          icon={images.searchIcon}
        />

        <View style={styles.mainBox}>
          <AppText style={styles.heading}>Upcoming Service</AppText>
          {filteredUpcoming.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.acBox}
              onPress={() =>
                navigation.navigate('ACServiceDetails', { data: item })
              }
            >
              <View style={styles.acIconCircle}>
                <Image source={images.splitAC} style={styles.acIcon} />
              </View>
              <AppText style={styles.acName}>{item.name}</AppText>
              <View style={styles.acIconCircle}>
                <Image source={images.rightArrow} style={styles.arrowIcon} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.mainBox}>
          <AppText style={styles.heading}>Completed Service</AppText>
          {filteredCompleted.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.acBox}
              onPress={() =>
                navigation.navigate('ACServiceDetails', { data: item })
              }
            >
              <View style={styles.acIconCircle}>
                <Image source={images.splitAC} style={styles.acIcon} />
              </View>
              <AppText style={styles.acName}>{item.name}</AppText>
              <View style={styles.acIconCircle}>
                <Image source={images.rightArrow} style={styles.arrowIcon} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: wp('4%'),
  },
  heading: {
    fontSize: hp('1.7%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
    marginVertical: wp('1.5%'),
  },
  mainBox: {
    backgroundColor: COLORS.white,
    marginVertical: wp('1.5%'),
    paddingHorizontal: wp('3%'),
    paddingBottom: hp('1%'),
    borderRadius: 10,
  },
  acBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    marginVertical: wp('1.5%'),
    borderRadius: 10,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  acIconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  acName: {
    fontSize: hp('1.4%'),
    fontFamily: Fonts.semiBold,
    color: '#333',
    flex: 1,
    marginLeft: wp('4%'),
  },
  acIcon: {
    width: wp('10%'),
    height: wp('7.5%'),
    resizeMode: 'contain',
  },
  arrowIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
  },
});

export default ACUnderServiceList;
