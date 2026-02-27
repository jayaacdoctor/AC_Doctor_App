import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import CustomButton from '../../components/CustomButton'; // Assume yeh hai
import { COLORS } from '../../utils/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppText from '../../components/AppText';

const MapScreen = ({ navigation }) => {
  const [position, setPosition] = useState({
    latitude: 22.7196, // Default Indore
    longitude: 75.8577,
  });
  const [address, setAddress] = useState('Loading address...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Current location fetch
    Geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });
        getAddressFromCoords(latitude, longitude);
      },
      (error) => Alert.alert('Error', 'Location permission denied'),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  // Reverse geocode: Lat/Long se address get
  const getAddressFromCoords = async (lat, lng) => {
    try {
      //   const response = await axios.get(
      //     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_GOOGLE_API_KEY` // Replace with your key
      //   );
      // if (response.data.results.length > 0) {
      //   setAddress(response.data.results[0].formatted_address);
      // }
    } catch (error) {
      console.error('Geocode error:', error);
      setAddress('Address not found');
    }
    setLoading(false);
  };

  const handleConfirm = () => {
    if (address && address !== 'Loading address...') {
      navigation.navigate('Home', { selectedAddress: { lat: position.latitude, lng: position.longitude, formatted: address } });
    } else {
      Alert.alert('Error', 'Please select a location');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // Google Maps use
        style={styles.map}
        initialRegion={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        onPress={(e) => {
          setPosition(e.nativeEvent.coordinate);
          getAddressFromCoords(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
        }}
      >
        <Marker
          coordinate={position}
          draggable
          onDragEnd={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setPosition({ latitude, longitude });
            getAddressFromCoords(latitude, longitude);
          }}
          title="Selected Location"
          description="Drag to select exact spot"
        />
      </MapView>
      <View style={styles.bottomContainer}>
        <AppText style={styles.addressText}>{loading ? 'Fetching...' : address}</AppText>
        <CustomButton
          buttonName="Confirm Location"
          btnColor={COLORS.themeColor}
          onPress={handleConfirm}
          disabled={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp('5%'),
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  addressText: { fontSize: hp('1.8%'), marginBottom: hp('2%'), textAlign: 'center' },
});

export default MapScreen;