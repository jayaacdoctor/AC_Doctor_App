import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    useColorScheme,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getTNotificationDetail } from '../../api/profileApi';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/Header';
import { COLORS, Fonts } from '../../utils/colors';
import AppText from '../../components/AppText';

const NotificationDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const scheme = useColorScheme();

    const notificationID = route?.params?.notificationId;
    // Alert.alert(`Notification ID: ${notificationID}`);

    const [notification, setNotification] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchNotificationDetail();
    }, [notificationID]);

    const fetchNotificationDetail = async () => {
        try {
            setLoading(true);

            console.log('Notification ID:', notificationID);

            const res = await getTNotificationDetail(notificationID);

            console.log('API Response:', res);

            if (res?.status) {
                setNotification(res?.data);
            } else {
                Alert.alert('Error', 'Failed to load details.');
            }
        } catch (error) {
            console.log('Error fetching notification detail:', error);

            Alert.alert(
                'Error',
                error?.response?.data?.message || 'Something went wrong',
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = dateString => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const optionsDate = {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
        };
        const optionsTime = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };

        const formattedDate = date.toLocaleDateString('en-IN', optionsDate);
        const formattedTime = date.toLocaleTimeString('en-IN', optionsTime);

        return `${formattedDate}  •  ${formattedTime}`;
    };

    const formattedDate = formatDateTime(notification?.createdAt);

    return (
        <View style={styles.container}>
            <Header title={notification?.title} onBack={() => navigation.goBack()} />

            {/* Date */}
            <AppText style={[styles.dateText]}>{formattedDate}</AppText>

            {/* Message Card */}
            <View style={styles.card}>
                <AppText style={styles.messageText}>{notification?.text}</AppText>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomContainer}>
                <Text style={styles.bottomText}>Can’t reply</Text>
            </View>
        </View>
    );
};

export default NotificationDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    backText: {
        fontSize: 22,
        fontWeight: '600',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
    },

    dateText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 5,
        color: COLORS.TextColor,
        marginTop: 15,
    },

    card: {
        marginTop: 25,
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        backgroundColor: COLORS.lightWhite,
    },

    messageText: {
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.TextColor,
    },

    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingVertical: 18,
        alignItems: 'center',
        backgroundColor: '#c2bebe',
    },

    bottomText: {
        fontSize: hp('2%'),
        fontWeight: Fonts.bold,
        color: COLORS.TextColor,
    },
});
