import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Platform, KeyboardAvoidingView
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS } from '../utils/colors';
import AppText from '../components/AppText';

const BookingSlotModal = ({
  visible,
  onClose,
  onBookProcess,
  setSelectedSlot,
  isReschedule = false,
}) => {
  const scrollRef = useRef(null);

  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [days, setDays] = useState([]);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const timeSlots = [
    { label: 'First Half', time: '10:00 AM - 02:00 PM' },
    { label: 'Second Half', time: '02:00 PM - 07:00 PM' },
  ];

  const generateDays = (month, year) => {
    const totalDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: totalDays }, (_, i) => {
      const date = i + 1;
      const day = new Date(year, month, date)
        .toLocaleDateString('en-US', { weekday: 'short' })
        .slice(0, 3);
      return { date, day };
    });
  };

  const isPastDate = date => {
    const check = new Date(selectedYear, selectedMonth, date);
    check.setHours(0, 0, 0, 0);

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    return check < todayDate;
  };

  useEffect(() => {
    const updatedDays = generateDays(selectedMonth, selectedYear);
    setDays(updatedDays);

    if (selectedMonth === currentMonth && selectedYear === currentYear) {
      const todayIndex = updatedDays.findIndex(d => d.date === currentDate);

      if (todayIndex !== -1) {
        setSelectedDay(todayIndex);

        setTimeout(() => {
          scrollRef.current?.scrollTo({
            x: todayIndex * wp(15),
            animated: true,
          });
        }, 300);
      }
    } else {
      setSelectedDay(null);
    }
  }, [selectedMonth, selectedYear, visible]);

  const handleProceedPress = () => {
    if (selectedDay === null || selectedTime === null) return;
    // 🔥 If reschedule mode & reason empty → don't proceed
    if (isReschedule && !rescheduleReason.trim()) {
      Alert.alert("Please enter reason for rescheduling");
      return;
    }
    const dayObj = days[selectedDay];

    setSelectedSlot({
      date: dayObj.date,
      day: dayObj.day,
      month: monthNames[selectedMonth],
      monthNumber: selectedMonth + 1,
      year: selectedYear,
      time: timeSlots[selectedTime].time,
      Timeslot: timeSlots[selectedTime].label,
      reason: isReschedule ? rescheduleReason : undefined,
    });
    onBookProcess();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={[styles.overlay, { justifyContent: 'flex-end' }]}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <KeyboardAvoidingView
          style={{
            flex: 1,
            // justifyContent: isReschedule ? 'flex-end' : 'flex-start',
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
        >
          <View style={[
            styles.modalContent,
            { maxHeight: isReschedule ? '90%' : '85%', }
          ]}>

            {/* Scrollable Content */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: hp(8),
              }}
            >

              <AppText allowFontScaling={false} style={styles.title}>Book a Slot</AppText>

              <AppText allowFontScaling={false} style={styles.sectionLabel}>Date</AppText>

              <View style={styles.monthYearSelector}>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(y => y - 1);
                    } else {
                      setSelectedMonth(m => m - 1);
                    }
                  }}
                >
                  <AppText allowFontScaling={false} style={styles.navText}>{'<<'}</AppText>
                </TouchableOpacity>

                <AppText allowFontScaling={false} style={styles.monthText}>
                  {monthNames[selectedMonth]} {selectedYear}
                </AppText>

                <TouchableOpacity
                  onPress={() => {
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear(y => y + 1);
                    } else {
                      setSelectedMonth(m => m + 1);
                    }
                  }}
                >
                  <AppText style={styles.navText}>{'>>'}</AppText>
                </TouchableOpacity>
              </View>

              <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.daysContainer}
              >
                {days.map((day, index) => {
                  const disabled = isPastDate(day.date);
                  return (
                    <TouchableOpacity
                      key={index}
                      disabled={disabled}
                      style={[
                        styles.dayButton,
                        selectedDay === index && !disabled && styles.selectedDay,
                        disabled && styles.disabledDay,
                      ]}
                      onPress={() => setSelectedDay(index)}
                    >
                      <AppText
                        style={[selectedDay === index ? styles.dateNumber : styles.disabledText, disabled && styles.disabledText,]}
                      >
                        {day.date}
                      </AppText>
                      <AppText
                        style={[selectedDay === index ? styles.dayName : styles.disabledText, disabled && styles.disabledText,]}
                      >
                        {day.day}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <AppText style={styles.sectionLabel}>Time</AppText>

              <View style={styles.timeContainer}>
                {timeSlots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeButton,
                      selectedTime === index && styles.selectedTime,
                    ]}
                    onPress={() => setSelectedTime(index)}
                  >
                    <AppText style={selectedTime === index ? styles.selectedtimeLabel : styles.timeLabel}>{slot.label}</AppText>
                    <AppText style={selectedTime === index ? styles.selectedtimeLabel : styles.timeText}>{slot.time}</AppText>
                  </TouchableOpacity>
                ))}
              </View>

              {isReschedule && (
                <>
                  <AppText style={styles.sectionLabel}>Reason of Rescheduling</AppText>
                  <TextInput
                    style={styles.reasonInput}
                    placeholder="Type here..."
                    placeholderTextColor={COLORS.TextColor}
                    multiline
                    textAlignVertical="top"
                    value={rescheduleReason}
                    onChangeText={setRescheduleReason}
                    allowFontScaling={false}
                    includeFontPadding={false}
                  />
                </>
              )}
            </ScrollView>

            {/* <View style={{ padding: 16 }}> */}
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleProceedPress}
            >
              <Text style={styles.proceedText}>Proceed</Text>
            </TouchableOpacity>
            {/* </View> */}

          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// export default BookingSlotModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.transparent,
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  title: {
    fontSize: hp(2),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: hp(2),
    color: COLORS.black
  },
  sectionLabel: {
    fontSize: hp(1.8),
    fontWeight: 'bold',
    color: '#0e0c0cff',
    marginBottom: hp(1),
  },
  monthYearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthButton: {
    padding: wp(2),
  },
  monthText: {
    fontSize: hp(1.8),
    fontWeight: '500',
    color: '#656060ff',
  },
  yearButton: {
    padding: wp(2),
  },
  yearText: {
    fontSize: hp(1.8),
    fontWeight: '500',
    color: '#656060ff',
  },
  daysContainer: {
    marginBottom: hp(2),
    paddingVertical: hp(1),
  },
  dayButton: {
    alignItems: 'center',
    padding: wp(1),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(3),
    width: wp(13),
    marginRight: wp(2.5),
  },
  selectedDay: {
    backgroundColor: COLORS.themeColor,
  },
  dateNumber: {
    fontSize: hp(1.6),
    fontWeight: '500',
    color: 'white'
  },
  dayName: {
    fontSize: hp(1.5),
    color: '#151414ff',
    color: 'white'
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: hp(2),
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    color: '#333',
    height: hp(10),
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3),
  },
  timeButton: {
    flex: 1,
    padding: wp(2),
    borderWidth: 1,
    borderColor: '#b5acacff',
    borderRadius: wp(3),
    marginHorizontal: wp(2),
    alignSelf: 'flex-start',
  },
  selectedTime: {
    backgroundColor: COLORS.themeColor,
    borderWidth: 1,
    borderRadius: wp(3),
  },
  timeLabel: {
    fontSize: hp(1.5),
    fontWeight: '500',
    textAlign: 'left',
    color: '#666',
    marginBottom: wp(1),
  },
  selectedtimeLabel: {
    fontSize: hp(1.5),
    fontWeight: '500',
    textAlign: 'left',
    color: '#f7f4f4',
    marginBottom: wp(1),
  },
  timeText: {
    fontSize: hp(1.5),
    color: '#747070ff',
  },
  proceedButton: {
    backgroundColor: COLORS.themeColor,
    padding: hp(1.5),
    borderRadius: wp(8),
    alignItems: 'center',
  },
  proceedText: {
    color: COLORS.white,
    fontSize: hp(2),
    fontWeight: '500',
  },
  navText: {
    color: COLORS.themeColor,
    fontSize: hp(2),
    fontWeight: '500',
  },
  disabledDay: {
    backgroundColor: 'lightgrey',
    borderColor: 'grey',
  },
  disabledText: {
    color: '#757272',
    fontSize: hp(1.6),
    fontWeight: '500',
  },
});

export default BookingSlotModal;
