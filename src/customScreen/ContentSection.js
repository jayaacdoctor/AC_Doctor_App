import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../assets/images';
import { COLORS, Fonts } from '../utils/colors';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { isTablet } from '../components/TabletResponsiveSize';
import AppText from '../components/AppText';

const ContentSection = ({
  activeSection,
  setActiveSection,
  keyBenefits,
  serviceInclusions,
  termsConditions,
}) => {
  const renderContent = () => {
    if (activeSection === 'Key Benefits') {
      return (
        <View style={styles.detailCont}>
          {keyBenefits.map((item, index) => (
            <View
              key={index}
              style={[
                styles.detailCont,
                { backgroundColor: COLORS.white, marginVertical: 10 },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FastImage
                  source={images.pointDes}
                  style={{
                    width: 30,
                    height: 30,
                    marginRight: heightPercentageToDP('1%'),
                    alignSelf: 'center',
                  }}
                />
                <AppText style={styles.texthead}>{item.title}</AppText>
              </View>
              <>
                <AppText
                  style={[
                    styles.textdes,
                    {
                      marginLeft: isTablet
                        ? widthPercentageToDP(5)
                        : widthPercentageToDP('10%'),
                    },
                  ]}
                >
                  {item.desc}
                </AppText>
              </>
            </View>
          ))}
        </View>
      );
    } else if (activeSection === 'Description') {
      return (
        <View style={[styles.detailCont]}>
          {serviceInclusions.map((section, index) => (
            <View
              key={index}
              style={[
                styles.detailCont,
                { backgroundColor: COLORS.white, marginBottom: 10 },
              ]}
            >
              {/* Title */}
              {section.title && (
                <AppText
                  style={[
                    styles.texthead,
                    { marginVertical: widthPercentageToDP('1%') },
                  ]}
                >
                  {section.title}
                </AppText>
              )}

              {/* Items */}
              {section.items.map((item, itemIndex) => (
                <AppText key={itemIndex} style={[styles.textdes]}>
                  • {item}
                </AppText>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (activeSection === 'Terms & Conditions') {
      return (
        <View style={[styles.detailCont, { backgroundColor: COLORS.white }]}>
          <AppText
            style={[
              styles.texthead,
              { marginVertical: widthPercentageToDP('1.5%') },
            ]}
          >
            Terms & Conditions
          </AppText>
          {termsConditions.map((item, index) => (
            <AppText key={index} style={[styles.textdes]}>
              {' '}
              • {item.text}
            </AppText>
          ))}
        </View>
      );
    }
    return null;
  };

  return (
    <View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderBottomColor:
                activeSection === 'Key Benefits'
                  ? COLORS.themeColor
                  : 'transparent',
            },
          ]}
          onPress={() => setActiveSection('Key Benefits')}
        >
          <AppText style={[styles.tabText, { color: activeSection === 'Key Benefits' ? COLORS.black : COLORS.textHeading }]}>Key Benefits</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderBottomColor:
                activeSection === 'Description'
                  ? COLORS.themeColor
                  : 'transparent',
            },
          ]}
          onPress={() => setActiveSection('Description')}
        >
          <AppText style={[styles.tabText, { color: activeSection === 'Description' ? COLORS.black : COLORS.textHeading }]}>Description</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderBottomColor:
                activeSection === 'Terms & Conditions'
                  ? COLORS.themeColor
                  : 'transparent',
            },
          ]}
          onPress={() => setActiveSection('Terms & Conditions')}
        >
          <AppText style={[styles.tabText, { color: activeSection === 'Terms & Conditions' ? COLORS.black : COLORS.textHeading }]}>Terms & Conditions</AppText>
        </TouchableOpacity>
      </View>
      <ScrollView>{renderContent()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderBottomWidth: 2,
    marginRight: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    borderRadius: widthPercentageToDP('1%'),
  },
  tabText: {
    fontSize: heightPercentageToDP('1.7%'),
    fontFamily: Fonts.semiBold,
    color: COLORS.textHeading,
  },
  detailCont: {
    width: widthPercentageToDP('95%'),
    paddingHorizontal: heightPercentageToDP('1.5%'),
    borderRadius: widthPercentageToDP('3%'),
    alignSelf: 'center',
  },
  textdes: {
    fontSize: heightPercentageToDP('1.5%'),
    fontFamily: Fonts.regular,
    textAlign: 'left',
    color: COLORS.textHeading,
    letterSpacing: 0.5,
    lineHeight: heightPercentageToDP('2.2%'),
  },
  texthead: {
    fontSize: heightPercentageToDP('1.5%'),
    fontFamily: Fonts.semiBold,
    textAlign: 'left',
    color: COLORS.black,
    alignSelf: 'flex-start',
  },
});

export default ContentSection;
