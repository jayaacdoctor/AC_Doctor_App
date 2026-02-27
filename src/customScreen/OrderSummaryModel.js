import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import CustomButton from '../components/CustomButton';
import { COLORS } from '../utils/colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppText from '../components/AppText';

const OrderSummaryModal = ({
    visible,
    onClose,
    locationText,
    phoneText,
    slotText,
    images,
    hp,
    OnPressBtn
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.container}>

                    {/* LOCATION */}
                    <View style={styles.row}>
                        <FastImage source={images.locationRed} style={styles.icon} />
                        <AppText style={styles.text} numberOfLines={2}
                            ellipsizeMode="tail"
                        >{locationText?.trim()}</AppText>
                    </View>

                    {/* PHONE */}
                    <View style={[styles.row, { marginVertical: hp('1.5%') }]}>
                        <FastImage
                            source={images.callRed}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                        <AppText style={styles.text}>
                            {phoneText?.trim()}
                        </AppText>
                    </View>

                    {/* SLOT */}
                    <View style={[styles.row, { marginBottom: hp('2%') }]}>
                        <FastImage source={images.timeRed} style={styles.icon} />
                        <AppText style={styles.text}>
                            {slotText?.trim()}
                        </AppText>
                    </View>

                    <CustomButton

                        buttonName={'Proceed Booking'}
                        btnTextColor={COLORS.white}
                        btnColor={COLORS.themeColor}
                        onPress={() => {
                            OnPressBtn()
                        }}
                        margingTOP={20}
                    />

                    <TouchableOpacity
                        style={{
                            marginTop: 15,
                            marginBottom: 5, alignSelf: 'center'
                        }}
                    >
                        <AppText style={[styles.text, { color: 'black' }]}>
                            By proceeding, you agree to our <AppText style={styles.textHeighlight}>Terms & Conditions and Privacy Policy
                                Policy</AppText>
                        </AppText>
                    </TouchableOpacity>

                </View>
            </Pressable>
        </Modal>
    );
};

export default OrderSummaryModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: 'rgb(253, 253, 253)',
        paddingHorizontal: hp('2%'),
        paddingVertical: hp('2%'),
        borderTopLeftRadius: wp('6.5%'),
        borderTopRightRadius: wp('6.5%'),
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        minHeight: hp(38),
        maxHeight: hp(60),
        alignSelf: 'center',
        width: wp('100%'),
        paddingBottom: hp(Platform.OS === 'android' ? 4 : 4),
        marginBottom: hp(0),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        width: '90%',
        marginTop: hp('1.5%')
    },
    icon: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    },
    text: {
        flex: 1,
        fontSize: 16,
        color: '#414040',
        fontWeight: '500',
        marginLeft: 10
    },
    textHeighlight: {
        fontSize: 16,
        color: '#2a80e9',
        fontWeight: '500',
        lineHeight: 22,
        textDecorationLine: 'underline', textDecorationColor: '#2a80e9',
    },
});
