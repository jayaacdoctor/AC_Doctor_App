import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import Commonstyles, { WindoData } from '../Home/HomeScreenStyles';
import images from '../../assets/images';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SliderImageUI from '../../components/SliderImageUI';
import { COLORS, Fonts } from '../../utils/colors';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { getFeaturedProductById, postInterestRequest } from '../../api/homeApi';
import CustomLoader from '../../components/CustomLoader';
import InterestSuccessModal from '../../components/InterestSuccessModal';
import Toast from 'react-native-simple-toast';

const ProductDetails = ({ route }) => {
    const navigation = useNavigation();
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchProductDetails();
    }, []);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const res = await getFeaturedProductById(productId);
            console.log('Product Details res--->', res?.data);
            setProduct(res.data); // 👈 full object from API
        } catch (e) {
            console.log('fetchProductDetails error', e);
        } finally {
            setLoading(false);
        }
    };

    // filter out the image
    const bannerImages =
        product?.images?.length > 0
            ? product.images.map(url => ({ uri: url }))
            : [images.ACimage];

    // submit interest
    const onBuyBtn = async () => {
        try {
            setLoading(true);
            const payload = {
                productId: String(product._id),
            };
            const res = await postInterestRequest(payload);
            console.log("API Response:", res?.data);
            setShowSuccess(true)
        } catch (error) {
            Toast.show(error?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }


    // render
    return (
        <View
            style={Commonstyles.workcontainer}
        >

            <Header
                title="Feature Product Details"
                onBack={() => navigation.goBack()}
            />
            <ScrollView>

                <View style={{ paddingHorizontal: wp('2.5%') }}>
                    <View
                        style={[
                            Commonstyles.allSideRadiusStyle,
                            { paddingRight: wp('3%'), paddingHorizontal: 0 },
                        ]}
                    >
                        <SliderImageUI
                            data={bannerImages}
                            height={180}          // 👈 non-zero height
                            autoPlay={true}
                            interval={3000}
                            showDots={true}
                            borderRadius={16}
                        />
                    </View>


                    <View style={[Commonstyles.oneWidthRow, { width: wp('85%') }]}>
                        <AppText style={Commonstyles.mediumText}>
                            {product?.name}
                        </AppText>
                    </View>


                    <View style={[Commonstyles.oneWidthRow]}>
                        <AppText style={Commonstyles.bigMediumText}>
                            ₹{product?.pricing?.customerPrice}{' '}{' '}
                            <AppText
                                style={[Commonstyles.accountNumber, { textDecorationLine: 'line-through' }]}
                            >
                                ₹ {product?.pricing?.mrp}
                            </AppText>
                        </AppText>
                    </View>

                    {/* of-24%f */}
                    <AppText style={[Commonstyles.mediumText, { color: COLORS.yellow }]}>
                        ★★★★ <AppText style={[Commonstyles.accountNumber]}>(5.00)</AppText>
                    </AppText>


                    {/* Description */}
                    <View style={{ marginTop: wp('3%') }}>
                        <AppText style={[Commonstyles.locationText, { color: COLORS.black }]}>
                            Description
                        </AppText>
                        <AppText
                            style={[Commonstyles.accountNumber, { marginVertical: wp('3%') }]}
                        >
                            {product?.description}
                        </AppText>
                    </View>


                    {/* Service Guarantee */}

                    {product !== null ?
                        <View style={Commonstyles.allSideRadiusStyle}>
                            <AppText style={Commonstyles.mediumText}>Service Guarantee</AppText>
                            {/* Services and View Cart Section */}
                            <View style={Commonstyles.oneWidthRow}>
                                <AppText
                                    style={[
                                        Commonstyles.locationText,
                                        { color: COLORS.textHeading },
                                    ]}
                                >
                                    Brand
                                </AppText>
                                <AppText style={Commonstyles.locationText}>{product?.brand}</AppText>
                            </View>
                            <View style={Commonstyles.bottomLine} />
                            <View style={Commonstyles.sergrid}>
                                <AppText
                                    style={[
                                        Commonstyles.locationText,
                                        { color: COLORS.textHeading },
                                    ]}
                                >
                                    AC Type
                                </AppText>
                                <AppText style={Commonstyles.locationText}>{product?.specifications?.acType}</AppText>
                            </View>
                            <View style={Commonstyles.bottomLine} />
                            <View style={Commonstyles.sergrid}>
                                <AppText
                                    style={[
                                        Commonstyles.locationText,
                                        { color: COLORS.textHeading },
                                    ]}
                                >
                                    Model
                                </AppText>
                                <AppText style={Commonstyles.locationText}>{product?.model}</AppText>
                            </View>
                            <View style={Commonstyles.bottomLine} />
                            <View style={Commonstyles.sergrid}>
                                <AppText
                                    style={[
                                        Commonstyles.locationText,
                                        { color: COLORS.textHeading },
                                    ]}
                                >
                                    Capacity
                                </AppText>
                                <AppText style={Commonstyles.locationText}>{product?.specifications?.tonnage} Tons</AppText>
                            </View>
                            <View style={Commonstyles.bottomLine} />
                            <View style={Commonstyles.sergrid}>
                                <AppText
                                    style={[
                                        Commonstyles.locationText,
                                        { color: COLORS.textHeading },
                                    ]}
                                >
                                    Cooling Power
                                </AppText>
                                <AppText style={Commonstyles.locationText}>{product?.specifications?.voltage} Watts</AppText>
                            </View>
                            <View style={Commonstyles.bottomLine} />
                            <View style={Commonstyles.sergrid}>
                                <AppText
                                    style={[
                                        Commonstyles.locationText,
                                        { color: COLORS.textHeading },
                                    ]}
                                >
                                    Power Rating
                                </AppText>
                                <AppText style={Commonstyles.locationText}>{product?.specifications?.powerRating}</AppText>
                            </View>
                            <View style={Commonstyles.bottomLine} />
                            <View style={Commonstyles.sergrid}>
                                <AppText
                                    style={[
                                        Commonstyles.locationText,
                                        { color: COLORS.textHeading },
                                    ]}
                                >
                                    Power Consumption
                                </AppText>
                                <AppText style={Commonstyles.locationText}>{product?.specifications?.powerConsumption}</AppText>
                            </View>
                            <View style={Commonstyles.bottomLine} />
                            <View style={Commonstyles.sergrid}>
                                <AppText
                                    style={[
                                        Commonstyles.locationText,
                                        { color: COLORS.textHeading },
                                    ]}
                                >
                                    Voltage
                                </AppText>
                                <AppText style={Commonstyles.locationText}>{product?.specifications?.voltage} Volts</AppText>
                            </View>
                            <View style={Commonstyles.bottomLine} />
                            <View style={Commonstyles.sergrid}>
                                <AppText
                                    style={[
                                        Commonstyles.locationText,
                                        { color: COLORS.textHeading },
                                    ]}
                                >
                                    Warranty
                                </AppText>
                                <AppText style={Commonstyles.locationText}> {product?.specifications?.warranty?.product}</AppText>
                            </View>
                            {/* <View style={Commonstyles.bottomLine} /> */}
                            {/* <View style={Commonstyles.sergrid}>
                            <Text
                                style={[
                                    Commonstyles.locationText,
                                    { color: COLORS.textHeading },
                                ]}
                            >
                                Noise Level
                            </Text>
                            <Text style={Commonstyles.locationText}>44 dB</Text>
                        </View> */}
                            {/* <View style={Commonstyles.bottomLine} />
                        <View style={Commonstyles.sergrid}>
                            <Text
                                style={[
                                    Commonstyles.locationText,
                                    { color: COLORS.textHeading },
                                ]}
                            >
                                Floor Area
                            </Text>
                            <Text style={Commonstyles.locationText}>180 Square Feet</Text>
                        </View> */}
                            {/* <View style={Commonstyles.bottomLine} />
                        <View style={Commonstyles.sergrid}>
                            <Text
                                style={[
                                    Commonstyles.locationText,
                                    { color: COLORS.textHeading },
                                ]}
                            >
                                Power Source
                            </Text>
                            <Text style={Commonstyles.locationText}>Corded Electric</Text>
                        </View> */}
                        </View>
                        : <>
                            <CustomLoader size='large' />
                        </>}


                    {/* free delivery */}
                    <View style={[Commonstyles.sergrid, Commonstyles.allSideRadiusStyle, { marginBottom: hp("10%") }]}>
                        <TouchableOpacity
                            style={Commonstyles.serstatCard}
                            activeOpacity={0.8}
                        >
                            <Image
                                source={images.delivery_truck}
                                style={Commonstyles.sericon}
                            />
                            <View>
                                <AppText
                                    style={[
                                        Commonstyles.serstatTitle,
                                        { color: COLORS.themeColor },
                                    ]}
                                >
                                    Free Delivery
                                </AppText>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={Commonstyles.serstatCard}
                            activeOpacity={0.8}
                        >
                            <Image
                                source={images.customer_support}
                                style={Commonstyles.sericon}
                            />
                            <View>
                                <AppText
                                    style={[
                                        Commonstyles.serstatTitle,
                                        { color: COLORS.themeColor },
                                    ]}
                                >
                                    Service Available
                                </AppText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={Commonstyles.serstatCard}
                            activeOpacity={0.8}
                        >
                            <Image source={images.waranty} style={Commonstyles.sericon} />
                            <View>
                                <AppText
                                    style={[
                                        Commonstyles.serstatTitle,
                                        { color: COLORS.themeColor },
                                    ]}
                                >
                                    1 Year Warranty
                                </AppText>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
            <CustomButton
                buttonName='Buy Now'
                btnTextColor={COLORS.white}
                onPress={onBuyBtn}
                marginBottom={hp('3%')}
            />
            <InterestSuccessModal
                visible={showSuccess}
                onClose={() => setShowSuccess(false)}
            />
        </View>
    )
}

export default ProductDetails

const styles = StyleSheet.create({})
