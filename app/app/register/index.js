import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { Card } from '../../src/components/common/cards/Card';
import { SPACING, RADIUS } from '../../src/constants/theme';

export default function RegisterIndexScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const registrationTypes = [
    { title: 'Driver', subtitle: 'Heavy & Commercial Vehicle Operator', icon: '🚛', type: 'Driver' },
    { title: 'Workshop', subtitle: 'Automotive Repair & Maintenance Hub', icon: '🛠️', type: 'Workshop' },
    { title: 'Oil Change', subtitle: 'Lubricant & Service Provider', icon: '🛢️', type: 'Oil Change' },
    { title: 'Car Location', subtitle: 'Fleet & Parking Location Node', icon: '📍', type: 'Car Location' },
    { title: 'Visitor', subtitle: 'General Access & Location Viewer', icon: '👤', type: 'Visitor' },
  ];

  const handleSelectType = (type) => {
    router.push({
      pathname: '/register/form',
      params: { registrationType: type },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Registration Type" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Choose Account Type</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Select your role to proceed with registration details.
        </Text>

        {registrationTypes.map((item) => (
          <TouchableOpacity
            key={item.type}
            activeOpacity={0.8}
            onPress={() => handleSelectType(item.type)}
          >
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <View style={[styles.iconBox, { backgroundColor: theme.surface }]}>
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                  <Text style={[styles.cardSub, { color: theme.textSecondary }]}>{item.subtitle}</Text>
                </View>
                <Text style={{ color: theme.primary, fontSize: 20 }}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  card: {
    marginBottom: SPACING.sm,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 12,
    marginTop: 2,
  },
});
