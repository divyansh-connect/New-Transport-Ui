import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { Card } from '../../src/components/common/cards/Card';
import { CustomButton } from '../../src/components/common/buttons/CustomButton';
import { RADIUS, SPACING } from '../../src/constants/theme';

export default function PaymentGatewayScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('card');

  const handlePay = () => {
    router.push('/register/success');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Payment Gateway" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.summaryCard}>
          <Text style={[styles.cardHeader, { color: theme.primary }]}>Registration Fee Summary</Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Account Setup Fee</Text>
            <Text style={[styles.value, { color: theme.textPrimary }]}>$49.99</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Live GPS Telemetry</Text>
            <Text style={[styles.value, { color: theme.textPrimary }]}>Included</Text>
          </View>
          <View style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: SPACING.xs }]}>
            <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Total Payable</Text>
            <Text style={[styles.totalValue, { color: theme.primary }]}>$49.99</Text>
          </View>
        </Card>

        <Text style={[styles.methodTitle, { color: theme.textPrimary }]}>Select Payment Method</Text>

        {[
          { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
          { id: 'apple', name: 'Apple Pay / Google Pay', icon: '📱' },
          { id: 'bank', name: 'Direct Bank Wire', icon: '🏦' },
        ].map((method) => (
          <TouchableOpacity
            key={method.id}
            activeOpacity={0.8}
            onPress={() => setSelectedMethod(method.id)}
          >
            <Card
              style={[
                styles.methodCard,
                selectedMethod === method.id && { borderColor: theme.primary, borderWidth: 2 },
              ]}
            >
              <View style={styles.methodRow}>
                <Text style={{ fontSize: 24, marginRight: SPACING.md }}>{method.icon}</Text>
                <Text style={[styles.methodName, { color: theme.textPrimary }]}>{method.name}</Text>
                {selectedMethod === method.id && (
                  <Text style={{ color: theme.primary, fontWeight: '700' }}>✓ Selected</Text>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <CustomButton title="Pay $49.99 & Register" onPress={handlePay} style={{ marginTop: SPACING.md }} />
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
  summaryCard: {
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  methodCard: {
    marginBottom: SPACING.sm,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
});
