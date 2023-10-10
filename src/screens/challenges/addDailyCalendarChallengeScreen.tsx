import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, useWindowDimensions, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SaveButton } from '../../components/ButtonWrapper/SaveButton';
import { useTheme } from '../../hooks/useTheme';
import { AppTheme } from '../../styles/themeModels';
import LinearGradient from 'react-native-linear-gradient'
import { MainStackParamList } from '../../navigators/MainStackNavigator';
import challengesService from '../../services/challengesService';
import { useHeaderHeight } from '@react-navigation/elements';
import { icons } from '../../assets';
import { CircleButton } from '../../components/ButtonWrapper/CircleButton';
import ImageSwapper from '../../components/ImageSwapper/ImageSwapper';
import { SvgComponents } from '../../assets/svgIndex';
import { Calendar } from 'react-native-calendars';
import { DailyCalendarChallenge } from '../../entities/challenge';
import timeService from '../../services/timeService';
import { Theme } from 'react-native-calendars/src/types';

type AddDailyCalendarChallengeScreenProps = NativeStackScreenProps<MainStackParamList, 'AddDailyCalendarChallengeScreen'>;

const dateDiffInDays = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2 - date1);

  if (isNaN(diffTime)) {
    return 0;
  }

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

export const AddDailyCalendarChallengeScreen = ({ navigation, route } : AddDailyCalendarChallengeScreenProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const { challengeType, originalChallenge } = route.params;

  const window = useWindowDimensions();
  const headerHeight = useHeaderHeight();

  const [isStartModalVisible, setIsStartModalVisible] = useState(false);
  const [isEndModalVisible, setIsEndModalVisible] = useState(false);

  const [title, onChangeTitleText] = useState(originalChallenge?.title != null ? originalChallenge.title : '');
  const [description, onChangeDescriptionText] = useState(originalChallenge?.description != null ? originalChallenge.description : '');
  const [targetValue, onChangeTargetValueText] = useState(originalChallenge?.targetValue != null ? originalChallenge.targetValue.toString() : '');
  const [imageLocation, setCurrentImageLocation] = useState(originalChallenge?.image != null ? originalChallenge.image : SvgComponents[0].location);
  
  const [startDate, setStartDate] = useState(originalChallenge?.startDate != null ? originalChallenge.startDate : timeService.getCurrentDate());
  const [endDate, setEndDate] = useState(originalChallenge?.endDate != null ? originalChallenge.endDate : '');
  const [numberOfDays, setNumberOfDays] = useState(dateDiffInDays(new Date(startDate), new Date(endDate)));

  const showStartCalendar = () => {
    setIsStartModalVisible(true);
  };

  const hideStartCalendar = () => {
    setIsStartModalVisible(false);
  };

  const showEndCalendar = () => {
    setIsEndModalVisible(true);
  };

  const hideEndCalendar = () => {
    setIsEndModalVisible(false);
  };

  const onStartDayPress = (day) => {
    const _startDate = new Date(day.dateString);
    const _endDate = new Date(endDate);

    if (endDate !== "" && _startDate > _endDate) {
      return;
    }

    setStartDate(day.dateString);
    setNumberOfDays(dateDiffInDays(_startDate, _endDate));
    hideStartCalendar();
  };

  const onEndDayPress = (day) => {
    const _startDate = new Date(startDate);
    const _endDate = new Date(day.dateString);

    if (_startDate > _endDate) {
      return;
    }

    setEndDate(day.dateString);
    setNumberOfDays(dateDiffInDays(_startDate, _endDate));
    hideEndCalendar();
  };

  const handleImageChange = newIndex => {
    setCurrentImageLocation(newIndex);
  };

  const createOrUpdateChallenge = () => {

    const targetValueInt = parseInt(targetValue, 10);

    const challengeCandidate = challengesService.createNewChallenge(title, description, 0, targetValueInt, imageLocation, challengeType) as DailyCalendarChallenge;

    if (challengeCandidate == null) {
      return null;
    }

    if (originalChallenge != null) {
      challengeCandidate.id = originalChallenge.id;
      challengeCandidate.timeCreated = originalChallenge.timeCreated;
      challengeCandidate.favorite = originalChallenge.favorite;
      challengeCandidate.status = originalChallenge.status;
    }

    if (targetValueInt > numberOfDays) {
      Alert.alert("Target value cannot be bigger than number of days");
      return null;
    }

    if (endDate === "") {
      Alert.alert("End date cannot be empty");
      return null;
    }

    challengeCandidate.startDate = startDate;
    challengeCandidate.endDate = endDate;

    let datesCompleted = originalChallenge?.datesCompleted != null ? originalChallenge.datesCompleted : [];

    datesCompleted = datesCompleted.filter(
      date => startDate <= date &&  date <= endDate,
    );

    challengeCandidate.datesCompleted = datesCompleted;
    challengeCandidate.currentValue = datesCompleted.length;

    return challengeCandidate;
  }

  const onSave = async () => {
    try {
      const challenge = createOrUpdateChallenge();

      if (challenge === null) {
        return false;
      }

      const result = await challengesService.storeChallenge(challenge);

      if (result) {
        navigation.navigate('ChallengesScreen');
      }
    }
    catch (exception) {
      return false;
    }
  }

  const setNumericValueOrDefault = (value: string, setValueFunction) => {
    const defaultNumbericValue = '0';
    const numericValue = parseInt(value, 10);

    if (!isNaN(numericValue)) {
      setValueFunction(numericValue.toString());
    } else {
      setValueFunction(defaultNumbericValue);
    }
  }

  const renderHeaderContainer = () => (
    <View style={styles.imageArea}>
      <View style={styles.imageSwapper}>
        <ImageSwapper onImageChange={handleImageChange} initialImageLocation={imageLocation} />
      </View>
      <CircleButton
        imgUrl={icons["back-arrow.png"]}
        onPress={() => navigation.navigate('ChallengesScreen')}
        style={styles.backCircle}
      />
    </View>
  );

  const renderCalendarContainer = (onDayPress, hideCalendar, isModalVisible, currentDate, minDate) => (
    <View style={styles.calendarContainer}>
      <Modal
        transparent={true}
        animationType='fade'
        visible={isModalVisible}
        onRequestClose={hideCalendar}
      >
        <TouchableWithoutFeedback onPress={hideCalendar}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <Calendar
                style={[styles.calendarStyles, { width: window.width * 0.8 }]}
                theme={styles.calendarTheme}
                minDate={minDate}
                current={currentDate === Date().toString() ? '' : currentDate}
                enableSwipeMonths={true}
                onDayPress={onDayPress}
                markedDates={{
                  [currentDate]: { selected: true, disableTouchEvent: true, selectedColor: theme.colors.tertiary },
                }}
              />
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );

  const renderInputContainer = () => (
    <View style={styles.textArea}>
      <View style={styles.textImput}>
        <Text style={styles.text}>Title</Text>
        <TextInput
          style={styles.textbox}
          placeholder='Enter your challenge title...'
          onChangeText={onChangeTitleText}
          value={title}
          placeholderTextColor={theme.colors.secondary}
        />
      </View>
      {renderCalendarContainer(onStartDayPress, hideStartCalendar, isStartModalVisible, startDate, undefined)}
      {renderCalendarContainer(onEndDayPress, hideEndCalendar, isEndModalVisible, endDate, startDate)}
      <View style={styles.textImput}>
        <Text style={styles.text}>Start date</Text>
        <TouchableOpacity onPress={showStartCalendar} style={styles.textbox}>
          <Text style={styles.dateText}>{startDate || 'Select challenge start day...'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textImput}>
        <Text style={styles.text}>End date</Text>
        <TouchableOpacity onPress={showEndCalendar} style={styles.textbox}>
          <Text style={styles.dateText}>{endDate || 'Select challenge end day...'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textImput}>
        <Text style={styles.text}>Number of days to success   ({numberOfDays} days)</Text>
        <TextInput
          style={styles.textbox}
          placeholder='Enter target value...'
          onChangeText={onChangeTargetValueText}
          onBlur={() => setNumericValueOrDefault(targetValue, onChangeTargetValueText)}
          value={targetValue}
          keyboardType="numeric"
          placeholderTextColor={theme.colors.secondary}
        />
      </View>
      <View style={styles.textImput}>
        <Text style={styles.text}>Short description</Text>
        <TextInput
          style={styles.textbox}
          placeholder='Enter a short description...'
          onChangeText={onChangeDescriptionText}
          value={description}
          placeholderTextColor={theme.colors.secondary}
        />
      </View>
      <View style={styles.textImput} />
    </View>
  );

  const renderSaveContainer = () => (
    <View style={styles.saveContainer}>
      <SaveButton
        title="Save"
        onPress={async () => onSave()}
      />
    </View>
  );

  return (
    <View style={{ ...styles.container, height: window.height - headerHeight }}>
      <LinearGradient
        colors={styles.linearGradient.colors}
        style={styles.linearGradient}
      >
        <View style={styles.mainScreen}>
          <View style={styles.inputBox}>
            <View style={[styles.inputContaine]}>
              {renderHeaderContainer()}
              {renderInputContainer()}
            </View>
          </View>
          <View style={styles.empty} />
        </View>
        {renderSaveContainer()}
      </LinearGradient>
    </View>
  );
};

const createStyles = (theme: AppTheme) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primary,
    },
    calendarContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    linearGradient: {
      flex: 1,
      height: '100%',
      colors: [theme.colors.primary, theme.colors.secondary],
    },
    iconsStyle: {
      height: 100,
      width: 100,
    },
    mainScreen: {
      flex: 11,
    },
    saveContainer: {
      flex: 1,
    },
    inputBox: {
      flex: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    empty: {
      flex: 2,
    },
    inputContaine: {
      width: '90%',
      height: '80%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: theme.colors.canvas
    },
    imageArea: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    imageSwapper: {
      flex: 1,
      width: '60%',
    },
    backCircle: {
      left: 15,
      top: 15,
    },
    textArea: {
      flex: 3,
      justifyContent: 'center',
      marginLeft: 30,
      marginRight: 30,
    },
    textImput: {
      flex: 1,
    },
    text: {
      flex: 3,
      textAlignVertical: 'bottom',
      fontFamily: theme.fonts.semiBold,
      color: theme.colors.primary,
    },
    textbox: {
      flex: 2,
      padding: 0,
      fontFamily: theme.fonts.light,
      color: theme.colors.secondary,
      borderBottomColor: theme.colors.canvasInverted,
      borderBottomWidth: 1,
      justifyContent: 'flex-end',
    },
    dateText: {
      padding: 0,
      fontFamily: theme.fonts.light,
      color: theme.colors.secondary,
    },
  });

  return styles;
};

export default AddDailyCalendarChallengeScreen;
