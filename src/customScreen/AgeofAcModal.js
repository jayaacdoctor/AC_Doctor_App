import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../utils/colors';
import AppText from '../components/AppText';

const AgeofAcModal = ({ visible, onClose, onSelect }) => {
  const [selectedType, setSelectedType] = useState(null);

  const defaultAcTypes = [
    { name: '0-1 year' },
    { name: '1-3 year' },
    { name: '3-5 year' },
    { name: '5+ year' },
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
      activeOpacity={0.7}
    >
      <AppText
        allowFontScaling={false}
        style={[
          styles.buttonText,
          { color: selectedType === item.name ? COLORS.themeColor : '#333' },
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
          <AppText style={styles.headText}>Select Age of AC</AppText>

          <View style={styles.acTypeContainer}>
            <FlatList
              data={defaultAcTypes}
              renderItem={renderAcTypeItem}
              keyExtractor={(item) => item.name}
              numColumns={3}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.acList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.doneButton, !selectedType && { opacity: 0.6 }]}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fbfbfb',
    paddingHorizontal: wp(8),
    paddingTop: hp(2),
    paddingBottom: Platform.OS === 'android' ? hp(4) : hp(5),
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    width: wp('100%'),
    alignSelf: 'center',
  },
  headText: {
    textAlign: 'center',
    fontSize: hp(2),
    fontFamily: Fonts.semiBold,
    color: COLORS.black,
    marginBottom: hp(4),
    textDecorationLine: 'underline',
  },
  acTypeContainer: {
    alignItems: 'flex-start',   // start from left
  },

  row: {
    justifyContent: 'flex-start',  // remove space-around
    alignItems: 'center',
    width: '80%',               // important
    marginBottom: hp(1),
  },

  acList: {
    paddingBottom: hp(2),
  },
  button: {
    backgroundColor: '#FFF',
    borderRadius: wp(2.5),
    paddingVertical: hp(1),
    paddingHorizontal: hp(1),
    marginRight: wp(4),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    width: "auto"
  },
  selectedButton: {
    borderColor: COLORS.themeColor,
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: hp(1.7),
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: COLORS.themeColor,
    borderRadius: wp(6),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(10),
    minWidth: wp(85),
    alignSelf: 'center',
    marginTop: hp(2),
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: hp(2),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AgeofAcModal;
