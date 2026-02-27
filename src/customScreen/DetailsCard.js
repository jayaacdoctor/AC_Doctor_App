import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../utils/colors";
import AppText from "../components/AppText";

const DetailsCard = ({
    title = "Details",
    points = [{ title: "Error Code is a specific alphanumeric code displayed on an appliance or device to indicate a malfunction or issue that needs attention." },
    { title: "Error Codes help users and technicians diagnose problems quickly and accurately, facilitating efficient troubleshooting and repairs." },],
    icon,
    containerStyle = {},
}) => {
    return (
        <View style={[styles.card, containerStyle]}>
            <AppText style={styles.header}>{title}</AppText>
            <View style={styles.borderLine} />

            {points.map((item, index) => (
                <View key={index} style={styles.row}>
                    <FastImage source={icon} style={styles.icon} />
                    <AppText style={styles.text}>{item.title}</AppText>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: hp("1.5%"),
        paddingVertical: hp("2%"),
        marginBottom: hp("3%"),
        elevation: 2,
    },
    header: {
        fontSize: hp("2%"),
        fontWeight: "600",
        paddingHorizontal: wp("4%"),
        marginBottom: hp("1%"),
        color: COLORS.black,
    },
    borderLine: {
        height: 1,
        backgroundColor: "#e0e0e0",
        marginBottom: hp("1.5%"),
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: wp("4%"),
        marginBottom: hp("1%"),
    },
    icon: {
        width: wp("4%"),
        height: wp("4%"),
        marginTop: hp("0.5%"),
        marginRight: wp("2%"),
    },
    text: {
        flex: 1,
        fontSize: hp("1.6%"),
        color: "#444",
        lineHeight: hp("2.2%"),
    },
});

export default DetailsCard;
