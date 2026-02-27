// src/components/Header.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import images from '../assets/images'; // Adjust path if needed
import COLORS, { Fonts } from '../utils/colors'; // Adjust path if needed
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { isTablet } from './TabletResponsiveSize';
import AppText from './AppText';

const Header = ({
  title = 'My App',
  onBack,
  onHelp,
  onAddImage,
  AddIcon,
  onImgclick,
}) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();

  // Dynamic styles based on scheme
  const dynamicStyles = {
    safeArea: {
      backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#ffffff',
    },
    backText: {
      color: scheme === 'dark' ? '#ffffff' : '#000000',
    },
    title: {
      color: scheme === 'dark' ? '#ffffff' : '#000000',
    },
    helpIcon: {
      tintColor: scheme === 'dark' ? '#ffffff' : '#000000',
    },
    extraIcon: {
      tintColor: scheme === 'dark' ? '#ffffff' : '#000000',
    },
  };

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: Platform.OS === 'android' ? insets.top : insets.top,
          backgroundColor: dynamicStyles.safeArea.backgroundColor,
        },
      ]}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Image
              source={images.backArrow}
              style={[styles.backIcon, dynamicStyles.extraIcon]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, { flex: 1 }]}
        >
          <AppText style={[styles.title, dynamicStyles.title]}>{title}</AppText>
        </TouchableOpacity>
        {onHelp && (
          <TouchableOpacity style={styles.helpButton} onPress={onHelp}>
            <Image
              source={images.questionIcon}
              style={[styles.helpIcon, dynamicStyles.helpIcon]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        {onAddImage && (
          <TouchableOpacity style={styles.helpButton} onPress={onImgclick}>
            <Image
              source={AddIcon}
              style={[styles.extraIcon, dynamicStyles.extraIcon]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    // Base styles, dynamic color will be overridden
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    paddingRight: wp('3%'),
  },
  backIcon: {
    width: isTablet ? wp(3) : wp('5%'),
    height: isTablet ? wp(3) : wp('5%'),
    resizeMode: 'contain',
  },
  title: {
    fontSize: isTablet ? wp(3) : wp('4%'),
    fontFamily: Fonts.semiBold,
    textAlign: 'left',
    marginLeft: wp('2'),
  },
  helpButton: {
    paddingLeft: wp('3%'),
  },
  helpIcon: {
    width: wp('6%'),
    height: wp('6%'),
  },
  extraIconButton: {
    paddingLeft: wp('3%'),
  },
  extraIcon: {
    width: wp('6%'),
    height: wp('6%'),
  },
});

export default Header;
