import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { Alert, Linking, Platform, View, Text, TextInput } from 'react-native';

import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import React, { useEffect } from 'react';

import { initRemoteConfig } from './src/services/remoteConfig';
import { requestNotificationPermission } from './src/services/notificationPermission';
import { setupPushListeners } from './src/services/pushHandler';
import messaging from '@react-native-firebase/messaging';
import { getAppVersion } from './src/utils/appVersion';
import remoteConfig from '@react-native-firebase/remote-config';
import { isUpdateRequired } from './src/utils/versionCompare';
import notifee, { AndroidImportance } from '@notifee/react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import NotificationService from './src/NotificationServices/notificationService';
export default function App() {
  useEffect(() => {
    // 🔹 Set navigation bar color
    SystemNavigationBar.setNavigationColor('black');
    NotificationService.init();
    // 🔹 Optional: light or dark icons
    // SystemNavigationBar.setNavigationColor('light');
    // 'light' = white icons
    // 'dark'  = black icons
  }, []);

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    // console.log('Permission enabled:', enabled);
  };

  // 🔹 Get FCM token
  const getFcmToken = async () => {
    const token = await messaging().getToken();
    // console.log('FCM TOKEN:', token);
  };

  // 🔹 Create notification channel (Android)
  const createChannel = async () => {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
  };
  useEffect(() => {
    init();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
        },
      });
    });

    // 🔔 Background → app opened by notification
    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log('Opened from background:', remoteMessage);
    });

    // 🔔 Killed → app opened by notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // console.log('Opened from quit state:', remoteMessage);
        }
      });

    return unsubscribe;
  }, []);
  const init = async () => {
    await initRemoteConfig();
    await checkForceUpdate();
    // await requestNotificationPermission();
    // await getFcmToken();
    // await setupPushListeners();
    // requestPermission();
    // getFcmToken();
    // createChannel();
  };

  const checkForceUpdate = async () => {
    const currentVersion = getAppVersion();

    const forceUpdate = remoteConfig().getBoolean('force_update');
    const latestVersion =
      Platform.OS === 'android'
        ? remoteConfig().getString('latest_version_android')
        : remoteConfig().getString('latest_version_ios');

    const updateMessage = remoteConfig().getString('update_message');
    const storeUrl =
      Platform.OS === 'android'
        ? remoteConfig().getString('android_store_url')
        : remoteConfig().getString('ios_store_url');

    if (forceUpdate && isUpdateRequired(currentVersion, latestVersion)) {
      Alert.alert(
        'Update Available',
        updateMessage,
        [
          {
            text: 'Update Now',
            onPress: () => Linking.openURL(storeUrl),
          },
        ],
        { cancelable: false },
      );
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
