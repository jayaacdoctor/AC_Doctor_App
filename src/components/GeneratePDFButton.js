// components/GeneratePDFButton.js
import React from 'react';
import { TouchableOpacity, Text, Alert, Platform, Dimensions } from 'react-native';
import { PDFDocument, StandardFonts, rgb } from 'rn-pdf-lib';
import RNFS from 'react-native-fs';
import AppText from '../components/AppText'

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GeneratePDFButton = ({ data, onSuccess }) => {
  const generatePDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([595, 842]); // A4
      const { width, height } = page.getSize();

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Responsive margin
      const margin = 60;
      const contentWidth = width - 2 * margin;

      // Brand color (default blue)
      const brandRGB = data.brandColor || { r: 0, g: 0.5, b: 1 };
      const brandColor = rgb(brandRGB.r, brandRGB.g, brandRGB.b);
      const lightGray = rgb(0.95, 0.95, 0.95);
      const black = rgb(0, 0, 0);
      const white = rgb(1, 1, 1);

      // Rounded Card Background
      page.drawRectangle({
        x: margin,
        y: height - margin - 320,
        width: contentWidth,
        height: 300,
        borderRadius: 24,
        color: lightGray,
        borderColor: brandColor,
        borderWidth: 2.5,
      });

      // Title
      page.drawText(data.title || 'Service Guarantee', {
        x: margin + 20,
        y: height - margin - 50,
        size: 22,
        font: boldFont,
        color: brandColor,
      });

      // Table Items
      let yPos = height - margin - 100;
      const lineHeight = 28;

      data.items.forEach((item) => {
        if (yPos < 150) {
          page = pdfDoc.addPage([595, 842]);
          yPos = 842 - margin - 50;
        }

        // Label
        page.drawText(item.label, {
          x: margin + 20,
          y: yPos,
          size: 13,
          font: boldFont,
          color: black,
        });

        // Value (shorten if too long)
        const value = item.value.length > 35 ? item.value.substring(0, 35) + '...' : item.value;
        page.drawText(value, {
          x: margin + 180,
          y: yPos,
          size: 13,
          font: font,
          color: black,
        });

        yPos -= lineHeight;
      });

      // Download Button
      const btnWidth = contentWidth - 80;
      page.drawRectangle({
        x: margin + 40,
        y: 100,
        width: btnWidth,
        height: 45,
        borderRadius: 12,
        color: brandColor,
      });

      page.drawText(data.buttonText || 'Download brochure', {
        x: margin + 40 + btnWidth / 2 - 70,
        y: 115,
        size: 15,
        font: boldFont,
        color: white,
      });

      // Save PDF
      const pdfBytes = await pdfDoc.save();
      const fileName = `${(data.title || 'Document').replace(/ /g, '_')}.pdf`;
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.writeFile(path, pdfBytes.toString('base64'), 'base64');

      // Android: Move to Downloads
      if (Platform.OS === 'android') {
        const downloadDir = `${RNFS.ExternalStorageDirectoryPath}/Download`;
        const destPath = `${downloadDir}/${fileName}`;
        await RNFS.mkdir(downloadDir).catch(() => { });
        await RNFS.moveFile(path, destPath);
        Alert.alert('Success', `PDF saved in Downloads: ${fileName}`);
      } else {
        Alert.alert('Saved', `PDF saved: ${fileName}`);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      // console.log('PDF Error:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  return (
    <TouchableOpacity
      onPress={generatePDF}
      style={{
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        alignSelf: 'center',
        marginVertical: 16,
        minWidth: 220,
        alignItems: 'center',
      }}
    >
      <AppText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
        Generate & Download PDF
      </AppText>
    </TouchableOpacity>
  );
};

export default GeneratePDFButton;