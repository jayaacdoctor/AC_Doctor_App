import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import images from '../assets/images';
import { COLORS } from '../utils/colors';
import AppText from '../components/AppText';

const { width } = Dimensions.get("window");

const RequestConfirm = ({
  visible,
  onClose,
  onViewRequest,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      {/* Dark Background */}
      <View style={styles.overlay}>

        {/* Center Card */}
        <View style={styles.card}>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <AppText style={{ fontSize: hp(3), color: "#555" }}>×</AppText>
          </TouchableOpacity>

          {/* Tick Icon */}
          <FastImage
            source={images.SuccessIcon} // Put your tick icon
            style={styles.icon}
            resizeMode="contain"
          />

          {/* Title */}
          <AppText style={styles.title}>Successful!</AppText>

          {/* Subtitle */}
          <AppText style={styles.subtitle}>
            Your AMC Request has been successfully submitted.
          </AppText>

          <AppText style={styles.smallText}>
            Our team will respond shortly.
          </AppText>

          {/* Divider */}
          <View style={styles.line} />

          {/* Buttons Row */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.outlineBtn} onPress={onViewRequest}>
              <AppText style={styles.outlineBtnText}>View Request</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fillBtn} onPress={onClose}>
              <AppText style={styles.fillBtnText}>Done</AppText>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default RequestConfirm;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: wp("4%"),
    paddingVertical: hp("3%"),
    paddingHorizontal: wp("5%"),
    alignItems: "center",
    position: "relative"
  },

  closeBtn: {
    position: "absolute",
    top: hp("1.2%"),
    right: wp("4%"),
    zIndex: 10
  },

  icon: {
    width: wp("20%"),
    height: wp("20%"),
    marginTop: hp("1%"),
  },

  title: {
    fontSize: hp("3%"),
    fontWeight: "700",
    color: "#0E1A2E",
    marginTop: hp("2%"),
  },

  subtitle: {
    textAlign: "center",
    marginTop: hp("1%"),
    fontSize: hp("1.7%"),
    color: "#161515ff",
    fontWeight: "600",
    // width: "90%",
  },
  smallText: {
    marginTop: hp("0.8%"),
    color: "#777",
    fontSize: hp("1.6%"),
    fontWeight: "400",
  },

  line: {
    height: 1,
    backgroundColor: "#E5E5E5",
    width: "100%",
    marginTop: hp("2%"),
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: hp("2%"),
  },

  outlineBtn: {
    width: "48%",
    borderWidth: 1,
    borderColor: COLORS.themeColor,
    paddingVertical: hp("1%"),
    borderRadius: wp("7%"),
    justifyContent: "center",
    alignItems: "center",
  },

  outlineBtnText: {
    color: COLORS.themeColor,
    fontSize: hp("1.8%"),
    fontWeight: "600",
  },

  fillBtn: {
    width: "48%",
    backgroundColor: COLORS.themeColor,
    paddingVertical: hp("1%"),
    borderRadius: wp("7%"),
    justifyContent: "center",
    alignItems: "center",
  },

  fillBtnText: {
    color: "#fff",
    fontSize: hp("2%"),
    fontWeight: "600",
  },
});
