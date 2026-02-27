import React from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Fonts } from '../../utils/colors'; // Adjust path as needed
import AppText from '../components/AppText'


const ServiceModal = ({ visible, onClose, onSelectService, selectedService }) => {
  const services = [
    { label: 'Installation', value: 'Installation' },
    { label: 'Repair', value: 'Repair' },
    { label: 'Maintenance', value: 'Maintenance' },
  ];

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <AppText style={styles.modalTitle}>Select Service</AppText>
          <FlatList
            data={services}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedService === item.value && styles.modalItemSelected,
                ]}
                onPress={() => {
                  onSelectService(item.value);
                  onClose();
                }}
              >
                <AppText style={styles.modalItemText}>{item.label}</AppText>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <AppText style={styles.modalCloseText}>Close</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp('80%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    borderColor: '#007BFF',
    borderWidth: hp(0.2),
  },
  modalTitle: {
    fontSize: hp('2%'),
    color: '#0056b3',
    fontFamily: Fonts.bold,
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  modalItem: {
    padding: hp('1.5%'),
    borderBottomWidth: hp(0.1),
    borderBottomColor: '#007BFF',
  },
  modalItemSelected: {
    backgroundColor: '#E6F0FA',
  },
  modalItemText: {
    fontSize: hp('1.8%'),
    color: '#0056b3',
    fontFamily: Fonts.medium,
  },
  modalCloseButton: {
    marginTop: hp('2%'),
    padding: hp('1.5%'),
    backgroundColor: '#007BFF',
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: hp('1.8%'),
    color: '#fff',
    fontFamily: Fonts.bold,
  },
});

export default ServiceModal;