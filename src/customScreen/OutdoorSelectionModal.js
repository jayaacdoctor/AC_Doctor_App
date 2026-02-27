import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../assets/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../utils/colors';
import AppText from '../components/AppText';

const OutdoorSelectionModal = ({ visible, onClose, onSelect }) => {
  const [selectedType, setSelectedType] = useState(null);

  const handleDone = () => {
    if (selectedType) {
      onSelect(selectedType);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableOpacity style={styles.modalContainer} onPress={onClose}>
        <View style={styles.modalContent}>
          <AppText style={styles.title}>Select Outdoor Condenser Location</AppText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedType === 'Wall mounted low' && styles.selectedButton,
              ]}
              onPress={() => setSelectedType('Wall mounted low')}
            >
              <FastImage
                style={styles.icon}
                source={images.wallCenter}
                resizeMode={FastImage.resizeMode.contain}
              />
              <AppText
                style={[
                  styles.buttonText,
                  {
                    color:
                      selectedType === 'Wall mounted low' && COLORS.themeColor,
                  },
                ]}
              >
                Wall mounted low
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                selectedType === 'Wall mounted high' && styles.selectedButton,
              ]}
              onPress={() => setSelectedType('Wall mounted high')}
            >
              <FastImage
                style={styles.icon}
                source={images.wallMid}
                resizeMode={FastImage.resizeMode.contain}
              />
              <AppText
                style={[
                  styles.buttonText,
                  {
                    color:
                      selectedType === 'Wall mounted high' && COLORS.themeColor,
                  },
                ]}
              >
                Wall mounted high
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                selectedType === 'Wall mounted Floor' && styles.selectedButton,
              ]}
              onPress={() => setSelectedType('Wall mounted Floor')}
            >
              <FastImage
                style={styles.icon}
                source={images.wallDown}
                resizeMode={FastImage.resizeMode.contain}
              />
              <AppText
                style={[
                  styles.buttonText,
                  {
                    color:
                      selectedType === 'Wall mounted Floor' &&
                      COLORS.themeColor,
                  },
                ]}
              >
                Wall mounted Floor
              </AppText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
            disabled={!selectedType}
          >
            <AppText style={styles.doneButtonText}>Done</AppText>
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
    paddingBottom: hp(Platform.OS === 'android' ? 4 : 4),
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: hp(2),
    paddingHorizontal: hp(1),
    margin: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectedButton: {
    borderColor: COLORS.themeColor,
    borderWidth: 1,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: hp(1.4),
    color: '#333',
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: COLORS.themeColor,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 30,
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OutdoorSelectionModal;
