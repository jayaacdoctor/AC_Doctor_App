import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS } from '../utils/colors';
import AppText from '../components/AppText'

const CustomDateTimePicker = ({
  activeColor = '#2E86DE',
  inactiveColor = '#000000',
  onChangeDate,
  onChangeSlot,
}) => {
  const today = new Date();
  const daysShort = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState('first');

  // ---------------- GENERATE DAYS OF THE MONTH ---------------- //
  const getDays = () => {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex =
      (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;

    let daysArray = [];

    // Empty slots
    for (let i = 0; i < firstDayIndex; i++) {
      daysArray.push({ label: daysShort[i], date: null });
    }

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const weekday = (dateObj.getDay() + 6) % 7;
      daysArray.push({ label: daysShort[weekday], date: d });
    }

    return daysArray;
  };

  // Change month
  const changeMonth = direction => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Select date
  const handleSelectDate = day => {
    if (!day.date) return;

    const newDate = new Date(currentYear, currentMonth, day.date);
    setSelectedDate(newDate);
    onChangeDate && onChangeDate(newDate);
  };

  useEffect(() => {
    onChangeSlot && onChangeSlot(selectedSlot);
  }, [selectedSlot]);

  return (
    <View style={styles.card}>
      <AppText allowFontScaling={false} style={styles.cardTitle}>Select Date & Time</AppText>
      {/* Month Navigation */}
      <View style={styles.monthRow}>
        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => changeMonth(-1)}
        >
          <AppText allowFontScaling={false} style={styles.arrow}>‹</AppText>
        </TouchableOpacity>

        <AppText allowFontScaling={false} style={styles.monthText}>
          {new Date(currentYear, currentMonth).toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </AppText>

        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => changeMonth(1)}
        >
          <AppText allowFontScaling={false} style={styles.arrow}>›</AppText>
        </TouchableOpacity>
      </View>

      {/* Horizontal Dates */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.daysRow}>
          {getDays().map((day, idx) => {
            const isSelected =
              day.date &&
              day.date === selectedDate.getDate() &&
              currentMonth === selectedDate.getMonth() &&
              currentYear === selectedDate.getFullYear();

            return (
              <TouchableOpacity
                key={idx}
                onPress={() => handleSelectDate(day)}
                disabled={!day.date}
                style={styles.dayBox}
              >
                <AppText allowFontScaling={false}
                  style={[
                    styles.dayLabel,
                    { color: day.date ? inactiveColor : '#CCC' },
                    isSelected && { color: activeColor },
                  ]}
                >
                  {day.label}
                </AppText>

                <View
                  style={[
                    styles.dateCircle,
                    isSelected && { backgroundColor: activeColor },
                  ]}
                >
                  <AppText allowFontScaling={false}
                    style={[styles.dayNumber, isSelected && { color: '#fff' }]}
                  >
                    {day.date || ''}
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ----------- BOOKING SLOT SECTION ----------- */}
      <AppText allowFontScaling={false} style={styles.cardTitle}>Booking Slot</AppText>

      <View style={styles.slotRow}>
        {/* FIRST HALF */}
        <TouchableOpacity
          onPress={() => setSelectedSlot('first')}
          style={[
            styles.slotBox,
            selectedSlot === 'first' && styles.slotActive,
          ]}
        >
          <View style={styles.slotHeader}>
            <AppText
              allowFontScaling={false}
              style={[
                styles.slotTitle,
                selectedSlot === 'first' && styles.slotTitleActive,
              ]}
            >
              First Half
            </AppText>

            <View
              style={[
                styles.radioOuter,
                selectedSlot === 'first' && styles.radioOuterActive,
              ]}
            >
              <View
                style={[
                  styles.radioInner,
                  selectedSlot === 'first' && styles.radioInnerActive,
                ]}
              />
            </View>
          </View>

          <AppText allowFontScaling={false}
            style={[
              styles.slotTime,
              selectedSlot === 'first' && styles.slotTimeActive,
            ]}
          >
            10:00 AM To 02:00 PM
          </AppText>
        </TouchableOpacity>

        {/* SECOND HALF */}
        <TouchableOpacity
          onPress={() => setSelectedSlot('second')}
          style={[
            styles.slotBox,
            selectedSlot === 'second' && styles.slotActive,
          ]}
        >
          <View style={styles.slotHeader}>
            <AppText allowFontScaling={false} style={styles.slotTitle}>Second Half</AppText>

            <View
              style={[
                styles.radioOuter,
                selectedSlot === 'second' && styles.radioOuterActive,
              ]}
            >
              <View
                style={[
                  styles.radioInner,
                  selectedSlot === 'second' && styles.radioInnerActive,
                ]}
              />
            </View>
          </View>

          <AppText allowFontScaling={false} style={styles.slotTime}>02:00 PM To 08:00 PM</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDateTimePicker;

// -------------------- STYLES -------------------- //

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },

  monthText: {
    fontSize: 16,
    fontWeight: '600',
  },

  arrowBtn: {
    paddingHorizontal: 15,
    paddingVertical: 2,
    backgroundColor: '#F2F2F2',
    borderRadius: 22,
    alignItems: 'center',
  },

  arrow: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
  },

  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  dayBox: {
    alignItems: 'center',
    marginRight: 15,
  },

  dayLabel: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },

  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAF0F6',
  },

  dayNumber: {
    fontSize: 15,
    fontWeight: '600',
  },

  // SLOT STYLES
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  slotBox: {
    width: '48%',
    borderWidth: 1.4,
    borderColor: '#D9D9D9',
    borderRadius: 14,
    padding: 12,
  },

  slotActive: {
    borderColor: '#207cccff',
  },

  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  slotTitle: {
    fontSize: 16,
    color: '#333',
  },

  slotTitleActive: {
    color: '#207cccff',
  },

  slotTime: {
    fontSize: 13,
    marginTop: 4,
    color: '#555',
  },

  slotTimeActive: {
    color: '#207cccff',
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterActive: {
    borderColor: '#207cccff',
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },

  radioInnerActive: {
    backgroundColor: '#207cccff',
    width: 10,
    height: 10,
    borderRadius: 6,
  },
});
