import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import useLocation from '../../utils/useLocation';
import CustomLoader from '../../components/CustomLoader';
import AppText from '../../components/AppText';

const NewAddressDemo = () => {
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateName, setStateName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const {
    location,
    error: locationError,
    isLoading: locationLoading,
    retry,
  } = useLocation();

  useEffect(() => {
    if (location) {
      setLatitude(String(location.latitude));
      setLongitude(String(location.longitude));
    }
  }, [location]);

  const validateFields = () => {
    if (!city.trim()) return 'City is required';
    if (!address.trim()) return 'Address is required';
    if (!landmark.trim()) return 'Landmark is required';
    if (!pincode.trim()) return 'Pincode is required';
    if (!/^\d{5,6}$/.test(pincode.trim()))
      return 'Pincode must be 5 or 6 digits';
    if (!stateName.trim()) return 'State is required';
    if (!latitude || isNaN(parseFloat(latitude))) return 'Latitude is invalid';
    if (!longitude || isNaN(parseFloat(longitude)))
      return 'Longitude is invalid';
    return null;
  };

  const handleSubmit = () => {
    const validationError = validateFields();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    const newAddress = {
      city,
      address,
      landmark,
      pincode,
      state: stateName,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    // You can replace this with API call
    console.log('Submitted Address:', newAddress);
    Alert.alert('Success', 'Address added successfully!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText allowFontScaling={false} style={styles.title}>
        Add Address
      </AppText>

      <TextInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={styles.input}
        onSubmitEditing={() => Keyboard.dismiss()}
        allowFontScaling={false}
        includeFontPadding={false}
      />

      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        onSubmitEditing={() => Keyboard.dismiss()}
        allowFontScaling={false}
        includeFontPadding={false}
      />

      <TextInput
        placeholder="Landmark"
        value={landmark}
        onChangeText={setLandmark}
        style={styles.input}
        onSubmitEditing={() => Keyboard.dismiss()}
        allowFontScaling={false}
        includeFontPadding={false}
      />

      <TextInput
        placeholder="Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="number-pad"
        style={styles.input}
        onSubmitEditing={() => Keyboard.dismiss()}
        allowFontScaling={false}
        includeFontPadding={false}
      />

      <TextInput
        placeholder="State"
        value={stateName}
        onChangeText={setStateName}
        style={styles.input}
        onSubmitEditing={() => Keyboard.dismiss()}
        allowFontScaling={false}
        includeFontPadding={false}
      />

      {locationLoading ? (
        <CustomLoader size="large" />
      ) : (
        <>
          <TextInput
            placeholder="Latitude"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="decimal-pad"
            style={styles.input}
            onSubmitEditing={() => Keyboard.dismiss()}
            allowFontScaling={false}
            includeFontPadding={false}
          />

          <TextInput
            placeholder="Longitude"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="decimal-pad"
            style={styles.input}
            onSubmitEditing={() => Keyboard.dismiss()}
            allowFontScaling={false}
            includeFontPadding={false}
          />
        </>
      )}

      {locationError && (
        <AppText style={styles.errorText}>
          Location Error: {locationError}{' '}
          <AppText onPress={retry} style={styles.retryText}>
            Retry
          </AppText>
        </AppText>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} color="#0066CC" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default NewAddressDemo;
