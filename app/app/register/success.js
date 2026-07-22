import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { Card } from '../../src/components/common/cards/Card';
import { CustomButton } from '../../src/components/common/buttons/CustomButton';
import { RADIUS, SPACING } from '../../src/constants/theme';

export default function PaymentSuccessScreen() {
  const { theme, language, registeredUser } = useTheme();
  const router = useRouter();
  const isArabic = language === 'Arabic';

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello Admin, I completed my driver payment registration. \nName: ${registeredUser?.name} ${registeredUser?.lastName} \nPlate No: ${registeredUser?.carPlateNumber || 'N/A'} \nPlan: ${registeredUser?.subscriptionDuration || '1 Month'} (${registeredUser?.amountPaid || '$49.99'}). \nPlease review and activate my account.`
    );
    Linking.openURL(`https://wa.me/966501234567?text=${message}`);
  };

  const handleCall = () => {
    Linking.openURL('tel:+966501234567');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={isArabic ? 'تأكيد عملية الدفع' : 'Payment Confirmation'} showBack={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: theme.success }]}>
            <Text style={styles.checkMark}>✓</Text>
          </View>

          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {isArabic ? 'تم تأكيد طلب الدفع بنجاح' : 'Payment Success / Confirmed'}
          </Text>

          {/* Unified payment receipt details */}
          <View style={[styles.noticeBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.noticeTitle, { color: theme.primary }]}>
              {isArabic ? 'تفاصيل فاتورة الاشتراك' : 'Subscription Invoice Details'}
            </Text>
            <View style={styles.bankDetailRow}>
              <Text style={[styles.bankLabel, { color: theme.textSecondary }]}>Subscriber Name:</Text>
              <Text style={[styles.bankValue, { color: theme.textPrimary }]}>{registeredUser?.name} {registeredUser?.lastName}</Text>
            </View>
            <View style={styles.bankDetailRow}>
              <Text style={[styles.bankLabel, { color: theme.textSecondary }]}>Selected Plan:</Text>
              <Text style={[styles.bankValue, { color: theme.textPrimary }]}>{registeredUser?.subscriptionDuration || '1 Month'}</Text>
            </View>
            <View style={styles.bankDetailRow}>
              <Text style={[styles.bankLabel, { color: theme.textSecondary }]}>Amount Paid:</Text>
              <Text style={[styles.bankValue, { color: theme.textPrimary }]}>{registeredUser?.amountPaid || '$49.99'}</Text>
            </View>
            <View style={styles.bankDetailRow}>
              <Text style={[styles.bankLabel, { color: theme.textSecondary }]}>Payment Gateway:</Text>
              <Text style={[styles.bankValue, { color: theme.textPrimary }]}>Saudi Checkout API</Text>
            </View>
          </View>

          {/* Contact Admin */}
          <View style={[styles.noticeBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.noticeTitle, { color: theme.primary }]}>
              {isArabic ? 'للتواصل مع المسؤول للتفعيل' : 'For Admin Approval Contact'}
            </Text>
            <Text style={[styles.phoneNum, { color: theme.textPrimary }]}>+966 50 123 4567</Text>
            <Text style={[styles.subNote, { color: theme.textSecondary }]}>
              {isArabic 
                ? 'يرجى إرسال رسالة للمسؤول عبر الواتساب لتفعيل حسابك فوراً.'
                : 'Share payment confirmation details with Admin on WhatsApp to get instant activation.'}
            </Text>
          </View>

          <CustomButton
            title={isArabic ? '💬 أرسل تأكيد الدفع (واتساب)' : '💬 Send Payment Copy (WhatsApp)'}
            onPress={handleWhatsApp}
            style={{ backgroundColor: '#25D366', marginVertical: SPACING.xs, width: '100%' }}
          />

          <CustomButton
            title={isArabic ? '📞 اتصل بالمسؤول مباشرة' : '📞 Call Admin Directly'}
            variant="secondary"
            onPress={handleCall}
            style={{ marginVertical: SPACING.xs, width: '100%' }}
          />

          <CustomButton
            title={isArabic ? 'الذهاب إلى حالة الموافقة' : 'Proceed to Approval Status'}
            onPress={() => router.push('/register/pending')}
            style={{ marginTop: SPACING.md, width: '100%' }}
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
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  checkMark: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  noticeBox: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  phoneNum: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: SPACING.xs,
  },
  subNote: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 4,
  },
  bankLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  bankValue: {
    fontSize: 12,
    fontWeight: '700',
  }
});
