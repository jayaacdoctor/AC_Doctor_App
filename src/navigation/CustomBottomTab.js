import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../assets/images';
import HomeScreen from '../screens/Home/HomeScreen';
import ShopScreen from '../screens/Shop/ShopScreen';
import AMCScreen from '../screens/AMC/AMCScreen';
import SmartControlScreen from '../screens/SmartControl/SmartControlScreen';
import AccountScreen from '../screens/Account/AccountScreen';
import { COLORS, Fonts } from '../utils/colors';
import AppText from '../components/AppText';

const Tab = createBottomTabNavigator();

const { width, height } = Dimensions.get('window');
const isTablet = Math.min(width, height) >= 600;

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const getTabImage = (routeName, isFocused) => {
    const imageMap = {
      Home: isFocused ? images.active_home : images.inactive_home,
      Shop: isFocused ? images.active_shop : images.inactive_shop,
      AMC: isFocused ? images.active_AMC : images.inactive_AMC,
      'Smart Control': isFocused ? images.active_cntrl : images.inactive_cntrl,
      Account: isFocused ? images.active_accnt : images.inactive_accnt,
    };
    return imageMap[routeName];
  };

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <FastImage
              source={getTabImage(route.name, isFocused)}
              style={styles.tabIcon}
              resizeMode={FastImage.resizeMode.contain}
            />

            <AppText
              numberOfLines={1}
              style={[
                styles.tabLabel,
                { color: isFocused ? COLORS.themeColor : '#777' },
              ]}
            >
              {route.name}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const CustomBottomTab = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* <Tab.Screen name="Shop" component={ShopScreen} /> */}
      {/* <Tab.Screen name="AMC" component={AMCScreen} /> */}
      {/* <Tab.Screen name="Smart Control" component={SmartControlScreen} /> */}
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: isTablet ? 90 : 70,
    paddingHorizontal: isTablet ? 30 : 10,
    paddingVertical: isTablet ? 12 : 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 10,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabIcon: {
    width: isTablet ? 34 : 24,
    height: isTablet ? 34 : 24,
    marginBottom: isTablet ? 6 : 4,
  },

  tabLabel: {
    fontSize: isTablet ? 14 : 11,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
});

export default CustomBottomTab;
