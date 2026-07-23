import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { CustomButton } from '../src/components/common/buttons/CustomButton';
import { Icon } from '../src/components/common/Icon';
import { SPACING, RADIUS } from '../src/constants/theme';
import { translations } from '../src/constants/translations';

export default function MenuScreen() {
  const { theme, isDarkMode, toggleTheme, language, setLanguage, registeredUser, saveUserProfile, showAlert } = useTheme();
  const router = useRouter();
  console.log('--- MENU SCREEN registeredUser:', registeredUser);
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;

  const menuItems = [
    { label: t.menuMap, icon: 'map', route: '/map' },
    { label: t.menuProfile, icon: 'user', route: '/profile' },
    { label: t.menuOpportunity, icon: 'briefcase', route: '/opportunity' },
    { label: t.menuNotification, icon: 'bell', route: '/notification' },
    { label: t.menuContactUs, icon: 'phone', route: '/contact-us' },
    { label: t.menuSetting, icon: 'settings', route: '/settings' },
  ];

  const getLanguageLabel = () => {
    if (language === 'English') return '🌐 Language: English → العربية';
    if (language === 'Arabic') return '🌐 اللغة: العربية ← اردو';
    return '🌐 زبان: اردو ← English';
  };

  const cycleLanguage = () => {
    if (language === 'English') setLanguage('Arabic');
    else if (language === 'Arabic') setLanguage('Urdu');
    else setLanguage('English');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={t.menuTitle} showBack={true} />

      <ScrollView contentContainerStyle={[styles.content, isRTL && { direction: 'rtl' }]}>
        {/* User Profile Header Badge */}
        <Card style={[styles.profileHeaderCard, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.avatarCircle, { backgroundColor: registeredUser ? theme.primary : theme.border }]}>
            <Text style={styles.avatarText}>
              {registeredUser 
                ? `${registeredUser.name?.[0] || ''}${registeredUser.lastName?.[0] || ''}`.toUpperCase() 
                : 'G'}
            </Text>
          </View>
          <View style={[styles.profileTextContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.profileName, { color: theme.textPrimary }]}>
              {registeredUser 
                ? `${registeredUser.name} ${registeredUser.lastName || ''}` 
                : (isArabic ? 'زائر / ضيف' : isUrdu ? 'وزیٹر / مہمان' : 'Visitor / Guest')}
            </Text>
            <View style={[
              styles.statusChip, 
              { backgroundColor: registeredUser ? 'rgba(22, 163, 74, 0.15)' : 'rgba(150, 150, 150, 0.15)' }
            ]}>
              <Text style={[
                styles.statusChipText, 
                { color: registeredUser ? '#16a34a' : theme.textSecondary }
              ]}>
                {registeredUser 
                  ? (registeredUser.status || 'Approved') 
                  : (isArabic ? 'غير مسجل' : isUrdu ? 'رجسٹرڈ نہیں' : 'Not Registered')}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.menuCardContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.75}
              onPress={() => router.push(item.route)}
              style={[styles.menuItemRow, isRTL && { flexDirection: 'row-reverse' }]}
            >
              <Text style={[styles.itemText, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>{item.label}</Text>
              <Icon name={isRTL ? 'chevronLeft' : 'chevronRight'} size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.menuItemRow, isRTL && { flexDirection: 'row-reverse' }]} onPress={toggleTheme}>
            <Text style={[styles.itemText, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>{t.menuDarkLight}</Text>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>
              {isDarkMode ? t.menuDark : t.menuLight}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Conditionally render Register or Logout button */}
        {registeredUser ? (
          <CustomButton
            title={isArabic ? 'تسجيل الخروج' : isUrdu ? 'لاگ آؤٹ' : 'Logout'}
            onPress={() => {
              showAlert(
                isArabic ? 'تسجيل الخروج' : isUrdu ? 'لاگ آؤٹ' : 'Logout',
                isArabic ? 'هل تريد تسجيل الخروج من حسابك؟' : isUrdu ? 'کیا آپ اپنے اکاؤنٹ سے لاگ آؤٹ کرنا چاہتے ہیں؟' : 'Are you sure you want to logout of your account?',
                [
                  { text: isArabic ? 'إلغاء' : isUrdu ? 'منسوخ کریں' : 'Cancel', style: 'cancel' },
                  {
                    text: isArabic ? 'تسجيل الخروج' : isUrdu ? 'لاگ آؤٹ' : 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                      await AsyncStorage.removeItem('user_profile');
                      saveUserProfile(null);
                      router.replace('/map');
                    }
                  }
                ]
              );
            }}
            style={{ marginVertical: SPACING.md, backgroundColor: '#ef4444' }}
          />
        ) : (
          <CustomButton
            title={t.registerOpenService}
            onPress={() => router.push('/register')}
            style={{ marginVertical: SPACING.md }}
          />
        )}

        {/* Language Toggle Button */}
        <CustomButton
          title={getLanguageLabel()}
          variant="secondary"
          onPress={cycleLanguage}
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
  menuCardContainer: {
    paddingVertical: SPACING.sm,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: 16,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  profileTextContainer: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
