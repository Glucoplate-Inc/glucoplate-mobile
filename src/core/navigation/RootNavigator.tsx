import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../../features/auth/hooks/useAuth';
import AuthNavigator from '../../features/auth/navigation/AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    // TODO: Add splash screen
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;