import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { CustomButton } from '../src/components/common/buttons/CustomButton';
import { Icon } from '../src/components/common/Icon';
import { SPACING, RADIUS } from '../src/constants/theme';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { theme, registeredUser } = useTheme();
  const router = useRouter();

  // If user is not registered / logged in yet
  if (!registeredUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Profile" showBack={true} />
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.avatarCard}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.surface }]}>
              <Icon name="user" size={36} color={theme.textSecondary} />
            </View>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>Unregistered Visitor</Text>
            <Text style={[styles.userRole, { color: theme.textSecondary }]}>No Profile Information Available</Text>

            <View style={[styles.statusTag, { backgroundColor: theme.surface }]}>
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>Not Registered</Text>
            </View>
          </Card>

          <Card style={styles.infoCard}>
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>Registration Required</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: SPACING.md }}>
              You have not completed driver registration yet. Please register your account to view your full profile and enable Live GPS Tracking on the Map.
            </Text>

            <CustomButton
              title="Register Now (Service List)"
              onPress={() => router.push('/register')}
            />
          </Card>

          <CustomButton
            title="Back to Map"
            variant="secondary"
            onPress={() => router.push('/map')}
            style={{ marginTop: SPACING.md }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // If user is registered / approved
  const user = registeredUser;

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || 'U'}${lastName?.[0] || 'D'}`.toUpperCase();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Profile" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.avatarCard}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>{getInitials(user.name, user.lastName)}</Text>
          </View>
          <Text style={[styles.userName, { color: theme.textPrimary }]}>
            {user.name} {user.lastName}
          </Text>
          <Text style={[styles.userRole, { color: theme.textSecondary }]}>
            {user.role || 'Commercial Transport Driver'}
          </Text>

          <View style={[styles.statusTag, { backgroundColor: theme.surface }]}>
            <Icon name="checkmark" size={14} color={theme.primary} />
            <Text style={[styles.statusText, { color: theme.primary }]}>
              {user.status || 'Active Member'}
            </Text>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Profile Information</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Name</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{user.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Last Name</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{user.lastName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Mobile Number</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{user.mobileNo}</Text>
          </View>

          {user.carPlateNumber ? (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Car Plate Number</Text>
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{user.carPlateNumber}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{user.email}</Text>
          </View>
        </Card>

        <CustomButton
          title="Back to Map"
          onPress={() => router.push('/map')}
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
  avatarCard: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  userRole: {
    fontSize: 14,
    marginTop: 4,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
