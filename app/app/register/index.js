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

  const services = [
    { title: 'Driver (Life Tracking)', type: 'Driver' },
    { title: 'Workshop (Location only)', type: 'Workshop' },
    { title: 'Oil change (Location only)', type: 'Oil Change' },
    { title: 'Car Location (Location only)', type: 'Car Location' },
  ];

  const handleSelectType = (type) => {
    router.push({
      pathname: '/register/form',
      params: { registrationType: type },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Service List Registration" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>Select Service / Role</Text>

        <Card style={styles.cardContainer}>
          {services.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.serviceRow}
              onPress={() => handleSelectType(item.type)}
            >
              <Text style={[styles.serviceTitle, { color: theme.textPrimary }]}>{item.title}</Text>
              <View style={[styles.checkbox, { borderColor: theme.primary }]} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Visitor Option (is upto Admin to be required or no) */}
        <Card style={{ marginTop: SPACING.md }}>
          <TouchableOpacity
            style={styles.serviceRow}
            onPress={() => handleSelectType('Visitor')}
          >
            <View>
              <Text style={[styles.serviceTitle, { color: theme.textPrimary }]}>Visitor</Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                (it is upto Admin to be required or no)
              </Text>
            </View>
            <View style={[styles.checkbox, { borderColor: theme.primary }]} />
          </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  cardContainer: {
    paddingVertical: SPACING.xs,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
  },
});
