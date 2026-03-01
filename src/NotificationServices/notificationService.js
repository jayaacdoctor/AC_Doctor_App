import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  // ✅ Permission + iOS registration
  async requestPermission() {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }

      // ⭐ IMPORTANT FOR iOS
      await messaging().registerDeviceForRemoteMessages();

      const authStatus = await messaging().requestPermission();

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log('Permission Status:', authStatus);

      return enabled;
    } catch (error) {
      console.log('Permission Error:', error);
    }
  }

  // ✅ Get FCM Token
  async getToken() {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('FCM Token:--', token);
      if (token) {
        await AsyncStorage.setItem('fcmToken', token);
        console.log('FCM Token saved:', token);
      }
      return token;
    } catch (error) {
      console.log('Token Error:', error);
    }
  }

  // ✅ Android Channel
  async createChannel() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }

  // ✅ Show Notification (Foreground)
  async displayNotification(remoteMessage) {
    await this.createChannel();

    const title =
      remoteMessage?.notification?.title ||
      remoteMessage?.data?.title ||
      'Notification';

    const body =
      remoteMessage?.notification?.body || remoteMessage?.data?.body || '';

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  // ✅ Foreground Listener
  async onMessageListener() {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message:', remoteMessage);
      this.displayNotification(remoteMessage);
    });
  }

  // ✅ Background Handler
  async backgroundHandler() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background Message:', remoteMessage);
    });
  }

  // ✅ Token Refresh Listener
  tokenRefreshListener() {
    messaging().onTokenRefresh(token => {
      console.log('New FCM Token:', token);
    });
  }

  // ✅ Init (Best Practice)
  async init() {
    await this.requestPermission();
    await this.getToken();
    this.onMessageListener();
    this.backgroundHandler();
    this.tokenRefreshListener();
  }
}

export default new NotificationService();
