import { useState, useEffect, useRef } from 'react';
import {
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
  AppState,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const GOOGLE_API_KEY = 'AIzaSyCnpSWXWK0qVlrprVD8SKHdO7J0LGUKkfs';

const useCurrentLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [addressText, setAddressText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const appState = useRef(AppState.currentState);
  const shouldRetry = useRef(false);


  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active' &&
        shouldRetry.current
      ) {
        shouldRetry.current = false; // reset
        getLocation();
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);



  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS
  };

  const reverseGeocode = async (lat, lon) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_API_KEY}`,
    );

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(data.error_message || 'Geocode failed');
    }

    const result = data.results[0];
    const components = result.address_components || [];

    const get = type =>
      components.find(c => c.types.includes(type))?.long_name || '';
    // console.log(result, 'lolololo');
    return {
      fullAddress: result.formatted_address,
      house: get('street_number'),
      road: get('route'),
      area: get('sublocality') || get('locality'),
      city: get('locality'),
      state: get('administrative_area_level_1'),
      pincode: get('postal_code'),
      country: get('country'),
    };
  };

  const getLocation = async (onSuccess) => {
    setLoading(true);
    setError(null);

    const permissionGranted = await requestPermission();

    if (!permissionGranted) {
      setError('Location permission denied');
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;

        setLatitude(lat);
        setLongitude(lon);

        try {
          const addressObj = await reverseGeocode(lat, lon);
          setAddressText(addressObj.fullAddress);

          onSuccess?.({
            latitude: lat,
            longitude: lon,
            address: addressObj,
          });
        } catch (e) {
          setError('Failed to fetch address');
        }

        setLoading(false);
      },

      (err) => {
        setLoading(false);

        // 🔥 IMPORTANT PART (GPS OFF)
        if (err.code === 2) {
          Alert.alert(
            'Location Disabled',
            'Please turn on location first to continue.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Turn On',
                onPress: () => {
                  shouldRetry.current = true;

                  if (Platform.OS === 'android') {
                    Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
                  } else {
                    Linking.openURL('App-Prefs:Privacy&path=LOCATION');
                  }
                },
              },
            ]
          );
        } else {
          setError(err.message);
        }
      },

      {
        enableHighAccuracy: false, // 🔥 important
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };


  return {
    latitude,
    longitude,
    addressText,
    loading,
    error,
    getLocation,
  };
};

export default useCurrentLocation;