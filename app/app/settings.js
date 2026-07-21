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
function SettingRow({ icon, iconBg, label, sublabel, right, onPress, isArabic, isLast }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.65 : 1}
      onPress={onPress}
      style={[
        styles.settingRow,
        isArabic && { flexDirection: 'row-reverse' },
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border + '33' },
      ]}
    >
      <View style={[styles.rowLeft, isArabic && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.iconBox, { backgroundColor: iconBg || theme.surface }]}>
          <Icon name={icon} size={19} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary, textAlign: isArabic ? 'right' : 'left' }]}>
            {label}
          </Text>
          {sublabel ? (
            <Text style={[styles.rowSub, { color: theme.textSecondary, textAlign: isArabic ? 'right' : 'left' }]}>
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
function SectionTitle({ title, isArabic, theme }) {
  return (
    <Text style={[styles.sectionTitle, { color: theme.textSecondary, textAlign: isArabic ? 'right' : 'left' }]}>
      {title}
    </Text>
  );
}

// ── Language Option ───────────────────────────────────────────────────────────
function LangOption({ flag, label, sublabel, selected, onPress, isArabic, theme, isLast }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.langRow,
        isArabic && { flexDirection: 'row-reverse' },
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border + '33' },
      ]}
    >
      <View style={[styles.rowLeft, isArabic && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.iconBox, { backgroundColor: selected ? '#1e3a5f' : theme.surface }]}>
          <Text style={{ fontSize: 20 }}>{flag}</Text>
        </View>
        <View>
          <Text style={[styles.rowLabel, { color: theme.textPrimary, textAlign: isArabic ? 'right' : 'left' }]}>{label}</Text>
          <Text style={[styles.rowSub, { color: theme.textSecondary, textAlign: isArabic ? 'right' : 'left' }]}>{sublabel}</Text>
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
  const { isDarkMode, toggleTheme, theme, language, setLanguage, saveUserProfile } = useTheme();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
  const router = useRouter();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [locationOn, setLocationOn] = useState(true);

  const handleClearAccount = () => {
    Alert.alert(
      isArabic ? 'مسح البيانات' : 'Clear Account Data',
      isArabic
        ? 'هل تريد مسح بيانات الحساب؟ ستحتاج للتسجيل مرة أخرى.'
        : 'This will clear your registration data. You will need to register again.',
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isArabic ? 'مسح' : 'Clear',
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
        <SectionTitle title={isArabic ? 'المظهر' : 'APPEARANCE'} isArabic={isArabic} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <SettingRow
            icon="moon"
            iconBg={isDarkMode ? '#1e3a5f' : '#f0f4ff'}
            label={isArabic ? 'الوضع الداكن' : 'Dark Mode'}
            sublabel={isDarkMode
              ? (isArabic ? 'الوضع الداكن مفعّل' : 'Dark theme is active')
              : (isArabic ? 'الوضع الفاتح مفعّل' : 'Light theme is active')}
            isArabic={isArabic}
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
        <SectionTitle title={isArabic ? 'اللغة' : 'LANGUAGE'} isArabic={isArabic} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <LangOption
            flag="🇬🇧"
            label="English"
            sublabel={isArabic ? 'الإنجليزية' : 'English Language'}
            selected={language === 'English'}
            onPress={() => setLanguage('English')}
            isArabic={isArabic}
            theme={theme}
            isLast={false}
          />
          <LangOption
            flag="🇸🇦"
            label="عربي"
            sublabel={isArabic ? 'اللغة العربية' : 'Arabic Language'}
            selected={language === 'Arabic'}
            onPress={() => setLanguage('Arabic')}
            isArabic={isArabic}
            theme={theme}
            isLast={true}
          />
        </View>

        {/* ── NOTIFICATIONS & LOCATION ─────────── */}
        <SectionTitle title={isArabic ? 'الإشعارات والموقع' : 'NOTIFICATIONS & LOCATION'} isArabic={isArabic} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <SettingRow
            icon="bell"
            iconBg="#1e3a5f"
            label={isArabic ? 'الإشعارات' : 'Push Notifications'}
            sublabel={isArabic ? 'تلقّي تنبيهات النظام' : 'Receive system alerts'}
            isArabic={isArabic}
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
            label={isArabic ? 'تتبع الموقع' : 'Location Tracking'}
            sublabel={isArabic ? 'تفعيل GPS المباشر للتتبع' : 'Enable live GPS for map tracking'}
            isArabic={isArabic}
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
        <SectionTitle title={isArabic ? 'الحساب' : 'ACCOUNT'} isArabic={isArabic} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <SettingRow
            icon="user"
            iconBg="#1e3a5f"
            label={isArabic ? 'الملف الشخصي' : 'My Profile'}
            sublabel={isArabic ? 'عرض بيانات الحساب المسجل' : 'View registered account details'}
            isArabic={isArabic}
            isLast={false}
            onPress={() => router.push('/profile')}
            right={<Icon name={isArabic ? 'chevronLeft' : 'chevronRight'} size={18} color={theme.textSecondary} />}
          />
          <SettingRow
            icon="trash"
            iconBg="#3b1e1e"
            label={isArabic ? 'مسح بيانات الحساب' : 'Clear Account Data'}
            sublabel={isArabic ? 'إلغاء التسجيل والبدء من جديد' : 'Unregister and start fresh'}
            isArabic={isArabic}
            isLast={true}
            onPress={handleClearAccount}
            right={<Icon name={isArabic ? 'chevronLeft' : 'chevronRight'} size={18} color="#ef4444" />}
          />
        </View>

        {/* ── SUPPORT ─────────────────────────────── */}
        <SectionTitle title={isArabic ? 'الدعم' : 'SUPPORT'} isArabic={isArabic} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <SettingRow
            icon="phone"
            iconBg="#1e3a5f"
            label={isArabic ? 'اتصل بنا' : 'Contact Us'}
            sublabel="+966 000 000 000"
            isArabic={isArabic}
            isLast={false}
            onPress={() => router.push('/contact-us')}
            right={<Icon name={isArabic ? 'chevronLeft' : 'chevronRight'} size={18} color={theme.textSecondary} />}
          />
          <SettingRow
            icon="shield"
            iconBg="#1e3a5f"
            label={isArabic ? 'الشروط والأحكام' : 'Terms & Conditions'}
            sublabel={isArabic ? 'اقرأ شروط الاستخدام' : 'Read usage terms'}
            isArabic={isArabic}
            isLast={true}
            right={<Icon name={isArabic ? 'chevronLeft' : 'chevronRight'} size={18} color={theme.textSecondary} />}
          />
        </View>

        {/* ── ABOUT ───────────────────────────────── */}
        <SectionTitle title={isArabic ? 'حول التطبيق' : 'ABOUT'} isArabic={isArabic} theme={theme} />
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <SettingRow
            icon="truck"
            iconBg="#1e3a5f"
            label={isArabic ? 'نظام التتبع المباشر' : 'Driver Life Tracking System'}
            sublabel={isArabic ? 'الإصدار 1.0.0' : 'Version 1.0.0'}
            isArabic={isArabic}
            isLast={false}
            right={null}
          />
          <SettingRow
            icon="info"
            iconBg="#1e3a5f"
            label={isArabic ? 'البنية التحتية' : 'Infrastructure'}
            sublabel={isArabic ? 'خرائط مجانية · OpenStreetMap' : 'Free Maps · OpenStreetMap'}
            isArabic={isArabic}
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
