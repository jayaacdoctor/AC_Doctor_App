import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomBottomTab from './CustomBottomTab';
import LoginScreen from '../screens/authscreen/LoginScreen';
import SplashScreen from '../screens/authscreen/SplashScreen';
import VerificationScreen from '../screens/authscreen/VerificationScreen';
import MapScreen from '../screens/authscreen/MapScreen';
import ServiceScreen from '../screens/authscreen/ServiceScreen';
import NewAddressDemo from '../screens/LocationAddress/NewAddressDemo';
import AddAddress from '../screens/Home/AddAddress';
import ViewCartScreen from '../screens/Home/ViewCartScreen';
import PaymentScreen from '../screens/Account/PaymentScreen';
import GasChargeScreen from '../screens/Home/GasChargeScreen';
import FreeConsultant from '../screens/Home/FreeConsultant';
import CopperPipeScreen from '../screens/Home/CopperScreen/CopperPipeScreen';
import RequestDetail from '../screens/Home/CopperScreen/RequestDetail';
import SellOldAcScreen from '../screens/Home/OldAc/SellOldAcScreen';
import BrandScreen from '../screens/Home/OldAc/BrandScreen';
import OldACRequest from '../screens/Home/OldAc/OldACRequest';
import ProfileDetail from '../screens/Account/ProfileDetail';
import ManageAddressScreen from '../screens/Account/ManageAddressScreen';
import NotificationScreeen from '../screens/Account/NotificationScreeen';
import NotificationDetailScreen from '../screens/Account/NotificationDetailScreen';
import MyRequestsScreen from '../screens/Account/MyRequestsScreen';
import MyBookingScreen from '../screens/Account/MyBookingScreen';
import OtherScreen from '../screens/Home/Other/OtherScreen';
import OtherCartView from '../screens/Home/Other/OtherCartView';
import TonnageCalculatorScreen from '../screens/Home/Utilities/TonnageCalculatorScreen';
import ErrorCodeScreen from '../screens/Home/Utilities/ErrorCodeScreen';
import ErrorDetails from '../screens/Home/Utilities/ErrorDetails';
import ProductListScreen from '../screens/Shop/ProductListScreen';
import ProductDetailScreen from '../screens/Shop/ProductDetailScreen';
import OrderSummaryScreen from '../screens/Shop/OrderSummaryScreen';
import CompareACScreen from '../screens/Shop/CompareACScreen';
import BookingSuccessScreen from '../customScreen/BookingSuccessScreen';
import SelectACmodel from '../screens/Shop/SelectACmodel';
import CompareResultScreen from '../screens/Shop/CompareResultScreen';
import AMCFrom from '../screens/AMC/AMCFrom';
import AMCRequestFrom from '../screens/AMC/AMCRequestFrom';
import AMCDashBoard from '../screens/AMC/AMCDashBoard';
import ReqBookingAMC from '../screens/AMC/ReqBookingAMC';
import ListOfBill from '../screens/AMC/ListOfBill';
import ACUnderServiceList from '../screens/AMC/ACUnderServiceList';
import ACServiceDetails from '../screens/AMC/ACServiceDetails';
import BillViewScreen from '../screens/AMC/BillViewScreen';
import ConfirmService from '../screens/AMC/ConfirmService'; // --- IGNORE ---
import PaymentlistScreen from '../screens/AMC/PaymentlistScreen'; // --- IGNORE
import ServiceReportscreen from '../screens/AMC/ServiceReportscreen';
import BookingDetailsScreen from '../screens/Account/BookingDetailsScreen';
import CouponScreen from '../screens/Home/CouponScreen';
import AppUpdateScreen from '../screens/authscreen/AppUpdateScreen';
import ProductDetails from '../screens/Home/ProductDetails';
import FeaturedProductsScreen from '../screens/Home/FeaturedProductsScreen';
import HelpScreen from '../screens/Account/HelpScreen';

import { COLORS } from '../utils/colors';
import { StatusBar, useColorScheme, Platform } from 'react-native';
import { CompareProvider } from '../hook/CompareContext';

LogBox.ignoreAllLogs(true);

const Stack = createStackNavigator();
const AppNavigator = () => {
  const scheme = useColorScheme();
  const [initialRoute, setInitialRoute] = useState(null);

  // Dynamic styles based on theme
  const dynamicStyles = {
    safeArea: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? 0 : 0, // Android ke liye dynamic padding, iOS pe SafeArea handle karega
      backgroundColor: scheme === 'dark' ? '#090909ff' : '#ffffffff',
    },
    headerStyle: {
      backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#ffffff',
    },
    headerTitleStyle: {
      color: scheme === 'dark' ? COLORS.white : '#000000',
    },
    headerBackTitleStyle: {
      color: scheme === 'dark' ? COLORS.white : '#000000',
    },
    headerTintColor: {
      tintColor: scheme === 'dark' ? COLORS.white : '#000000',
    },
  };

  return (
    <SafeAreaProvider style={dynamicStyles.safeArea}>
      <CompareProvider>
        <StatusBar
          barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={scheme === 'dark' ? '#000000' : '#ffffff'}
          translucent={Platform.OS === 'android'}
        />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
              headerStyle: dynamicStyles.headerStyle,
              headerTitleStyle: dynamicStyles.headerTitleStyle,
              headerBackTitleStyle: dynamicStyles.headerBackTitleStyle,
              headerTintColor: dynamicStyles.headerTintColor.tintColor,
              headerShown: false,
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="AppUpdate" component={AppUpdateScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
            <Stack.Screen name="AddAddress" component={AddAddress} />
            <Stack.Screen name="NewAddressDemo" component={NewAddressDemo} />
            <Stack.Screen name="Tab" component={CustomBottomTab} />
            <Stack.Screen name="ViewCart" component={ViewCartScreen} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen name="GasChargeScreen" component={GasChargeScreen} />
            <Stack.Screen name="FreeConsultant" component={FreeConsultant} />
            <Stack.Screen
              name="CopperPipeScreen"
              component={CopperPipeScreen}
            />
            <Stack.Screen name="RequestDetail" component={RequestDetail} />
            <Stack.Screen name="SellOldAcScreen" component={SellOldAcScreen} />
            <Stack.Screen name="BrandScreen" component={BrandScreen} />
            <Stack.Screen name="OldACRequest" component={OldACRequest} />
            <Stack.Screen name="ProfileDetail" component={ProfileDetail} />
            <Stack.Screen
              name="ManageAddressScreen"
              component={ManageAddressScreen}
            />
            <Stack.Screen
              name="NotificationScreeen"
              component={NotificationScreeen}
            />
            <Stack.Screen
              name="NotificationDetailScreen"
              component={NotificationDetailScreen}
            />
            <Stack.Screen
              name="MyRequestsScreen"
              component={MyRequestsScreen}
            />
            <Stack.Screen name="MyBookingScreen" component={MyBookingScreen} />
            <Stack.Screen name="OtherScreen" component={OtherScreen} />
            <Stack.Screen name="OtherCartView" component={OtherCartView} />
            <Stack.Screen
              name="TonnageCalculatorScreen"
              component={TonnageCalculatorScreen}
            />
            <Stack.Screen name="ErrorCodeScreen" component={ErrorCodeScreen} />
            <Stack.Screen name="ErrorDetails" component={ErrorDetails} />
            <Stack.Screen
              name="ProductListScreen"
              component={ProductListScreen}
            />
            <Stack.Screen
              name="ProductDetailScreen"
              component={ProductDetailScreen}
            />
            <Stack.Screen
              name="OrderSummaryScreen"
              component={OrderSummaryScreen}
            />
            <Stack.Screen name="CompareACScreen" component={CompareACScreen} />
            <Stack.Screen name="SelectACmodel" component={SelectACmodel} />
            <Stack.Screen
              name="CompareResultScreen"
              component={CompareResultScreen}
            />
            <Stack.Screen
              name="BookingSuccessScreen"
              component={BookingSuccessScreen}
            />
            <Stack.Screen name="AMCFrom" component={AMCFrom} />
            <Stack.Screen name="AMCRequestFrom" component={AMCRequestFrom} />
            <Stack.Screen name="AMCDashBoard" component={AMCDashBoard} />
            <Stack.Screen name="ReqBookingAMC" component={ReqBookingAMC} />
            <Stack.Screen name="ListOfBill" component={ListOfBill} />
            <Stack.Screen
              name="ACUnderServiceList"
              component={ACUnderServiceList}
            />
            <Stack.Screen
              name="ACServiceDetails"
              component={ACServiceDetails}
            />
            <Stack.Screen name="BillViewScreen" component={BillViewScreen} />
            <Stack.Screen name="ConfirmService" component={ConfirmService} />
            <Stack.Screen
              name="PaymentlistScreen"
              component={PaymentlistScreen}
            />
            <Stack.Screen
              name="ServiceReportscreen"
              component={ServiceReportscreen}
            />
            <Stack.Screen
              name="BookingDetailsScreen"
              component={BookingDetailsScreen}
            />
            <Stack.Screen name="CouponScreen" component={CouponScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="HelpScreen" component={HelpScreen} />
            <Stack.Screen name="FeaturedProductsScreen" component={FeaturedProductsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CompareProvider>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
