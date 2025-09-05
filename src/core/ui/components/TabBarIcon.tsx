import React from 'react';
import {Text} from 'react-native';

interface TabBarIconProps {
  name: string;
  color: string;
  size: number;
}

// Simple emoji-based icons for now
// You can replace with react-native-vector-icons later
const iconMap: Record<string, string> = {
  home: '🏠',
  'add-circle': '➕',
  book: '📖',
  calendar: '📅',
  menu: '☰',
};

export default function TabBarIcon({name, color, size}: TabBarIconProps) {
  return (
    <Text style={{fontSize: size, color}}>
      {iconMap[name] || '❓'}
    </Text>
  );
}