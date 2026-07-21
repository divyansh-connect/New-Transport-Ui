import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { Card } from '../../src/components/common/cards/Card';
import { CustomButton } from '../../src/components/common/buttons/CustomButton';
import { RADIUS, SPACING } from '../../src/constants/theme';

export default function ApprovalPendingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [status, setStatus] = useState('Pending'); // 'Pending' or 'Approved'

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Approval Status" showBack={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <View style={[styles.statusIcon, { backgroundColor: status === 'Approved' ? theme.success : theme.warning }]}>
            <Text style={{ fontSize: 32 }}>{status === 'Approved' ? '✅' : '⏳'}</Text>
          </View>

          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {status === 'Approved' ? 'Account Approved!' : 'Admin Approval Pending'}
          </Text>

          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            {status === 'Approved'
              ? 'Your account has been verified by system administrator. You can now start live tracking.'
              : 'Your application and payment are under review by the Admin Team. No OTP or login is required.'}
          </Text>

          <View style={[styles.statusBadge, { backgroundColor: theme.surface }]}>
            <Text style={[styles.badgeLabel, { color: theme.textSecondary }]}>Current Status:</Text>
            <Text
              style={[
                styles.badgeValue,
                { color: status === 'Approved' ? theme.success : theme.warning },
              ]}
            >
              {status}
            </Text>
          </View>

          {/* Toggle demo button for status transition */}
          <CustomButton
            title={status === 'Pending' ? 'Simulate Admin Approval' : 'Reset to Pending'}
            variant="secondary"
            onPress={() => setStatus(status === 'Pending' ? 'Approved' : 'Pending')}
            style={{ marginBottom: SPACING.sm }}
          />

          <CustomButton
            title="Back to Map"
            onPress={() => router.replace('/map')}
          />
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
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  statusIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  sub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.lg,
  },
  badgeLabel: {
    fontSize: 13,
    marginRight: 6,
  },
  badgeValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});
