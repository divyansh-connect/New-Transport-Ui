import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { RADIUS, SPACING } from '../src/constants/theme';

export default function MapScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [userRole, setUserRole] = useState('Driver'); // Driver or Visitor

  const markers = [
    { id: 1, title: 'Your Location', top: '35%', left: '42%', type: 'you' },
    { id: 2, title: 'Workshop Hub', top: '55%', left: '65%', type: 'workshop' },
    { id: 3, title: 'Oil Change Center', top: '68%', left: '25%', type: 'oil' },
    { id: 4, title: 'Car Location Node', top: '25%', left: '72%', type: 'location' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Bar with Settings Icon Button (as in Client Wireframe Page 1) */}
      <View style={[styles.topBar, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>MAP</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            style={[styles.roleChip, { backgroundColor: theme.surface }]}
            onPress={() => setUserRole(userRole === 'Driver' ? 'Visitor' : 'Driver')}
          >
            <Text style={[styles.roleText, { color: theme.primary }]}>{userRole}</Text>
          </TouchableOpacity>

          {/* Settings / Menu Icon (Top Right as in Client Diagram Page 1) */}
          <TouchableOpacity style={[styles.settingsButton, { backgroundColor: theme.primary }]} onPress={() => router.push('/menu')}>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Styled Responsive Vector Map Visual Canvas */}
      <View style={[styles.mapCanvas, { backgroundColor: theme.isDarkMode ? '#0B132B' : '#E2E8F0' }]}>
        {/* Map Grid Roads */}
        <View style={[styles.roadHorizontal, { top: '40%', backgroundColor: theme.isDarkMode ? '#1E293B' : '#CBD5E1' }]} />
        <View style={[styles.roadHorizontal, { top: '70%', backgroundColor: theme.isDarkMode ? '#1E293B' : '#CBD5E1' }]} />
        <View style={[styles.roadVertical, { left: '45%', backgroundColor: theme.isDarkMode ? '#1E293B' : '#CBD5E1' }]} />
        <View style={[styles.roadVertical, { left: '70%', backgroundColor: theme.isDarkMode ? '#1E293B' : '#CBD5E1' }]} />

        {/* Map Markers */}
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
              <Text style={[styles.pinLabel, { color: m.type === 'you' ? '#FFF' : theme.textPrimary }]}>
                {m.type === 'you'
                  ? '📍 Own Location'
                  : m.type === 'workshop'
                  ? '🛠️ Workshop'
                  : m.type === 'oil'
                  ? '🛢️ Oil Change'
                  : '📍 Car Location'}
              </Text>
            </View>
          ))}

        {/* Client Wireframe Notice Text on MAP */}
        <View style={[styles.overlayNotice, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text style={[styles.noticeText, { color: theme.textPrimary }]}>
            {userRole === 'Visitor'
              ? 'Visitor Visible to himself only'
              : 'All Services are Visible to everyone'}
          </Text>
        </View>

        {/* Live Tracking ON/OFF Switch Pill (Exact Client Wireframe Page 1: "Life Tracking ON/OFF") */}
        {userRole === 'Driver' && (
          <View style={[styles.lifeTrackingBox, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={[styles.trackingLabel, { color: theme.textPrimary }]}>Life Tracking</Text>
            <Switch
              value={isLiveTracking}
              onValueChange={setIsLiveTracking}
              trackColor={{ false: theme.border, true: theme.primary }}
              style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
            />
            <Text style={[styles.statusText, { color: isLiveTracking ? theme.primary : theme.textSecondary }]}>
              {isLiveTracking ? 'ON' : 'OFF'}
            </Text>
          </View>
        )}
      </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
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
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCanvas: {
    flex: 1,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
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
    top: SPACING.md,
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
  lifeTrackingBox: {
    position: 'absolute',
    bottom: SPACING.md,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    elevation: 6,
    gap: 8,
  },
  trackingLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
