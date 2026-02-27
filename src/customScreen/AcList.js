import React, {
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image, PixelRatio, Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS, Fonts } from '../utils/colors';
import { hp, rf } from '../components/Resposive';
import { isTablet } from '../components/TabletResponsiveSize';
import images from '../assets/images';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scale = size => (SCREEN_WIDTH / 375) * size; // 375 is base iPhone width
const normalize = size => Math.round(PixelRatio.roundToNearestPixel(scale(size)));


const AcList = forwardRef(({ data, onChange }, ref) => {
  const [acList, setAcList] = useState(data);

  // ✅ Increment / Decrement
  const updateCount = (id, type) => {
    const updated = acList.map(item =>
      item.id === id
        ? {
          ...item,
          count:
            type === 'inc' ? item.count + 1 : Math.max(item.count - 1, 0),
        }
        : item,
    );

    setAcList(updated);

    // 🔥 parent ko notify karo
    onChange && onChange(updated);
  };

  // ✅ selected ACs
  const selectedACs = useMemo(
    () => acList.filter(item => item.count > 0),
    [acList],
  );

  // ✅ total count
  const totalCount = useMemo(
    () => selectedACs.reduce((sum, item) => sum + item.count, 0),
    [selectedACs],
  );

  // ✅ expose data to parent via ref
  useImperativeHandle(ref, () => ({
    getSelectedACs: () => selectedACs,
    getTotalCount: () => totalCount,
  }));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.leftRow}>
        <FastImage source={item.icon} style={styles.icon} />
        <Text allowFontScaling={false} style={styles.name}>{item.name}</Text>
      </View>

      {item.count === 0 ? (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => updateCount(item.id, 'inc')}
        >
          <Text allowFontScaling={false} style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.mainCounterView}>
          <TouchableOpacity onPress={() => updateCount(item.id, 'dec')}>
            <Image source={images.minusicon} style={{ width: 15, height: 15, marginRight: 4 }} resizeMode='contain' />
          </TouchableOpacity>

          <Text allowFontScaling={false} style={styles.count}>{item.count}</Text>

          <TouchableOpacity onPress={() => updateCount(item.id, 'inc')}>
            <Image source={images.plusicon} style={{ width: 13, height: 13, marginLeft: 4 }} resizeMode='contain' />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={acList}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      extraData={acList} // 🔥 ensure re-render
    />
  );
});

export default AcList;
/* styles yahin ya common styles file me */
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: normalize(16),
    marginVertical: normalize(4),
    borderRadius: normalize(14),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    minHeight: normalize(10)
  },
  leftRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: normalize(42), height: normalize(42), marginRight: normalize(12) },
  name: { fontSize: isTablet ? rf(9) : rf(13), fontFamily: Fonts.semiBold, color: COLORS.black, flexShrink: 1, },
  addBtn: {
    borderWidth: 0.5,
    borderRadius: normalize(20),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(6),
  },
  addText: { fontWeight: '400', color: 'black', fontSize: normalize(14) },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  counterBtn: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 8 },
  mainCounterView: {
    borderWidth: 1,
    borderRadius: normalize(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(10),
    borderColor: '#ddd',
    minWidth: normalize(80),
  },
  count: {
    fontSize: normalize(16),
    color: COLORS.themeColor,
    fontWeight: '600',
    marginHorizontal: normalize(8),
  },
});
