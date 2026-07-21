import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { Card } from '../src/components/common/cards/Card';
import { RADIUS, SPACING } from '../src/constants/theme';

export default function MapScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [userRole, setUserRole] = useState('Driver'); // Driver or Visitor

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Floating Control Bar */}
      <View style={[styles.topBar, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/menu')}>
          <Text style={{ color: theme.textPrimary, fontSize: 22 }}>☰</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Live Map</Text>
        <TouchableOpacity
          style={[styles.roleChip, { backgroundColor: theme.surface }]}
          onPress={() => setUserRole(userRole === 'Driver' ? 'Visitor' : 'Driver')}
        >
          <Text style={[styles.roleText, { color: theme.primary }]}>{userRole}</Text>
        </TouchableOpacity>
      </View>

      {/* Simulated Map View */}
      <View style={[styles.mapContainer, { backgroundColor: theme.surface }]}>
        {/* Mock Map Grid & Pins */}
        <View style={styles.mapGrid}>
          <View style={[styles.pin, { top: '30%', left: '40%', backgroundColor: theme.primary }]}>
            <Text style={styles.pinIcon}>📍 You</Text>
          </View>
          {userRole === 'Driver' && (
            <>
              <View style={[styles.pin, { top: '50%', left: '70%', backgroundColor: theme.success }]}>
                <Text style={styles.pinIcon}>🛠️ Workshop</Text>
              </View>
              <View style={[styles.pin, { top: '65%', left: '25%', backgroundColor: theme.warning }]}>
                <Text style={styles.pinIcon}>🛢️ Oil Station</Text>
              </View>
            </>
          )}
        </View>
        <Text style={[styles.mapNotice, { color: theme.textSecondary }]}>
          {userRole === 'Visitor'
            ? 'Visitor Mode: Showing only your current location.'
            : 'Driver Mode: Services & Nearby Hubs Visible.'}
        </Text>
      </View>

      {/* Bottom Tracking Switch Panel */}
      <Card style={styles.bottomCard}>
        <View style={styles.switchRow}>
          <View>
            <Text style={[styles.switchTitle, { color: theme.textPrimary }]}>Live Location Tracking</Text>
            <Text style={[styles.switchSubtitle, { color: theme.textSecondary }]}>
              {isLiveTracking ? 'Broadcasting live location to network' : 'Tracking disabled'}
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
    fontSize: 18,
    fontWeight: '700',
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
  mapContainer: {
    flex: 1,
    margin: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  pin: {
    position: 'absolute',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    elevation: 3,
  },
  pinIcon: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  mapNotice: {
    position: 'absolute',
    bottom: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    fontSize: 12,
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
  switchTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  switchSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
