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
import { translations } from '../../src/constants/translations';

export default function ApprovalPendingScreen() {
  const { theme, language, registeredUser, saveUserProfile } = useTheme();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
  const router = useRouter();

  // Check current approval status from stored user profile
  const isApproved = registeredUser?.status === 'Approved';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={isArabic ? 'حالة الموافقة' : 'Approval Status'} showBack={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          {/* Status Icon */}
          <View style={[
            styles.statusIcon,
            { backgroundColor: isApproved ? '#16a34a' : '#d97706' }
          ]}>
            <Icon name={isApproved ? 'checkmark' : 'time'} size={32} color="#FFF" />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {isApproved
              ? (isArabic ? 'تمت الموافقة على الحساب!' : 'Account Approved!')
              : (isArabic ? 'في انتظار موافقة المدير' : 'Waiting For Admin Approval')}
          </Text>

          {/* Sub text */}
          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            {isApproved
              ? (isArabic
                ? 'تم التحقق من تسجيلك والموافقة عليه من قِبل المدير. يمكنك الآن الوصول إلى التتبع المباشر على الخريطة.'
                : 'Your driver registration has been verified and approved by Admin. You can now access Live Tracking and all Service Locations on Map.')
              : (isArabic
                ? 'تم إرسال طلبك إلى لوحة تحكم المدير. ملفك الشخصي غير نشط بعد. يرجى الانتظار حتى تتم الموافقة.'
                : 'Your payment & registration has been sent to Admin Dashboard. Your profile is NOT active yet. Please wait for admin approval.')}
          </Text>

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: theme.surface }]}>
            <Text style={[styles.badgeLabel, { color: theme.textSecondary }]}>
              {isArabic ? 'الحالة الحالية:' : 'Current Status:'}
            </Text>
            <Text style={[styles.badgeValue, {
              color: isApproved ? '#16a34a' : '#d97706'
            }]}>
              {isApproved
                ? (isArabic ? 'مُوافَق عليه ✓' : 'Approved ✓')
                : (isArabic ? 'قيد الانتظار...' : 'Pending...')}
            </Text>
          </View>

          {/* If the driver has NOT paid yet, show 'Pay Now' button to complete payment */}
          {(!registeredUser?.paymentStatus || registeredUser?.paymentStatus.includes('Unpaid') || registeredUser?.paymentStatus === '') && (
            <CustomButton
              title={isArabic ? '💳 أكمل عملية الدفع الآن' : '💳 Complete Payment (Pay Now)'}
              onPress={() => router.push('/register/payment')}
              style={{ backgroundColor: '#2563eb', marginBottom: SPACING.md, width: '100%' }}
            />
          )}

          {/* Go to Map */}
          <CustomButton
            title={isApproved
              ? (isArabic ? 'الذهاب إلى الخريطة (التتبع المباشر)' : 'Go To Map — Start Live Tracking')
              : (isArabic ? 'الذهاب إلى الخريطة (وضع الانتظار)' : 'Go To Map (Pending Mode)')}
            onPress={() => router.replace('/map')}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.md, justifyContent: 'center' },
  card: { alignItems: 'center', paddingVertical: SPACING.xl },
  statusIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
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
    gap: 6,
  },
  badgeLabel: { fontSize: 13 },
  badgeValue: { fontSize: 14, fontWeight: '700' },
});
