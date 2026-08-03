import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, ChevronDown, ChevronUp, X, Layers, Check } from 'lucide-react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { Header } from '../../src/components/common/headers/Header';
import { Card } from '../../src/components/common/cards/Card';
import { SPACING, RADIUS } from '../../src/constants/theme';
import { translations } from '../../src/constants/translations';
import { API_BASE_URL } from '../../src/utils/api';

export default function RegisterIndexScreen() {
  const { theme, language, registeredUser } = useTheme();
  const router = useRouter();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;

  const [dynamicServices, setDynamicServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/service-types`)
      .then(r => r.json())
      .then(data => {
        const filtered = data.filter(c => c.isActive && c.slug !== 'visitor');
        setDynamicServices(filtered);
      })
      .catch(err => {
        console.warn('Failed to load categories in app:', err);
        setDynamicServices([
          { name: 'Driver', slug: 'driver' },
          { name: 'Workshop', slug: 'workshop' },
          { name: 'Oil Change', slug: 'oil' },
          { name: 'charge Stations', slug: 'charge-station' }
        ]);
      });
  }, []);

  React.useEffect(() => {
    if (registeredUser) {
      const isPaid = registeredUser.paymentStatus === 'Paid' || registeredUser.paymentStatus === 'Trial' || registeredUser.paymentStatus === 'Free Bypass';
      if (!isPaid) {
        router.replace('/register/payment');
      } else {
        router.replace('/map');
      }
    }
  }, [registeredUser]);

  const handleSelectType = (type) => {
    router.push({
      pathname: '/register/form',
      params: { registrationType: type },
    });
  };

  const filteredServices = dynamicServices.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    item.slug?.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={t.serviceListTitle} showBack={true} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.heading, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>{t.selectServiceRole}</Text>

        {/* Search Input Box */}
        <View style={[styles.searchContainer, { backgroundColor: theme.surface || 'rgba(255,255,255,0.05)', borderColor: theme.border || 'rgba(255,255,255,0.1)' }]}>
          <Search size={18} color={theme.textSecondary || '#94a3b8'} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={isArabic ? 'ابحث عن الفئة...' : isUrdu ? 'زمرہ تلاش کریں...' : 'Search category / service...'}
            placeholderTextColor={theme.textSecondary || '#64748b'}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (!isDropdownOpen) setIsDropdownOpen(true);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={16} color={theme.textSecondary || '#94a3b8'} />
            </TouchableOpacity>
          )}
        </View>

        {/* Dropdown Selector Card */}
        <Card style={styles.cardContainer}>
          <TouchableOpacity
            style={[styles.dropdownHeader, isRTL && { flexDirection: 'row-reverse' }]}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            activeOpacity={0.7}
          >
            <View style={[styles.dropdownTitleGroup, isRTL && { flexDirection: 'row-reverse' }]}>
              <Layers size={18} color={theme.primary} style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }} />
              <Text style={[styles.dropdownHeaderTitle, { color: theme.textPrimary }]}>
                {isArabic ? 'اختر فئة الخدمة' : isUrdu ? 'سروس کی زمرہ منتخب کریں' : 'Service Category Dropdown'}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.countBadgeText, { color: theme.primary }]}>{filteredServices.length}</Text>
              </View>
            </View>
            {isDropdownOpen ? (
              <ChevronUp size={20} color={theme.textSecondary || '#94a3b8'} />
            ) : (
              <ChevronDown size={20} color={theme.textSecondary || '#94a3b8'} />
            )}
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdownContent}>
              {filteredServices.length > 0 ? (
                filteredServices.map((item, idx) => (
                  <TouchableOpacity
                    key={item.id || item.slug || idx}
                    style={[
                      styles.serviceRow,
                      isRTL && { flexDirection: 'row-reverse' },
                      idx === filteredServices.length - 1 && { borderBottomWidth: 0 }
                    ]}
                    onPress={() => handleSelectType(item.slug)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.serviceNameGroup, isRTL && { flexDirection: 'row-reverse' }]}>
                      {item.pinColor && (
                        <View style={[styles.colorDot, { backgroundColor: item.pinColor }]} />
                      )}
                      <Text style={[styles.serviceTitle, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
                        {item.name}
                      </Text>
                    </View>
                    <View style={[styles.checkbox, { borderColor: theme.primary }]} />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={[styles.noResultsText, { color: theme.textSecondary || '#94a3b8' }]}>
                    {isArabic ? 'لم يتم العثور على فئات' : isUrdu ? 'کوئی زمرہ نہیں ملا' : `No categories found for "${searchQuery}"`}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Card>

        {/* Visitor Option */}
        <Card style={{ marginTop: SPACING.md }}>
          <TouchableOpacity
            style={[styles.serviceRow, isRTL && { flexDirection: 'row-reverse' }, { borderBottomWidth: 0 }]}
            onPress={() => handleSelectType('Visitor')}
            activeOpacity={0.7}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.serviceTitle, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>{t.visitorLabel}</Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2, textAlign: isRTL ? 'right' : 'left' }}>
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
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    height: 46,
    borderRadius: RADIUS.md || 10,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  cardContainer: {
    paddingVertical: SPACING.xs,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  dropdownTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  countBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dropdownContent: {
    paddingTop: 4,
  },
  serviceNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
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
  noResultsContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
