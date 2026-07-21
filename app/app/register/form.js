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
    name: '',
    lastName: '',
    mobileNo: '',
    carPlateNumber: '',
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
          <CustomInput
            label="Name"
            placeholder="Enter Name"
            value={form.name}
            onChangeText={(val) => handleChange('name', val)}
          />

          <CustomInput
            label="Last Name"
            placeholder="Enter Last Name"
            value={form.lastName}
            onChangeText={(val) => handleChange('lastName', val)}
          />

          <CustomInput
            label="Mobile NO"
            placeholder="Enter Mobile Number"
            keyboardType="phone-pad"
            value={form.mobileNo}
            onChangeText={(val) => handleChange('mobileNo', val)}
          />

          {registrationType === 'Driver' && (
            <CustomInput
              label="For driver Car plate number"
              placeholder="Enter Car Plate Number"
              value={form.carPlateNumber}
              onChangeText={(val) => handleChange('carPlateNumber', val)}
            />
          )}

          <CustomInput
            label="Email Option"
            placeholder="Enter Email Address"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(val) => handleChange('email', val)}
          />

          <View style={styles.switchRow}>
            <Text style={[styles.switchTitle, { color: theme.textPrimary }]}>Track Location</Text>
            <Switch
              value={trackLocation}
              onValueChange={setTrackLocation}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={[styles.switchTitle, { color: theme.textPrimary }]}>Accept Terms & Condition</Text>
            <Switch
              value={acceptTerms}
              onValueChange={setAcceptTerms}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
        </Card>

        <CustomButton
          title="Next"
          onPress={handleNext}
          style={{ marginTop: SPACING.md }}
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
});
