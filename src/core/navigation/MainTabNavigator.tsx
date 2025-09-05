import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform} from 'react-native';
import DashboardScreen from '../../features/dashboard/screens/DashboardScreen';
import MealLogScreen from '../../features/meals/screens/MealLogScreen';
import RecipesScreen from '../../features/recipes/screens/RecipesScreen';
import MealPlanScreen from '../../features/meals/screens/MealPlanScreen';
import MoreScreen from '../../features/dashboard/screens/MoreScreen';
import {MainTabParamList} from './types';
import TabBarIcon from '../../core/ui/components/TabBarIcon';

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#10B981', // Green color matching iOS app
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: Platform.OS === 'ios' ? 0 : 5,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Log"
        component={MealLogScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <TabBarIcon name="add-circle" color={color} size={size} />
          ),
          title: 'Log Meal',
        }}
      />
      <Tab.Screen
        name="Recipes"
        component={RecipesScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <TabBarIcon name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Plan"
        component={MealPlanScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <TabBarIcon name="calendar" color={color} size={size} />
          ),
          title: 'Meal Plan',
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <TabBarIcon name="menu" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;