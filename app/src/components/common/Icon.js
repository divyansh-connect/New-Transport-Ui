import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

// Clean Minimal Vector Icon Primitives
export const Icon = ({ name, size = 20, color }) => {
  const { theme } = useTheme();
  const activeColor = color || theme.primary;

  const icons = {
    truck: (
      <View style={[styles.iconBase, { width: size, height: size }]}>
        <Text style={{ fontSize: size * 0.75 }}>🚛</Text>
      </View>
    ),
    map: (
      <View style={[styles.iconBase, { width: size, height: size }]}>
        <Text style={{ fontSize: size * 0.75 }}>🗺️</Text>
      </View>
    ),
    user: (
      <View style={[styles.iconBase, { width: size, height: size }]}>
        <Text style={{ fontSize: size * 0.75 }}>👤</Text>
      </View>
    ),
    lock: (
      <View style={[styles.iconBase, { width: size, height: size }]}>
        <Text style={{ fontSize: size * 0.75 }}>🔒</Text>
      </View>
    ),
    mail: (
      <View style={[styles.iconBase, { width: size, height: size }]}>
        <Text style={{ fontSize: size * 0.75 }}>✉️</Text>
      </View>
    ),
    phone: (
      <View style={[styles.iconBase, { width: size, height: size }]}>
        <Text style={{ fontSize: size * 0.75 }}>📞</Text>
      </View>
    ),
    bell: (
      <View style={[styles.iconBase, { width: size, height: size }]}>
        <Text style={{ fontSize: size * 0.75 }}>🔔</Text>
      </View>
    ),
    briefcase: (
      <View style={[styles.iconBase, { width: size, height: size }]}>
        <Text style={{ fontSize: size * 0.75 }}>💼</Text>
      </View>
    ),
    settings: (
      <View style={[styles.iconBase, { width: size, height: size }]}>
        <Text style={{ fontSize: size * 0.75 }}>⚙️</Text>
      </View>
    ),
    chevronRight: (
      <Text style={{ fontSize: size * 0.8, color: activeColor, fontWeight: '700' }}>›</Text>
    ),
    back: (
      <Text style={{ fontSize: size, color: activeColor, fontWeight: '700' }}>←</Text>
    ),
  };

  return icons[name] || null;
};

const styles = StyleSheet.create({
  iconBase: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
