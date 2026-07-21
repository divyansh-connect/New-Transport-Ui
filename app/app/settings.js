import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { SPACING } from '../src/constants/theme';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme, theme, language, setLanguage } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Settings" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>Appearance</Text>
          <View style={styles.row}>
            <View>
              <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Dark Mode</Text>
              <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>Localization</Text>
          <Text style={[styles.settingTitle, { color: theme.textPrimary, marginBottom: SPACING.xs }]}>
            Application Language
          </Text>
          {['English', 'Spanish', 'French', 'Arabic'].map((lang) => (
            <TouchableOpacity
              key={lang}
              style={styles.langOption}
              onPress={() => setLanguage(lang)}
            >
              <Text style={{ color: theme.textPrimary, fontSize: 15 }}>{lang}</Text>
              {language === lang && <Text style={{ color: theme.primary, fontWeight: '700' }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </Card>
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
  card: {
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 12,
    marginTop: 2,
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
});
