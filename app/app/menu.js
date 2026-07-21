import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { CustomButton } from '../src/components/common/buttons/CustomButton';
import { Icon } from '../src/components/common/Icon';
import { SPACING, RADIUS } from '../src/constants/theme';

export default function MenuScreen() {
  const { theme, isDarkMode, toggleTheme, language, setLanguage } = useTheme();
  const router = useRouter();

  const menuItems = [
    { label: 'MAP', icon: 'map', route: '/map' },
    { label: 'Profile', icon: 'user', route: '/profile' },
    { label: 'Opportunity', icon: 'briefcase', route: '/opportunity' },
    { label: 'Notification', icon: 'bell', route: '/notification' },
    { label: 'Contact us', icon: 'phone', route: '/contact-us' },
    { label: 'Setting', icon: 'settings', route: '/settings' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Menu Settings" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.menuCardContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.75}
              onPress={() => router.push(item.route)}
              style={styles.menuItemRow}
            >
              <Text style={[styles.itemText, { color: theme.textPrimary }]}>{item.label}</Text>
              <Icon name="chevronRight" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.menuItemRow} onPress={toggleTheme}>
            <Text style={[styles.itemText, { color: theme.textPrimary }]}>Dark-Light Mode</Text>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>
              {isDarkMode ? '🌙 Dark' : '☀️ Light'}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Register Button (open Service List) */}
        <CustomButton
          title="Register (open Service List)"
          onPress={() => router.push('/register')}
          style={{ marginVertical: SPACING.md }}
        />

        {/* Language Button */}
        <CustomButton
          title={`Language: ${language}`}
          variant="secondary"
          onPress={() => setLanguage(language === 'English' ? 'Arabic' : 'English')}
        />
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
  menuCardContainer: {
    paddingVertical: SPACING.sm,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
