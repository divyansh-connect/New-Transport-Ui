import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { SPACING, RADIUS } from '../src/constants/theme';

export default function ContactUsScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Contact Support" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>We are here to help you</Text>
        <Text style={[styles.subheading, { color: theme.textSecondary }]}>
          Reach out directly to our admin and support team via phone or WhatsApp.
        </Text>

        <TouchableOpacity onPress={() => Linking.openURL('tel:+18005550199')} activeOpacity={0.8}>
          <Card style={styles.contactCard}>
            <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
              <Text style={{ fontSize: 24 }}>📞</Text>
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Phone Support</Text>
              <Text style={[styles.cardValue, { color: theme.primary }]}>+1 (800) 555-0199</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/18005550199')} activeOpacity={0.8}>
          <Card style={styles.contactCard}>
            <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
              <Text style={{ fontSize: 24 }}>💬</Text>
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>WhatsApp Direct</Text>
              <Text style={[styles.cardValue, { color: theme.success }]}>+1 (800) 555-0199</Text>
            </View>
          </Card>
        </TouchableOpacity>
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
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: SPACING.sm,
  },
  subheading: {
    fontSize: 14,
    marginVertical: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
});
