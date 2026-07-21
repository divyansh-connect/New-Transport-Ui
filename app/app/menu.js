import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { Icon } from '../src/components/common/Icon';
import { SPACING, RADIUS } from '../src/constants/theme';

export default function MenuScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const menuItems = [
    { label: 'Login Screen', icon: 'lock', route: '/login' },
    { label: 'Profile', icon: 'user', route: '/profile' },
    { label: 'Opportunity', icon: 'briefcase', route: '/opportunity' },
    { label: 'Notifications', icon: 'bell', route: '/notification' },
    { label: 'Contact Support', icon: 'phone', route: '/contact-us' },
    { label: 'App Settings', icon: 'settings', route: '/settings' },
    { label: 'Register as Partner/Driver', icon: 'truck', route: '/register' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Menu Navigation" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} activeOpacity={0.75} onPress={() => router.push(item.route)}>
            <Card style={styles.menuCard}>
              <View style={styles.itemRow}>
                <View style={[styles.iconWrapper, { backgroundColor: theme.surface }]}>
                  <Icon name={item.icon} size={22} color={theme.primary} />
                </View>
                <Text style={[styles.itemLabel, { color: theme.textPrimary }]}>{item.label}</Text>
                <Icon name="chevronRight" size={18} color={theme.textSecondary} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
  },
  menuCard: {
    marginBottom: SPACING.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});
