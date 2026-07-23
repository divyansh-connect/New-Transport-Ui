import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { CustomInput } from '../src/components/common/inputs/CustomInput';
import { CustomButton } from '../src/components/common/buttons/CustomButton';
import { Card } from '../src/components/common/cards/Card';
import { SPACING } from '../src/constants/theme';
import { translations } from '../src/constants/translations';

export default function EditProfileScreen() {
  const { theme, language, registeredUser, saveUserProfile, showAlert } = useTheme();
  const router = useRouter();
  
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;
  const t = translations[language] || translations.English;

  // Form states initialized with current profile values
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    mobileNo: '',
    carPlateNumber: '',
    email: '',
  });

  useEffect(() => {
    if (registeredUser) {
      setForm({
        name: registeredUser.name || '',
        lastName: registeredUser.lastName || '',
        mobileNo: registeredUser.mobileNo || '',
        carPlateNumber: registeredUser.carPlateNumber || '',
        email: registeredUser.email || '',
      });
    }
  }, [registeredUser]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.mobileNo.trim()) {
      showAlert(
        isArabic ? 'خطأ' : isUrdu ? 'غلطی' : 'Error',
        isArabic ? 'الرجاء ملء الحقول المطلوبة (الاسم ورقم الجوال).' : isUrdu ? 'براہ کرم مطلوبہ فیلڈز (نام اور موبائل نمبر) پُر کریں۔' : 'Please fill in required fields (Name and Mobile Number).'
      );
      return;
    }

    if (registeredUser) {
      const updatedProfile = {
        ...registeredUser,
        name: form.name,
        lastName: form.lastName,
        mobileNo: form.mobileNo,
        carPlateNumber: form.carPlateNumber,
        email: form.email,
      };

      await saveUserProfile(updatedProfile);

      showAlert(
        isArabic ? 'نجاح' : isUrdu ? 'کامیابی' : 'Success',
        isArabic ? 'تم تحديث الملف الشخصي بنجاح.' : isUrdu ? 'پروفائل کامیابی سے اپ ڈیٹ ہو گئی۔' : 'Profile updated successfully.',
        [
          {
            text: isArabic ? 'موافق' : isUrdu ? 'ٹھیک ہے' : 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  // If user is not registered / logged in yet
  if (!registeredUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title={isArabic ? 'تعديل الملف الشخصي' : isUrdu ? 'پروفائل میں ترمیم کریں' : 'Edit Profile'} showBack={true} />
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.primary, textAlign: isRTL ? 'right' : 'left' }]}>{t.registrationRequired}</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: SPACING.md, textAlign: isRTL ? 'right' : 'left' }}>
              {t.registerPrompt}
            </Text>
            <CustomButton
              title={t.registerNow}
              onPress={() => router.push('/register')}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={isArabic ? 'تعديل الملف الشخصي' : isUrdu ? 'پروفائل میں ترمیم کریں' : 'Edit Profile'} showBack={true} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Card style={styles.card}>
              <CustomInput
                label={isArabic ? 'الاسم الاول' : isUrdu ? 'پہلا نام' : 'Name'}
                placeholder={isArabic ? 'أدخل الاسم الأول' : isUrdu ? 'پہلا نام درج کریں' : 'Enter Name'}
                value={form.name}
                onChangeText={(val) => handleChange('name', val)}
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              />

              <CustomInput
                label={isArabic ? 'الكنية / اسم العائلة' : isUrdu ? 'خاندان کا نام' : 'Last Name'}
                placeholder={isArabic ? 'أدخل اسم العائلة' : isUrdu ? 'خاندان کا نام درج کریں' : 'Enter Last Name'}
                value={form.lastName}
                onChangeText={(val) => handleChange('lastName', val)}
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              />

              <CustomInput
                label={isArabic ? 'رقم الهاتف المحمول' : isUrdu ? 'موبائل نمبر' : 'Mobile NO'}
                placeholder={isArabic ? 'أدخل رقم الجوال' : isUrdu ? 'موبائل نمبر درج کریں' : 'Enter Mobile Number'}
                keyboardType="phone-pad"
                value={form.mobileNo}
                onChangeText={(val) => handleChange('mobileNo', val)}
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              />

              {registeredUser?.role === 'Driver' && (
                <CustomInput
                  label={isArabic ? 'رقم لوحة السيارة' : isUrdu ? 'ڈرائیور گاڑی کی نمبر پلیٹ کے لیے' : 'For driver Car plate number'}
                  placeholder={isArabic ? 'أدخل رقم لوحة السيارة' : isUrdu ? 'نمبر پلیٹ درج کریں' : 'Enter Car Plate Number'}
                  value={form.carPlateNumber}
                  onChangeText={(val) => handleChange('carPlateNumber', val)}
                  style={{ textAlign: isRTL ? 'right' : 'left' }}
                />
              )}

              <CustomInput
                label={isArabic ? 'البريد الإلكتروني (اختياري)' : isUrdu ? 'ای میل (اختیاری)' : 'Email Option'}
                placeholder={isArabic ? 'أدخل البريد الإلكتروني' : isUrdu ? 'ای میل ایڈریس درج کریں' : 'Enter Email Address'}
                keyboardType="email-address"
                value={form.email}
                onChangeText={(val) => handleChange('email', val)}
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              />
            </Card>

            <CustomButton
              title={isArabic ? 'حفظ التغييرات' : isUrdu ? 'تبدیلیاں محفوظ کریں' : 'Save Changes'}
              onPress={handleSave}
              style={{ marginTop: SPACING.xs, marginBottom: SPACING.xl }}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  card: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
});
