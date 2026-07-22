import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { CustomButton } from '../src/components/common/buttons/CustomButton';
import { SPACING, RADIUS } from '../src/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContactUsScreen() {
  const { theme, registeredUser } = useTheme();
  const router = useRouter();

  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Submit dynamic ticket to shared database/AsyncStorage simulation
  const handleRaiseTicket = async () => {
    if (!subject.trim() || !details.trim()) {
      Alert.alert('Validation Error', 'Please enter both Subject and Issue Details.');
      return;
    }

    setSubmitting(true);

    try {
      // Create new ticket object matching web Contact inquiry schema
      const newTicketId = `TKT-${Math.floor(100 + Math.random() * 900)}`;
      const newTicket = {
        id: newTicketId,
        user: registeredUser?.name ? `${registeredUser.name} ${registeredUser.lastName || ''}` : 'App User',
        role: registeredUser?.role || 'Driver',
        phone: registeredUser?.mobileNo || '+966 500000000',
        subject: subject,
        status: 'Open',
        time: 'Just now',
        details: details
      };

      // In real systems, this calls the API endpoint. We will write to a mocked localStorage/AsyncStorage system
      // Web and App communicate mock updates locally. For demo context we save to shared storage structure
      const savedTicketsStr = await AsyncStorage.getItem('support_inquiries');
      let ticketsList = [];
      if (savedTicketsStr) {
        ticketsList = JSON.parse(savedTicketsStr);
      } else {
        // Initial fallback seed
        ticketsList = [
          {
            id: 'TKT-101',
            user: 'Rajesh Kumar',
            role: 'Driver',
            phone: '+91 98765 43210',
            subject: 'Payment Delay',
            status: 'Open',
            time: '10 mins ago',
            details: 'Payout for last week trip has not credited.'
          }
        ];
      }

      ticketsList = [newTicket, ...ticketsList];
      await AsyncStorage.setItem('support_inquiries', JSON.stringify(ticketsList));

      // Simulate a small network delay
      setTimeout(() => {
        setSubmitting(false);
        Alert.alert(
          'Inquiry Submitted',
          `Ticket ${newTicketId} has been successfully raised. Our Admin team will review it shortly on the Web Panel.`,
          [{ text: 'OK', onPress: () => router.replace('/map') }]
        );
        setSubject('');
        setDetails('');
      }, 1000);

    } catch (e) {
      setSubmitting(false);
      console.log('Ticket submission error:', e);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Contact Support" showBack={true} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.heading, { color: theme.textPrimary }]}>Inquiry / Support Ticket</Text>
        <Text style={[styles.subheading, { color: theme.textSecondary }]}>
          Having issues with your tracking, payments, or route locks? Raise a support ticket directly to the Admin Hub.
        </Text>

        <Card style={styles.formCard}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Subject / Topic</Text>
          <TextInput
            style={[styles.input, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.surface }]}
            placeholder="e.g., GPS Tracking Delay, Payment issue"
            placeholderTextColor={theme.textSecondary}
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={[styles.label, { color: theme.textPrimary, marginTop: SPACING.md }]}>Issue Details</Text>
          <TextInput
            style={[styles.textArea, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.surface }]}
            placeholder="Please write details of the problem..."
            placeholderTextColor={theme.textSecondary}
            multiline={true}
            numberOfLines={5}
            value={details}
            onChangeText={setDetails}
          />

          {submitting ? (
            <ActivityIndicator size="small" color={theme.primary} style={{ marginTop: SPACING.lg }} />
          ) : (
            <CustomButton
              title="Raise Ticket to Admin"
              onPress={handleRaiseTicket}
              style={{ marginTop: SPACING.lg }}
            />
          )}
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
    lineHeight: 20,
  },
  formCard: {
    padding: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
  },
  textArea: {
    height: 120,
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 15,
    textAlignVertical: 'top',
  },
});
