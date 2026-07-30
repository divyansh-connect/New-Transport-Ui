import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';
import { Header } from '../src/components/common/headers/Header';
import { Card } from '../src/components/common/cards/Card';
import { SPACING, RADIUS } from '../src/constants/theme';
import { translations } from '../src/constants/translations';

export default function OpportunityScreen() {
  const { theme, opportunityNotice, language } = useTheme();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;

  const defaultNoticeList = [
    opportunityNotice || {
      title: 'High-Demand Cargo Routes Available',
      category: 'Logistics Opportunity',
      type: 'Freight',
      date: 'Today, 10:30 AM',
      description: 'Long-haul freight opportunities open for heavy truck drivers connecting northern ports to regional fulfillment hubs. High competitive payouts.',
    }
  ];

  const [notices, setNotices] = useState(defaultNoticeList);

  useEffect(() => {
    let isMounted = true;
    const fetchNotices = async () => {
      try {
        const { apiFetch } = require('../src/utils/api');
        const data = await apiFetch('/notices');
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setNotices(data);
        }
      } catch (err) {
        console.log('Error loading notices on OpportunityScreen:', err);
      }
    };
    fetchNotices();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={t.opportunityTitle} showBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        {notices.map((notice, idx) => (
          <Card key={notice.id || idx} style={styles.card}>
            <View style={[styles.badgeRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={[styles.categoryBadge, { backgroundColor: theme.surface, color: theme.primary }]}>
                {notice.type || notice.category || 'Admin Announcement'}
              </Text>
              <Text style={[styles.dateText, { color: theme.textSecondary }]}>{notice.date || 'Just Now'}</Text>
            </View>
            <Text style={[styles.title, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>{notice.title}</Text>
            <Text style={[styles.desc, { color: theme.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {notice.description || notice.body || notice.content}
            </Text>
          </Card>
        ))}

        <View style={[styles.noteBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.noteHeader, { color: theme.primary, textAlign: isRTL ? 'right' : 'left' }]}>{t.noticeInfo}</Text>
          <Text style={[styles.noteText, { color: theme.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {t.noticeDesc}
          </Text>
        </View>
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
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  card: {
    marginBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  dateText: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: SPACING.xs,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
  },
  noteBox: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginTop: SPACING.xs,
  },
  noteHeader: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
