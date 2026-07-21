import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { SPACING } from '../src/constants/theme';

export default function NotificationScreen() {
  const { theme } = useTheme();

  const notifications = [
    { id: 1, title: 'Approval Request Update', body: 'Your registration request is currently under admin review.', time: '10m ago', unread: true },
    { id: 2, title: 'Live Tracking Enabled', body: 'GPS broadcasting is active for your driver profile.', time: '1h ago', unread: false },
    { id: 3, title: 'System Maintenance', body: 'Map telemetry system update scheduled at 02:00 UTC.', time: '1d ago', unread: false },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Notifications" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        {notifications.map((item) => (
          <Card key={item.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.time, { color: theme.textSecondary }]}>{item.time}</Text>
            </View>
            <Text style={[styles.body, { color: theme.textSecondary }]}>{item.body}</Text>
          </Card>
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
  card: {
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
  },
  body: {
    fontSize: 14,
  },
});
