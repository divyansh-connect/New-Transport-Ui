import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { useTheme } from '../src/context/ThemeContext';
import { Icon } from '../src/components/common/Icon';
import { RADIUS, SPACING } from '../src/constants/theme';
import { translations } from '../src/constants/translations';

export default function MapScreen() {
  const { theme, language, registeredUser, showAlert } = useTheme();
  const router = useRouter();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  // ── Auto-detect role from stored profile ──────────────────────────────────
  // Visitor  = no registeredUser
  // Pending  = registeredUser exists but status !== 'Approved'
  // Driver   = registeredUser exists AND status === 'Approved'
  const isApprovedDriver = registeredUser?.status === 'Approved';
  const isPending = registeredUser && !isApprovedDriver;
  // For Leaflet JS injection we still need a string role
  const userRole = isApprovedDriver ? 'Driver' : 'Visitor';
  
  // Real GPS Device Location State (Default Riyadh Center fallback until permission granted)
  const [userLocation, setUserLocation] = useState({
    latitude: 24.7136,
    longitude: 46.6753,
  });
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // Request Device Live GPS Permission on App Mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
        let currentLocation = await Location.getCurrentPositionAsync({});
        if (currentLocation && currentLocation.coords) {
          setUserLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
        }
      }
    })();
  }, []);

  // Services / Places
  const serviceNodes = [
    {
      id: 2,
      title: 'Workshop Hub',
      description: 'Commercial Heavy Maintenance & Repair Station',
      lat: userLocation.latitude + 0.015,
      lng: userLocation.longitude + 0.012,
      type: 'workshop',
      icon: 'wrench',
      contact: '+966 55 987 6543',
      address: 'Industrial District Gate 4',
    },
    {
      id: 3,
      title: 'Oil Change Center',
      description: 'Quick Lube & Fleet Synthetic Oil Fluids',
      lat: userLocation.latitude - 0.012,
      lng: userLocation.longitude - 0.015,
      type: 'oil',
      icon: 'fuel',
      contact: '+966 54 321 0987',
      address: 'Expressway Service Station Exit 11',
    },
    {
      id: 4,
      title: 'Active Heavy Truck (Volvo FH16)',
      description: 'Available for Goods & Freight Transport. Capacity: 25 Tons.',
      lat: userLocation.latitude + 0.020,
      lng: userLocation.longitude - 0.010,
      type: 'location',
      icon: 'truck',
      contact: '+966 51 654 3210',
      address: 'Northern Ring Road Freight Hub',
    },
    {
      id: 5,
      title: 'Active Recovery Truck (Flatbed)',
      description: 'Vehicle Towing & Roadside Recovery Service.',
      lat: userLocation.latitude - 0.015,
      lng: userLocation.longitude + 0.018,
      type: 'location',
      icon: 'car',
      contact: '+966 50 888 9999',
      address: 'King Fahd Road Service Hub',
    },
  ];

  // Live Leaflet HTML Template
  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; height: 100%; width: 100%; }
        #map { height: 100%; width: 100%; }
        .leaflet-div-icon { background: transparent; border: none; }
        .own-dot {
          width: 14px;
          height: 14px;
          background: #2563EB;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
          animation: own-pulse 2s infinite ease-in-out;
          box-sizing: border-box;
        }
        .driver-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #0f1d2e;
          border: 1.5px solid #3b82f6;
          box-shadow: 0 3px 10px rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: car-pulse 2s infinite ease-in-out;
        }
        .driver-circle .svg-icon {
          width: 14px;
          height: 14px;
          color: #e2e8f0;
        }
        .poi-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #0f1d2e;
          border: 1.5px solid rgba(148,163,184,0.35);
          box-shadow: 0 3px 10px rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .poi-circle .svg-icon {
          width: 13px;
          height: 13px;
          color: #e2e8f0;
        }
        @keyframes car-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7), 0 3px 10px rgba(0,0,0,0.45);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0), 0 3px 10px rgba(0,0,0,0.45);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0), 0 3px 10px rgba(0,0,0,0.45);
          }
        }
        @keyframes own-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.6), 0 2px 5px rgba(0, 0, 0, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(37, 99, 235, 0), 0 2px 5px rgba(0, 0, 0, 0.4);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0), 0 2px 5px rgba(0, 0, 0, 0.4);
          }
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var userLat = ${userLocation.latitude};
        var userLng = ${userLocation.longitude};

        var map = L.map('map', { zoomControl: true }).setView([userLat, userLng], 13);
        
        // English-Only Map Labels - OpenStreetMap English Tile Server
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // 1. Own Live GPS Pin - Blue Dot style matching Google Maps
        var ownIcon = L.divIcon({
          className: '',
          html: '<div class="own-dot"></div>',
          iconSize: null,
          iconAnchor: [7, 7]
        });
        
        var ownMarker = L.marker([userLat, userLng], { icon: ownIcon }).addTo(map);
        ownMarker.on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            title: 'Own Location',
            description: 'Your Real-Time Device GPS Position',
            type: 'you',
            icon: 'navigation',
            address: 'Device Live GPS Telemetry',
            contact: 'Active Device Session'
          }));
        });

        // 2. SVG Icons definitions
        var carSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>';
        var wrenchSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';
        var oilSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>';

        // 3. Service Hubs & Active Drivers
        var isDriver = '${userRole}' === 'Driver';
        var services = ${JSON.stringify(serviceNodes)};
        var pinConfig = {
          workshop:  { icon: wrenchSvg, isPOI: true },
          oil:       { icon: oilSvg,    isPOI: true },
          location:  { icon: carSvg,    isPOI: false }
        };
        services.forEach(function(s) {
          // Visitors see Active Drivers (type === 'location'). Approved Drivers see everything (workshops, oil, location).
          if (s.type === 'location' || isDriver) {
            var cfg = pinConfig[s.type] || { icon: wrenchSvg, isPOI: true };
            var htmlContent = '';
            
            if (cfg.isPOI) {
              htmlContent = '<div class="poi-circle">' + cfg.icon + '</div>';
            } else {
              htmlContent = '<div class="driver-circle">' + cfg.icon + '</div>';
            }
            
            var sIcon = L.divIcon({
              className: '',
              html: htmlContent,
              iconSize: null,
              iconAnchor: [13, 13]
            });
            var sMarker = L.marker([s.lat, s.lng], { icon: sIcon }).addTo(map);
            sMarker.on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify(s));
            });
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { backgroundColor: theme.cardBackground, borderColor: theme.border }, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="truck" size={20} color={theme.primary} />
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{t.mapTitle}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {!registeredUser ? (
            // ── Guest: show Register + Login buttons ──
            <>
              <TouchableOpacity
                style={[styles.quickRegisterBtn, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/register')}
              >
                <Icon name="user" size={12} color="#FFF" />
                <Text style={styles.quickRegisterText}>{t.register}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleChip, { backgroundColor: theme.surface }]}
                onPress={() => router.push('/login')}
              >
                <Text style={[styles.roleText, { color: theme.primary }]}>
                  {isArabic ? 'دخول' : isUrdu ? 'لاگ ان' : 'Login'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            // ── Registered user: show name chip ──
            <TouchableOpacity
              style={[styles.roleChip, { backgroundColor: isApprovedDriver ? theme.primary : theme.surface }]}
              onPress={() => router.push('/profile')}
            >
              <Text style={[styles.roleText, { color: isApprovedDriver ? '#FFF' : theme.primary }]}>
                {registeredUser.name?.charAt(0)}{registeredUser.lastName?.charAt(0)}
                {' '}{isApprovedDriver ? '✓' : '⏳'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/menu')}
          >
            <Icon name="settings" size={18} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notice Banner */}
      <View style={[styles.noticeBanner, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Text style={[styles.noticeText, { color: theme.textPrimary }]}>
          {isApprovedDriver
            ? t.allServicesVisible
            : isPending
              ? (isArabic ? 'بانتظار موافقة المدير — الخدمات غير مفعّلة بعد' : isUrdu ? 'ایڈمن کی منظوری کا انتظار ہے — سروسز مقفل ہیں' : 'Pending Admin Approval — Services locked')
              : (isArabic ? 'وضع الزائر — عرض السائقين المتاحين' : isUrdu ? 'وزیٹر موڈ — دستیاب ڈرائیورز دکھائے جا رہے ہیں' : 'Visitor Mode — Viewing Active Drivers')}
        </Text>
      </View>

      {/* Live Map Canvas */}
      <View style={styles.mapCanvas}>
        <WebView
          originWhitelist={['*']}
          source={{ html: leafletHTML }}
          style={styles.webView}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              setSelectedService(data);
            } catch (e) {
              console.log(e);
            }
          }}
        />

        {/* Life Tracking Switch — only for Approved Drivers */}
        {isApprovedDriver && (
          <View style={[styles.lifeTrackingBox, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={[styles.trackingLabel, { color: theme.textPrimary }]}>{t.lifeTracking}</Text>
            <Switch
              value={isLiveTracking}
              onValueChange={setIsLiveTracking}
              trackColor={{ false: theme.border, true: theme.primary }}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
            <Text style={[styles.statusText, { color: isLiveTracking ? theme.primary : theme.textSecondary }]}>
              {isLiveTracking ? t.on : t.off}
            </Text>
          </View>
        )}

        {/* Pending Banner — shown while waiting for approval */}
        {isPending && (
          <TouchableOpacity
            style={[styles.pendingBanner, { backgroundColor: '#92400e' }]}
            onPress={() => router.push('/register/pending')}
          >
            <Text style={styles.pendingText}>
              {isArabic ? '⏳ بانتظار موافقة المدير — اضغط للتحقق' : isUrdu ? '⏳ ایڈمن کی منظوری کا انتظار ہے — چیک کرنے کے لیے کلک کریں' : '⏳ Pending Admin Approval — tap to check'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Custom Service Details Popup Modal */}
      <Modal
        visible={!!selectedService}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedService(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={[styles.modalHeader, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.modalIconBox, { backgroundColor: theme.surface }]}>
                  <Icon name={selectedService?.icon || 'truck'} size={20} color={theme.primary} />
                </View>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>{selectedService?.title}</Text>
                  <Text style={[styles.modalSubtitle, { color: theme.primary }]}>
                    {selectedService?.type?.toUpperCase()} {isArabic ? 'التفاصيل' : isUrdu ? 'تفصیلات' : 'DETAILS'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedService(null)} style={styles.closeBtn}>
                <Icon name="x" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.modalDesc, { color: theme.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {selectedService?.description}
              </Text>
              <View style={[styles.infoRow, { backgroundColor: theme.surface }, isRTL && { flexDirection: 'row-reverse' }]}>
                <Icon name="map-pin" size={16} color={theme.primary} />
                <Text style={[styles.infoText, { color: theme.textPrimary }]}>{selectedService?.address}</Text>
              </View>
              <View style={[styles.infoRow, { backgroundColor: theme.surface }, isRTL && { flexDirection: 'row-reverse' }]}>
                <Icon name="phone" size={16} color={theme.primary} />
                <Text style={[styles.infoText, { color: theme.textPrimary }]}>{selectedService?.contact}</Text>
              </View>

              {/* Booking & Action Buttons for Customer/Visitor */}
              <View style={{ gap: 8, marginTop: 12 }}>
                <TouchableOpacity
                  style={[styles.modalActionBtn, { backgroundColor: '#16a34a', flexDirection: 'row', justifyContent: 'center', gap: 6 }]}
                  onPress={() => {
                    const phone = (selectedService?.contact || '').replace(/[^0-9+]/g, '');
                    Linking.openURL(`tel:${phone || '+966501234567'}`);
                  }}
                >
                  <Icon name="phone" size={16} color="#FFF" />
                  <Text style={styles.modalActionText}>
                    {isArabic ? 'الاتصال بالسائق / الخدمة' : isUrdu ? 'ڈرائیور / سروس کو کال کریں' : 'Call Driver / Service'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalActionBtn, { backgroundColor: '#25D366', flexDirection: 'row', justifyContent: 'center', gap: 6 }]}
                  onPress={() => {
                    const phone = (selectedService?.contact || '').replace(/[^0-9+]/g, '');
                    const text = encodeURIComponent('Hello, I want to book transport / hire vehicle service.');
                    Linking.openURL(`https://wa.me/${phone.replace('+', '') || '966501234567'}?text=${text}`);
                  }}
                >
                  <Icon name="chat" size={16} color="#FFF" />
                  <Text style={styles.modalActionText}>
                    {isArabic ? 'واتساب - حجز السائق' : isUrdu ? 'واٹس ایپ - ڈرائیور بک کریں' : 'WhatsApp - Book Driver'}
                  </Text>
                </TouchableOpacity>

                {selectedService?.type === 'location' && (
                  <TouchableOpacity
                    style={[styles.modalActionBtn, { backgroundColor: theme.primary, flexDirection: 'row', justifyContent: 'center', gap: 6 }]}
                    onPress={() => {
                      showAlert(
                        isArabic ? 'طلب حجز الرحلة' : isUrdu ? 'سفر کی بکنگ بھیجی گئی' : 'Transport Booking Sent',
                        isArabic
                          ? 'تم إرسال طلب الحجز إلى السائق. سيتم التواصل معك فوراً.'
                          : isUrdu
                            ? `بکنگ کی درخواست ${selectedService?.title} کو بھیج دی گئی ہے۔ ڈرائیور جلد ہی آپ سے رابطہ کرے گا!`
                            : `Booking request sent to ${selectedService?.title}. Driver will contact you shortly!`,
                        [{ text: isArabic ? 'موافق' : isUrdu ? 'ٹھیک ہے' : 'OK', onPress: () => setSelectedService(null) }]
                      );
                    }}
                  >
                    <Icon name="truck" size={16} color="#FFF" />
                    <Text style={styles.modalActionText}>
                      {isArabic ? 'تأكيد طلب الشاحنة / الحجز' : isUrdu ? 'ابھی گاڑی / بکنگ کی درخواست کریں' : 'Request Truck / Hire Now'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.modalActionBtn, { backgroundColor: theme.surface, marginTop: 10, borderWidth: 1, borderColor: theme.border }]}
              onPress={() => setSelectedService(null)}
            >
              <Text style={[styles.modalActionText, { color: theme.textSecondary }]}>{isArabic ? 'إغلاق' : isUrdu ? 'بند کریں' : 'Close'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    marginHorizontal: SPACING.sm,
    marginTop: SPACING.xs,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  quickRegisterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  quickRegisterText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  roleChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  settingsButton: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  noticeBanner: {
    marginHorizontal: SPACING.sm,
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 2,
  },
  noticeText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  pendingBanner: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    elevation: 8,
    zIndex: 20,
  },
  pendingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  mapCanvas: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    marginTop: 8,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  lifeTrackingBox: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    elevation: 6,
    gap: 6,
    zIndex: 10,
  },
  trackingLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    width: '100%',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.md,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalActionBtn: {
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  modalActionText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
