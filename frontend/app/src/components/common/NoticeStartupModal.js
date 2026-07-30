import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { RADIUS, SPACING } from '../../constants/theme';
import { Icon } from './Icon';

const { width } = Dimensions.get('window');

// Module-level session flag (persists only in memory during app run, resets on app re-launch)
let sessionDismissed = false;

const DEFAULT_FALLBACK_NOTICES = [
  {
    id: 'notice-1',
    title: 'High-Demand Cargo Routes Available',
    type: 'Freight',
    priority: 'High',
    location: 'Northern Ports',
    date: '24 Jul 2026',
    description: 'Long-haul freight opportunities open for heavy truck drivers connecting northern ports. Premium rates applied for weekend dispatch.',
    isVisible: true
  },
  {
    id: 'notice-2',
    title: 'Partner Workshop Expansion Notice',
    type: 'Partnership',
    priority: 'Normal',
    location: 'All Zones',
    date: '21 Jul 2026',
    description: 'Register oil change centers & workshops for automatic dispatch requests. New API endpoints available for third-party systems.',
    isVisible: true
  },
  {
    id: 'notice-3',
    title: 'Monsoon Safety Guidelines',
    type: 'Safety',
    priority: 'Critical',
    location: 'System Wide',
    date: '18 Jul 2026',
    description: 'Mandatory speed limits enforced across all active tracking nodes due to heavy rainfall warnings.',
    isVisible: true
  }
];

export default function NoticeStartupModal() {
  const { theme, language, registeredUser } = useTheme();
  const router = useRouter();
  const [activeNotices, setActiveNotices] = useState([]);
  const [selectedNoticeIndex, setSelectedNoticeIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;

  useEffect(() => {
    // REQUIREMENT: Only show popup for logged-in drivers/users, NOT on logout/guest mode
    if (!registeredUser || sessionDismissed) {
      setIsVisible(false);
      return;
    }

    let isMounted = true;
    const fetchActiveNotices = async () => {
      try {
        const { apiFetch } = require('../../utils/api');
        const data = await apiFetch('/notices');
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setActiveNotices(data);
            setSelectedNoticeIndex(0);
            setIsVisible(true);
          } else {
            setActiveNotices(DEFAULT_FALLBACK_NOTICES);
            setSelectedNoticeIndex(0);
            setIsVisible(true);
          }
        }
      } catch (err) {
        console.log('Fallback startup notices loaded:', err);
        if (isMounted) {
          setActiveNotices(DEFAULT_FALLBACK_NOTICES);
          setSelectedNoticeIndex(0);
          setIsVisible(true);
        }
      }
    };

    fetchActiveNotices();
    return () => {
      isMounted = false;
    };
  }, [registeredUser]);

  // If not logged in, or session dismissed, or no notices -> render nothing
  if (!registeredUser || sessionDismissed || !isVisible || activeNotices.length === 0) {
    return null;
  }

  const currentNotice = activeNotices[selectedNoticeIndex] || activeNotices[0];

  // Professional Single-Click Close Handler: Closes popup once for the entire session
  const handleCloseAll = () => {
    sessionDismissed = true;
    setIsVisible(false);
  };

  const handleOpenNoticeBoard = () => {
    handleCloseAll();
    router.push('/opportunity');
  };

  const modalTitleText = isArabic ? 'إعلانات جديدة' : isUrdu ? 'نئی اطلاعات' : 'Active Announcements';
  const viewAllText = isArabic ? 'عرض الكل ➔' : isUrdu ? 'سب دیکھیں ➔' : 'View All ➔';
  const gotItText = isArabic ? 'تم (إغلاق)' : isUrdu ? 'ٹھیک ہے (بند کریں)' : 'Got It (Close)';

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={handleCloseAll}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.cardBackground || '#1e293b', borderColor: theme.border || '#334155' }]}>
          {/* Header */}
          <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.iconBox, { backgroundColor: theme.surface || '#0f172a' }]}>
              <Icon name="bell" size={20} color={theme.primary || '#3b82f6'} />
            </View>
            <View style={{ flex: 1, marginHorizontal: 8 }}>
              <Text style={[styles.headerSub, { color: theme.primary || '#3b82f6', textAlign: isRTL ? 'right' : 'left' }]}>
                {modalTitleText}
              </Text>
              <Text style={[styles.counterText, { color: theme.textSecondary || '#94a3b8', textAlign: isRTL ? 'right' : 'left' }]}>
                {activeNotices.length > 1 
                  ? (isArabic ? `${activeNotices.length} إشعارات نشطة` : isUrdu ? `${activeNotices.length} فعال اطلاعات` : `${activeNotices.length} Active Notices Available`)
                  : (isArabic ? 'إشعار 1 جديد' : isUrdu ? '1 نئی اطلاع' : '1 New Notice')}
              </Text>
            </View>
            <TouchableOpacity onPress={handleCloseAll} style={styles.closeIconBtn}>
              <Icon name="x" size={20} color={theme.textSecondary || '#94a3b8'} />
            </TouchableOpacity>
          </View>

          {/* If multiple notices, show professional tab pills */}
          {activeNotices.length > 1 && (
            <View style={[styles.tabContainer, isRTL && { flexDirection: 'row-reverse' }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                {activeNotices.map((n, idx) => (
                  <TouchableOpacity
                    key={n.id || idx}
                    onPress={() => setSelectedNoticeIndex(idx)}
                    style={[
                      styles.tabPill,
                      {
                        backgroundColor: idx === selectedNoticeIndex ? (theme.primary || '#3b82f6') : (theme.surface || '#0f172a'),
                        borderColor: idx === selectedNoticeIndex ? (theme.primary || '#3b82f6') : (theme.border || '#334155')
                      }
                    ]}
                  >
                    <Text style={[
                      styles.tabPillText,
                      { color: idx === selectedNoticeIndex ? '#FFFFFF' : (theme.textSecondary || '#94a3b8') }
                    ]}>
                      #{idx + 1} {n.type || 'Notice'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Badges & Meta info */}
          <View style={[styles.metaRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.badge, { backgroundColor: theme.surface || '#0f172a', color: theme.primary || '#3b82f6' }]}>
              {currentNotice.type || 'Notice'}
            </Text>
            {currentNotice.priority && (
              <Text style={[
                styles.badge,
                {
                  backgroundColor: currentNotice.priority === 'Critical' ? '#fee2e2' : currentNotice.priority === 'High' ? '#fef3c7' : (theme.surface || '#0f172a'),
                  color: currentNotice.priority === 'Critical' ? '#dc2626' : currentNotice.priority === 'High' ? '#d97706' : (theme.primary || '#3b82f6')
                }
              ]}>
                {currentNotice.priority}
              </Text>
            )}
            <Text style={[styles.dateText, { color: theme.textSecondary || '#94a3b8' }]}>
              {currentNotice.date || 'Today'}
            </Text>
          </View>

          {/* Notice Content Scrollable */}
          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            <Text style={[styles.noticeTitle, { color: theme.textPrimary || '#f8fafc', textAlign: isRTL ? 'right' : 'left' }]}>
              {currentNotice.title}
            </Text>

            {currentNotice.location && currentNotice.location !== 'All Zones' && (
              <View style={[styles.locationRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Icon name="map-pin" size={14} color={theme.primary || '#3b82f6'} />
                <Text style={[styles.locationText, { color: theme.textSecondary || '#94a3b8' }]}>
                  {currentNotice.location}
                </Text>
              </View>
            )}

            <Text style={[styles.noticeDesc, { color: theme.textSecondary || '#94a3b8', textAlign: isRTL ? 'right' : 'left' }]}>
              {currentNotice.description}
            </Text>
          </ScrollView>

          {/* Footer Action Buttons */}
          <View style={[styles.footerRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleOpenNoticeBoard}
              style={[styles.secondaryActionBtn, { borderColor: theme.border || '#334155' }]}
            >
              <Text style={[styles.secondaryBtnText, { color: theme.primary || '#3b82f6' }]}>{viewAllText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCloseAll}
              style={[styles.primaryActionBtn, { backgroundColor: theme.primary || '#3b82f6' }]}
            >
              <Text style={styles.primaryBtnText}>{gotItText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    zIndex: 99999,
    elevation: 99,
  },
  card: {
    width: Math.min(width * 0.9, 440),
    maxHeight: '80%',
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSub: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '600',
  },
  closeIconBtn: {
    padding: 4,
  },
  tabContainer: {
    marginBottom: 10,
  },
  tabScroll: {
    gap: 6,
  },
  tabPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  tabPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  dateText: {
    fontSize: 11,
    marginLeft: 'auto',
  },
  contentScroll: {
    maxHeight: 200,
    marginBottom: 16,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noticeDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  secondaryActionBtn: {
    flex: 1,
    height: 42,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  primaryActionBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
