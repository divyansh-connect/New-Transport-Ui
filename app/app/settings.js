import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Switch, ScrollView,
  TouchableOpacity, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Icon } from '../src/components/common/Icon';
import { SPACING, RADIUS } from '../src/constants/theme';
import { translations } from '../src/constants/translations';
import { useRouter } from 'expo-router';

// ── Reusable Setting Row ──────────────────────────────────────────────────────
function SettingRow({ icon, iconBg, label, sublabel, right, onPress, isRTL, isLast }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.65 : 1}
      onPress={onPress}
      style={[
        styles.settingRow,
        isRTL && { flexDirection: 'row-reverse' },
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border + '33' },
      ]}
    >
      <View style={[styles.rowLeft, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.iconBox, { backgroundColor: iconBg || theme.surface }]}>
          <Icon name={icon} size={19} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
            {label}
          </Text>
          {sublabel ? (
            <Text style={[styles.rowSub, { color: theme.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {sublabel}
            </Text>
          ) : null}
        </View>
      </View>
      {right}
    </TouchableOpacity>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionTitle({ title, isRTL, theme }) {
  return (
    <Text style={[styles.sectionTitle, { color: theme.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
      {title}
    </Text>
  );
}

// ── Language Option ───────────────────────────────────────────────────────────
function LangOption({ flag, label, sublabel, selected, onPress, isRTL, theme, isLast }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.langRow,
        isRTL && { flexDirection: 'row-reverse' },
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border + '33' },
      ]}
    >
      <View style={[styles.rowLeft, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.iconBox, { backgroundColor: selected ? '#1e3a5f' : theme.surface }]}>
          <Text style={{ fontSize: 20 }}>{flag}</Text>
        </View>
        <View>
          <Text style={[styles.rowLabel, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
          <Text style={[styles.rowSub, { color: theme.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{sublabel}</Text>
        </View>
      </View>
      {selected ? (
        <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
          <Icon name="checkmark" size={13} color="#FFF" />
        </View>
      ) : (
        <View style={[styles.checkBadge, { backgroundColor: theme.border + '55', borderWidth: 1, borderColor: theme.border }]} />
      )}
    </TouchableOpacity>
  );
}

// ── Main Settings Screen ──────────────────────────────────────────────────────
export default function SettingsScreen() {
  const { isDarkMode, toggleTheme, theme, language, setLanguage, saveUserProfile, showAlert } = useTheme();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;
  const router = useRouter();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [locationOn, setLocationOn] = useState(true);

  const tClearTitle = isArabic ? 'مسح البيانات' : isUrdu ? 'ڈیٹا صاف کریں' : 'Clear Account Data';
  const tClearMsg = isArabic
    ? 'هل تريد مسح بيانات الحساب؟ ستحتاج للتسجيل مرة أخرى.'
    : isUrdu
      ? 'اس سے آپ کے اکاؤنٹ کا ڈیٹا صاف ہو جائے گا۔ آپ کو دوبارہ رجسٹریشن کرنی ہوگی۔'
      : 'This will clear your registration data. You will need to register again.';
  const tCancel = isArabic ? 'إلغاء' : isUrdu ? 'منسوخ کریں' : 'Cancel';
  const tClear = isArabic ? 'مسح' : isUrdu ? 'صاف کریں' : 'Clear';

  const handleClearAccount = () => {
    showAlert(
      tClearTitle,
      tClearMsg,
      [
        { text: tCancel, style: 'cancel' },
        {
          text: tClear,
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('user_profile');
            saveUserProfile(null);
            router.push('/map');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={t.settingsTitle} showBack={true} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── APPEARANCE ─────────────────────────── */}
        <SectionTitle title={isArabic ? 'المظهر' : isUrdu ? 'مظہر' : 'APPEARANCE'} isRTL={isRTL} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <SettingRow
            icon="moon"
            iconBg={isDarkMode ? '#1e3a5f' : '#f0f4ff'}
            label={isArabic ? 'الوضع الداكن' : isUrdu ? 'ڈارک موڈ' : 'Dark Mode'}
            sublabel={isDarkMode
              ? (isArabic ? 'الوضع الداكن مفعّل' : isUrdu ? 'ڈارک تھیم فعال ہے' : 'Dark theme is active')
              : (isArabic ? 'الوضع الفاتح مفعّل' : isUrdu ? 'لائٹ تھیم فعال ہے' : 'Light theme is active')}
            isRTL={isRTL}
            isLast={true}
            right={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        {/* ── LANGUAGE ───────────────────────────── */}
        <SectionTitle title={isArabic ? 'اللغة' : isUrdu ? 'زبان' : 'LANGUAGE'} isRTL={isRTL} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <LangOption
            flag="🇬🇧"
            label="English"
            sublabel={isArabic ? 'الإنجليزية' : isUrdu ? 'انگریزی' : 'English Language'}
            selected={language === 'English'}
            onPress={() => setLanguage('English')}
            isRTL={isRTL}
            theme={theme}
            isLast={false}
          />
          <LangOption
            flag="🇸🇦"
            label="عربي"
            sublabel={isArabic ? 'اللغة العربية' : isUrdu ? 'عربی زبان' : 'Arabic Language'}
            selected={language === 'Arabic'}
            onPress={() => setLanguage('Arabic')}
            isRTL={isRTL}
            theme={theme}
            isLast={false}
          />
          <LangOption
            flag="🇵🇰"
            label="اردو"
            sublabel={isArabic ? 'الأردية' : isUrdu ? 'اردو زبان' : 'Urdu Language'}
            selected={language === 'Urdu'}
            onPress={() => setLanguage('Urdu')}
            isRTL={isRTL}
            theme={theme}
            isLast={true}
          />
        </View>

        {/* ── NOTIFICATIONS & LOCATION ─────────── */}
        <SectionTitle title={isArabic ? 'الإشعارات والموقع' : isUrdu ? 'اطلاعات اور لوکیشن' : 'NOTIFICATIONS & LOCATION'} isRTL={isRTL} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <SettingRow
            icon="bell"
            iconBg="#1e3a5f"
            label={isArabic ? 'الإشعارات' : isUrdu ? 'اطلاعات' : 'Push Notifications'}
            sublabel={isArabic ? 'تلقّي تنبيهات النظام' : isUrdu ? 'سسٹم الرٹس موصول کریں' : 'Receive system alerts'}
            isRTL={isRTL}
            isLast={false}
            right={
              <Switch
                value={notificationsOn}
                onValueChange={setNotificationsOn}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            }
          />
          <SettingRow
            icon="navigation"
            iconBg="#1e3a5f"
            label={isArabic ? 'تتبع الموقع' : isUrdu ? 'لوکیشن ٹریکنگ' : 'Location Tracking'}
            sublabel={isArabic ? 'تفعيل GPS المباشر للتتبع' : isUrdu ? 'لائیو GPS ٹریکنگ فعال کریں' : 'Enable live GPS for map tracking'}
            isRTL={isRTL}
            isLast={true}
            right={
              <Switch
                value={locationOn}
                onValueChange={setLocationOn}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        {/* ── ACCOUNT ─────────────────────────────── */}
        <SectionTitle title={isArabic ? 'الحساب' : isUrdu ? 'اکاؤنٹ' : 'ACCOUNT'} isRTL={isRTL} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <SettingRow
            icon="user"
            iconBg="#1e3a5f"
            label={isArabic ? 'الملف الشخصي' : isUrdu ? 'میری پروفائل' : 'My Profile'}
            sublabel={isArabic ? 'عرض بيانات الحساب المسجل' : isUrdu ? 'رجسٹرڈ اکاؤنٹ کی تفصیلات دیکھیں' : 'View registered account details'}
            isRTL={isRTL}
            isLast={false}
            onPress={() => router.push('/profile')}
            right={<Icon name={isRTL ? 'chevronLeft' : 'chevronRight'} size={18} color={theme.textSecondary} />}
          />
          <SettingRow
            icon="pencil"
            iconBg="#1e3a5f"
            label={isArabic ? 'تعديل الملف الشخصي' : isUrdu ? 'پروفائل میں ترمیم کریں' : 'Edit Profile'}
            sublabel={isArabic ? 'تحديث وتغيير معلومات حسابك' : isUrdu ? 'اپنے اکاؤنٹ کی معلومات کو تبدیل کریں' : 'Update and change your account info'}
            isRTL={isRTL}
            isLast={false}
            onPress={() => router.push('/edit-profile')}
            right={<Icon name={isRTL ? 'chevronLeft' : 'chevronRight'} size={18} color={theme.textSecondary} />}
          />
          <SettingRow
            icon="trash"
            iconBg="#3b1e1e"
            label={isArabic ? 'مسح بيانات الحساب' : isUrdu ? 'اکاؤنٹ کا ڈیٹا صاف کریں' : 'Clear Account Data'}
            sublabel={isArabic ? 'إلغاء التسجيل والبدء من جديد' : isUrdu ? 'رجسٹریشن ختم کریں اور نیا شروع کریں' : 'Unregister and start fresh'}
            isRTL={isRTL}
            isLast={true}
            onPress={handleClearAccount}
            right={<Icon name={isRTL ? 'chevronLeft' : 'chevronRight'} size={18} color="#ef4444" />}
          />
        </View>

        {/* ── SUPPORT ─────────────────────────────── */}
        <SectionTitle title={isArabic ? 'الدعم' : isUrdu ? 'سپورٹ' : 'SUPPORT'} isRTL={isRTL} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <SettingRow
            icon="phone"
            iconBg="#1e3a5f"
            label={isArabic ? 'اتصل بنا' : isUrdu ? 'ہم سے رابطہ کریں' : 'Contact Us'}
            sublabel="+966 000 000 000"
            isRTL={isRTL}
            isLast={false}
            onPress={() => router.push('/contact-us')}
            right={<Icon name={isRTL ? 'chevronLeft' : 'chevronRight'} size={18} color={theme.textSecondary} />}
          />
          <SettingRow
            icon="shield"
            iconBg="#1e3a5f"
            label={isArabic ? 'الشروط والأحكام' : isUrdu ? 'شرائط و ضوابط' : 'Terms & Conditions'}
            sublabel={isArabic ? 'اقرأ شروط الاستخدام' : isUrdu ? 'استعمال کی شرائط پڑھیں' : 'Read usage terms'}
            isRTL={isRTL}
            isLast={true}
            right={<Icon name={isRTL ? 'chevronLeft' : 'chevronRight'} size={18} color={theme.textSecondary} />}
          />
        </View>

        {/* ── ABOUT ───────────────────────────────── */}
        <SectionTitle title={isArabic ? 'حول التطبيق' : isUrdu ? 'ایپ کے بارے میں' : 'ABOUT'} isRTL={isRTL} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <SettingRow
            icon="truck"
            iconBg="#1e3a5f"
            label={isArabic ? 'نظام التتبع المباشر' : isUrdu ? 'ڈرائیور لائیو ٹریکنگ سسٹم' : 'Driver Life Tracking System'}
            sublabel={isArabic ? 'الإصدار 1.0.0' : isUrdu ? 'ورژن 1.0.0' : 'Version 1.0.0'}
            isRTL={isRTL}
            isLast={false}
            right={null}
          />
          <SettingRow
            icon="info"
            iconBg="#1e3a5f"
            label={isArabic ? 'البنية التحتية' : isUrdu ? 'انفراسٹرکچر' : 'Infrastructure'}
            sublabel={isArabic ? 'خرائط مجانية · OpenStreetMap' : isUrdu ? 'مفت نقشے · OpenStreetMap' : 'Free Maps · OpenStreetMap'}
            isRTL={isRTL}
            isLast={true}
            right={null}
          />
        </View>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.md },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: SPACING.md,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: 4,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: SPACING.sm,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: SPACING.sm,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 12,
    marginTop: 2,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
