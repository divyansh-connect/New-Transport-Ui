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
  const { theme, language, registeredUser, refreshUserProfile } = useTheme();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  // Auto-check live approval status from backend MySQL DB every 4 seconds
  React.useEffect(() => {
    refreshUserProfile();
    const interval = setInterval(() => {
      refreshUserProfile();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await refreshUserProfile();
    setTimeout(() => setRefreshing(false), 500);
  };

  const isApproved = registeredUser?.status === 'Approved';
  const isPaid = registeredUser?.paymentStatus === 'Paid' || registeredUser?.paymentStatus === 'Trial' || registeredUser?.paymentStatus === 'Free Bypass';

  const handleMapAccess = () => {
    if (isApproved && !isPaid) {
      Alert.alert(
        isArabic ? 'الدفع مطلوب' : isUrdu ? 'ادائیگی درکار ہے' : 'Payment Required',
        isArabic
          ? 'تمت الموافقة على حسابك! يرجى إكمال عملية الدفع لفتح الوصول الكامل للتتبع المباشر.'
          : isUrdu
            ? 'آپ کا اکاؤنٹ ایڈمن سے منظور شدہ ہے! لائیو ٹریکنگ تک مکمل رسائی حاصل کرنے کے لیے براہ کرم اپنی ادائیگی مکمل کریں۔'
            : 'Your account is approved by Admin! Please complete your registration payment to unlock Live Tracking and service map access.',
        [
          { text: isArabic ? 'إلغاء' : isUrdu ? 'منسوخ کریں' : 'Cancel', style: 'cancel' },
          { text: isArabic ? 'ادفع الآن' : isUrdu ? 'ابھی ادا کریں' : 'Pay Now', onPress: () => router.push('/register/payment') }
        ]
      );
      return;
    }
    router.replace('/map');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={isArabic ? 'حالة الموافقة والدفع' : isUrdu ? 'منظوری و ادائیگی' : 'Approval & Payment Status'} showBack={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          {/* Status Icon */}
          <View style={[
            styles.statusIcon,
            { backgroundColor: isApproved && isPaid ? '#16a34a' : isApproved ? '#2563eb' : '#d97706' }
          ]}>
            <Icon name={isApproved && isPaid ? 'checkmark' : isApproved ? 'card' : 'time'} size={32} color="#FFF" />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {isApproved && isPaid
              ? (isArabic ? 'تمت الموافقة والدفع بنجاح!' : isUrdu ? 'منظوری اور ادائیگی مکمل!' : 'Account Approved & Paid!')
              : isApproved
                ? (isArabic ? 'تمت الموافقة - بانتظار الدفع' : isUrdu ? 'منظور شدہ - ادائیگی باقی ہے' : 'Approved — Payment Required')
                : (isArabic ? 'في انتظار موافقة المدير' : isUrdu ? 'ایڈمن کی منظوری کا انتظار ہے' : 'Waiting For Admin Approval')}
          </Text>

          {/* Sub text */}
          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            {isApproved && isPaid
              ? (isArabic
                ? 'تم التحقق من حسابك وإكمال الدفع. يمكنك الآن الوصول إلى التتبع المباشر.'
                : isUrdu
                  ? 'آپ کی رجسٹریشن اور ادائیگی مکمل ہو گئی ہے۔ اب آپ لائیو ٹریکنگ شروع کر سکتے ہیں۔'
                  : 'Your account is fully approved and paid. You have complete access to Live Tracking & Map Services.')
              : isApproved
                ? (isArabic
                  ? 'قام المدير بالموافقة على طلبك! يرجى إتمام عملية الدفع لتفعيل الحساب بالكامل.'
                  : isUrdu
                    ? 'ایڈمن نے آپ کا اکاؤنٹ منظور کر لیا ہے! مکمل رسائی کے لیے براہ کرم اپنی ادائیگی مکمل کریں۔'
                    : 'Admin has approved your registration request! Please complete payment to fully activate your account.')
                : (isArabic
                  ? 'تم إرسال طلبك إلى لوحة تحكم المدير. يرجى الانتظار حتى تتم الموافقة.'
                  : isUrdu
                    ? 'آپ کی درخواست ایڈمن ڈیش بورڈ پر بھیج دی گئی ہے۔ براہ کرم منظوری کا انتظار کریں۔'
                    : 'Your payment & registration has been sent to Admin Dashboard. Please wait for admin approval.')}
          </Text>

          {/* Status Badges Row */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: SPACING.lg, flexWrap: 'wrap', justifyContent: 'center' }}>
            <View style={[styles.statusBadge, { backgroundColor: theme.surface }]}>
              <Text style={[styles.badgeLabel, { color: theme.textSecondary }]}>Approval:</Text>
              <Text style={[styles.badgeValue, { color: isApproved ? '#16a34a' : '#d97706' }]}>
                {isApproved ? 'Approved ✓' : 'Pending...'}
              </Text>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: theme.surface }]}>
              <Text style={[styles.badgeLabel, { color: theme.textSecondary }]}>Payment:</Text>
              <Text style={[styles.badgeValue, { color: isPaid ? '#16a34a' : '#ef4444' }]}>
                {isPaid ? 'Paid ✓' : 'Unpaid'}
              </Text>
            </View>
          </View>

          {/* Re-Check Status Button */}
          {!isApproved && (
            <CustomButton
              title={refreshing ? 'Checking Live Database...' : '🔄 Check Approval Status'}
              onPress={handleManualRefresh}
              style={{ backgroundColor: '#10b981', marginBottom: SPACING.md, width: '100%' }}
            />
          )}

          {/* Show Pay Now button if payment is unpaid */}
          {!isPaid && (
            <CustomButton
              title={isArabic ? '💳 أكمل عملية الدفع الآن' : isUrdu ? '💳 ابھی ادائیگی مکمل کریں' : '💳 Complete Payment (Pay Now)'}
              onPress={() => router.push('/register/payment')}
              style={{ backgroundColor: '#2563eb', marginBottom: SPACING.md, width: '100%' }}
            />
          )}

          {/* Go to Map */}
          <CustomButton
            title={isApproved && isPaid
              ? (isArabic ? 'الذهاب إلى الخريطة (التتبع المباشر)' : isUrdu ? 'نقشے پر جائیں — لائیو ٹریکنگ شروع کریں' : 'Go To Map — Start Live Tracking')
              : (isArabic ? 'الذهاب إلى الخريطة (وضع محدود)' : isUrdu ? 'نقشے پر جائیں (محدود موڈ)' : 'Go To Map (Limited Mode)')}
            onPress={handleMapAccess}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: SPACING.md,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
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
