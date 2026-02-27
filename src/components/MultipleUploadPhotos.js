import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import { COLORS, Fonts } from '../utils/colors';
import images from '../assets/images';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { isTablet } from './TabletResponsiveSize';
import AppText from './AppText';


const MultipleUploadPhotos = ({
  onChange,
  OptionalText = '',
  imagesData = [],
}) => {

  const handlePickImageOrVideo = () => {
    const options = {
      mediaType: 'photo',
      multiple: true,
      maxFiles: 150,
      compressImageQuality: 0.8,
      includeBase64: false,
    };

    Alert.alert('Select Option', 'Choose an action', [
      {
        text: 'Gallery',
        onPress: () => {
          setTimeout(() => {
            ImagePicker.openPicker(options)
              .then(response => {
                const newItems = response.map(item => ({
                  id: `${item.path}_${Date.now()}`,
                  uri: item.path,
                  filename: item.filename,
                  mime: item.mime,
                  type: 'photo',
                }));

                const updated = [...imagesData, ...newItems];
                onChange && onChange(updated);
              })
              .catch(error => {
                if (error?.code !== 'E_PICKER_CANCELLED') {
                  console.log('Gallery Error:', error);
                }
              });
          }, 300);
        },
      },
      {
        text: 'Camera',
        onPress: () => {
          setTimeout(() => {
            ImagePicker.openCamera({
              mediaType: 'photo',
              cropping: true,
              compressImageQuality: 0.8,
            })
              .then(response => {
                const newItem = {
                  id: `${response.path}_${Date.now()}`,
                  uri: response.path,
                  filename: response.filename,
                  mime: response.mime,
                  type: 'photo',
                };
                const updated = [...imagesData, newItem];
                onChange && onChange(updated);
              })
              .catch(error => {
                if (error?.code !== 'E_PICKER_CANCELLED') {
                  console.log('Camera Error:', error);
                }
              });
          }, 300);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleRemoveUpload = id => {
    const updated = imagesData.filter(item => item.id !== id);
    onChange && onChange(updated);
  };

  const renderItem = ({ item }) => (

    <View style={styles.uploadCard}>
      <Image
        source={{ uri: item.uri }}
        style={styles.cardImage}
        resizeMode={'cover'}
      />

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveUpload(item.id)}
      >
        <AppText style={styles.removeText}>×</AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      <View style={styles.inputGroup}>
        <AppText allowFontScaling={false} style={styles.label}>
          Upload Photos <AppText allowFontScaling={false} style={styles.labelInput}>{OptionalText}</AppText>
        </AppText>

        <FlatList
          data={imagesData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={isTablet ? 6 : 3}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          windowSize={10}
          removeClippedSubviews
          ListFooterComponent={
            <TouchableOpacity
              style={styles.uploadContainer}
              onPress={handlePickImageOrVideo}
            >
              <Image
                source={images.Camera}
                style={styles.customIcon}
                resizeMode={'contain'}
              />
              <AppText allowFontScaling={false} style={styles.uploadText}>Add Photos</AppText>
            </TouchableOpacity>
          }
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 4,
    // marginHorizontal: 10,
  },
  label: {
    fontSize: 14,
    color: COLORS.black,
    marginTop: 10,
    fontFamily: Fonts.semiBold,
  },
  labelInput: {
    fontSize: 12,
    color: '#969494ff',
    fontFamily: Fonts.medium,
  },
  uploadContainer: {
    marginTop: 15,
    height: 90,
    backgroundColor: '#eaf0f7ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    width: 100,
  },
  customIcon: {
    width: 30,
    height: 30,
    tintColor: '#666',
  },
  uploadText: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  uploadCard: {
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 5,
    width: 100,
    overflow: 'hidden',
    marginTop: 18
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'flex-start',
  },
});

export default MultipleUploadPhotos;
