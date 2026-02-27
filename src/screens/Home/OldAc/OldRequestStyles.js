import { StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../../utils/colors';
import { isTablet } from '../../../components/TabletResponsiveSize';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: hp(1),
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: hp(1),
        backgroundColor: COLORS.white,
        marginVertical: hp(2),
        borderRadius: wp(4),
    },
    tab: {
        alignItems: 'center',
        paddingHorizontal: wp(2),
    },
    tabNumber: {
        fontSize: hp(1.8),
        fontWeight: Fonts.medium,
        color: '#333',
        width: wp(5.3),
        textAlign: 'center',
        marginRight: wp(1),
        borderRadius: hp(6),
    },
    tabText: {
        fontSize: hp(1.6),
        fontWeight: Fonts.medium,
        color: '#333',
    },
    section: {
        backgroundColor: COLORS.white,
        marginVertical: hp(1),
        borderRadius: wp(3),
        paddingHorizontal: hp(1),
        elevation: 2,
    },
    statusBar: {
        backgroundColor: '#e9f4fb',
        padding: hp(0.5),
        paddingHorizontal: hp(1),
        borderTopLeftRadius: wp(3),
        borderTopRightRadius: wp(3),
        width: isTablet ? wp(98) : wp(95.5),
        alignSelf: 'center',
    },
    statusBarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: wp(1),
    },
    icon: {
        width: wp(6),
        height: wp(6),
        resizeMode: 'contain',
    },
    statusText: {
        fontSize: hp(1.5),
        fontFamily: Fonts.medium,
        color: COLORS.textHeading,
        marginLeft: wp(1),
    },
    statusBadge: {
        borderRadius: wp(1),
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(2),
        // marginRight: wp(2),
        marginTop: hp(1),
    },
    statusBadgeText: {
        fontSize: hp(1.3),
        fontFamily: Fonts.medium,
        color: '#ee9937ff',
    },
    detailRow: {
        paddingVertical: hp(0.3),
        justifyContent: 'center',
        alignSelf: 'center',
    },
    copperRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp(0.9),
        borderBottomColor: COLORS.lightGray,
        borderBottomWidth: wp(0.1),
    },
    label: {
        fontSize: hp(1.5),
        fontFamily: Fonts.medium,
        color: '#666',
        marginBottom: wp(1),
    },
    value: {
        fontSize: hp(1.4),
        fontFamily: Fonts.medium,
        color: COLORS.black,
    },
    sectionTitle: {
        fontSize: hp(1.6),
        fontFamily: Fonts.medium,
        color: COLORS.black,
        paddingVertical: hp(0.5),
    },
    photoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(1),
    },
    photo: {
        width: wp(26),
        height: hp(12),
        borderRadius: wp(2.5),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: wp(6),
        padding: hp(1),
    },
    playIconImage: {
        width: wp(5),
        height: hp(2),
        tintColor: COLORS.white,
    },
    noteText: {
        fontSize: hp(1.5),
        fontFamily: Fonts.regular,
        color: COLORS.TextColor,
        textAlign: 'left',
        marginVertical: hp(1),
    },
    agentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        padding: hp(1.5),
        borderRadius: wp(1),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginVertical: hp(1),
    },
    agentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    agentImage: {
        width: wp(13),
        height: wp(15),
        borderRadius: wp(2),
        marginRight: wp(3),
    },
    agentText: {
        flexShrink: 1,
    },
    agentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    agentName: {
        fontSize: hp(1.5),
        fontFamily: Fonts.medium,
        color: COLORS.black,
        marginLeft: wp(1),
    },
    agentTitle: {
        fontSize: hp(1.3),
        color: '#666',
    },
    actionButtons: {
        alignItems: 'center',
    },
    viewProfileButton: {
        paddingVertical: hp(0.8),
        paddingHorizontal: wp(3),
    },
    viewProfileText: {
        fontSize: hp(1.4),
        color: COLORS.themeColor,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    chatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(3),
        borderRadius: wp(2),
        borderWidth: wp(0.1),
        borderColor: COLORS.themeColor,
    },
    chatIcon: {
        width: wp(9),
        height: hp(2.5),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: hp(2),
        backgroundColor: COLORS.white,
        paddingBottom: wp(6),
    },
    doneButton: {
        width: wp(42),
        paddingVertical: hp(1.5),
        alignItems: 'center',
        borderWidth: wp(0.1),
        borderColor: COLORS.textHeading,
        borderRadius: wp(6),
    },
    secondButton: {
        backgroundColor: COLORS.themeColor,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: hp(1.8),
        fontWeight: '500',
    },
    IconImage: {
        width: wp(4),
        height: hp(1.5),
    },
    showiconStyle: {
        width: wp(6),
        height: hp(3),
        marginHorizontal: wp(1),
        resizeMode: 'contain',
    },
    acHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderLeftWidth: wp(1.5),
        borderLeftColor: COLORS.themeColor,
        backgroundColor: COLORS.white,
        width: wp('90%'),
        alignSelf: 'center',
        marginTop: wp(3),
    },
    acItem: {
        borderRadius: wp(2),
        backgroundColor: COLORS.white,
        alignSelf: 'center',
        width: wp('90%'),
        padding: wp(3),
        marginTop: wp(2),
    },
    acTitle: {
        fontSize: hp(1.6),
        fontFamily: Fonts.semiBold,
        color: COLORS.black,
    },
    arrow: {
        fontSize: hp(1.6),
        color: COLORS.textColor,
    },
    inputGroup: {
        marginTop: hp('1%'),
        // marginHorizontal: wp('2%'),
        backgroundColor: COLORS.white,
        borderRadius: wp('2%'),
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('2%'),
    },
    pickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffffff',
        borderRadius: wp('9%'),
        borderWidth: hp(0.1),
        borderColor: '#ddd',
        overflow: 'hidden',
        height: hp('5%'),
        width: wp('90%'),
        alignSelf: 'center',
    },
    photosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 8,
    },

    imageWrapper: {
        width: '30%',  // 3 images per row
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },

    image: {
        width: '100%',
        height: '100%',
    },

});
export default styles;