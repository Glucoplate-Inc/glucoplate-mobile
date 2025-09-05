import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good evening,</Text>
          <Text style={styles.userName}>Bobby</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <View style={styles.calorieContainer}>
            <Text style={styles.calorieNumber}>1,671</Text>
            <Text style={styles.calorieLabel}>calories</Text>
            <Text style={styles.calorieSubtext}>of 2,711</Text>
            <Text style={styles.calorieRemaining}>1,039 left</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Water Intake</Text>
          <Text style={styles.waterText}>0ml of 3,700ml</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Add</Text>
          <View style={styles.quickAddGrid}>
            <View style={styles.quickAddItem}>
              <Text>☕</Text>
              <Text>Coffee</Text>
              <Text style={styles.quickAddCalories}>5 cal</Text>
            </View>
            <View style={styles.quickAddItem}>
              <Text>🍞</Text>
              <Text>Toast</Text>
              <Text style={styles.quickAddCalories}>140 cal</Text>
            </View>
            <View style={styles.quickAddItem}>
              <Text>🍎</Text>
              <Text>Apple</Text>
              <Text style={styles.quickAddCalories}>80 cal</Text>
            </View>
            <View style={styles.quickAddItem}>
              <Text>🍌</Text>
              <Text>Banana</Text>
              <Text style={styles.quickAddCalories}>105 cal</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  calorieContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  calorieNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  calorieSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  calorieRemaining: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  waterText: {
    fontSize: 16,
    color: '#6b7280',
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAddItem: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  quickAddCalories: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});