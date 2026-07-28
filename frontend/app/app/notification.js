import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { SPACING } from '../src/constants/theme';
import { apiFetch } from '../src/utils/api';

export default function NotificationScreen() {
  const { theme, registeredUser } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserNotifications();
  }, []);

  const fetchUserNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token || !registeredUser) {
        // Show status-based message if not logged in
        setNotifications([]);
        setLoading(false);
        return;
      }

      // Fetch notifications linked to this user from backend
      try {
        const data = await apiFetch('/notifications');
        // Filter notifications for this user only
        const userNotifs = data.filter(n =>
          !n.userId || n.userId === registeredUser?.id
        );
        setNotifications(userNotifs);
      } catch (err) {
        // If 403 (not admin) or network error, show user-specific status notifications
        setNotifications(getStatusNotifications());
      }
    } catch (err) {
      console.log('Notification fetch error:', err);
      setNotifications(getStatusNotifications());
    } finally {
      setLoading(false);
    }
  };

  // Generate status-based notifications from the user's profile data
  const getStatusNotifications = () => {
    if (!registeredUser) return [];
    const notifs = [];

    if (registeredUser.status === 'Pending') {
      notifs.push({
        id: 'status-1',
        title: 'Registration Under Review',
        body: 'Your registration request has been submitted and is currently under admin review. You will be notified once approved.',
        time: 'Just now',
        unread: true
      });
    }

    if (registeredUser.status === 'Approved') {
      notifs.push({
        id: 'status-2',
        title: '✅ Account Approved',
        body: `Welcome ${registeredUser.name}! Your account is active. GPS tracking is now enabled for your profile.`,
        time: 'Active',
        unread: false
      });
    }

    if (registeredUser.status === 'Rejected') {
      notifs.push({
        id: 'status-3',
        title: '❌ Registration Rejected',
        body: registeredUser.rejectionReason || 'Your registration was not approved. Please contact support.',
        time: 'Recent',
        unread: true
      });
    }

    return notifs;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Notifications" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
        ) : notifications.length === 0 ? (
          <Card style={styles.card}>
            <Text style={[styles.title, { color: theme.textSecondary, textAlign: 'center' }]}>
              No notifications yet.
            </Text>
            <Text style={[styles.body, { color: theme.textSecondary, textAlign: 'center', marginTop: 8 }]}>
              {registeredUser ? 'You will be notified when your status changes.' : 'Please login or register to see notifications.'}
            </Text>
          </Card>
        ) : (
          notifications.map((item) => (
            <Card key={item.id} style={[styles.card, item.unread && { borderLeftWidth: 3, borderLeftColor: theme.primary }]}>
              <View style={styles.row}>
                <Text style={[styles.title, { color: theme.textPrimary, flex: 1 }]}>{item.title}</Text>
                <Text style={[styles.time, { color: theme.textSecondary }]}>{item.time}</Text>
              </View>
              <Text style={[styles.body, { color: theme.textSecondary }]}>{item.body || item.message}</Text>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: SPACING.md,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  card: { marginBottom: SPACING.sm },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
    alignItems: 'flex-start',
    gap: 8,
  },
  title: { fontSize: 15, fontWeight: '700' },
  time: { fontSize: 12, marginTop: 2 },
  body: { fontSize: 14, lineHeight: 20 },
});
