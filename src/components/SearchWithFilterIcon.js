import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../assets/images';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AppText from './AppText';

const SearchWithFilterIcon = ({ initialData, onFilterChange, placeholder = "Search products...", }) => {
  // Filters
  const [searchText, setSearchText] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [lastSearch, setLastSearch] = useState('');

  // Sirf jab filters change ho, tabhi recalculate karo
  const filteredData = useMemo(() => {
    if (!initialData) return [];

    let filtered = [...initialData];

    if (searchText) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedRating) {
      filtered = filtered.filter(item => Math.floor(item.rating) === selectedRating);
    }

    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      filtered = filtered.filter(
        item => item.price >= priceRange[0] && item.price <= priceRange[1]
      );
    }

    if (freeDelivery) {
      filtered = filtered.filter(item => item.freeDelivery);
    }
    setLastSearch(searchText);
    return filtered;
  }, [initialData, searchText, selectedRating, priceRange, freeDelivery]);


  // Sirf jab filteredData change ho, tabhi parent ko batao
  useEffect(() => {
    onFilterChange?.(filteredData);
  }, [filteredData, onFilterChange]);

  const clearFilters = () => {
    setSearchText('');
    setSelectedRating(null);
    setPriceRange([0, 100000]);
    setFreeDelivery(false);
  };

  const FilterTag = ({ label, onRemove }) => (
    <View style={styles.filterTag}>
      <AppText style={styles.filterTagText}>{label}</AppText>
      <TouchableOpacity onPress={onRemove}>
        <AppText style={styles.removeTag}>×</AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <FastImage source={images.searchIcon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={() => Keyboard.dismiss()}
          allowFontScaling={false}
          includeFontPadding={false}
        />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <FastImage source={images.filterImg} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {(searchText || selectedRating || freeDelivery || priceRange[1] < 100000) && (
        <View style={styles.activeFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {searchText && (
              <FilterTag label={`"${searchText}"`} onRemove={() => setSearchText('')} />
            )}
            {selectedRating && (
              <FilterTag label={`${selectedRating} Star`} onRemove={() => setSelectedRating(null)} />
            )}
            {freeDelivery && (
              <FilterTag label="Free Delivery" onRemove={() => setFreeDelivery(false)} />
            )}
            {priceRange[1] < 100000 && (
              <FilterTag
                label={`₹${priceRange[0]} - ₹${priceRange[1]}`}
                onRemove={() => setPriceRange([0, 100000])}
              />
            )}
            <TouchableOpacity onPress={clearFilters}>
              <AppText style={styles.clearAll}>Clear All</AppText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Last Search */}
      {lastSearch && !searchText && (
        <AppText style={styles.lastSearch}>
          Last searched: "<AppText style={{ fontWeight: 'bold' }}>{lastSearch}</AppText>"
        </AppText>
      )}

      {/* Filter Modal */}
      {showFilters && (
        <View style={styles.filterModal}>
          <AppText style={styles.filterTitle}>Filters</AppText>

          {/* Rating */}
          <AppText style={styles.filterLabel}>Rating</AppText>
          <View style={styles.ratingRow}>
            {[4, 3, 2, 1].map(rating => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingBtn,
                  selectedRating === rating && styles.ratingBtnActive,
                ]}
                onPress={() => setSelectedRating(selectedRating === rating ? null : rating)}
              >
                <AppText style={styles.ratingText}>{rating} Star</AppText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <AppText style={styles.filterLabel}>Price Range</AppText>
          <View style={styles.priceRow}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min"
              keyboardType="numeric"
              value={priceRange[0].toString()}
              onChangeText={text => setPriceRange([+text || 0, priceRange[1]])}
              onSubmitEditing={() => Keyboard.dismiss()}
              allowFontScaling={false}
              includeFontPadding={false}
            />
            <AppText style={styles.toText}>to</AppText>
            <TextInput
              style={styles.priceInput}
              placeholder="Max"
              keyboardType="numeric"
              value={priceRange[1].toString()}
              onChangeText={text => setPriceRange([priceRange[0], +text || 100000])}
              onSubmitEditing={() => Keyboard.dismiss()}
              allowFontScaling={false}
              includeFontPadding={false}
            />
          </View>

          {/* Free Delivery */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setFreeDelivery(!freeDelivery)}
          >
            <View style={[styles.checkbox, freeDelivery && styles.checkboxActive]} />
            <AppText style={styles.checkboxLabel}>Free Delivery Only</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => setShowFilters(false)}
          >
            <AppText style={styles.applyText}>Apply Filters</AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 25,
    elevation: 2,
  },
  searchIcon: { width: 20, height: 20, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 12 },
  filterIcon: { width: 24, height: 24 },

  activeFilters: { paddingHorizontal: 16, marginBottom: 8 },
  filterTag: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
  },
  filterTagText: { fontSize: 14, color: '#1976d2' },
  removeTag: { marginLeft: 8, fontWeight: 'bold', color: '#1976d2', fontSize: 16 },
  clearAll: { color: '#d32f2f', fontWeight: '600', marginLeft: 8, marginTop: 6 },

  lastSearch: { paddingHorizontal: 16, fontSize: 14, color: '#666', marginBottom: 8 },

  filterModal: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 5,
  },
  filterTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  filterLabel: { fontSize: 16, marginBottom: 8, fontWeight: '600', color: '#666' },

  ratingRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  ratingBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  ratingBtnActive: { borderColor: '#1976d2', backgroundColor: '#e3f2fd' },
  ratingText: { color: '#666', fontSize: 14 },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    width: wp('30%'),
    textAlign: 'center',
  },
  toText: { marginHorizontal: 8, fontSize: 16 },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 8,
  },
  checkboxActive: { borderColor: '#1976d2', backgroundColor: '#1976d2' },
  checkboxLabel: { fontSize: 16 },

  applyBtn: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: { color: '#fff', fontWeight: 'bold' },
});

export default SearchWithFilterIcon;
