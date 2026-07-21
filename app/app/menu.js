import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { CustomButton } from '../src/components/common/buttons/CustomButton';
import { Icon } from '../src/components/common/Icon';
import { SPACING, RADIUS } from '../src/constants/theme';
import { translations } from '../src/constants/translations';

export default function MenuScreen() {
  const { theme, isDarkMode, toggleTheme, language, setLanguage } = useTheme();
  const router = useRouter();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';

  const menuItems = [
    { label: t.menuMap, icon: 'map', route: '/map' },
    { label: t.menuProfile, icon: 'user', route: '/profile' },
    { label: t.menuOpportunity, icon: 'briefcase', route: '/opportunity' },
    { label: t.menuNotification, icon: 'bell', route: '/notification' },
    { label: t.menuContactUs, icon: 'phone', route: '/contact-us' },
    { label: t.menuSetting, icon: 'settings', route: '/settings' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={t.menuTitle} showBack={true} />

      <ScrollView contentContainerStyle={[styles.content, isArabic && { direction: 'rtl' }]}>
        <Card style={styles.menuCardContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.75}
              onPress={() => router.push(item.route)}
              style={[styles.menuItemRow, isArabic && { flexDirection: 'row-reverse' }]}
            >
              <Text style={[styles.itemText, { color: theme.textPrimary, textAlign: isArabic ? 'right' : 'left' }]}>{item.label}</Text>
              <Icon name={isArabic ? 'chevronLeft' : 'chevronRight'} size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.menuItemRow, isArabic && { flexDirection: 'row-reverse' }]} onPress={toggleTheme}>
            <Text style={[styles.itemText, { color: theme.textPrimary, textAlign: isArabic ? 'right' : 'left' }]}>{t.menuDarkLight}</Text>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>
              {isDarkMode ? t.menuDark : t.menuLight}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Register Button */}
        <CustomButton
          title={t.registerOpenService}
          onPress={() => router.push('/register')}
          style={{ marginVertical: SPACING.md }}
        />

        {/* Language Toggle Button */}
        <CustomButton
          title={language === 'English' ? '🌐 Language: English → العربية' : '🌐 اللغة: العربية ← English'}
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
