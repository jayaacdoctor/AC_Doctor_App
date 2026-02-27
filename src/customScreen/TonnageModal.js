import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../assets/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../utils/colors';
import AppText from '../components/AppText';

const TonnageModal = ({ visible, onClose, onSelect }) => {
  const [selectedType, setSelectedType] = useState(null);

  const defaultAcTypes = [
    { name: '1 Ton' },
    { name: '1.5 Ton' },
    { name: '2 Ton' },
    { name: '2.5 Ton' },
    { name: '5+ Ton' },
  ];

  const handleDone = () => {
    if (selectedType) {
      onSelect(selectedType);
      onClose();
    }
  };

  const renderAcTypeItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.button,
        selectedType === item.name && styles.selectedButton,
      ]}
      onPress={() => setSelectedType(item.name)}
    >
      <AppText
        style={[
          styles.buttonText,
          { color: selectedType === item.name ? '#4a90e2' : '#333' },
        ]}
      >
        {item.name}
      </AppText>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableOpacity
        style={styles.modalContainer}
        onPress={onClose}
        activeOpacity={1}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.headText}>Select AC Tonnage</Text>

          <View style={styles.acTypeContainer}>
            <FlatList
              data={defaultAcTypes}
              renderItem={renderAcTypeItem}
              keyExtractor={item => item.name}
              numColumns={3}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.acList}
            />
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
            disabled={!selectedType}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: wp(5),
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignSelf: 'center',
    width: wp('100%'),
    paddingBottom: hp(Platform.OS === 'android' ? 4 : 5),
  },
  headText: {
    textAlign: 'center',
    fontSize: hp(1.8),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
    marginBottom: hp(1),
    textDecorationLine: 'underline'
  },
  button: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: hp(0.8),
    margin: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    // width: wp(20),
  },
  selectedButton: {
    borderColor: COLORS.themeColor,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: hp(1.7),
    color: '#333',
    fontFamily: Fonts.medium,
    paddingHorizontal: wp(2)
  },
  doneButton: {
    backgroundColor: COLORS.themeColor,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TonnageModal;
