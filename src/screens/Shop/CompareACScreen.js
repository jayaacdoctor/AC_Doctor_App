import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header';
import Commonstyles from '../Home/HomeScreenStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../../assets/images';
import { COLORS, Fonts } from '../../utils/colors';
import FastImage from 'react-native-fast-image';

import { useCompare } from '../../hook/CompareContext';
import AppText from '../../components/AppText';

const CompareACScreen = ({ navigation, route }) => {
  const [selectCompare, setSelectCompare] = useState({});
  const toggleLike = itemId => {
    setSelectCompare(prev => ({
      ...prev,
      [itemId]: !prev[itemId], // Toggle
    }));
  };

  const isLiked = itemId => !!selectCompare[itemId];

  const products = [
    {
      id: '1',
      title:
        'Godrej 1.5 Ton 3 Star Inverter Split AC (Copper, 5-in-1 Convertible, 2023 Model)',
      rating: 4,
      ton: '1.5 Ton 3 Star',
      image: images.ACimage,
      limitedDeal: true,
    },
    {
      id: '2',
      title:
        'Godrej 1.5 Ton 3 Star Inverter Split AC (Copper, 5-in-1 Convertible, 2023 Model)',
      rating: 3,
      ton: '1.5 Ton 3 Star',
      image: images.ACimage,
      limitedDeal: true,
    },
  ];

  //   logic and data store from compareContext screen
  const { selectedACs, addAC, removeAC, allACsForCompare, defaultAC } = useCompare();

  useEffect(() => {
    const newAC = route.params?.selectedAC;

    if (newAC) {
      addAC(newAC);
      navigation.setParams({ selectedAC: undefined });
    }
  }, [route.params?.selectedAC, navigation, addAC]);

  // removeAC aur goToSelect functions same rahenge
  const goToSelect = () => {
    navigation.navigate('BrandScreen', { from: 'CompareACScreen' });
  };

  const goToCompareResult = () => {
    navigation.navigate('CompareResultScreen', {
      acs: allACsForCompare,
    });
  };

  //   flatlist Similar AC render
  const ProductCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <FastImage
          source={item.image}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
        />

        <AppText style={styles.title} numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText style={styles.title} numberOfLines={1}>
          {item.ton}
        </AppText>

        <View style={styles.mrpRow}>
          <AppText style={styles.price}>₹43437.00</AppText>
          <AppText style={styles.mrpPrice}> ₹{item.mrp}</AppText>
        </View>

        <View style={styles.discountRow}>
          <TouchableOpacity
            style={styles.mrpRow}
            onPress={() => toggleLike(item.id)}
          >
            <FastImage
              source={isLiked(item.id) ? images.check : images.uncheck}
              style={[Commonstyles.locationIcon]}
              resizeMode={FastImage.resizeMode.contain}
            />
            <AppText style={styles.mrp}>Compare</AppText>
          </TouchableOpacity>
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <AppText
                  key={i}
                  style={
                    i < (item.rating || 0)
                      ? styles.starFilled
                      : styles.starEmpty
                  }
                >
                  ★
                </AppText>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Header title={'Compare AC'} onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Commonstyles.container}
        contentContainerStyle={{ paddingHorizontal: wp('2.5%') }}
      >
        {/* DEFAULT AC */}
        <View style={[Commonstyles.allSideRadiusStyle, { marginTop: hp(2) }]}>
          {selectedACs.length > 0 && (
            <TouchableOpacity style={styles.removeBtn}>
              <AppText style={styles.removeText}>x</AppText>
            </TouchableOpacity>
          )}
          <View style={Commonstyles.faquestionContainer}>
            <Image source={{ uri: 'https://picsum.photos/200/300' }} style={styles.cardimage} />
            <View style={{ width: wp(55) }}>
              <AppText
                style={[
                  Commonstyles.locationtitle,
                  { color: COLORS.black, lineHeight: 23 },
                ]}
              >
                {defaultAC.title} {/* Context se title */}
              </AppText>
              <AppText style={Commonstyles.mediumText}>
                ₹32,920.00
                {'  '}
                <AppText
                  style={[
                    Commonstyles.locationText,
                    { textDecorationLine: 'line-through', color: '#666' },
                  ]}
                >
                  ₹ 67,546.00
                </AppText>
              </AppText>
            </View>
          </View>
          {selectedACs.length === 0 && (
            <TouchableOpacity
              style={[styles.addButton, { width: wp(90) }]}
              onPress={goToSelect}
            >
              <AppText style={styles.addBtnText}> + Add AC</AppText>
            </TouchableOpacity>
          )}
        </View>

        {/* SELECTED ACs (Context se aayi hui list) */}
        <FlatList
          data={selectedACs}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <View style={styles.vsContainer}>
                <AppText style={styles.vsText}>VS</AppText>
              </View>

              <View
                style={[
                  Commonstyles.allSideRadiusStyle,
                  { marginHorizontal: 16, marginTop: hp(0) },
                ]}
              >
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeAC(item.id)}>
                  <AppText style={styles.removeText}>x</AppText>
                </TouchableOpacity>
                <View style={Commonstyles.faquestionContainer}>
                  <View>
                    <Image source={{ uri: 'https://picsum.photos/200/300' }} style={styles.cardimage} />
                  </View>
                  <View style={{ width: wp(55) }}>
                    <AppText
                      style={[
                        Commonstyles.locationtitle,
                        { color: COLORS.black, lineHeight: 23 },
                      ]}
                    >
                      {item.title}
                    </AppText>

                    <AppText style={Commonstyles.mediumText}>
                      ₹{item.price.toLocaleString()}
                      {'  '}
                      <AppText
                        style={[
                          Commonstyles.locationText,
                          { textDecorationLine: 'line-through', color: '#666' },
                        ]}
                      >
                        ₹{item.originalPrice.toLocaleString()}
                      </AppText>
                    </AppText>
                  </View>
                </View>
                {/* BOTTOM BUTTONS */}
                <View style={styles.bottomBar}>
                  {/* Max 2 check Context state se */}
                  {selectedACs.length < 2 && (
                    <TouchableOpacity
                      style={[
                        styles.addButton,
                        { width: selectedACs.length === 0 ? wp(80) : wp(40) },
                      ]}
                      onPress={goToSelect}
                    >
                      <AppText style={styles.addBtnText}>Add AC</AppText>
                    </TouchableOpacity>
                  )}

                  {selectedACs.length >= 1 && (
                    <TouchableOpacity
                      style={[styles.compareBtn, {
                        width: selectedACs.length === 2 ? wp(85) : wp(40),
                        marginLeft: selectedACs.length === 2 ? wp(0) : wp(4)
                      }]}
                      disabled={selectedACs.length === 0}
                      onPress={goToCompareResult}
                    >
                      <AppText style={styles.compareBtnText}>Compare</AppText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        />

        {/*  Selected Similar ACs */}
        <AppText style={[Commonstyles.mediumText, { marginVertical: hp(1.5) }]}>
          Selected Similar ACs
        </AppText>
        <View>
          <FlatList
            data={products}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ProductCard item={item} />}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CompareACScreen;

const styles = StyleSheet.create({
  cardimage: {
    width: wp(30),
    height: hp('10%'),
    borderRadius: 15,
    resizeMode: 'contain',
  },

  listContent: {
    // marginBottom: hp(15),
  },
  card: {
    width: wp('45%'),
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: hp(1.4),
    fontFamily: Fonts.medium,
    color: '#333',
    marginBottom: 6,
    lineHeight: 18,
  },

  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.themeColor,
    marginBottom: 2,
  },
  mrpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mrp: {
    fontSize: 12,
    color: '#666',
  },
  mrpPrice: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  heartButton: {
    padding: 4,
  },
  heart: {
    fontSize: 20,
  },

  addText: {
    color: COLORS.themeColor,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  ratingRow: {
    alignItems: 'flex-start',
  },
  stars: {
    flexDirection: 'row',
  },
  starFilled: {
    color: COLORS.yellow,
    fontSize: hp(1.3),
  },
  starEmpty: {
    color: '#ddd',
    fontSize: hp(1.3),
  },
  removeBtn: {
    position: 'absolute',
    right: 0,
    top: -2,
    // backgroundColor: '#a56c6cff',
    width: 30,
    height: 30,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 10,
  },
  removeText: { fontSize: 22, color: COLORS.textHeading, textAlign: "center" },
  striked: { textDecorationLine: 'line-through', color: '#999', fontSize: 14 },
  vsContainer: { alignItems: 'center', },
  vsText: {
    backgroundColor: COLORS.themeColor,
    color: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 25,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.themeColor,
    padding: 14,
    borderRadius: 12,
    marginRight: 8,
  },
  outlineBtnText: {
    color: COLORS.themeColor,
    textAlign: 'center',
    fontWeight: '600',
  },
  compareBtn: {
    backgroundColor: COLORS.themeColor,
    padding: 14,
    borderRadius: 8,
  },
  compareBtnText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.themeColor,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    height: hp(5),
  },
  addBtnText: {
    fontSize: hp(1.5),
    fontFamily: Fonts.bold,
    color: COLORS.themeColor,
    textAlign: 'center',
  },
});
