import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { linearRegression, linearRegressionLine, mean, standardDeviation } from 'simple-statistics';

import type { RootStackParamList } from '../navigation/types';
import { useAppShellStore } from '../store/appShellStore';
import { palette } from '../theme/colors';
import { statsRepository } from '../repositories/StatsRepository';
import { recipeRepository } from '../repositories/RecipeRepository';
import type { CalorieRecord, ConfidenceRecord, RecipeDTO } from '../types/api';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: palette.surface,
  backgroundGradientTo: palette.surface,
  color: (opacity = 1) => `rgba(164, 219, 102, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(224, 235, 222, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'AnalysisStatistics'>;

function getCalorieTrendData(history: CalorieRecord[]) {
  // Use last 7 items or mock if empty
  const hasEnoughData = history.length >= 2;
  const baseData = hasEnoughData 
    ? [...history].reverse().slice(-7)
    : [
        { calories: 1800, date: '' }, { calories: 2100, date: '' }, 
        { calories: 1950, date: '' }, { calories: 2000, date: '' }, 
        { calories: 2400, date: '' }, { calories: 2300, date: '' }, 
        { calories: 2200, date: '' }
      ];

  const rawData = baseData.map(d => d.calories);
  const points = rawData.map((val, idx) => [idx, val]);
  
  let equation = 'y = 0x + 0';
  let trendLine = rawData;

  try {
    if (points.length >= 2) {
      const regressionResult = linearRegression(points);
      const findLineY = linearRegressionLine(regressionResult);
      trendLine = rawData.map((_, idx) => findLineY(idx));
      equation = `y = ${regressionResult.m.toFixed(2)}x + ${regressionResult.b.toFixed(2)}`;
    }
  } catch (e) {
    console.warn('Regression calculation failed', e);
  }
  
  return {
    labels: baseData.map((_, i) => i === baseData.length - 1 ? 'Today' : `T-${baseData.length - 1 - i}`),
    datasets: [
      {
        data: rawData,
        color: (opacity = 1) => `rgba(164, 219, 102, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: trendLine,
        color: (opacity = 1) => `rgba(255, 100, 100, ${opacity})`,
        withDots: false,
        strokeWidth: 2,
      }
    ],
    equation,
    isMock: !hasEnoughData
  };
}

function getPrepTimeVsDifficultyData(recipes: RecipeDTO[]) {
  // Group by difficulty
  const difficultyMap: Record<string, number[]> = { easy: [], medium: [], hard: [] };
  
  recipes.forEach(r => {
    if (difficultyMap[r.difficulty]) {
      difficultyMap[r.difficulty].push(r.totalTimeMinutes);
    }
  });

  const getAvg = (diff: string) => {
    const times = difficultyMap[diff];
    if (times.length > 0) {
      try {
        return mean(times);
      } catch {
        return diff === 'easy' ? 15 : diff === 'medium' ? 35 : 75;
      }
    }
    return diff === 'easy' ? 15 : diff === 'medium' ? 35 : 75;
  };

  return {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [getAvg('easy'), getAvg('medium'), getAvg('hard')]
      }
    ],
    isMock: recipes.length === 0
  };
}

function getConfidenceData(history: ConfidenceRecord[]) {
  const hasEnoughData = history.length >= 2;
  const baseData = hasEnoughData
    ? [...history].reverse().slice(-6)
    : [{ confidence: 0.65 }, { confidence: 0.70 }, { confidence: 0.85 }, { confidence: 0.82 }, { confidence: 0.90 }, { confidence: 1.0 }];

  const scores = baseData.map(d => d.confidence);
  let avg = 0.85;

  try {
    avg = scores.length > 0 ? mean(scores) : 0.85;
  } catch (e) {
    console.warn('Mean calculation failed', e);
  }
  
  return {
    labels: baseData.map((_, i) => (i + 1).toString()),
    datasets: [{ data: scores.map(s => s * 100) }],
    average: avg * 100,
    isMock: !hasEnoughData
  };
}

export function AnalysisStatisticsScreen({ navigation }: ScreenProps) {
  const { t } = useTranslation();
  const pantryIngredients = useAppShellStore((state) => state.pantryIngredients);
  const latestAnalysis = useAppShellStore((state) => state.latestAnalysis);
  
  const [calorieHistory, setCalorieHistory] = useState<CalorieRecord[]>([]);
  const [confidenceHistory, setConfidenceHistory] = useState<ConfidenceRecord[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<RecipeDTO[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cal, conf, recipes] = await Promise.all([
          statsRepository.getCalorieHistory(),
          statsRepository.getConfidenceHistory(),
          recipeRepository.findAll()
        ]);
        setCalorieHistory(cal);
        setConfidenceHistory(conf);
        setSavedRecipes(recipes);
      } catch (e) {
        console.error('Failed to load stats data', e);
      }
    };
    loadData();
  }, []);

  // Math Model: Variance & Mean of Categories
  const categoryCounts = pantryIngredients.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Mock if empty
  const hasPantryData = Object.keys(categoryCounts).length > 0;
  const defaultCategories = { vegetable: 4, protein: 2, dairy: 1, fruit: 3 };
  const finalCategories = hasPantryData ? categoryCounts : defaultCategories;
  
  const pieData = Object.entries(finalCategories).map(([name, population], index) => {
    const colors = ['#A4DB66', '#FF9F40', '#FF6384', '#36A2EB', '#9966FF'];
    return {
      name,
      population,
      color: colors[index % colors.length],
      legendFontColor: palette.textSecondary,
      legendFontSize: 12
    };
  });

  const populations = Object.values(finalCategories);
  let categoryMean = '0';
  let categoryStdDev = '0';

  try {
    if (populations.length > 0) {
      categoryMean = mean(populations).toFixed(1);
      // Standard deviation requires at least one element for population SD in some libs, 
      // but simple-statistics needs 2 or more for variance/sample SD.
      categoryStdDev = populations.length >= 2 ? standardDeviation(populations).toFixed(1) : '0';
    }
  } catch (e) {
    console.warn('Stat calculations failed', e);
  }

  // Include current latest analysis in prep time calculation if available
  const allKnownRecipes = latestAnalysis ? [...savedRecipes, latestAnalysis.suggestedRecipe] : savedRecipes;

  const calorieTrend = getCalorieTrendData(calorieHistory);
  const prepTime = getPrepTimeVsDifficultyData(allKnownRecipes);
  const confidence = getConfidenceData(confidenceHistory);

  return (
    <LinearGradient colors={[palette.background, palette.backgroundAlt]} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialCommunityIcons color={palette.textPrimary} name="arrow-left" size={24} />
            </Pressable>
            <View style={styles.headerCopy}>
              <Text style={styles.headerTitle}>{t('dataInsights')}</Text>
              <Text style={styles.headerSubtitle}>{t('dataInsightsDesc')}</Text>
            </View>
          </View>

          {/* CHART 1: Calories Trend */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('caloriesTrend')}</Text>
            <Text style={styles.cardBody}>{t('caloriesTrendDesc')}</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={calorieTrend}
                width={screenWidth - 80}
                height={220}
                chartConfig={chartConfig}
                bezier={false}
                style={styles.chart}
              />
              <Text style={styles.modelText}>
                {calorieTrend.isMock ? 'Model (Target): ' : 'Model (Real Trend): '} 
                {calorieTrend.equation}
              </Text>
            </View>
          </View>

          {/* CHART 2: Pantry Stats */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('pantryStats')}</Text>
            <Text style={styles.cardBody}>{t('pantryStatsDesc')}</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieData}
                width={screenWidth - 80}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
              <Text style={styles.modelText}>Mean: {categoryMean} | Std Dev: {categoryStdDev}</Text>
            </View>
          </View>

          {/* CHART 3: Prep Time vs Difficulty */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('prepTimeVsDifficulty')}</Text>
            <Text style={styles.cardBody}>{t('prepTimeVsDifficultyDesc')}</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={prepTime}
                width={screenWidth - 80}
                height={220}
                yAxisLabel=""
                yAxisSuffix="m"
                chartConfig={chartConfig}
                style={styles.chart}
                showValuesOnTopOfBars
              />
              <Text style={styles.modelText}>
                {prepTime.isMock ? 'Mathematical Model: Default Expectations' : `Analysis: Correlation from ${allKnownRecipes.length} recipes`}
              </Text>
            </View>
          </View>

          {/* CHART 4: Confidence Scores */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('confidenceScores')}</Text>
            <Text style={styles.cardBody}>{t('confidenceScoresDesc')}</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={confidence}
                width={screenWidth - 80}
                height={220}
                yAxisLabel=""
                yAxisSuffix="%"
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
              <Text style={styles.modelText}>
                {confidence.isMock ? 'Model (Target Accuracy): ' : 'Performance (Moving Average): '}
                {confidence.average.toFixed(1)}%
              </Text>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 40 },
  header: {
    alignItems: 'center', flexDirection: 'row', gap: 16, marginBottom: 22,
  },
  backButton: {
    alignItems: 'center', backgroundColor: palette.surface,
    borderColor: palette.outlineStrong, borderRadius: 999,
    borderWidth: 1, height: 46, justifyContent: 'center', width: 46,
  },
  headerCopy: { flex: 1 },
  headerTitle: { color: palette.textPrimary, fontSize: 28, fontWeight: '900' },
  headerSubtitle: { color: palette.textSecondary, fontSize: 14, marginTop: 6 },
  card: {
    backgroundColor: palette.surface, borderColor: palette.outlineStrong,
    borderRadius: 24, borderWidth: 1, marginBottom: 18, padding: 18,
  },
  cardLabel: {
    color: palette.primary, fontSize: 13, fontWeight: '900',
    letterSpacing: 1, textTransform: 'uppercase',
  },
  cardBody: {
    color: palette.textSecondary, fontSize: 15, lineHeight: 22, marginTop: 8,
  },
  chartContainer: { marginTop: 16, alignItems: 'center' },
  chart: { borderRadius: 16 },
  modelText: {
    color: palette.primary, fontSize: 13, marginTop: 12, fontWeight: '700', textAlign: 'center'
  }
});
