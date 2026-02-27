import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../utils/colors';
import images from '../../assets/images';
import FastImage from 'react-native-fast-image';
import Header from '../../components/Header';
import HomeScreenStyles from './HomeScreenStyles';
import CustomButton from '../../components/CustomButton';
import WorkInfo from '../../customScreen/WorkInfo';
import { isTablet } from '../../components/TabletResponsiveSize';
import { rf } from '../../components/Resposive';
import AppText from '../../components/AppText';

const CommericalAc = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeSection, setActiveSection] = useState('Key Benefits');
  const [isExpanded, setIsExpanded] = useState({});
  const [acTypes, setAcTypes] = useState([
    {
      name: 'Ducted AC',
      count: { repair: 0, installation: 0, service: 0 },
      showButtons: false,
      acIcon: images.ducted,
      totalCount: 0,
    },
    {
      name: 'VRV/VRF AC',
      count: { repair: 0, installation: 0, service: 0 },
      showButtons: false,
      acIcon: images.VRVac,
      totalCount: 0,
    },
    {
      name: 'Tower AC',
      count: { repair: 0, installation: 0, service: 0 },
      showButtons: false,
      acIcon: images.towerAc,
      totalCount: 0,
    },
  ]);

  const toggleExpandAC = index => {
    setIsExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleIncrement = (index, type) => {
    setAcTypes(prevAcTypes =>
      prevAcTypes.map((ac, i) => {
        if (i !== index) return ac;

        const newCount = { ...ac.count, [type]: ac.count[type] + 1 };
        const newTotal =
          newCount.repair + newCount.installation + newCount.service;

        return {
          ...ac,
          count: newCount,
          totalCount: newTotal,
          showButtons: newTotal > 0,
        };
      }),
    );
  };

  const handleDecrement = (index, type) => {
    setAcTypes(prevAcTypes =>
      prevAcTypes.map((ac, i) => {
        if (i !== index) return ac;

        const newCount = {
          ...ac.count,
          [type]: Math.max(0, ac.count[type] - 1),
        };
        const newTotal =
          newCount.repair + newCount.installation + newCount.service;

        return {
          ...ac,
          count: newCount,
          totalCount: newTotal,
          showButtons: newTotal > 0,
        };
      }),
    );
  };

  const renderCounter = (value, onIncrement, onDecrement) => {
    return value > 0 ? (
      <View style={styles.counter}>
        <TouchableOpacity style={styles.counterButton} onPress={onDecrement}>
          <AppText style={styles.counterText}>-</AppText>
        </TouchableOpacity>
        <AppText style={styles.counterValue}>{value}</AppText>{' '}
        {/* ← Fixed: was `count` */}
        <TouchableOpacity style={styles.counterButton} onPress={onIncrement}>
          <AppText style={styles.counterText}>+</AppText>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity onPress={onIncrement}>
        <AppText style={styles.addText}>+ Add</AppText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={HomeScreenStyles.workcontainer}>
      <Header
        title="Commerical Ac"
        onBack={() => navigation.goBack()}
      // onHelp={() => alert('Help for Home')}
      />

      <ScrollView
        style={HomeScreenStyles.workscrollstyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={HomeScreenStyles.worksliderview}>
          <Image source={images.bannerOne} style={HomeScreenStyles.workimage} />
        </View>

        <AppText style={HomeScreenStyles.workheadText}>Select Type of AC</AppText>

        {acTypes.map((ac, index) => (
          <View key={index} style={HomeScreenStyles.card}>
            <TouchableOpacity
              style={styles.header}
              onPress={() => toggleExpandAC(index)}
            >
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => toggleExpandAC(index)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FastImage
                    source={ac.acIcon}
                    style={styles.workacIconstyle}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <AppText style={[styles.title, { marginLeft: wp(3) }]}>
                    {ac.name}
                  </AppText>

                  {ac.showButtons ? (
                    <View style={HomeScreenStyles.workbuttonContainer}>
                      <TouchableOpacity
                        style={HomeScreenStyles.workbutton}
                        onPress={() => {
                          const activeType =
                            ac.count.repair > 0
                              ? 'repair'
                              : ac.count.installation > 0
                                ? 'installation'
                                : ac.count.service > 0
                                  ? 'service'
                                  : 'repair';
                          handleDecrement(index, activeType);
                        }}
                      >
                        <AppText style={HomeScreenStyles.workbuttonText}>-</AppText>
                      </TouchableOpacity>
                      <AppText style={HomeScreenStyles.workcount}>
                        {ac.totalCount}
                      </AppText>
                      <TouchableOpacity
                        style={HomeScreenStyles.workbutton}
                        onPress={() => handleIncrement(index, 'repair')}
                      >
                        <AppText style={styles.workbuttonText}>+</AppText>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleIncrement(index, 'repair')}
                    >
                      <AppText style={styles.addText}>+ Add</AppText>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
              {isExpanded[index] && (
                <View style={styles.subOptions}>
                  <View style={styles.subOption}>
                    <AppText style={styles.subText}>Repair</AppText>
                    {renderCounter(
                      ac.count.repair,
                      () => handleIncrement(index, 'repair'),
                      () => handleDecrement(index, 'repair'),
                    )}
                  </View>
                  <View style={styles.subOption}>
                    <AppText style={styles.subText}>Installation</AppText>
                    {renderCounter(
                      ac.count.installation,
                      () => handleIncrement(index, 'installation'),
                      () => handleDecrement(index, 'installation'),
                    )}
                  </View>
                  <View style={styles.subOption}>
                    <AppText style={styles.subText}>Service</AppText>
                    {renderCounter(
                      ac.count.service,
                      () => handleIncrement(index, 'service'),
                      () => handleDecrement(index, 'service'),
                    )}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}

        <WorkInfo />
      </ScrollView>

      {/* Services and View Cart Section */}
      <View style={HomeScreenStyles.servicesSection}>
        <CustomButton
          buttonName="View Cart"
          margingTOP={hp('0%')}
          btnTextColor={COLORS.white}
          btnColor={COLORS.themeColor}
          onPress={() =>
            navigation.navigate('ViewCart', { screenName: 'Commerical AC' })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#751a1aff',
    borderRadius: 8,
    marginBottom: hp('1%'),
    elevation: 2,
  },
  header: {
    paddingVertical: wp('2%'),
    paddingHorizontal: hp(1),
    backgroundColor: COLORS.white,
    borderRadius: hp(1),
    marginBottom: hp(1),
  },
  icon: {
    width: wp('10%'),
    height: wp('10%'),
    marginRight: wp('3%'),
    alignItems: 'center',
    resizeMode: 'contain',
  },
  workacIconstyle: {
    width: isTablet ? wp(8) : wp(11),
    height: isTablet ? wp(8) : wp(11),
  },
  title: {
    flex: 1,
    fontSize: isTablet ? rf(9) : rf(13),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
  },
  // addButton: {
  //   borderColor: '#bcc4c6ff',
  //   borderWidth: wp(0.3),
  //   padding: wp('2%'),
  //   paddingHorizontal: hp('2%'),
  //   borderRadius: hp(2),
  // },
  // addText: { color: '#34495E', fontSize: wp('4%') },
  addButton: {
    borderWidth: 0.5,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  addText: { fontWeight: '400', color: 'black' },
  subOptions: { padding: wp('1%') },
  subOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  subText: { fontSize: isTablet ? wp(2.3) : wp('3%'), color: '#34495E' },
  counter: { flexDirection: 'row', alignItems: 'center' },
  counterButton: {
    width: isTablet ? wp(5) : wp('7%'),
    height: isTablet ? wp(5) : wp('7%'),
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  counterText: { fontSize: isTablet ? wp(2.5) : hp('3%'), color: '#34495E' },
  counterValue: {
    fontSize: isTablet ? wp(2) : wp('4%'),
    color: '#34495E',
    marginHorizontal: wp('2%'),
  },
  // Add other styles as needed from HomeScreenStyles.js
});

export default CommericalAc;
