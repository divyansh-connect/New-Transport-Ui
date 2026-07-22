import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { Card } from '../../src/components/common/cards/Card';
import { CustomButton } from '../../src/components/common/buttons/CustomButton';
import { RADIUS, SPACING } from '../../src/constants/theme';
import { translations } from '../../src/constants/translations';

export default function PaymentGatewayScreen() {
  const { theme, language, registeredUser, saveUserProfile } = useTheme();
  const router = useRouter();
  const isArabic = language === 'Arabic';
  const [selectedMethod, setSelectedMethod] = useState('card');

  const handlePay = async () => {
    // Save selected payment method into profile status to show on next screens
    if (registeredUser) {
      const paymentMethodLabel = 
        selectedMethod === 'card' ? 'Credit Card' : 
        selectedMethod === 'apple' ? 'Apple Pay / Google Pay' : 'Direct Bank Wire';
      
      const updated = { 
        ...registeredUser, 
        paymentMethod: paymentMethodLabel,
        paymentStatus: 'Paid ($49.99)'
      };
      await saveUserProfile(updated);
    }
    router.push('/register/success');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={isArabic ? 'بوابة الدفع' : 'Payment Gateway'} showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.summaryCard}>
          <Text style={[styles.cardHeader, { color: theme.primary, textAlign: isArabic ? 'right' : 'left' }]}>
            {isArabic ? 'ملخص رسوم التسجيل' : 'Registration Fee Summary'}
          </Text>
          <View style={[styles.row, isArabic && { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              {isArabic ? 'رسوم إعداد الحساب' : 'Account Setup Fee'}
            </Text>
            <Text style={[styles.value, { color: theme.textPrimary }]}>$49.99</Text>
          </View>
          <View style={[styles.row, isArabic && { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              {isArabic ? 'تتبع الموقع الجغرافي المباشر' : 'Live GPS Telemetry'}
            </Text>
            <Text style={[styles.value, { color: theme.textPrimary }]}>
              {isArabic ? 'مشمول' : 'Included'}
            </Text>
          </View>
          <View style={[
            styles.row, 
            isArabic && { flexDirection: 'row-reverse' },
            { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: SPACING.xs }
          ]}>
            <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>
              {isArabic ? 'إجمالي المبلغ المستحق' : 'Total Payable'}
            </Text>
            <Text style={[styles.totalValue, { color: theme.primary }]}>$49.99</Text>
          </View>
        </Card>

        <Text style={[styles.methodTitle, { color: theme.textPrimary, textAlign: isArabic ? 'right' : 'left' }]}>
          {isArabic ? 'اختر طريقة الدفع' : 'Select Payment Method'}
        </Text>

        {[
          { id: 'card', name: isArabic ? 'بطاقة الائتمان / مدى' : 'Credit / Debit Card', icon: '💳' },
          { id: 'apple', name: isArabic ? 'أبل باي / جوجل باي' : 'Apple Pay / Google Pay', icon: '📱' },
          { id: 'bank', name: isArabic ? 'التحويل البنكي المباشر (حوالة)' : 'Direct Bank Wire', icon: '🏦' },
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
              <View style={[styles.methodRow, isArabic && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.innerRow, isArabic && { flexDirection: 'row-reverse' }]}>
                  <Text style={{ fontSize: 24, [isArabic ? 'marginLeft' : 'marginRight']: SPACING.md }}>{method.icon}</Text>
                  <Text style={[styles.methodName, { color: theme.textPrimary }]}>{method.name}</Text>
                </View>
                {selectedMethod === method.id && (
                  <Text style={{ color: theme.primary, fontWeight: '700' }}>
                    {isArabic ? '✓ تم الاختيار' : '✓ Selected'}
                  </Text>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <CustomButton 
          title={isArabic ? 'دفع $49.99 والتسجيل' : 'Pay $49.99 & Register'} 
          onPress={handlePay} 
          style={{ marginTop: SPACING.md }} 
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
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodName: {
    fontSize: 15,
    fontWeight: '600',
  },
});
