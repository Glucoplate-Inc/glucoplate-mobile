import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function RecipesScreen() {
  const recipes = [
    {id: 1, name: 'Churros with Chocolate', time: '50 min', difficulty: 'Medium', tags: ['Vegetarian', 'Fried', 'Sweet']},
    {id: 2, name: 'Jalebi', time: '50 min', difficulty: 'Medium', tags: ['Balanced', 'Vegetarian']},
    {id: 3, name: 'Cannoli Siciliani', time: '90 min', difficulty: 'Medium', tags: ['Vegetarian', 'Sweet']},
    {id: 4, name: 'Mysore Pak', time: '45 min', difficulty: 'Medium', tags: ['Balanced', 'Vegetarian']},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>🔍 Search recipes...</Text>
        </View>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
            <Text style={styles.filterChipTextActive}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>🔥 Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>⭐ For You</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterChipText}>❤️ Favorites</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recipeGrid}>
          {recipes.map(recipe => (
            <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
              <View style={styles.recipeImage}>
                <Text style={styles.placeholderImage}>🍽️</Text>
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeDetails}>⏱ {recipe.time} • {recipe.difficulty}</Text>
                <View style={styles.tags}>
                  {recipe.tags.map(tag => (
                    <Text key={tag} style={styles.tag}>{tag}</Text>
                  ))}
                </View>
              </View>
              <TouchableOpacity style={styles.favoriteButton}>
                <Text>🤍</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  searchPlaceholder: {
    color: '#9ca3af',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
  },
  filterChipText: {
    color: '#374151',
  },
  filterChipTextActive: {
    color: 'white',
  },
  recipeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  recipeImage: {
    height: 120,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    fontSize: 48,
  },
  recipeInfo: {
    padding: 12,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  recipeDetails: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 10,
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});