import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import images from '../../assets/images';
import { COLORS, Fonts } from '../../utils/colors';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';

const AppUpdateScreen = () => {
  // render
  return (
    <View style={styles.container}>
      <Image source={images.logoUpdate} style={styles.image} />
      <AppText style={styles.text}>Update Available</AppText>
      <AppText style={styles.description}>New Version, New Vibe. Update now</AppText>
      <CustomButton
        buttonName="Update Now"
        btnTextColor={COLORS.white}
        btnColor={COLORS.themeColor}
        margingTOP={35}
        onPress={() => { }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontFamily: Fonts.extraBold,
    color: COLORS.black,
  },
  description: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: COLORS.gray,
    marginTop: 10,
  },
});

export default AppUpdateScreen;
