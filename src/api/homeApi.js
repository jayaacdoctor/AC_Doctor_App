import api from './axoisInsance';
import endPoint from './endPoint';
import Toast from 'react-native-simple-toast';

export const getAuthpatner = async userId => {
  try {
    const res = await api.get(endPoint.AUTH_PATNER);
    return res.data;
  } catch (error) {
    console.log('API Error:', error?.response?.data || error);
    throw error;
  }
};

export const getServiceList = async () => {
  try {
    const res = await api.get(endPoint.SERVICE_CATEGORIES);
    return res.data;
  } catch (error) {
    console.log('API Error:', error?.response?.data || error);
    throw error;
  }
};

export const getBanner = async () => {
  try {
    const res = await api.get(endPoint.BANNER_HOME);
    return res.data;
  } catch (error) {
    console.log('API Error:', error?.response?.data || error);
    throw error;
  }
};

export const getBrandlist = async () => {
  try {
    const res = await api.get(endPoint.BRAND_LIST);
    return res.data;
  } catch (error) {
    console.log('API Error:', error?.response?.data || error);
    throw error;
  }
};

// free consultancy
export const postConsultancy = async payload => {
  try {
    const res = await api.post(endPoint.CREATE_CONSULT, payload);
    return res.data;
  } catch (error) {
    console.log('API Error:', error?.response?.data || error);
    throw error;
  }
};

export const getConsultancy = async (userId) => {
  try {
    const res = await api.get(`${endPoint.GET_ALLCONSULT}${userId}`);
    return res.data;
  } catch (error) {
    console.log('API Error:', error?.response?.data || error);
    throw error;
  }
};
export const getAMC = async (userId) => {
  try {
    const res = await api.get(`${endPoint.GET_AMC}${userId}`);
    return res.data;
  } catch (error) {
    console.log('API Error:', error?.response?.data || error);
    throw error;
  }
};

// Error code
export const postErrorCode = async (payload) => {
  try {
    const res = await api.post(endPoint.ERROR_POST, payload);
    return res.data;
  } catch (error) {
    console.log('API Error:', error?.response?.data || error);
    throw error;
  }
};

// AMC Request
export const postAMCRequest = async (payload) => {
  try {
    const res = await api.post(endPoint.AMC_REQUEST, payload);
    return res.data;
  } catch (error) {
    console.log('API Error:', error?.response?.data || error);
    throw error;
  }
};

// Booking Request
export const postBookingRequest = async (payload) => {
  try {
    const res = await api.post(endPoint.BOOKING_REQUEST, payload);
    return res.data;
  } catch (error) {
    Toast.show(
      error?.response?.data?.message ||
      error,
    );
  }
};

// FEATURED_PRODUCTS
export const getFeaturedProducts = async (page = 1, limit = 20) => {
  try {
    const res = await api.get(endPoint.FEATURED_PRODUCTS, {
      params: {
        page,
        limit,
      },
    });

    return res.data;
  } catch (error) {
    console.log(
      'API Error (FEATURED_PRODUCTS):',
      error?.response?.data || error
    );
    throw error;
  }
};

// FEATURED_PRODUCT_DETAILS
export const getFeaturedProductById = async (productId) => {
  try {
    const res = await api.get(
      `${endPoint.FEATURED_PRODUCT_DETAILS}/${productId}`
    );

    return res.data;
  } catch (error) {
    console.log(
      'API Error (FEATURED_PRODUCT_DETAILS):',
      error?.response?.data || error
    );
    throw error;
  }
};

// post Intereest
export const postInterestRequest = async (payload) => {
  try {
    const res = await api.post(endPoint.POST_INTEREST, payload);
    return res.data;
  } catch (error) {
    Toast.show(
      error?.response?.data?.message ||
      error,
    );
  }
};

// post Old AC Request
export const postOldAcRequest = async (payload) => {
  try {
    const res = await api.post(endPoint.OLD_AC_REQUEST, payload);
    return res.data;
  } catch (error) {
    Toast.show(
      error?.response?.data?.message ||
      error,
    );
  }
};
// Cancel AC Request
export const cancelEnquiryRequest = async (enquiryId) => {
  try {
    const res = await api.post(endPoint.CANCEL_RESHEDUL, { enquiryId });
    return res.data;
  } catch (error) {
    Toast.show(
      error?.response?.data?.message ||
      error,
    );
  }
};

// Cancel AC Request
export const RescheduleEnquiryRequest = async (payload) => {
  try {
    const res = await api.post(endPoint.RE_SCHEDUL_REQUEST, payload);
    return res.data;
  } catch (error) {
    Toast.show(
      error?.response?.data?.message ||
      error,
    );
  }
};

// get Old AC Request according to Id
export const getUserOldAcRequest = async (id) => {
  try {
    const res = await api.get(`${endPoint.OLD_AC_ID_REQUEST}${id}`);
    return res.data;
  } catch (error) {
    Toast.show(
      error?.response?.data?.message ||
      error,
    );
  }
};

// get Old AC Request according to Id
export const getAllOldAcRequest = async () => {
  try {
    const res = await api.get(endPoint.ALL_OLD_REQUEST);
    return res.data;
  } catch (error) {
    Toast.show(
      error?.response?.data?.message ||
      error,
    );
  }
};


