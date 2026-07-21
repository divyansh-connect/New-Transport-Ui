import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Standard Built-in Expo Vector Icons (Zero External Dependency Issues)
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
    chevronLeft: <Ionicons name="chevron-back" size={size} color={activeColor} />,
    back: <Ionicons name="arrow-back" size={size} color={activeColor} />,
    whatsapp: <Ionicons name="logo-whatsapp" size={size} color={activeColor} />,
    checkmark: <Ionicons name="checkmark-circle" size={size} color={activeColor} />,
    time: <Ionicons name="time-outline" size={size} color={activeColor} />,
    wrench: <Ionicons name="construct-outline" size={size} color={activeColor} />,
    fuel: <Ionicons name="color-fill-outline" size={size} color={activeColor} />,
    car: <Ionicons name="car-outline" size={size} color={activeColor} />,
    sun: <Ionicons name="sunny-outline" size={size} color={activeColor} />,
    moon: <Ionicons name="moon-outline" size={size} color={activeColor} />,
    globe: <Ionicons name="globe-outline" size={size} color={activeColor} />,
    navigation: <Ionicons name="navigate-outline" size={size} color={activeColor} />,
    x: <Ionicons name="close" size={size} color={activeColor} />,
    'map-pin': <Ionicons name="location-outline" size={size} color={activeColor} />,
    info: <Ionicons name="information-circle-outline" size={size} color={activeColor} />,
    shield: <Ionicons name="shield-checkmark-outline" size={size} color={activeColor} />,
    logout: <Ionicons name="log-out-outline" size={size} color={activeColor} />,
    trash: <Ionicons name="trash-outline" size={size} color={activeColor} />,
    eye: <Ionicons name="eye-outline" size={size} color={activeColor} />,
  };

  return iconMap[name] || <Ionicons name="location-outline" size={size} color={activeColor} />;
};
