import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SearchWithFilterIcon from '../../components/SearchWithFilterIcon';
import FastImage from 'react-native-fast-image';
import images from '../../assets/images';
import AppText from '../../components/AppText';

const SelectACmodel = ({ navigation, route }) => {
  const Sname = route?.params?.Sname || 'AC';
  const products = [
    // tumhara data same
    {
      id: '1',
      title:
        'Voltas 1 Ph Rot. SAC C2-N Venture I-Cassette AC (2 Ton White) Corded Electric',
      price: 84790,
      originalPrice: 98100,
      discount: '24% off',
      rating: 3.5,
      reviews: 1150,
      freeDelivery: true,
      image: 'https://picsum.photos/200/300',
    },
    {
      id: '2',
      title:
        'Voltas 1 Ph Rot. SAC C2-N Venture I-Cassette AC (2 Ton White) Corded Electric',
      price: 35890,
      originalPrice: 98100,
      discount: '24% off',
      rating: 4.5,
      reviews: 1150,
      freeDelivery: true,
      image: 'https://picsum.photos/200/300',
    },
    {
      id: '3',
      title:
        'Hitachi 1 Ph Rot. SAC C2-N Venture I-Cassette AC (2 Ton White) Corded Electric',
      price: 54890,
      originalPrice: 98100,
      discount: '24% off',
      rating: 4.5,
      reviews: 1150,
      freeDelivery: true,
      image: 'https://picsum.photos/200/300',
    },
    {
      id: '4',
      title:
        'Mitsubishi 1 Ph Rot. SAC C2-N Venture I-Cassette AC (2 Ton White) Corded Electric',
      price: 74890,
      originalPrice: 98100,
      discount: '24% off',
      rating: 4.5,
      reviews: 1150,
      freeDelivery: true,
      image: 'https://picsum.photos/200/300',
    },
  ];
  const stableProducts = useMemo(() => products, []);

  const [filteredProducts, setFilteredProducts] = useState(stableProducts);

  const StarRating = ({ rating }) => (
    <View style={{ flexDirection: 'row' }}>
      {[...Array(5)].map((_, i) => (
        <AppText
          key={i}
          style={{
            color: i < Math.floor(rating) ? '#FFD700' : '#E0E0E0',
            fontSize: 14,
          }}
        >
          {i < Math.floor(rating) ? '★' : '☆'}
        </AppText>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title={`Select ${Sname} Model`}
        onBack={() => navigation.goBack()}
      />

      {/* serah bar */}
      <SearchWithFilterIcon
        initialData={stableProducts}
        onFilterChange={setFilteredProducts}
        placeholder="Search AC, Fans..."
      />

      {/* DATA = filteredProducts (NOT products) */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => {
              navigation.navigate('CompareACScreen', {
                selectedAC: item,
                //   refreshCompare: Date.now() 
              });
            }
            }
          >
            <FastImage source={{ uri: item.image }} style={styles.productImg} />
            <View style={styles.productInfo}>
              <AppText style={styles.productTitle} numberOfLines={2}>
                {item.title}
              </AppText>
              <View style={styles.ratingRow}>
                <StarRating rating={item.rating} />
                <AppText style={styles.reviewCount}>({item.reviews})</AppText>
              </View>
              <View style={styles.ratingRow}>
                <AppText style={styles.price}>₹{item.price.toLocaleString()}</AppText>
                <AppText
                  style={[
                    styles.reviewCount,
                    { textDecorationLine: 'line-through' },
                  ]}
                >
                  ₹{item.originalPrice.toLocaleString()}
                </AppText>
                <AppText style={styles.freeDelivery}>{item.discount}</AppText>
              </View>
              {item.freeDelivery && (
                <AppText style={styles.freeDelivery}>Free Delivery</AppText>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<AppText style={styles.empty}>No products found</AppText>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  productCard: {
    width: wp(45),
    // flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  productImg: {
    width: wp(40),
    height: 108,
    marginTop: 8,
    alignSelf: 'center',
    borderRadius: 8,
  },
  productInfo: { flex: 1, padding: 12 },
  productTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  reviewCount: { fontSize: 12, color: '#666', marginLeft: 6 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  freeDelivery: { color: '#00A650', fontSize: 12, marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 20, color: '#666', fontSize: 16 },
});

export default SelectACmodel;
