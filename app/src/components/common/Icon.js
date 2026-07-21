import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Standard Expo Vector Icons Wrapper
export const Icon = ({ name, size = 22, color }) => {
  const { theme } = useTheme();
  const activeColor = color || theme.primary;

  const iconMap = {
    map: <Ionicons name="map-outline" size={size} color={activeColor} />,
    user: <Ionicons name="person-outline" size={size} color={activeColor} />,
    briefcase: <Ionicons name="briefcase-outline" size={size} color={activeColor} />,
    bell: <Ionicons name="notifications-outline" size={size} color={activeColor} />,
    phone: <Ionicons name="call-outline" size={size} color={activeColor} />,
    settings: <Ionicons name="settings-outline" size={size} color={activeColor} />,
    truck: <MaterialCommunityIcons name="truck-fast-outline" size={size} color={activeColor} />,
    chevronRight: <Ionicons name="chevron-forward" size={size} color={activeColor} />,
    back: <Ionicons name="arrow-back" size={size} color={activeColor} />,
    whatsapp: <Ionicons name="logo-whatsapp" size={size} color={activeColor} />,
    checkmark: <Ionicons name="checkmark-circle" size={size} color={activeColor} />,
    time: <Ionicons name="time-outline" size={size} color={activeColor} />,
  };

  return iconMap[name] || <Ionicons name="help-circle-outline" size={size} color={activeColor} />;
};
