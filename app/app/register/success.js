import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { Card } from '../../src/components/common/cards/Card';
import { CustomButton } from '../../src/components/common/buttons/CustomButton';
import { RADIUS, SPACING } from '../../src/constants/theme';

export default function PaymentSuccessScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/966000000000');
  };

  const handleCall = () => {
    Linking.openURL('tel:+966000000000');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="For Approval Contact Us" showBack={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: theme.success }]}>
            <Text style={styles.checkMark}>✓</Text>
          </View>

          <Text style={[styles.title, { color: theme.textPrimary }]}>Payment Gateway Success</Text>

          <View style={[styles.noticeBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.noticeTitle, { color: theme.primary }]}>For Approval Contact Us</Text>
            <Text style={[styles.phoneNum, { color: theme.textPrimary }]}>+966000000000</Text>
            <Text style={[styles.subNote, { color: theme.textSecondary }]}>
              Contact admin via WhatsApp or Phone call for account activation & dashboard notification review.
            </Text>
          </View>

          <CustomButton
            title="💬 Contact via WhatsApp"
            onPress={handleWhatsApp}
            style={{ backgroundColor: '#25D366', marginVertical: SPACING.xs }}
          />

          <CustomButton
            title="📞 Call Admin Direct (+966000000000)"
            variant="secondary"
            onPress={handleCall}
            style={{ marginVertical: SPACING.xs }}
          />

          <CustomButton
            title="Proceed to Approval Status"
            onPress={() => router.push('/register/pending')}
            style={{ marginTop: SPACING.md }}
          />
        </Card>
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
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  checkMark: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  noticeBox: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  phoneNum: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: SPACING.xs,
  },
  subNote: {
    fontSize: 12,
    textAlign: 'center',
  },
});
