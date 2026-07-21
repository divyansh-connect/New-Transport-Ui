import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { SPACING, RADIUS } from '../src/constants/theme';

export default function OpportunityScreen() {
  const { theme, opportunityNotice } = useTheme();

  const notice = opportunityNotice || {
    title: 'High-Demand Cargo Routes Available',
    category: 'Logistics Opportunity',
    date: 'Today, 10:30 AM',
    description: 'Long-haul freight opportunities open for heavy truck drivers connecting northern ports to regional fulfillment hubs. High competitive payouts.',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Opportunity Notice Board" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <View style={styles.badgeRow}>
            <Text style={[styles.categoryBadge, { backgroundColor: theme.surface, color: theme.primary }]}>
              {notice.category || 'Admin Announcement'}
            </Text>
            <Text style={[styles.dateText, { color: theme.textSecondary }]}>{notice.date || 'Just Now'}</Text>
          </View>

          <Text style={[styles.title, { color: theme.textPrimary }]}>{notice.title}</Text>
          <Text style={[styles.desc, { color: theme.textSecondary }]}>
            {notice.description || notice.body || notice.content}
          </Text>
        </Card>

        {/* Client Note Information */}
        <View style={[styles.noteBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.noteHeader, { color: theme.primary }]}>ℹ️ Notice Board Info</Text>
          <Text style={[styles.noteText, { color: theme.textSecondary }]}>
            This section displays static or live notices written directly by System Admin from the Web Admin Dashboard.
          </Text>
        </View>
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
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  dateText: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: SPACING.xs,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
  },
  noteBox: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginTop: SPACING.xs,
  },
  noteHeader: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
