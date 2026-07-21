import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../src/context/ThemeContext';
import { Card } from '../src/components/common/cards/Card';
import { CustomButton } from '../src/components/common/buttons/CustomButton';
import { RADIUS, SPACING } from '../src/constants/theme';

export default function MapScreen() {
  const { theme, isLoggedIn, user, logout } = useTheme();
  const router = useRouter();
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [userRole, setUserRole] = useState('Driver');

  const markers = [
    { id: 1, title: 'Your Live Location', top: '35%', left: '40%', type: 'you' },
    { id: 2, title: 'Metro Workshop Hub', top: '55%', left: '60%', type: 'workshop' },
    { id: 3, title: 'Oil Change Center', top: '65%', left: '20%', type: 'oil' },
    { id: 4, title: 'Car Parking Station', top: '25%', left: '70%', type: 'location' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/menu')}>
          <Ionicons name="menu" size={26} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Live Telemetry Map</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            {isLoggedIn ? `Welcome, ${user?.name || 'Driver'}` : 'Guest Mode'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.roleChip, { backgroundColor: theme.surface }]}
          onPress={() => setUserRole(userRole === 'Driver' ? 'Visitor' : 'Driver')}
        >
          <Text style={[styles.roleText, { color: theme.primary }]}>{userRole}</Text>
        </TouchableOpacity>
      </View>

      {/* Auth Action Bar: Dynamic Login / Logout Toggle */}
      <View style={styles.loginShortcutBar}>
        {isLoggedIn ? (
          <View style={styles.authRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success} />
              <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>Logged In</Text>
            </View>
            <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.danger }]} onPress={logout}>
              <Ionicons name="log-out-outline" size={18} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CustomButton
            title="🔑 Login to Account"
            variant="primary"
            onPress={() => router.push('/login')}
            style={styles.loginBtnStyle}
          />
        )}
      </View>

      {/* Styled Responsive Map Visual Canvas */}
      <View style={[styles.mapCanvas, { backgroundColor: theme.isDarkMode ? '#0B132B' : '#E2E8F0' }]}>
        <View style={[styles.roadHorizontal, { top: '40%', backgroundColor: theme.isDarkMode ? '#1E293B' : '#CBD5E1' }]} />
        <View style={[styles.roadHorizontal, { top: '70%', backgroundColor: theme.isDarkMode ? '#1E293B' : '#CBD5E1' }]} />
        <View style={[styles.roadVertical, { left: '45%', backgroundColor: theme.isDarkMode ? '#1E293B' : '#CBD5E1' }]} />
        <View style={[styles.roadVertical, { left: '70%', backgroundColor: theme.isDarkMode ? '#1E293B' : '#CBD5E1' }]} />

        {/* Map Markers with Ionicons */}
        {markers
          .filter((m) => userRole === 'Driver' || m.type === 'you')
          .map((m) => (
            <View
              key={m.id}
              style={[
                styles.mapPin,
                {
                  top: m.top,
                  left: m.left,
                  backgroundColor: m.type === 'you' ? theme.primary : theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name={m.type === 'you' ? 'navigate' : m.type === 'workshop' ? 'build' : 'funnel'}
                size={14}
                color={m.type === 'you' ? '#FFF' : theme.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.pinLabel, { color: m.type === 'you' ? '#FFF' : theme.textPrimary }]}>
                {m.type === 'you' ? 'You' : m.type === 'workshop' ? 'Workshop' : 'Oil Station'}
              </Text>
            </View>
          ))}

        {/* Map Overlay Notice */}
        <View style={[styles.overlayNotice, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text style={[styles.noticeText, { color: theme.textPrimary }]}>
            {userRole === 'Visitor'
              ? '👤 Visitor Mode: Showing vehicle location.'
              : '🚛 Driver Mode: Nearby Workshops & Stations Active.'}
          </Text>
        </View>
      </View>

      {/* Bottom Telemetry Card */}
      <Card style={styles.bottomCard}>
        <View style={styles.switchRow}>
          <View style={styles.textContainer}>
            <Text style={[styles.switchTitle, { color: theme.textPrimary }]} numberOfLines={1}>
              Live GPS Telemetry
            </Text>
            <Text style={[styles.switchSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
              {isLiveTracking ? 'Broadcasting live location to admin network' : 'Tracking disabled'}
            </Text>
          </View>
          <Switch
            value={isLiveTracking}
            onValueChange={setIsLiveTracking}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </View>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    elevation: 4,
    zIndex: 10,
  },
  menuButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 11,
  },
  roleChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loginShortcutBar: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.xs,
  },
  loginBtnStyle: {
    marginVertical: 0,
    paddingVertical: 10,
  },
  authRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  mapCanvas: {
    flex: 1,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  roadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 16,
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 16,
  },
  mapPin: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    elevation: 4,
  },
  pinLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  overlayNotice: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    elevation: 3,
  },
  noticeText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  switchSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
