import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/Header';
import { COLORS, Fonts } from '../../utils/colors';
import Commonstyles, { CompareData, WindoData } from '../Home/HomeScreenStyles';
import images from '../../assets/images';
import ReactNativeBlobUtil from 'react-native-blob-util';
import AppText from '../../components/AppText';

const CompareResultScreen = ({ route, navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { acs = [] } = route.params || {};
  const totalACs = acs.length; // 2 ya 3

  // manufacture Toggle
  const toggleExpand = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  // Dynamic column width
  const columnWidth = totalACs === 2 ? wp(48) : wp(32);

  //   downloadBrochure
  const downloadBrochure = (pdfUrl, fileName = 'AC_Brochure.pdf') => {
    const { fs, config } = ReactNativeBlobUtil;
    const dirToSave = fs.dirs.DownloadDir;

    const options = {
      fileCache: false,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: fileName,
        path: `${dirToSave}/${fileName}`,
        description: 'Downloading brochure',
      },
    };

    config(options)
      .fetch('GET', pdfUrl)
      .then(res => {
        console.log('PDF Downloaded:', res.path());
        alert('Brochure downloaded! Check Downloads folder');
      })
      .catch(err => {
        console.log('Download error:', err);
        alert('Download failed. Please try again.');
      });
  };


  return (
    <View style={styles.container}>
      <Header title={'Compare AC'} onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={Commonstyles.container}
        contentContainerStyle={{ paddingHorizontal: wp('2.5%') }}
      >
        {/* TITLE & PRICE */}
        <View style={styles.row}>
          {acs.map((ac, index) => (
            <View key={ac.id} style={[styles.column, { width: columnWidth }]}>
              <FastImage
                source={{ uri: ac.image || ac.image }}
                style={styles.acImage}
              />
              {index < acs.length - 1 && (
                <FastImage source={images.vsBtn} style={styles.VsStyle} />
              )}
              <AppText
                style={[
                  styles.title,
                  { width: acs.length === 2 ? wp(38) : wp(30) },
                ]}
                numberOfLines={3}
              >
                {ac.title}
              </AppText>
              <AppText style={styles.price}>
                ₹{ac.price.toLocaleString()}
                <AppText style={styles.originalPrice}>
                  {' '}
                  ₹{ac.originalPrice.toLocaleString()}
                </AppText>
              </AppText>
            </View>
          ))}
        </View>

        {/* ADD AC BUTTON - Sirf jab 2 AC ho */}
        {totalACs === 2 && (
          <TouchableOpacity style={styles.addAcBtn} onPress={() => navigation.navigate('BrandScreen', { from: 'CompareACScreen' })}>
            <AppText style={styles.addAcText}>Add AC</AppText>
          </TouchableOpacity>
        )}

        {/* COMPARISON TABLE */}
        <View style={styles.table}>
          <View style={styles.conditionView}>
            <AppText style={styles.categoryTitle}>Air Conditioner Category</AppText>
          </View>

          <View style={styles.tableRow}>
            <AppText style={[styles.label, { color: COLORS.darkgreen }]}>
              Window Name
            </AppText>
            {acs.map((ac, index) => (
              // <View style={{ width: wp('20%') }}>
              <AppText
                key={ac.id}
                style={[
                  styles.value,
                  { fontFamily: Fonts.semiBold },
                ]}
                numberOfLines={3}
              >
                {ac.title}
              </AppText>
              // </View>
            ))}
          </View>

          {/* Row 1 */}
          <View style={styles.tableRow}>
            <AppText style={styles.label}>Air- Conditioner Type</AppText>
            {acs.map(ac => (
              <AppText key={ac.id} style={styles.value}>
                Split
              </AppText>
            ))}
          </View>

          {/* Row 2 */}
          <View style={styles.tableRow}>
            <AppText style={styles.label}>Air Conditioner Capacity</AppText>
            {acs.map((ac, i) => (
              <AppText key={ac.id} style={styles.value}>
                {i === 0 ? '1.3 Ton' : '1.5 Ton'}
              </AppText>
            ))}
          </View>

          {/* Row 3 */}
          <View style={styles.tableRow}>
            <AppText style={styles.label}>Coverage Area</AppText>
            {acs.map((ac, i) => (
              <AppText key={ac.id} style={styles.value}>
                {i === 0 ? '150 sq.Ft' : '170 sq.Ft'}
              </AppText>
            ))}
          </View>

          {/* Row 4 */}
          <View style={styles.tableRow}>
            <AppText style={styles.label}>Coverage Area(Sq.ft)</AppText>
            {acs.map((ac, i) => (
              <AppText key={ac.id} style={styles.value}>
                {i === 0 ? '13.93 Sq.M.' : '14.93 Sq.M.'}
              </AppText>
            ))}
          </View>

          {/* Row 5 */}
          <View style={styles.tableRow}>
            <AppText style={styles.label}>Installation Type</AppText>
            {acs.map(() => (
              <AppText style={styles.value}>Wall Mount</AppText>
            ))}
          </View>

          {/* Row 6 - Brochure */}
          <View style={styles.tableRow}>
            <AppText style={styles.label}>Brochure</AppText>
            {acs.map(() => (
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() =>
                  downloadBrochure(
                    'https://www.samsung.com/in/pdf/air-conditioners/WindFree_AC_Brochure.pdf',
                    'Samsung_WindFree_AC.pdf',
                  )
                }
              >
                <AppText style={styles.downloadText}>Download</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Manufactor Items */}
        <View style={{ marginBottom: hp(15) }}>
          {CompareData.map((item, index) => (
            <View key={index} style={[Commonstyles.faqItem]}>
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                style={Commonstyles.faquestionContainer}
              >
                <AppText style={Commonstyles.faquestionText}>{item.question}</AppText>
                <AppText style={Commonstyles.faqarrow}>
                  {expandedIndex === index ? '﹀' : '>'}
                </AppText>
              </TouchableOpacity>

              {expandedIndex === index && (
                <View style={{ paddingHorizontal: hp(1.5) }}>
                  <View style={styles.tableRow}>
                    <AppText style={[styles.label, { color: COLORS.darkgreen }]}>
                      Window Name
                    </AppText>
                    {acs.map((ac, index) => (
                      <View style={{ width: wp('20%') }}>
                        <AppText
                          key={ac.id}
                          style={[
                            styles.value,
                            {
                              fontFamily: Fonts.semiBold,
                              color: COLORS.themeColor,
                            },
                          ]}
                          numberOfLines={3}
                        >
                          {ac.title}
                        </AppText>
                      </View>
                    ))}
                  </View>
                  <View style={styles.tableRow}>
                    <AppText style={styles.label}>{item.secondTitle}</AppText>
                    {acs.map((ac, i) => (
                      <AppText key={ac.id} style={styles.value}>
                        {i === 0 ? 'Voltas' : 'Daikin'}
                      </AppText>
                    ))}
                  </View>
                  <View style={styles.tableRow}>
                    <AppText style={styles.label}>{item.title}</AppText>
                    {acs.map((ac, i) => (
                      <AppText key={ac.id} style={styles.value}>
                        {i === 0 ? 'Vector' : 'Vector'}
                      </AppText>
                    ))}
                  </View>
                  <View style={styles.tableRow}>
                    <AppText style={styles.label}>{item.Thirdtitle}</AppText>
                    {acs.map((ac, i) => (
                      <AppText key={ac.id} style={styles.value}>
                        {i === 0 ? '165v Vector Pearl' : '165v Vector Pearl'}
                      </AppText>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CompareResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  acImage: {
    width: wp(25),
    height: hp(8),
    resizeMode: 'contain',
    backgroundColor: 'pink',
  },
  VsStyle: {
    width: wp(10),
    height: hp(5),
    resizeMode: 'contain',
    position: 'absolute',
    top: hp(2),
    left: hp(22),
    transform: [{ translateX: -wp(6) }],
    borderRadius: wp(10),
  },

  // TITLE & PRICE ROW
  row: {
    width: wp(50),
    flexDirection: 'row',
    paddingVertical: hp(2),
    // paddingHorizontal: wp(7),
    // backgroundColor: COLORS.white,
  },

  column: {
    alignItems: 'center',
  },
  title: {
    fontSize: hp(1.5),
    fontFamily: Fonts.semiBold,
    textAlign: 'left',
    color: '#333',
    marginVertical: hp(1),
    lineHeight: hp(2.2),
  },
  price: {
    fontSize: hp(1.7),
    fontFamily: Fonts.bold,
    color: COLORS.black,
  },
  originalPrice: {
    fontSize: hp(1.5),
    fontFamily: Fonts.bold,
    color: '#999',
    textDecorationLine: 'line-through',
    // marginLeft: wp(2),
  },

  // ADD AC BUTTON
  addAcBtn: {
    width: wp(90),
    marginHorizontal: wp(8),
    paddingVertical: hp(1.3),
    borderWidth: 1,
    borderColor: COLORS.themeColor,
    borderRadius: wp(2),
    alignItems: 'center',
    alignSelf: 'center',
  },
  addAcText: {
    color: COLORS.themeColor,
    fontFamily: Fonts.semiBold,
    fontSize: hp(2),
  },

  // TABLE CONTAINER
  table: {
    marginTop: wp(8),
    margin: wp(2),
    borderRadius: wp(3),
    alignItems: 'center',
    borderColor: '#bbdefb',
    borderWidth: 2,
  },
  conditionView: {
    backgroundColor: COLORS.lightSky,
    width: wp(90),
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: wp(4),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
  },
  categoryTitle: {
    fontSize: hp(2),
    fontFamily: Fonts.semiBold,
    color: COLORS.themeColor,
    textAlign: 'center',
  },

  // TABLE ROWS
  tableRow: {
    flexDirection: 'row',
    paddingVertical: hp(1.6),
    borderBottomWidth: 1,
    borderColor: '#bbdefb',
    alignItems: 'center',
  },
  label: {
    width: wp(26),
    fontSize: hp(1.7),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
    paddingLeft: wp(2),
  },
  value: {
    flex: 1,
    textAlign: 'center',
    fontSize: hp(1.6),
    fontFamily: Fonts.medium,
    color: COLORS.textHeading,
    paddingHorizontal: wp(2),
  },

  // DOWNLOAD BUTTON
  downloadBtn: {
    flex: 1,
    marginHorizontal: wp(2),
    paddingVertical: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadText: {
    color: COLORS.black,
    fontFamily: Fonts.bold,
    fontSize: hp(1.5),
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.themeColor,
  },
});
