import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { Card } from '../../src/components/common/cards/Card';
import { SPACING, RADIUS } from '../../src/constants/theme';
import { translations } from '../../src/constants/translations';

export default function RegisterIndexScreen() {
  const { theme, language } = useTheme();
  const router = useRouter();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';

  const services = [
    { title: t.driverLifeTracking, type: 'Driver' },
    { title: t.workshopLocation, type: 'Workshop' },
    { title: t.oilChangeLocation, type: 'Oil Change' },
    { title: t.carLocationOnly, type: 'Car Location' },
  ];

  const handleSelectType = (type) => {
    router.push({
      pathname: '/register/form',
      params: { registrationType: type },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={t.serviceListTitle} showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: theme.textPrimary, textAlign: isArabic ? 'right' : 'left' }]}>{t.selectServiceRole}</Text>

        <Card style={styles.cardContainer}>
          {services.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.serviceRow, isArabic && { flexDirection: 'row-reverse' }]}
              onPress={() => handleSelectType(item.type)}
            >
              <Text style={[styles.serviceTitle, { color: theme.textPrimary, textAlign: isArabic ? 'right' : 'left' }]}>{item.title}</Text>
              <View style={[styles.checkbox, { borderColor: theme.primary }]} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Visitor Option */}
        <Card style={{ marginTop: SPACING.md }}>
          <TouchableOpacity
            style={[styles.serviceRow, isArabic && { flexDirection: 'row-reverse' }]}
            onPress={() => handleSelectType('Visitor')}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.serviceTitle, { color: theme.textPrimary, textAlign: isArabic ? 'right' : 'left' }]}>{t.visitorLabel}</Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2, textAlign: isArabic ? 'right' : 'left' }}>
                {t.visitorAdminNote}
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
