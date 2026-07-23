import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import { CustomInput } from '../src/components/common/inputs/CustomInput';
import { CustomButton } from '../src/components/common/buttons/CustomButton';
import { Card } from '../src/components/common/cards/Card';
import { Header } from '../src/components/common/headers/Header';
import { RADIUS, SPACING } from '../src/constants/theme';
import { translations } from '../src/constants/translations';

export default function LoginScreen() {
  const { theme, language, saveUserProfile, showAlert } = useTheme();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Login by Mobile Number ──────────────────────────────────────────────────
  // Looks up the stored user profile and matches mobile number
  const handleLogin = async () => {
    if (!mobile.trim()) {
      showAlert(
        isArabic ? 'خطأ' : isUrdu ? 'غلطی' : 'Error',
        isArabic ? 'يرجى إدخال رقم الجوال' : isUrdu ? 'براہ کرم اپنا موبائل نمبر درج کریں' : 'Please enter your mobile number'
      );
      return;
    }

    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem('user_profile');
      if (stored) {
        const profile = JSON.parse(stored);
        // Match mobile number (strip spaces and dashes for comparison)
        const inputMobile = mobile.replace(/[\s\-]/g, '');
        const storedMobile = (profile.mobileNo || '').replace(/[\s\-]/g, '');

        if (inputMobile === storedMobile) {
          // ✅ Found — restore session
          await saveUserProfile(profile);
          router.replace('/map');
        } else {
          showAlert(
            isArabic ? 'لم يُعثر على حساب' : isUrdu ? 'اکاؤنٹ نہیں ملا' : 'Account Not Found',
            isArabic
              ? 'رقم الجوال هذا غير مسجل. يرجى التسجيل أولاً.'
              : isUrdu
                ? 'یہ موبائل نمبر رجسٹرڈ نہیں ہے۔ براہ کرم پہلے رجسٹریشن کریں۔'
                : 'This mobile number is not registered. Please register first.'
          );
        }
      } else {
        showAlert(
          isArabic ? 'لا يوجد حساب' : isUrdu ? 'کوئی اکاؤنٹ نہیں ملا' : 'No Account Found',
          isArabic
            ? 'لا يوجد حساب مسجل على هذا الجهاز. يرجى التسجيل أولاً.'
            : isUrdu
              ? 'اس ڈیوائس پر کوئی رجسٹرڈ اکاؤنٹ نہیں ملا۔ براہ کرم پہلے رجسٹریشن کریں۔'
              : 'No registered account found on this device. Please register first.'
        );
      }
    } catch (e) {
      showAlert(isArabic ? 'خطأ' : isUrdu ? 'غلطی' : 'Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Quick Demo Login for Instant Testing ────────────────────────────────────
  const handleDemoApprovedDriver = async () => {
    const dummyDriver = {
      name: 'Ahmed',
      lastName: 'Al-Sayed',
      mobileNo: '+966 50 123 4567',
      serviceRole: 'Driver',
      carPlate: 'KSA-9988',
      status: 'Approved',
      paymentStatus: 'Paid ($49.99)',
    };
    await saveUserProfile(dummyDriver);
    router.replace('/map');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={isArabic ? 'تسجيل الدخول' : isUrdu ? 'لاگ ان' : 'Login'} showBack={true} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View style={styles.brandSection}>
          <View style={[styles.logoCard, { backgroundColor: theme.primary }]}>
            <MaterialCommunityIcons name="truck-fast" size={44} color="#FFF" />
          </View>
          <Text style={[styles.appTitle, { color: theme.textPrimary }]}>
            {isArabic ? 'نظام التتبع المباشر' : isUrdu ? 'ڈرائیور لائیو ٹریکنگ' : 'Driver Life Tracking'}
          </Text>
          <Text style={[styles.appTagline, { color: theme.textSecondary }]}>
            {isArabic ? 'أدخل رقم جوالك للدخول' : isUrdu ? 'جاری رکھنے کے لیے اپنا موبائل نمبر درج کریں' : 'Enter your mobile number to continue'}
          </Text>
        </View>

        {/* Login Card */}
        <Card style={styles.loginCard}>
          <Text style={[styles.cardHeading, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
            {isArabic ? 'مرحباً بعودتك' : isUrdu ? 'خوش آمدید' : 'Welcome Back'}
          </Text>
          <Text style={[styles.cardSubheading, { color: theme.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {isArabic
              ? 'أدخل رقم جوالك المسجّل للوصول إلى حسابك'
              : isUrdu
                ? 'اپنے اکاؤنٹ تک رسائی کے لیے اپنا رجسٹرڈ موبائل نمبر درج کریں'
                : 'Enter your registered mobile number to access your account'}
          </Text>

          <CustomInput
            label={isArabic ? 'رقم الجوال' : isUrdu ? 'موبائل نمبر' : 'Mobile Number'}
            placeholder={isArabic ? 'أدخل رقم الجوال المسجّل' : isUrdu ? 'رجسٹرڈ موبائل نمبر درج کریں' : 'Enter registered mobile number'}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          />

          <CustomButton
            title={loading
              ? (isArabic ? 'جاري التحقق...' : isUrdu ? 'تصدیق ہو رہی ہے...' : 'Verifying...')
              : (isArabic ? 'دخول' : isUrdu ? 'لاگ ان' : 'Login')}
            onPress={handleLogin}
            style={{ marginTop: SPACING.md }}
          />

          {/* ⚡ Quick Demo Button for testing Approved Driver State */}
          <CustomButton
            title={isArabic ? '⚡ دخول فوري سائق معتمد (تجريبي)' : isUrdu ? '⚡ فوری ڈیمو لاگ ان: منظور شدہ ڈرائیور' : '⚡ Demo Login: Approved Driver'}
            variant="secondary"
            onPress={handleDemoApprovedDriver}
            style={{ marginTop: SPACING.sm }}
          />
        </Card>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <Text style={[styles.dividerText, { color: theme.textSecondary }]}>
            {isArabic ? 'أو' : isUrdu ? 'یا' : 'OR'}
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        </View>

        {/* Register Link */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            {isArabic ? 'مستخدم جديد؟ ' : isUrdu ? 'نیا صارف؟ ' : 'New user? '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={[styles.registerText, { color: theme.primary }]}>
              {isArabic ? 'سجّل الآن' : isUrdu ? 'ابھی رجسٹر کریں' : 'Register Now'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back to Map as Guest */}
        <TouchableOpacity
          style={styles.guestLink}
          onPress={() => router.replace('/map')}
        >
          <Text style={[styles.guestText, { color: theme.textSecondary }]}>
            {isArabic ? 'تصفح كزائر (بدون تسجيل)' : isUrdu ? 'بطور وزیٹر جاری رکھیں (لاگ ان کے بغیر)' : 'Continue as Visitor (no login)'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  logoCard: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    elevation: 6,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  appTagline: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  loginCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardSubheading: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xs,
  },
  footerText: { fontSize: 14 },
  registerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  guestLink: {
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  guestText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
