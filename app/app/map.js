import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { useTheme } from '../src/context/ThemeContext';
import { Icon } from '../src/components/common/Icon';
import { RADIUS, SPACING } from '../src/constants/theme';
import { translations } from '../src/constants/translations';

export default function MapScreen() {
  const { theme, language, registeredUser } = useTheme();
  const router = useRouter();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
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
      title: 'Car Location Node',
      description: 'Fleet Parking, Recovery & Terminal Depot',
      lat: userLocation.latitude + 0.020,
      lng: userLocation.longitude - 0.010,
      type: 'location',
      icon: 'car',
      contact: '+966 51 654 3210',
      address: 'Northern Ring Road Hub 8',
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
        .own-pin {
          background: #2563EB;
          color: white;
          padding: 7px 14px;
          border-radius: 50px;
          font-family: -apple-system, Arial, sans-serif;
          font-size: 13px;
          font-weight: 700;
          border: 2px solid rgba(255,255,255,0.8);
          box-shadow: 0 3px 12px rgba(37,99,235,0.55);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 5px;
          letter-spacing: 0.2px;
        }
        .service-pin {
          background: #0f1d2e;
          color: #e2e8f0;
          padding: 7px 13px;
          border-radius: 50px;
          font-family: -apple-system, Arial, sans-serif;
          font-size: 12px;
          font-weight: 600;
          border: 1.5px solid rgba(148,163,184,0.35);
          box-shadow: 0 3px 10px rgba(0,0,0,0.45);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 5px;
          letter-spacing: 0.2px;
        }
        .service-pin .pin-icon {
          font-size: 14px;
          line-height: 1;
        }
        .own-pin .pin-icon {
          font-size: 14px;
          line-height: 1;
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

        // 1. Own Live GPS Pin - pill style matching reference UI
        var ownIcon = L.divIcon({
          className: '',
          html: '<div class="own-pin"><span class="pin-icon">📍</span> Own Location</div>',
          iconSize: null,
          iconAnchor: [62, 18]
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

        // 2. Service Hubs - dark navy pill style matching reference UI
        var isDriver = '${userRole}' === 'Driver';
        if (isDriver) {
          var services = ${JSON.stringify(serviceNodes)};
          var pinConfig = {
            workshop:  { icon: '🔧',  label: 'Workshop Hub' },
            oil:       { icon: '🛢️', label: 'Oil Change Center' },
            location:  { icon: '🚗', label: 'Car Location Node' }
          };
          services.forEach(function(s) {
            var cfg = pinConfig[s.type] || { icon: '&#128205;', label: s.title };
            var sIcon = L.divIcon({
              className: '',
              html: '<div class="service-pin"><span class="pin-icon">' + cfg.icon + '</span> ' + cfg.label + '</div>',
              iconSize: null,
              iconAnchor: [70, 18]
            });
            var sMarker = L.marker([s.lat, s.lng], { icon: sIcon }).addTo(map);
            sMarker.on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify(s));
            });
          });
        }
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { backgroundColor: theme.cardBackground, borderColor: theme.border }, isArabic && { flexDirection: 'row-reverse' }]}>
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
                  {isArabic ? 'دخول' : 'Login'}
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
              ? (isArabic ? 'بانتظار موافقة المدير — الخدمات غير مفعّلة بعد' : 'Pending Admin Approval — Services locked')
              : (isArabic ? 'وضع الزائر — يرى موقعه فقط' : 'Visitor Mode — Your location only')}
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
              {isArabic ? '⏳ بانتظار موافقة المدير — اضغط للتحقق' : '⏳ Pending Admin Approval — tap to check'}
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
            <View style={[styles.modalHeader, isArabic && { flexDirection: 'row-reverse' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.modalIconBox, { backgroundColor: theme.surface }]}>
                  <Icon name={selectedService?.icon || 'truck'} size={20} color={theme.primary} />
                </View>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary, textAlign: isArabic ? 'right' : 'left' }]}>{selectedService?.title}</Text>
                  <Text style={[styles.modalSubtitle, { color: theme.primary }]}>
                    {selectedService?.type?.toUpperCase()} {isArabic ? 'التفاصيل' : 'DETAILS'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedService(null)} style={styles.closeBtn}>
                <Icon name="x" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.modalDesc, { color: theme.textSecondary, textAlign: isArabic ? 'right' : 'left' }]}>
                {selectedService?.description}
              </Text>
              <View style={[styles.infoRow, { backgroundColor: theme.surface }, isArabic && { flexDirection: 'row-reverse' }]}>
                <Icon name="map-pin" size={16} color={theme.primary} />
                <Text style={[styles.infoText, { color: theme.textPrimary }]}>{selectedService?.address}</Text>
              </View>
              <View style={[styles.infoRow, { backgroundColor: theme.surface }, isArabic && { flexDirection: 'row-reverse' }]}>
                <Icon name="phone" size={16} color={theme.primary} />
                <Text style={[styles.infoText, { color: theme.textPrimary }]}>{selectedService?.contact}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.modalActionBtn, { backgroundColor: theme.primary }]}
              onPress={() => setSelectedService(null)}
            >
              <Text style={styles.modalActionText}>{isArabic ? 'إغلاق' : 'Close Details'}</Text>
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
