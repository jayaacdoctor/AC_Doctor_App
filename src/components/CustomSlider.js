import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Image, Dimensions, StyleSheet, ImageBackground } from 'react-native';
import { isTablet } from './TabletResponsiveSize';
import { wp, hp } from '../components/Resposive';

const COLORS = {
  lightGray: '#F5F5F5',
  gray: '#999999',
  accent: '#FF6F61',
};

const CustomSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (!images || images.length === 0) return;

    const autoplayInterval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(autoplayInterval);
  }, [images]);

  const handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }) => (
    <View style={styles.sliderview}>
      <View style={styles.imageWrapper}>
        <ImageBackground
          source={
            item?.logo
              ? { uri: item.logo }
              : { item }
          }
          imageStyle={styles.imageBorder}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );

  const dotSize = wp('2%');
  const dotMargin = wp('1.5%');
  const dotTopPosition = hp('12%');

  return (
    <View style={{ flex: 1 }}>
      {images && images.length > 0 ? (
        <FlatList
          ref={flatListRef}
          style={{
            marginRight: isTablet ? wp(2.4) : wp(3),
            marginLeft: isTablet ? wp(0.6) : wp(1),
            maxHeight: isTablet ? hp(30) : hp(18),
          }}
          data={images}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      ) : (
        <View style={styles.sliderview}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: 'https://via.placeholder.com/800x400' }}
              style={styles.image}
              imageStyle={styles.imageBorder}
              resizeMode="cover"
            />
          </View>
        </View>
      )}

      {images && images.length > 1 && (
        <View style={[styles.dots, { top: dotTopPosition }]}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  marginHorizontal: dotMargin,
                  backgroundColor:
                    index === currentIndex ? COLORS.accent : COLORS.gray,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderview: {
    marginTop: hp(1),
    marginHorizontal: isTablet ? wp(1.6) : wp(2),
    maxHeight: isTablet ? hp(30) : hp(18),
  },
  imageWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },

  image: {
    width: isTablet ? wp(95) : wp(93),
    height: isTablet ? hp(28) : hp(17),
  },

  imageBorder: {
    borderRadius: 10, // 👈 same as wrapper
  },
  dots: {
    position: 'absolute',
    width: '100%',
    height: hp('14%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    borderRadius: 999,
  },
});

export default CustomSlider;
