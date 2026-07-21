import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { CustomInput } from '../../src/components/common/inputs/CustomInput';
import { CustomButton } from '../../src/components/common/buttons/CustomButton';
import { Card } from '../../src/components/common/cards/Card';
import { SPACING } from '../../src/constants/theme';

export default function RegistrationFormScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { registrationType = 'Driver' } = useLocalSearchParams();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    plateNumber: '',
    email: '',
  });

  const [trackLocation, setTrackLocation] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    router.push('/register/payment');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={`${registrationType} Registration`} showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Personal & Vehicle Details</Text>

          <CustomInput
            label="First Name"
            placeholder="John"
            value={form.firstName}
            onChangeText={(val) => handleChange('firstName', val)}
          />

          <CustomInput
            label="Last Name"
            placeholder="Doe"
            value={form.lastName}
            onChangeText={(val) => handleChange('lastName', val)}
          />

          <CustomInput
            label="Mobile Number"
            placeholder="+1 987 654 3210"
            keyboardType="phone-pad"
            value={form.mobileNumber}
            onChangeText={(val) => handleChange('mobileNumber', val)}
          />

          <CustomInput
            label="Plate Number"
            placeholder="ABC-9876"
            value={form.plateNumber}
            onChangeText={(val) => handleChange('plateNumber', val)}
          />

          <CustomInput
            label="Email Address"
            placeholder="john.doe@example.com"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(val) => handleChange('email', val)}
          />

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.switchTitle, { color: theme.textPrimary }]}>Track Location</Text>
              <Text style={[styles.switchSub, { color: theme.textSecondary }]}>
                Allow real-time GPS tracking on map
              </Text>
            </View>
            <Switch
              value={trackLocation}
              onValueChange={setTrackLocation}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.switchTitle, { color: theme.textPrimary }]}>Accept Terms & Conditions</Text>
              <Text style={[styles.switchSub, { color: theme.textSecondary }]}>
                I agree to the Driver Life system policy
              </Text>
            </View>
            <Switch
              value={acceptTerms}
              onValueChange={setAcceptTerms}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
        </Card>

        <CustomButton
          title="Next to Payment"
          onPress={handleNext}
          style={{ marginTop: SPACING.sm }}
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
  card: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
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
  switchSub: {
    fontSize: 12,
  },
});
