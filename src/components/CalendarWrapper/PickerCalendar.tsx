import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import timeService from "../../services/timeService";
import { AppTheme } from "../../styles/themeModels";
import { useTheme } from "../../hooks/useTheme";
import { Theme } from "react-native-calendars/src/types";
import MyModal from "../Modals/MyModal";

interface PickerCalendarProps {
  onDayPress: (day) => void;
  hideCalendar: () => void;
  isModalVisible: boolean;
  currentDate: string;
  minDate: string | undefined;
  maxDate?: string | undefined;
}

const PickerCalendar = (props: PickerCalendarProps) => {
  const { isModalVisible, hideCalendar, onDayPress, currentDate, minDate, maxDate } = props;

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const window = useWindowDimensions();

  return (
    <View style={styles.calendarContainer}>
      <MyModal isModalVisible={isModalVisible} hideModal={hideCalendar} >
        <Calendar
          style={[styles.calendarStyles, { width: window.width * 0.8 }]}
          theme={styles.calendarTheme}
          maxDate={maxDate}
          minDate={minDate}
          current={timeService.getCurrentDateString()}
          enableSwipeMonths={true}
          onDayPress={onDayPress}
          markedDates={{
            [currentDate]: { selected: true, disableTouchEvent: true, selectedColor: theme.colors.tertiary },
          }}
        />
      </MyModal>
    </View>
  )
}

const createStyles = (theme: AppTheme) => {
  const styles = StyleSheet.create({
    calendarContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    calendarStyles: {
      justifyContent: 'center',
    },
    calendarTheme: {
      arrowColor: theme.colors.canvasInverted,
      textDayFontFamily: theme.fonts.light,
      textMonthFontFamily: theme.fonts.bold,
      textDayHeaderFontFamily: theme.fonts.medium,
      todayTextColor: theme.colors.tertiary,
    } as Theme,
  });

  return styles;
};

export default PickerCalendar;