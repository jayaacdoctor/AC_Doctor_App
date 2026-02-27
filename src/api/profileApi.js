import axios from 'axios';
import api from './axoisInsance';
import endPoint from './endPoint';

export const getUserProfile = async userId => {
  try {
    const res = await api.get(`${endPoint.USER_PROFILE}${userId}`);
    return res.data;
  } catch (error) {
    console.log('Profile API Error:', error?.res?.data || error);
    throw error;
  }
};

export const getPresignedUrl = async (fileName, fileType) => {
  try {
    const res = await api.get(
      `${endPoint.PRE_ASSIGNURL}?fileName=${fileName}&fileType=${fileType}`
    );
    console.log('Presigned URL Response:---', res.data);
    return res.data;
  } catch (error) {
    console.log('Presigned URL Error:', error?.response?.data || error);
    throw error;
  }
};


export const uploadImageToS3 = async (presignedUrl, imageUri, fileType) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    body: blob,
    headers: {
      'Content-Type': fileType || 'image/jpeg',
    },
  });
  return uploadResponse;
  if (!uploadResponse.ok) {
    throw new Error('S3 upload failed');
  }
};

export const updateUserProfile = async payload => {
  try {
    const res = await api.post(endPoint.UPDATE_PROFILE, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    console.log('Update Profile API Error:', error?.response?.data || error);
  }
};

export const logoutUser = async userId => {
  try {
    const res = await api.post(`${endPoint.LOG_OUT}${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getUserDeatil = async (userId) => {
  try {
    const res = await api.get(
      `${endPoint.UPDATE_USERDETAIL}${userId}`,
    );
    return res.data;
  } catch (error) {
    console.log('uerdetail api:', error?.res?.data || error);
    throw error;
  }
};

// api/profileApi.js
export const getTNotification = async (payload) => {
  try {
    const res = await api.get(endPoint.NOTIFICATION, {
      params: payload,
    });
    return res?.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
// api/profileApi.js
export const DeleteNotification = async (userId) => {
  try {
    const res = await api.get(`${endPoint.DELETE_NOTIFICATION}${userId}`);
    return res?.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};





