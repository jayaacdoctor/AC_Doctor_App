import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import CustomLoader from './CustomLoader';
import AppText from './AppText';

const { width } = Dimensions.get('window');

const ImagePickerModal = ({ visible, onClose, onImageSelect }) => {
  const [loading, setLoading] = useState(null);

  if (!visible) return null;

  // ---- Open Camera ----
  const openCamera = async () => {
    setLoading('camera');
    try {
      const image = await ImagePicker.openCamera({
        mediaType: 'photo',
        compressImageQuality: 0.8,
        includeBase64: false,
        width: 500,
        height: 500,
      });

      const uri = image.path || image.uri;
      const mime = image.mime;

      onImageSelect(uri, mime);
    } catch (err) {
      console.log('Camera Error:', err);
    } finally {
      setLoading(null);
      onClose();
    }
  };

  // ---- Open Gallery ----
  const openGallery = async () => {
    setLoading('gallery');
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        // cropping: true,
        compressImageQuality: 0.8,
        maxFiles: 1,
        includeBase64: false,
        width: 500,
        height: 500,
      });
      const uri = image.path || image.uri;
      const mime = image.mime
      onImageSelect(uri, mime);
      onClose();
    } finally {
      onClose();
      setLoading(null);
    }
  };


  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <AppText style={styles.title}>Choose Photo</AppText>

          <TouchableOpacity
            style={[styles.btn, loading === 'camera' && styles.disabled]}
            onPress={() => openCamera()}
            disabled={!!loading}
          >
            <AppText style={styles.btnText}>Camera</AppText>
            {loading === 'camera' && <CustomLoader size="large" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, loading === 'gallery' && styles.disabled]}
            onPress={openGallery}
            disabled={!!loading}
          >
            <AppText style={styles.btnText}>Gallery</AppText>
            {loading === 'gallery' && <CustomLoader size="large" />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <AppText style={styles.cancelText}>Cancel</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal >
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    width,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignSelf: 'center',
    width: widthPercentageToDP('100%'),
    paddingBottom: heightPercentageToDP(Platform.OS === 'android' ? 4 : 4), // add this line for android
    // marginTop: heightPercentageToDP(100),
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  btnText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
  disabled: { opacity: 0.6 },
  cancel: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#207cccff',
    borderRadius: 12,
  },
  cancelText: { fontSize: 17, color: '#f8f3f3ff', fontWeight: '600' },
});

export default ImagePickerModal;
