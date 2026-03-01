import api from './axoisInsance';
import endPoint from './endPoint';

export const loginUser = async data => {
  try {
    const res = await api.post(endPoint.LOGIN, data);
    console.log('Login Response:', res.data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const VerifyOTP = async payload => {
  try {
    const res = await api.post(
      endPoint.VERIFY_OTP,
      JSON.stringify({
        otp: payload.otp,
        userId: payload.userId,
      }),
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const resendOTP = async payload => {
  try {
    const res = await api.post(
      endPoint.RESET_OTP,
      {
        phoneNumber: payload.phoneNumber,
        countryCode: payload.countryCode,
      },
    );
    return res.data;
  } catch (error) {
    console.log("RESEND ERROR:", error?.response?.data);
    throw error;
  }
};




