import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function MealPlanScreen() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDay = 4; // Thursday
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Text style={styles.cartIcon}>🛒</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekSelector}>
          {days.map((day, index) => (
            <TouchableOpacity 
              key={day} 
              style={[
                styles.dayButton,
                index === currentDay && styles.dayButtonActive
              ]}
            >
              <Text style={[
                styles.dayText,
                index === currentDay && styles.dayTextActive
              ]}>{day}</Text>
              <Text style={[
                styles.dateText,
                index === currentDay && styles.dateTextActive
              ]}>{31 + index}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.nutritionSummary}>
          <Text style={styles.sectionTitle}>Daily Nutrition</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>0 cal</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>0g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>0g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>0g</Text>
            </View>
          </View>
        </View>

        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>☀️ Breakfast</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>➕ Add Breakfast</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>🍽️ Lunch</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>➕ Add Lunch</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>🍴 Dinner</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>➕ Add Dinner</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>🥜 Snacks</Text>
          <TouchableOpacity style={styles.addIconButton}>
            <Text style={styles.addIcon}>➕</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  cartIcon: {
    fontSize: 24,
  },
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  dayButtonActive: {
    backgroundColor: '#3b82f6',
  },
  dayText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  dayTextActive: {
    color: 'white',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dateTextActive: {
    color: 'white',
  },
  nutritionSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  mealSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  addIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 20,
    color: '#3b82f6',
  },
});