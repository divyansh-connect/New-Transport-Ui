import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { SPACING } from '../src/constants/theme';

export default function SplashScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/map');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
          <Text style={styles.logoText}>🚛</Text>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Driver Life Tracking</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Smart Fleet & Service Ecosystem</Text>
      </View>
      <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  content: {
    alignItems: 'center',
    marginTop: 100,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
  },
  loader: {
    marginBottom: SPACING.lg,
  },
});
