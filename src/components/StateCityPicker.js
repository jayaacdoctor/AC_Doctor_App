import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    TextInput,
    StyleSheet,
    PixelRatio,
    Dimensions
} from 'react-native';
import { State, City } from 'country-state-city';
import { Fonts } from '../utils/colors';
import AppText from './AppText';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 🔹 Normalize size for font & layout consistency
const scale = size => (SCREEN_WIDTH / 375) * size; // 375 = base iPhone width
const normalize = size => Math.round(PixelRatio.roundToNearestPixel(scale(size)));

const StateCityPicker = ({
    selectedState,
    selectedCity,
    onStateSelect,
    onCitySelect,
}) => {
    const [stateModal, setStateModal] = useState(false);
    const [cityModal, setCityModal] = useState(false);

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [stateSearch, setStateSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');

    useEffect(() => {
        setStates(State.getStatesOfCountry('IN'));
    }, []);

    const handleStatePress = item => {
        onStateSelect(item.name);
        setCities(City.getCitiesOfState('IN', item.isoCode));
        setStateModal(false);
        onCitySelect('');
        setCitySearch('');
    };

    // 🔹 Improved search: exact match first, startsWith priority
    const filteredStates = useMemo(() => {
        if (!stateSearch) return states;
        const search = stateSearch.toLowerCase();
        return [
            ...states.filter(s => s.name.toLowerCase().startsWith(search)),
            ...states.filter(s => !s.name.toLowerCase().startsWith(search) && s.name.toLowerCase().includes(search))
        ];
    }, [stateSearch, states]);

    const filteredCities = useMemo(() => {
        if (!citySearch) return cities;
        const search = citySearch.toLowerCase();
        return [
            ...cities.filter(c => c.name.toLowerCase().startsWith(search)),
            ...cities.filter(c => !c.name.toLowerCase().startsWith(search) && c.name.toLowerCase().includes(search))
        ];
    }, [citySearch, cities]);

    return (
        <View>
            {/* STATE FIELD */}
            <AppText style={styles.label}>State</AppText>
            <TouchableOpacity style={styles.box} onPress={() => setStateModal(true)}>
                <AppText style={styles.valueText}>{selectedState || 'Select State'}</AppText>
            </TouchableOpacity>

            {/* CITY FIELD */}
            <AppText style={styles.label}>City</AppText>
            <TouchableOpacity
                style={styles.box}
                onPress={() => selectedState && setCityModal(true)}
            >
                <AppText style={styles.valueText}>{selectedCity || 'Select City'}</AppText>
            </TouchableOpacity>

            {/* ================= STATE MODAL ================= */}
            <Modal visible={stateModal} animationType="slide">
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.headerRow}>
                        <AppText style={styles.modalTitle}>Select State</AppText>
                        <TouchableOpacity onPress={() => setStateModal(false)}>
                            <AppText style={styles.closeText}>Close</AppText>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder="Search State..."
                        value={stateSearch}
                        onChangeText={setStateSearch}
                        style={styles.searchInput}
                        allowFontScaling={false}
                        includeFontPadding={false}
                    />

                    <FlatList
                        data={filteredStates}
                        keyExtractor={item => item.isoCode}
                        keyboardShouldPersistTaps="handled"
                        initialNumToRender={15}
                        windowSize={10}
                        renderItem={({ item }) => {
                            const isSelected = selectedState === item.name;
                            return (
                                <TouchableOpacity
                                    style={[styles.item, isSelected && styles.selectedItem]}
                                    onPress={() => handleStatePress(item)}
                                >
                                    <AppText style={styles.itemText}>{item.name}</AppText>
                                </TouchableOpacity>
                            );
                        }}
                        ListEmptyComponent={
                            <AppText style={styles.emptyText}>No state found</AppText>
                        }
                    />
                </SafeAreaView>
            </Modal>

            {/* ================= CITY MODAL ================= */}
            <Modal visible={cityModal} animationType="slide">
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.headerRow}>
                        <AppText style={styles.modalTitle}>Select City</AppText>
                        <TouchableOpacity onPress={() => setCityModal(false)}>
                            <AppText style={styles.closeText}>Close</AppText>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder="Search City..."
                        placeholderTextColor={'#333'}
                        value={citySearch}
                        onChangeText={setCitySearch}
                        style={styles.searchInput}
                        allowFontScaling={false}
                    />

                    <FlatList
                        data={filteredCities}
                        keyExtractor={(item, index) => index.toString()}
                        keyboardShouldPersistTaps="handled"
                        initialNumToRender={20}
                        windowSize={10}
                        renderItem={({ item }) => {
                            const isSelected = selectedCity === item.name;
                            return (
                                <TouchableOpacity
                                    style={[styles.item, isSelected && styles.selectedItem]}
                                    onPress={() => {
                                        onCitySelect(item.name);
                                        setCityModal(false);
                                    }}
                                >
                                    <AppText style={styles.itemText}>{item.name}</AppText>
                                </TouchableOpacity>
                            );
                        }}
                        ListEmptyComponent={
                            <AppText style={styles.emptyText}>No city found</AppText>
                        }
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
};

export default StateCityPicker;

const styles = StyleSheet.create({
    label: {
        fontSize: normalize(16),
        marginTop: normalize(10),
        marginBottom: normalize(5),
        color: '#333',
        fontFamily: Fonts.semiBold,
    },
    box: {
        minHeight: normalize(48),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: normalize(25),
        justifyContent: 'center',
        paddingHorizontal: normalize(12),
        backgroundColor: '#fff',
    },
    valueText: {
        fontSize: normalize(14),
        color: '#888787',
        fontFamily: Fonts.medium,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: normalize(15),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: normalize(16),
        fontWeight: '600',
        color: '#333',
    },
    closeText: {
        fontSize: normalize(14),
        color: 'red',
        fontWeight: '600',
    },
    searchInput: {
        minHeight: normalize(45),
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: normalize(30),
        margin: normalize(10),
        paddingHorizontal: normalize(15),
        fontSize: normalize(14),
        fontFamily: Fonts.medium,
        color: '#161616',
        paddingVertical: normalize(2)
    },
    item: {
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(15),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedItem: {
        backgroundColor: '#e6f0ff',
    },
    itemText: {
        fontSize: normalize(14),
        color: '#333',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: normalize(20),
        color: '#999',
    },
});
