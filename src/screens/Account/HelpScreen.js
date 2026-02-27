import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity, Linking,
    Alert
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../../assets/images'; // Your check icon
import { COLORS, Fonts } from '../../utils/colors';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../components/AppText';

const HelpScreen = () => {
    const navigation = useNavigation();
    // const handleCall = () => {
    //     const phoneNumber = 'tel:+918959898989';
    //     Linking.canOpenURL(phoneNumber)
    //         .then(supported => {
    //             if (supported) {
    //                 return Linking.openURL(phoneNumber);
    //             } else {
    //                 Alert.alert('Phone call not supported');
    //             }
    //         })
    //         .catch(err => console.log(err));
    // };

    const handleCall = async () => {
        try {
            await Linking.openURL('tel:+91 8959898989');
        } catch (error) {
            Alert.alert('Error', 'Unable to open dialer');
        }
    };

    const handleEmail = () => {
        try {
            Linking.openURL('mailto:info@acdoctor.in')
        } catch (error) {
            Alert.alert('Unable to open email');
        }
    };



    return (<>
        <Header title='Help' onBack={() => navigation.goBack()} />
        <View style={styles.container}>
            {/* Success Icon */}
            <View style={styles.iconContainer}>
                <Image
                    source={images.helpnotify}
                    style={styles.checkIcon}
                // resizeMode={'contain'}
                />
                <AppText style={styles.helpText}>Hello {'\n'}How can we help you?</AppText>
            </View>
            <TouchableOpacity style={styles.card} onPress={() => handleCall()}>
                <Image source={images.contact} style={styles.contactIcon} resizeMode={'contain'} />
                <AppText style={styles.orderId}>+91 8959898989</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.card, { marginTop: hp(3) }]} onPress={handleEmail}>
                <Image source={images.emailIcon} style={styles.contactIcon} resizeMode={'contain'} />
                <AppText style={styles.orderId}>info@acdoctor.in</AppText>
            </TouchableOpacity>


        </View>
    </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: hp(5),
        marginTop: hp(-16),
    },
    checkIcon: {
        width: wp(40),
        height: wp(40),
    },
    card: {
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#add1f1',
        borderWidth: 1, padding: 10,
        borderRadius: wp(2), width: '95%', alignSelf: 'center'
    },
    orderId: {
        fontSize: hp(1.6),
        fontFamily: Fonts.medium,
        color: COLORS.black,
        textAlign: 'center',
        // marginBottom: 12,
    },
    helpText: {
        fontSize: hp(1.8),
        fontFamily: Fonts.semiBold,
        color: COLORS.gray,
        textAlign: 'center',
        marginTop: hp(2),
    },
    contactIcon: {
        width: wp(7),
        height: wp(5.5),
        marginRight: wp(2),
    },
    message: {
        fontSize: 13,
        color: '#555',
        textAlign: 'center',
        lineHeight: 22,
    }
});

export default HelpScreen;
