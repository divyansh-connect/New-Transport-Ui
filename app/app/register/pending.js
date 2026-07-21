import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { Card } from '../../src/components/common/cards/Card';
import { CustomButton } from '../../src/components/common/buttons/CustomButton';
import { Icon } from '../../src/components/common/Icon';
import { RADIUS, SPACING } from '../../src/constants/theme';

export default function ApprovalPendingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(false); // False = Pending, True = Approved

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Approval Status" showBack={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <View style={[styles.statusIcon, { backgroundColor: isApproved ? theme.success : theme.warning }]}>
            <Icon name={isApproved ? 'checkmark' : 'time'} size={32} color="#FFF" />
          </View>

          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {isApproved ? 'Account Approved!' : 'Waiting For Admin Approval'}
          </Text>

          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            {isApproved
              ? 'Your driver registration has been verified and approved by System Admin. You can now access Live Tracking on Map.'
              : 'Your payment & registration request has been sent to Admin Dashboard. Your profile is NOT active yet. Please wait for admin approval.'}
          </Text>

          <View style={[styles.statusBadge, { backgroundColor: theme.surface }]}>
            <Text style={[styles.badgeLabel, { color: theme.textSecondary }]}>Current Status:</Text>
            <Text
              style={[
                styles.badgeValue,
                { color: isApproved ? theme.success : theme.warning },
              ]}
            >
              {isApproved ? 'Approved (Active)' : 'Approval Pending'}
            </Text>
          </View>

          {/* Toggle button to simulate Admin Approval from Admin Web Dashboard */}
          <CustomButton
            title={isApproved ? 'Reset to Pending' : '⚡ Simulate Admin Dashboard Approval'}
            variant="secondary"
            onPress={() => setIsApproved(!isApproved)}
            style={{ marginBottom: SPACING.sm }}
          />

          {/* Go To Map Button - Unlocks Map upon approval */}
          <CustomButton
            title={isApproved ? 'Go To Map (Start Live Tracking)' : 'Go To Map (Pending Mode)'}
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
    textAlign: 'center',
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
