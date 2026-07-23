import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { Card } from '../../src/components/common/cards/Card';
import { CustomButton } from '../../src/components/common/buttons/CustomButton';
import { RADIUS, SPACING } from '../../src/constants/theme';

export default function PaymentGatewayScreen() {
  const { theme, language, registeredUser, saveUserProfile, showAlert } = useTheme();
  const router = useRouter();
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;

  const selectedPrice = registeredUser?.amountPaid || '$49.99';
  const selectedDuration = registeredUser?.subscriptionDuration || '1 Month';

  // Direct checkout handler without showing specific gateway integrations
  const handlePay = async () => {
    showAlert(
      isArabic ? 'بوابة الدفع الإلكتروني' : isUrdu ? 'محفوظ چیک آؤٹ' : 'Secure Checkout',
      isArabic 
        ? `هل تريد إتمام عملية الدفع بمبلغ ${selectedPrice}؟`
        : isUrdu
          ? `کیا آپ ${selectedPrice} کی ادائیگی مکمل کرنا چاہتے ہیں؟`
          : `Do you want to complete the payment of ${selectedPrice}?`,
      [
        {
          text: isArabic ? 'إلغاء' : isUrdu ? 'منسوخ کریں' : 'Cancel',
          style: 'cancel'
        },
        {
          text: isArabic ? 'تأكيد الدفع' : isUrdu ? 'ادائیگی کی تصدیق کریں' : 'Confirm Payment',
          onPress: async () => {
            if (registeredUser) {
              const updated = { 
                ...registeredUser, 
                paymentMethod: 'Online Payment',
                paymentStatus: `Paid (${selectedPrice})`
              };
              await saveUserProfile(updated);
            }
            router.replace('/register/success');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={isArabic ? 'بوابة الدفع الإلكتروني' : isUrdu ? 'آن لائن ادائیگی' : 'Online Payment'} showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.summaryCard}>
          <Text style={[styles.cardHeader, { color: theme.primary, textAlign: isRTL ? 'right' : 'left' }]}>
            {isArabic ? 'ملخص رسوم التفعيل' : isUrdu ? 'رجسٹریشن فیس کا خلاصہ' : 'Registration Fee Summary'}
          </Text>
          
          <View style={[styles.row, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              {isArabic ? 'مدة الاشتراك' : isUrdu ? 'سبسکرپشن کی مدت' : 'Subscription Duration'}
            </Text>
            <Text style={[styles.value, { color: theme.textPrimary }]}>{selectedDuration}</Text>
          </View>
          
          <View style={[styles.row, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              {isArabic ? 'تتبع الموقع الجغرافي المباشر' : isUrdu ? 'لائیو GPS ٹیلی میٹری' : 'Live GPS Telemetry'}
            </Text>
            <Text style={[styles.value, { color: theme.textPrimary }]}>
              {isArabic ? 'مشمول' : isUrdu ? 'شامل ہے' : 'Included'}
            </Text>
          </View>
          
          <View style={[styles.row, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              {isArabic ? 'الضريبة المضافة والرسوم' : isUrdu ? 'ٹیکس اور ویٹ' : 'Tax & VAT'}
            </Text>
            <Text style={[styles.value, { color: theme.textPrimary }]}>
              {isArabic ? 'مشمول (15٪)' : isUrdu ? 'شامل ہے (15٪)' : 'Included (15%)'}
            </Text>
          </View>
          
          <View style={[
            styles.row, 
            isRTL && { flexDirection: 'row-reverse' },
            { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: SPACING.xs, alignItems: 'center' }
          ]}>
            <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>
              {isArabic ? 'إجمالي المبلغ المستحق' : isUrdu ? 'کل واجب الادا' : 'Total Payable'}
            </Text>
            <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
              <Text style={[styles.totalValue, { color: theme.primary }]}>
                {selectedPrice}
              </Text>
              <Text style={{ fontSize: 10, color: theme.textSecondary, marginTop: 2 }}>
                {isArabic ? '(شامل الضريبة)' : isUrdu ? '(ٹیکس اور ویٹ سمیت)' : '(Incl. Tax & VAT)'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Clean checkout view without specific provider brands */}
        <Card style={styles.checkoutBox}>
          <Text style={[styles.checkoutText, { color: theme.textPrimary }]}>
            {isArabic ? 'الدفع الإلكتروني الآمن' : isUrdu ? 'محفوظ آن لائن ادائیگی' : 'Secure Online Payment'}
          </Text>
          <Text style={[styles.checkoutSub, { color: theme.textSecondary }]}>
            {isArabic 
              ? 'يرجى تأكيد الدفع لإكمال عملية التسجيل وتفعيل الحساب.'
              : isUrdu
                ? 'براہ کرم اپنی رجسٹریشن مکمل کرنے کے لیے ادائیگی کی تصدیق کریں۔'
                : 'Please confirm checkout to complete your registration request.'}
          </Text>
        </Card>

        <CustomButton 
          title={isArabic ? `دفع ${selectedPrice} الآن` : isUrdu ? `ابھی ${selectedPrice} ادا کریں` : `Pay ${selectedPrice} Now`} 
          onPress={handlePay} 
          style={{ marginTop: SPACING.lg }} 
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
  checkoutBox: {
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.3)',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
  },
  checkoutText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  checkoutSub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  }
});
