import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { Card } from '../../src/components/common/cards/Card';
import { CustomButton } from '../../src/components/common/buttons/CustomButton';
import { RADIUS, SPACING } from '../../src/constants/theme';

export default function PaymentSuccessScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Payment Confirmation" showBack={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: theme.success }]}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Payment Successful!</Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            Transaction Reference: #TXN-98402948
          </Text>

          <View style={[styles.noticeBox, { backgroundColor: theme.surface }]}>
            <Text style={[styles.noticeTitle, { color: theme.primary }]}>Please Contact Admin</Text>
            <Text style={[styles.noticeBody, { color: theme.textPrimary }]}>
              Your registration application has been submitted successfully. Please contact system admin for account activation & verification.
            </Text>
          </View>

          <CustomButton
            title="Proceed to Admin Approval Status"
            onPress={() => router.push('/register/pending')}
            style={{ marginTop: SPACING.md }}
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
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  checkMark: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    marginBottom: SPACING.lg,
  },
  noticeBox: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  noticeBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
