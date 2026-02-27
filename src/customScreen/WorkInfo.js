import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Homstyles, {
  works,
  keyBenefitsData,
  serviceInclusionsData,
  termsConditionsData,
  faqData,
} from '../screens/Home/HomeScreenStyles';
import ContentSection from '../customScreen/ContentSection';
import images from '../assets/images';
import AppText from '../components/AppText';

const WorkInfo = ({
  paddingHorizontal = 0,
  styling = {},
  needHelp = true,
  Homwork = true
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeSection, setActiveSection] = useState('Key Benefits');

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <View style={{ paddingHorizontal: paddingHorizontal, ...styling }}>

      {/* How it works */}
      {Homwork && (
        <View style={Homstyles.workitem}>
          <AppText style={Homstyles.utititle}>How it works?</AppText>

          <View style={Homstyles.workContain}>
            <FlatList
              data={works}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => `work-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={Homstyles.workoption}
                  onPress={item.action}
                >
                  <FastImage source={item.icon} style={Homstyles.workicon} />
                  <AppText style={[Homstyles.utilabel, { color: 'white' }]}>
                    {item.text}
                  </AppText>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}

      {/* Benefits / Terms / Inclusion */}
      <ContentSection
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        keyBenefits={keyBenefitsData}
        serviceInclusions={serviceInclusionsData}
        termsConditions={termsConditionsData}
      />

      {/* Banner */}
      <View style={Homstyles.worksliderview}>
        <Image source={images.bannerTwo} style={Homstyles.workimage} />
      </View>

      {/* FAQ Header */}
      <AppText style={[Homstyles.workheadText, { marginTop: 8 }]}>
        FAQs
      </AppText>

      {/* FAQ Items */}
      {faqData.map((item, index) => (
        <View key={index} style={Homstyles.faqItem}>
          <TouchableOpacity
            style={Homstyles.faquestionContainer}
            onPress={() => toggleExpand(index)}
            activeOpacity={0.7}
          >
            <AppText style={Homstyles.faquestionText}>{item.question}</AppText>
            <AppText style={Homstyles.faqarrow}>
              {expandedIndex === index ? '︿' : '﹀'}
            </AppText>
          </TouchableOpacity>

          {expandedIndex === index && (
            <AppText style={Homstyles.faqanswerText}>{item.answer}</AppText>
          )}
        </View>
      ))}

      {/* Brand Image */}
      <TouchableOpacity style={Homstyles.worksliderview} activeOpacity={6}>
        <Image source={images.brands} style={Homstyles.brandimage} />
      </TouchableOpacity>

      {/* Need Help? */}
      {needHelp && (
        <View style={Homstyles.brandcont}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={images.helpdesk} style={Homstyles.smallimage} />
            <AppText style={Homstyles.needHelp}> Need Help?</AppText>
          </View>
          <Image source={images.chatIcon} style={Homstyles.chaticon} />
        </View>
      )}

    </View>
  );
};


export default WorkInfo;
