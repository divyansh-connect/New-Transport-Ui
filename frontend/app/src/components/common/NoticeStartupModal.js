import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS } from '../../constants/theme';
import { translations } from '../../constants/translations';

const DEFAULT_FALLBACK_NOTICES = [
  {
    id: 'notice-1',
    title: 'High-Demand Cargo Routes Available',
    type: 'Freight Opportunity',
    date: 'Today, 10:30 AM',
    description: 'Long-haul freight opportunities open for heavy truck drivers connecting northern ports to regional fulfillment hubs. High competitive payouts.',
  },
  {
    id: 'notice-2',
    title: 'Partner Workshop Expansion Notice',
    type: 'Service Announcement',
    date: 'Yesterday',
    description: 'New verified service centers added along Highway 101 for immediate truck maintenance, oil servicing, and 24/7 breakdown assistance.',
  },
  {
    id: 'notice-3',
    title: 'Monsoon Safety & Route Guidelines',
    type: 'Safety Advisory',
    date: '2 Days Ago',
    description: 'Ensure tire tread depth and brake inspections are updated before accepting long-distance loads during heavy rainfall across coastal corridors.',
  },
];

export default function NoticeStartupModal() {
  const { theme, language, registeredUser, markAllNoticesAsRead, readNoticeIds } = useTheme();
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;

  useEffect(() => {
    let isMounted = true;
    const fetchNoticesForModal = async () => {
      try {
        const { apiFetch } = require('../../utils/api');
        const data = await apiFetch('/notices');
        let activeList = Array.isArray(data) && data.length > 0 ? data : DEFAULT_FALLBACK_NOTICES;

        // Filter ONLY unread notices that the user has not dismissed yet
        const unreadList = activeList.filter((n) => {
          const idStr = String(n.id || n.customId || '');
          return idStr && !readNoticeIds.includes(idStr);
        });

        if (isMounted) {
          if (unreadList.length > 0) {
            setNotices(unreadList);
            setCurrentIndex(0);
            setVisible(true);
          } else {
            setVisible(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          // If fallback notices are not marked read, check unread
          const unreadFallback = DEFAULT_FALLBACK_NOTICES.filter((n) => !readNoticeIds.includes(n.id));
          if (unreadFallback.length > 0) {
            setNotices(unreadFallback);
            setCurrentIndex(0);
            setVisible(true);
          } else {
            setVisible(false);
          }
        }
      }
    };

    fetchNoticesForModal();
    // Re-check periodically every 5 seconds for new incoming notices from Admin
    const interval = setInterval(fetchNoticesForModal, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [registeredUser, readNoticeIds]);

  if (!visible || notices.length === 0) {
    return null;
  }

  const currentNotice = notices[currentIndex] || notices[0];
  const isLast = currentIndex === notices.length - 1;
  const isFirst = currentIndex === 0;

  const handleNext = () => {
    if (currentIndex < notices.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleDismiss = () => {
    markAllNoticesAsRead(notices);
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Header Bar */}
          <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.headerTitleGroup}>
              <View style={[styles.iconBadge, { backgroundColor: theme.primary + '20' }]}>
                <MaterialCommunityIcons name="bullhorn-outline" size={22} color={theme.primary} />
              </View>
              <View style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>
                <Text style={[styles.modalHeading, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {isArabic ? 'فرص وإشعارات' : isUrdu ? 'مواقع aur نوٹس' : 'Opportunity & Notices'}
                </Text>
                {notices.length > 1 && (
                  <Text style={[styles.counterText, { color: theme.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                    {isArabic
                      ? `إشعار ${currentIndex + 1} من ${notices.length}`
                      : isUrdu
                        ? `نوٹس ${currentIndex + 1} از ${notices.length}`
                        : `Notice ${currentIndex + 1} of ${notices.length}`}
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Consecutive Dot Indicators */}
          {notices.length > 1 && (
            <View style={styles.dotsRow}>
              {notices.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: idx === currentIndex ? theme.primary : theme.border,
                      width: idx === currentIndex ? 20 : 6,
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* Notice Content */}
          <ScrollView
            style={styles.noticeBody}
            contentContainerStyle={{ paddingVertical: SPACING.xs }}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.tagRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={[styles.tagBadge, { backgroundColor: theme.primary + '15', color: theme.primary }]}>
                {currentNotice.type || currentNotice.category || 'Announcement'}
              </Text>
              <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                {currentNotice.date || 'Today'}
              </Text>
            </View>

            <Text style={[styles.noticeTitle, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
              {currentNotice.title}
            </Text>

            <Text style={[styles.noticeDesc, { color: theme.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {currentNotice.description || currentNotice.body || currentNotice.content}
            </Text>
          </ScrollView>

          {/* Footer Action Buttons */}
          <View style={[styles.footerRow, isRTL && { flexDirection: 'row-reverse' }]}>
            {!isFirst ? (
              <TouchableOpacity
                onPress={handlePrev}
                style={[styles.actionBtn, styles.secondaryBtn, { borderColor: theme.border }]}
              >
                <MaterialCommunityIcons
                  name={isRTL ? 'chevron-right' : 'chevron-left'}
                  size={18}
                  color={theme.textPrimary}
                />
                <Text style={[styles.btnTextSecondary, { color: theme.textPrimary }]}>
                  {isArabic ? 'السابق' : isUrdu ? 'پچھلا' : 'Previous'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleDismiss} style={styles.skipBtn}>
                <Text style={{ fontSize: 13, color: theme.textSecondary, fontWeight: '600' }}>
                  {isArabic ? 'تخطي الكل' : isUrdu ? 'سب چھوڑ دیں' : 'Skip All'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleNext}
              style={[styles.actionBtn, styles.primaryBtn, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.btnTextPrimary}>
                {isLast
                  ? (isArabic ? 'حسناً، فهمت' : isUrdu ? 'سمجھ گیا' : 'Got It')
                  : (isArabic ? 'الإشعار التالي' : isUrdu ? 'اگلا نوٹس' : 'Next Notice')}
              </Text>
              {!isLast && (
                <MaterialCommunityIcons
                  name={isRTL ? 'chevron-left' : 'chevron-right'}
                  size={18}
                  color="#FFF"
                  style={{ marginLeft: 4 }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: Math.min(screenWidth * 0.92, 480),
    maxHeight: 460,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '800',
  },
  counterText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  closeButton: {
    padding: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginVertical: SPACING.xs,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  noticeBody: {
    marginVertical: SPACING.sm,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  tagBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 11,
  },
  noticeTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginVertical: SPACING.xs,
    lineHeight: 22,
  },
  noticeDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
  },
  primaryBtn: {
    justifyContent: 'center',
  },
  secondaryBtn: {
    borderWidth: 1,
  },
  btnTextPrimary: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  btnTextSecondary: {
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});
