import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../../components/Header';
import images from '../../assets/images';
import styles from './HomeScreenStyles';
import WorkInfo from '../../customScreen/WorkInfo';
import AcList from '../../customScreen/AcList';
import { useDispatch, useSelector } from 'react-redux';
import { addOrMergeItems } from '../../redux/slices/cartSlice';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../components/AppText';

const GasChargeScreen = ({ route }) => {
  const navigation = useNavigation()
  const { screenName, serviceId } = route?.params;
  const { source = 'HOME' } = route.params || {};
  const dispatch = useDispatch();
  const acRef = useRef();
  const [acData, setAcData] = useState([
    { id: 1, name: 'Split AC', icon: images.splitAC, count: 0 },
    { id: 2, name: 'Window AC', icon: images.windowAc, count: 0 },
    { id: 3, name: 'Cassette AC', icon: images.casseteAc, count: 0 },
    { id: 4, name: 'VRV/VRF AC', icon: images.VRVac, count: 0 },
    { id: 5, name: 'Tower AC', icon: images.towerAc, count: 0 },
    { id: 6, name: 'Ducted AC', icon: images.ductedAc, count: 0 },
    { id: 7, name: 'Chiller AC', icon: images.chilarIcon, count: 0 },
  ]);


  const handleAddToCart = () => {
    const items = buildPayloadFromACData();

    if (!items.length) return;

    dispatch(
      addOrMergeItems({
        source, // HOME or VIEW_CART OR OTHER_CART
        items,
      }),
    );
    if (source === 'OTHER_CART') {
      navigation.replace('OtherCartView');
    } else {
      navigation.replace('ViewCart');
    }
  };

  const buildPayloadFromACData = () => {
    return acData
      .filter(ac => ac.count > 0)
      .map(ac => ({
        serviceType: screenName.toUpperCase(),
        acType: ac.name,
        quantity: ac.count,
        service_id: serviceId,
      }));
  };

  const totalSelected = acData.reduce((sum, ac) => sum + (ac.count || 0), 0);

  const handleBack = () => {
    navigation.goBack()
  };

  return (
    <View style={styles.workcontainer}>
      <Header title={screenName} onBack={handleBack} />

      <ScrollView
        style={styles.workscrollstyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.worksliderview}>
          <Image source={images.bannerOne} style={styles.workimage} />
        </View>

        <AppText style={styles.workheadText}>Select Type of AC</AppText>

        <AcList ref={acRef} data={acData} onChange={setAcData} />

        <View style={{ marginTop: '2%' }}>
          <WorkInfo />
        </View>
      </ScrollView>

      {/* Services and View Cart Section */}
      {totalSelected > 0 && (
        <View
          style={[
            styles.servicesSection,
            { flexDirection: 'row', justifyContent: 'space-between' },
          ]}
          key={'viewCart'}
        >
          <View>
            <AppText style={styles.servicesCount}>{totalSelected} Services</AppText>
            <AppText style={styles.servicesCount}>Selected</AppText>
          </View>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => handleAddToCart()}
          >
            <AppText style={styles.viewCartText}>View Cart</AppText>
            <Image source={images.cart} style={styles.carticon} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default GasChargeScreen;
