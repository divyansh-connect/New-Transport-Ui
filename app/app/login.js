import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../src/context/ThemeContext';
import { CustomInput } from '../src/components/common/inputs/CustomInput';
import { CustomButton } from '../src/components/common/buttons/CustomButton';
import { Card } from '../src/components/common/cards/Card';
import { Header } from '../src/components/common/headers/Header';
import { RADIUS, SPACING } from '../src/constants/theme';

export default function LoginScreen() {
  const { theme, login } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login({ name: 'John Doe', email: email || 'driver@example.com' });
    router.replace('/map');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Account Login" showBack={true} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandSection}>
          <View style={[styles.logoCard, { backgroundColor: theme.primary }]}>
            <MaterialCommunityIcons name="truck-fast" size={44} color="#FFF" />
          </View>
          <Text style={[styles.appTitle, { color: theme.textPrimary }]}>Driver Life System</Text>
          <Text style={[styles.appTagline, { color: theme.textSecondary }]}>
            Enterprise Fleet & Telemetry Network
          </Text>
        </View>

        {/* Login Form Card */}
        <Card style={styles.loginCard}>
          <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Welcome Back</Text>
          <Text style={[styles.cardSubheading, { color: theme.textSecondary }]}>
            Sign in to access live map tracking and partner features
          </Text>

          <View style={styles.formGroup}>
            <CustomInput
              label="Email Address / Username"
              placeholder="driver@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <CustomInput
              label="Password"
              placeholder="••••••••"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.forgotPassLink}>
              <Text style={[styles.linkText, { color: theme.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>

            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              style={styles.signInButton}
            />
          </View>
        </Card>

        {/* Footer Registration Action */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>New to Driver Life? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={[styles.registerText, { color: theme.primary }]}>Register Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoCard: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  appTagline: {
    fontSize: 13,
    marginTop: 2,
    textAlign: 'center',
  },
  loginCard: {
    padding: SPACING.lg,
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardSubheading: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  formGroup: {
    width: '100%',
  },
  forgotPassLink: {
    alignSelf: 'flex-end',
    marginVertical: SPACING.xs,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
  },
  signInButton: {
    marginTop: SPACING.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: 14,
  },
  registerText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
