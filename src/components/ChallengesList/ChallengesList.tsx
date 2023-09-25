import React, { useContext, useState, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { customTheme } from '../../styles/customTheme';
import { ThemeContext } from '../../contexts/themeContext';
import { Challenge } from '../../entities/challenge';
import { PressableTile } from '../Tile/PressableTile';
import { HomeStackParamList } from '../../navigators/MenuTabNavigator';
import { ChallengeFilteringOptions } from '../../entities/challengeFilters';
import { ProgressStatus } from '../../entities/progressStatus';
import challengesService from '../../services/challengesService';

type ChallengesScreenProps = NativeStackScreenProps<HomeStackParamList, 'ChallengesScreen'>;

interface ChallengesListProps {
  navigation: ChallengesScreenProps;
  filteringOptions: ChallengeFilteringOptions;
}

export const ChallengesList = (props: ChallengesListProps) => {
  const { navigation, filteringOptions } = props;

  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  const [challengesFromStorage, setDataSource] = useState([] as Challenge[]);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    navigation.addListener('focus', () => {
      readData();
    });
  }, [navigation]);

  const renderItem = (item: Challenge, index: number) => {
    return (
      <PressableTile
        title={item.title}
        challenge={item}
        onPress={() => navigation.navigate('ChallengeScreen', { challenge: item })} />
    );
  };

  const filterData = (data: Challenge[]) => {
    if (filteringOptions === ChallengeFilteringOptions.OnlyFavorite) {
      return data.filter((item) => item.favorite);
    }

    if (filteringOptions === ChallengeFilteringOptions.OnlyCompleted) {
      return data.filter((item) => item.status == ProgressStatus.Completed);
    }

    return data;
  }

  async function readData() {
    try {
      const challenges = await challengesService.getAllChalenges();

      if (challenges.length == 0) {
        setRefreshing(false);
        setDataSource([]);
        return;
      }

      const filteredData = filterData(challenges);
      setDataSource(filteredData);
      setRefreshing(false);
    } catch (error) {
      Alert.alert(`${error}`)
    }
  }

  const onRefresh = () => {
    setDataSource([]);
    readData();
  };

  return (
    <SafeAreaView style={styles.container}>
      {refreshing ? <ActivityIndicator /> : null}
      <View style={styles.flatList}>
        <FlatList
          data={challengesFromStorage}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={item => item.id}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 100, justifyContent: 'center', paddingBottom: 150 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: typeof customTheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    menu: {
      flex: 1,
    },
    flatList: {
      marginTop: 10,
      marginBottom: 10,
      marginLeft: '5%',
      marginRight: '5%',
    },
  });

  return styles;
};
