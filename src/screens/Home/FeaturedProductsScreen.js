import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { getFeaturedProducts } from '../../api/homeApi'
import Header from '../../components/Header';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS, Fonts } from '../../utils/colors';
import images from '../../assets/images';
import StarRating from '../../customScreen/StarRating';
import AppText from '../../components/AppText';

const FeaturedProductsScreen = ({ navigation }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [selectedTon, setSelectedTon] = useState('All');

    // 📡 Fetch products
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await getFeaturedProducts(1, 20); // load more for filtering
            const mapped = res?.data?.map(item => ({
                id: item._id,
                name: item.name,
                image: { uri: item.image },
                mrp: `₹ ${item.mrp}`,
                price: `₹ ${item.customerPrice}`,
                discount: item.discountedPercentage
                    ? `${item.discountedPercentage}% off`
                    : 'Hot Deal',
                rating: '4.0',
                reviews: item.offerLabel || 'Limited time deal',
            }));
            setAllProducts(mapped || []);
        } catch (e) {
            console.log('Fetch error', e);
        } finally {
            setLoading(false);
        }
    };

    // 🔍 Filter logic
    const filteredProducts = useMemo(() => {
        if (!search?.trim()) return allProducts; // no search = show all

        return allProducts.filter(item =>
            item.name
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search, allProducts]);


    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate('ProductDetails', {
                    productId: item.id,
                })
            }>
            <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
            />

            <View style={{ flex: 1 }}>
                <AppText style={styles.name} numberOfLines={2}>
                    {item.name}
                </AppText>

                <View style={styles.viewRow}>
                    <AppText style={styles.price}>{item.price}{' '}</AppText>
                    <AppText style={styles.mrp}>{item.mrp}</AppText>
                    <AppText style={styles.mrp}>{item.discountedPercentage}</AppText>
                </View>

                <StarRating
                    maxStars={5}
                    starSize={18}
                    rating={item.rating}
                />

                <View style={styles.badge}>
                    <AppText style={styles.badgeText}>{item.discount}</AppText>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Feature Product"
                onBack={() => navigation.goBack()}
            />
            {/* 🔍 Search */}
            <View style={styles.searchView}>
                <Image source={images.searchIcon} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search AC (Daikin, Godrej, 1.5 Ton...)"
                    placeholderTextColor={COLORS.textColor}
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                    allowFontScaling={false}
                    includeFontPadding={false}
                />
            </View>



            {/* 📦 Product List */}
            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <AppText style={styles.emptyText}>
                        No products found 😕
                    </AppText>
                }
                contentContainerStyle={{ paddingBottom: 30, alignItems: 'center', paddingHorizontal: 12 }}
            />
        </View>
    );
};

export default FeaturedProductsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingHorizontal: 12,
    },
    searchView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: wp('5%'),
        marginVertical: hp('2.5%'),
        marginHorizontal: 12,
        width: '94%',
        alignSelf: 'center'
    },

    searchInput: {
        fontSize: hp('1.5%'),
        fontFamily: Fonts.semiBold,
        paddingHorizontal: 4,
        color: COLORS.textColor
    },

    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 14,
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 }, // 👈 center shadow
        shadowOpacity: 0.25,
        shadowRadius: 8,

        // Android shadow
        elevation: 6,
        width: '98%',
    },
    searchIcon: { width: 20, height: 20, marginHorizontal: 8 },

    viewRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    image: {
        width: 100,
        height: 100,
        marginRight: 10,
    },

    name: {
        fontSize: hp('1.8%'),
        fontWeight: Fonts.semiBold,
        color: COLORS.black,
    },

    price: {
        fontSize: hp('2%'),
        fontWeight: '700',
        color: COLORS.black,
        marginTop: 4,
    },

    mrp: {
        fontSize: hp('1.6%'),
        color: '#999',
        textDecorationLine: 'line-through',
        marginTop: 5
    },

    badge: {
        marginTop: 6,
        alignSelf: 'flex-start',
        borderRadius: 6,
        paddingVertical: 3,
    },

    badgeText: {
        color: COLORS.darkgreen,
        fontSize: hp('1.5%'),
        fontWeight: '600',
    },

    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    },
});

