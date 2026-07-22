import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { CustomInput } from '../../src/components/common/inputs/CustomInput';
import { CustomButton } from '../../src/components/common/buttons/CustomButton';
import { Card } from '../../src/components/common/cards/Card';
import { SPACING, RADIUS } from '../../src/constants/theme';

export default function RegistrationFormScreen() {
  const { theme, language, saveUserProfile } = useTheme();
  const router = useRouter();
  const { registrationType = 'Driver' } = useLocalSearchParams();
  const isArabic = language === 'Arabic';

  const [form, setForm] = useState({
    name: '',
    lastName: '',
    mobileNo: '',
    carPlateNumber: '',
    email: '',
  });

  // Dynamic pricing option state (1 Month, 6 Months, 1 Year)
  const [selectedDuration, setSelectedDuration] = useState('1m'); 
  const [trackLocation, setTrackLocation] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (!form.name.trim() || !form.mobileNo.trim()) {
      alert(isArabic ? 'الرجاء ملء الحقول المطلوبة (الاسم ورقم الجوال).' : 'Please fill in required fields (Name and Mobile Number).');
      return;
    }

    // Dynamic price calculation label based on selected duration
    const priceLabel = selectedDuration === '1m' ? '$49.99' : selectedDuration === '6m' ? '$199.99' : '$349.99';
    const durationLabel = selectedDuration === '1m' ? '1 Month' : selectedDuration === '6m' ? '6 Months' : '1 Year';

    await saveUserProfile({
      name: form.name,
      lastName: form.lastName,
      mobileNo: form.mobileNo,
      carPlateNumber: form.carPlateNumber,
      email: form.email,
      role: registrationType,
      status: 'Pending Approval',
      subscriptionDuration: durationLabel,
      amountPaid: priceLabel,
      paymentStatus: 'Unpaid'
    });

    router.push('/register/payment');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={isArabic ? `${registrationType} تسجيل` : `${registrationType} Registration`} showBack={true} />

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
                label={isArabic ? 'الاسم الاول' : 'Name'}
                placeholder={isArabic ? 'أدخل الاسم الأول' : 'Enter Name'}
                value={form.name}
                onChangeText={(val) => handleChange('name', val)}
              />

              <CustomInput
                label={isArabic ? 'الكنية / اسم العائلة' : 'Last Name'}
                placeholder={isArabic ? 'أدخل اسم العائلة' : 'Enter Last Name'}
                value={form.lastName}
                onChangeText={(val) => handleChange('lastName', val)}
              />

              <CustomInput
                label={isArabic ? 'رقم الهاتف المحمول' : 'Mobile NO'}
                placeholder={isArabic ? 'أدخل رقم الجوال' : 'Enter Mobile Number'}
                keyboardType="phone-pad"
                value={form.mobileNo}
                onChangeText={(val) => handleChange('mobileNo', val)}
              />

              {registrationType === 'Driver' && (
                <CustomInput
                  label={isArabic ? 'رقم لوحة السيارة' : 'For driver Car plate number'}
                  placeholder={isArabic ? 'أدخل رقم لوحة السيارة' : 'Enter Car Plate Number'}
                  value={form.carPlateNumber}
                  onChangeText={(val) => handleChange('carPlateNumber', val)}
                />
              )}

              <CustomInput
                label={isArabic ? 'البريد الإلكتروني (اختياري)' : 'Email Option'}
                placeholder={isArabic ? 'أدخل البريد الإلكتروني' : 'Enter Email Address'}
                keyboardType="email-address"
                value={form.email}
                onChangeText={(val) => handleChange('email', val)}
              />

              {/* Dynamic Subscription Duration selection box */}
              <View style={{ marginVertical: SPACING.md }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary, marginBottom: 8, textAlign: isArabic ? 'right' : 'left' }}>
                  {isArabic ? 'اختر مدة الاشتراك' : 'Select Subscription Plan'}
                </Text>
                <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', gap: 10 }}>
                  {[
                    { id: '1m', label: isArabic ? 'شهر واحد' : '1 Month', price: '$49.99' },
                    { id: '6m', label: isArabic ? '٦ أشهر' : '6 Months', price: '$199.99' },
                    { id: '1y', label: isArabic ? 'سنة كاملة' : '1 Year', price: '$349.99' }
                  ].map((plan) => (
                    <TouchableOpacity
                      key={plan.id}
                      style={[
                        styles.planButton,
                        { borderColor: theme.border },
                        selectedDuration === plan.id && { borderColor: theme.primary, backgroundColor: theme.surface }
                      ]}
                      onPress={() => setSelectedDuration(plan.id)}
                    >
                      <Text style={[styles.planLabel, { color: theme.textPrimary }]}>{plan.label}</Text>
                      <Text style={[styles.planPrice, { color: theme.primary }]}>{plan.price}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.switchRow, isArabic && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.switchTitle, { color: theme.textPrimary }]}>
                  {isArabic ? 'تتبع الموقع الجغرافي' : 'Track Location'}
                </Text>
                <Switch
                  value={trackLocation}
                  onValueChange={setTrackLocation}
                  trackColor={{ false: theme.border, true: theme.primary }}
                />
              </View>

              <View style={[styles.switchRow, isArabic && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.switchTitle, { color: theme.textPrimary }]}>
                  {isArabic ? 'الموافقة على الشروط والأحكام' : 'Accept Terms & Condition'}
                </Text>
                <Switch
                  value={acceptTerms}
                  onValueChange={setAcceptTerms}
                  trackColor={{ false: theme.border, true: theme.primary }}
                />
              </View>
            </Card>

            <CustomButton
              title={isArabic ? 'التالي' : 'Next'}
              onPress={handleNext}
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  planButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 14,
    fontWeight: '800',
  }
});
