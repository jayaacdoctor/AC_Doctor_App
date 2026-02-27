import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS, Fonts } from '../utils/colors';
import images from '../assets/images';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { isTablet } from '../components/TabletResponsiveSize';
import AppText from '../components/AppText';

const ACTypeSelector = ({
  onChange,
  acTypes: customAcTypes = [],
  headingText,
  ShapeRADIUS,
  HeadingStyle,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});

  // Default AC types (static array)
  const defaultAcTypes = [
    { name: 'Split AC', count: 2, showButtons: false, acIcon: images.splitAC },
    {
      name: 'Window AC',
      count: 0,
      showButtons: false,
      acIcon: images.windowAc,
    },
    {
      name: 'Cassette AC',
      count: 1,
      showButtons: false,
      acIcon: images.casseteAc,
    },
    { name: 'VRV/VRF AC', count: 0, showButtons: false, acIcon: images.VRVac },
    {
      name: 'Ducted AC',
      count: 0,
      showButtons: false,
      acIcon: images.ductedAc,
    },
    {
      name: 'Chiller AC',
      acIcon: images.chilarIcon,
      count: 0,
      showButtons: false,
    },
    { name: 'Tower AC', count: 0, showButtons: false, acIcon: images.towerAc },
  ];

  // Use customAcTypes if provided, otherwise use default
  const finalAcTypes =
    customAcTypes.length > 0 ? customAcTypes : defaultAcTypes;

  // Add or update count
  const handleAddItem = itemName => {
    const updatedItems = {
      ...selectedItems,
      [itemName]: (selectedItems[itemName] || 0) + 1,
    };
    setSelectedItems(updatedItems);
    onChange(updatedItems);
  };

  // Decrease count or remove item
  const handleMinusItem = itemName => {
    setSelectedItems(prev => {
      const newCount = prev[itemName] - 1;
      if (newCount <= 0) {
        const { [itemName]: _, ...rest } = prev;
        onChange(rest);
        return rest;
      }
      const updated = { ...prev, [itemName]: newCount };
      onChange(updated);
      return updated;
    });
  };

  // Remove item or decrease count
  const handleRemoveItem = itemName => {
    setSelectedItems(prev => {
      const newCount = prev[itemName] - 1;
      if (newCount <= 0) {
        const { [itemName]: _, ...rest } = prev;
        onChange(rest);
        return rest;
      }
      const updated = { ...prev, [itemName]: newCount };
      onChange(updated);
      return updated;
    });
  };

  // Render selected items as chips
  const renderChips = () => {
    return Object.entries(selectedItems).map(([itemName, count]) => (
      <View key={itemName} style={styles.chipContainer}>
        <AppText style={styles.chipText}>{`${itemName} - ${count}`}</AppText>
        <TouchableOpacity onPress={() => handleRemoveItem(itemName)}>
          <AppText style={styles.removeText}>×</AppText>
        </TouchableOpacity>
      </View>
    ));
  };

  // Ensure hooks are called before any conditional returns
  if (!onChange) {
    console.warn('onChange prop is missing in ACTypeSelector');
    return null; // Safe early return after hooks
  }

  return (
    <>
      <View style={styles.inputGroup}>
        <AppText style={[styles.label, HeadingStyle]}>{headingText}</AppText>
        <TouchableOpacity
          style={[styles.pickerWrapper, { borderRadius: ShapeRADIUS }]}
          onPress={() => setModalVisible(true)}
        >
          <AppText style={styles.placeholder}>Select AC type</AppText>
          <FastImage
            source={images.arrowdown}
            style={styles.customIcon}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>

        {Object.keys(selectedItems).length > 0 ? (
          <View style={styles.chipsWrapper}>{renderChips()}</View>
        ) : (
          <View style={{ marginTop: -25 }} />
        )}
      </View>
      <Modal
        transparent={true}
        animationType="slide"

        visible={isModalVisible}
      // style={{ backgroundColor: "red" }}
      // onRequestClose={() => setModalVisible(false)}
      >
        <View

          style={styles.modalBackground}
        // onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={finalAcTypes}
              keyboardShouldPersistTaps="never"
              keyExtractor={item => item.name}
              renderItem={({ item }) => {
                const count = selectedItems[item.name] || 0;
                return (
                  <View
                    style={[styles.item, { backgroundColor: COLORS?.white, justifyContent: 'space-between' }]}
                  >
                    <View
                      style={{
                        // flex: 1,
                        justifyContent: "space-between",
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <FastImage
                        source={item.acIcon}
                        style={styles.customIAccon}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                      <AppText style={styles.itemText}>{item.name}</AppText>
                    </View>
                    {count === 0 ? (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddItem(item.name)}
                      >
                        <AppText style={styles.addButtonText}> + Add</AppText>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.minusButton}>
                        <TouchableOpacity
                          onPress={() => handleMinusItem(item.name)}
                        >
                          <AppText style={styles.minusButtonText}>-</AppText>
                        </TouchableOpacity>
                        <AppText style={styles.countText}>{count}</AppText>
                        <TouchableOpacity onPress={() => handleAddItem(item.name)}>
                          <AppText style={styles.addButtonText}>+</AppText>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }}
            />
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setModalVisible(false)}
            >
              <AppText style={styles.doneButtonText}>Done</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  label: {
    fontSize: hp('1.6%'),
    color: COLORS.black,
    marginVertical: 10,
    fontFamily: Fonts.semiBold,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 8,
    width: wp(88),
    alignSelf: 'center',
  },
  placeholder: {
    flex: 1,
    fontSize: wp(4),
    color: '#666',
  },
  customIcon: {
    width: isTablet ? wp(3) : wp(4),
    height: isTablet ? wp(3) : wp(4),
    // tintColor: '#c37e7eff',
  },
  customIAccon: {
    width: wp(8),
    height: hp(5),
    marginRight: 15,
    // tintColor: '#c37e7eff',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // marginBottom: 10,
    padding: 17,
    width: '100%',
    maxHeight: '70%',
    alignSelf: 'center',
    paddingBottom: hp(Platform.OS === 'android' ? 2 : 4),
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    // width: '100%',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  countText: {
    fontSize: 16,
    color: '#666',
  },
  chipsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8eef5ff',
    borderRadius: 10,
    paddingHorizontal: 5,
    height: 30,
    // width:'35%',
    marginRight: 5,
    marginVertical: 5,
  },
  chipText: {
    fontSize: 13,
    color: '#333',
  },
  removeText: {
    fontSize: 16,
    color: '#989595ff',
    marginLeft: 5,
  },
  doneButton: {
    backgroundColor: '#2683e6ff',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.textHeading,
    borderRadius: 17,
  },
  addButtonText: {
    fontSize: 13.5,
    color: '#333',
    fontWeight: '500'
  },
  minusButton: {
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.textHeading,
    borderRadius: 20,
    paddingHorizontal: 12.5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  minusButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500'
  },
  countText: {
    fontSize: 16,
    marginHorizontal: 10,
    color: COLORS.themeColor,
  },
});

export default ACTypeSelector;
