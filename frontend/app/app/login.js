import React, { useState, useEffect } from 'react';
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
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Login by Mobile Number or Email ──────────────────────────────────────────
  // Authenticates with the backend and saves JWT session
  const handleLogin = async () => {
    if (!mobile.trim() || !password.trim()) {
      showAlert(
        isArabic ? 'خطأ' : isUrdu ? 'غلطی' : 'Error',
        isArabic ? 'يرجى إدخال التفاصيل وكلمة المرور' : isUrdu ? 'براہ کرم تفصیلات اور پاس ورڈ درج کریں' : 'Please enter your details and password'
      );
      return;
    }

    setLoading(true);
    try {
      const { apiFetch } = require('../src/utils/api');
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identity: mobile.trim(),
          password: password.trim()
        })
      });

      if (response && response.token) {
        await AsyncStorage.setItem('auth_token', response.token);
        await saveUserProfile(response.user);
        router.replace('/map');
      } else {
        throw new Error('Invalid response from authentication server.');
      }
    } catch (e) {
      showAlert(
        isArabic ? 'فشل تسجيل الدخول' : isUrdu ? 'لاگ ان ناممکن' : 'Login Error',
        e.message || 'Verification failed. Please register or check connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear any stale/fake demo data from AsyncStorage on login screen mount
  useEffect(() => {
    const clearFakeData = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        // No real JWT = clear any fake profile data
        await AsyncStorage.removeItem('user_profile');
      }
    };
    clearFakeData();
  }, []);

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
            <MaterialCommunityIcons name="car" size={44} color="#FFF" />
          </View>
          <Text style={[styles.appTitle, { color: theme.textPrimary }]}>
            {isArabic ? 'نظام تتبع حياة المستخدم' : isUrdu ? 'صارف لائیو ٹریکنگ' : 'User Life Tracking'}
          </Text>
          <Text style={[styles.appTagline, { color: theme.textSecondary }]}>
            {isArabic ? 'أدخل رقم جوالك أو البريد الإلكتروني للدخول' : isUrdu ? 'جاری رکھنے کے لیے اپنا موبائل نمبر یا ای میل درج کریں' : 'Enter your mobile number or email to continue'}
          </Text>
        </View>

        {/* Login Card */}
        <Card style={styles.loginCard}>
          <Text style={[styles.cardHeading, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
            {isArabic ? 'مرحباً بعودتك' : isUrdu ? 'خوش آمدید' : 'Welcome Back'}
          </Text>
          <Text style={[styles.cardSubheading, { color: theme.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {isArabic
              ? 'أدخل رقم جوالك المسجّل أو البريد الإلكتروني للوصول إلى حسابك'
              : isUrdu
                ? 'اپنے اکاؤنٹ تک رسائی کے لیے اپنا رجسٹرڈ موبائل نمبر یا ای میل درج کریں'
                : 'Enter your registered mobile number or email to access your account'}
          </Text>

          <CustomInput
            label={isArabic ? 'رقم الجوال أو البريد الإلكتروني' : isUrdu ? 'موبائل نمبر یا ای میل' : 'Mobile Number or Email'}
            placeholder={isArabic ? 'أدخل رقم الجوال أو البريد الإلكتروني' : isUrdu ? 'موبائل نمبر یا ای میل درج کریں' : 'Enter mobile number or email'}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="default"
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          />

          <CustomInput
            label={isArabic ? 'كلمة المرور' : isUrdu ? 'پاس ورڈ' : 'Password'}
            placeholder={isArabic ? 'أدخل كلمة المرور' : isUrdu ? 'اپنا پاس ورڈ درج کریں' : 'Enter your password'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          />

          <CustomButton
            title={loading
              ? (isArabic ? 'جاري التحقق...' : isUrdu ? 'تصدیق ہو رہی ہے...' : 'Verifying...')
              : (isArabic ? 'دخول' : isUrdu ? 'لاگ ان' : 'Login')}
            onPress={handleLogin}
            style={{ marginTop: SPACING.md }}
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
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
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
