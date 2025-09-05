import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function MealLogScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How would you like to log your meal?</Text>
        
        <View style={styles.quickAdd}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddGrid}>
            <TouchableOpacity style={styles.quickAddItem}>
              <Text style={styles.emoji}>☕</Text>
              <Text>Coffee</Text>
              <Text style={styles.calories}>5 cal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAddItem}>
              <Text style={styles.emoji}>🍞</Text>
              <Text>Toast</Text>
              <Text style={styles.calories}>140 cal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAddItem}>
              <Text style={styles.emoji}>🍎</Text>
              <Text>Apple</Text>
              <Text style={styles.calories}>80 cal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAddItem}>
              <Text style={styles.emoji}>🍌</Text>
              <Text>Banana</Text>
              <Text style={styles.calories}>105 cal</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.button, styles.primaryButton]}>
          <Text style={styles.buttonIcon}>📸</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Take Photo</Text>
            <Text style={styles.buttonSubtitle}>AI-powered analysis</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.primaryButton]}>
          <Text style={styles.buttonIcon}>🎤</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Voice Input</Text>
            <Text style={styles.buttonSubtitle}>Describe your meal with voice</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonIcon}>✏️</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitleDark}>Manual Entry</Text>
            <Text style={styles.buttonSubtitleDark}>Search ingredients & recipes</Text>
          </View>
          <Text style={styles.chevronDark}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#111827',
  },
  quickAdd: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#374151',
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
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  calories: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  buttonTitleDark: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  buttonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  buttonSubtitleDark: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: 'white',
  },
  chevronDark: {
    fontSize: 24,
    color: '#6b7280',
  },
});