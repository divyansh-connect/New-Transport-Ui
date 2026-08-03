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
import { API_BASE_URL } from '../src/utils/api';

export default function MapScreen() {
  const { theme, language, registeredUser, showAlert, unreadNoticeCount, markAllNoticesAsRead, updateUnreadNotices } = useTheme();
  const router = useRouter();
  const t = translations[language] || translations.English;
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  // ── Platform Settings from Admin DB ──────────────────────────────────────────
  const [platformSettings, setPlatformSettings] = useState({
    showVisitorServices: true,
    paymentRequiredFor: { driver: true, workshop: false, visitor: false, oilchange: false },
    freeTrialEnabled: false,
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then(r => r.json())
      .then(data => {
        if (data && data.paymentRequiredFor !== undefined) {
          setPlatformSettings(data);
        }
      })
      .catch(err => console.log('Could not load platform settings:', err));
  }, []);

  // ── Auto-detect role from stored profile ──────────────────────────────────
  // Visitor  = no registeredUser
  // Pending  = registeredUser exists but status !== 'Approved'
  // Driver   = registeredUser exists AND status === 'Approved'
  const isApprovedDriver = registeredUser?.status === 'Approved';
  const isPending = registeredUser && !isApprovedDriver;
  const currentUserRole = (registeredUser?.role || 'visitor').toLowerCase();
  // For Leaflet JS injection we still need a string role
  const userRole = isApprovedDriver ? 'Driver' : 'Visitor';
  
  // Real GPS Device Location State
  const [userLocation, setUserLocation] = useState({
    latitude: 22.7196,
    longitude: 75.8577,
  });
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [activePins, setActivePins] = useState([]);

  // Request Device Live GPS Permission on App Mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
        try {
          let lastKnown = await Location.getLastKnownPositionAsync({});
          if (lastKnown && lastKnown.coords) {
            setUserLocation({
              latitude: lastKnown.coords.latitude,
              longitude: lastKnown.coords.longitude,
            });
          }
        } catch (e) {}
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

  // Fetch active pins from MySQL backend
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const { apiFetch } = require('../src/utils/api');
        const pins = await apiFetch('/users/pins');
        const nodes = pins.map((p, idx) => ({
          id: p.id || idx,
          title: p.name,
          description: p.role === 'driver' 
            ? `Active Driver (${p.carPlateNumber || 'N/A'})` 
            : `${p.name} (${p.categoryName || 'Service Station'})`,
          lat: parseFloat(p.latitude),
          lng: parseFloat(p.longitude),
          type: p.role === 'driver' ? 'location' : p.role,
          icon: p.iconName || (p.role === 'driver' ? 'car' : p.role === 'workshop' ? 'wrench' : 'fuel'),
          color: p.pinColor || '#2563EB',
          contact: 'Active Node',
          address: 'Synchronized live GPS coordinates'
        }));
        setActivePins(nodes);
      } catch (err) {
        console.log('Error fetching active pins:', err);
      }
    };

    fetchPins();
    const interval = setInterval(fetchPins, 12000);
    return () => clearInterval(interval);
  }, []);

  // Upload own live location coordinates to MySQL backend
  useEffect(() => {
    if (!isApprovedDriver || !isLiveTracking) return;

    const uploadLocation = async () => {
      try {
        const { apiFetch } = require('../src/utils/api');
        await apiFetch('/users/coordinates', {
          method: 'PUT',
          body: JSON.stringify({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          })
        });
      } catch (err) {
        console.log('Error uploading coordinates:', err);
      }
    };

    uploadLocation();
    const interval = setInterval(uploadLocation, 10000);
    return () => clearInterval(interval);
  }, [isApprovedDriver, isLiveTracking, userLocation]);

  // Use live pins from backend DB — activePins already populated from /api/users/pins
  // Falls back to empty array if no approved users with coordinates exist yet
  const serviceNodes = activePins.length > 0 ? activePins : [];

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
        
        /* 1. Google Maps style Navigation Arrow */
        .own-arrow-container {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .own-arrow-pulse {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.25);
          border: 1px solid rgba(37, 99, 235, 0.4);
          animation: arrow-glow 2s infinite ease-in-out;
          z-index: 1;
          box-sizing: border-box;
        }
        .own-arrow-container .arrow-svg {
          width: 22px;
          height: 22px;
          z-index: 2;
          filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.35));
          transform: rotate(45deg); /* Tilted arrow like Google Maps */
        }
        @keyframes arrow-glow {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        /* 2. Driver Icon (🚗 Emoji, No Background) */
        .driver-car-marker {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.35));
        }

        /* 3. Small POI Circles (Workshop & Oil) */
        .poi-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #1e293b;
          border: 1.5px solid #94a3b8;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .poi-circle .svg-icon {
          width: 11px;
          height: 11px;
          color: #f8fafc;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var userLat = ${userLocation.latitude};
        var userLng = ${userLocation.longitude};

        var map = L.map('map', { zoomControl: true }).setView([userLat, userLng], 13);
        
        // English-Only Map Labels - CartoDB Voyager International Tile Server
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: '© OpenStreetMap contributors © CARTO'
        }).addTo(map);

        // 1. Own Live GPS Pin - Google Maps style Tilted Arrow with blue border and Pulse
        var ownIcon = L.divIcon({
          className: '',
          html: '<div class="own-arrow-container"><div class="own-arrow-pulse"></div><svg class="arrow-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563EB" stroke="#3B82F6" stroke-width="2.5"><path d="M12 2L2 22l10-6 10 6z"/></svg></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
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
        var carSvg = '🚗';
        var wrenchSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';
        var oilSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>';

        // 3. Service Hubs & Active Drivers (ROLE-SPECIFIC FILTERING FOR APPROVED ACCOUNTS)
        var isApprovedDriver = ${isApprovedDriver ? 'true' : 'false'};
        var currentUserRole = '${currentUserRole}';
        var services = ${JSON.stringify(activePins.length > 0 ? activePins : serviceNodes)};
        var usedCoords = {};
        services.forEach(function(s) {
          // Strictly require approved user account to view pins
          if (!isApprovedDriver) return;

          // Non-driver service roles should only see pins matching their own category type
          if (currentUserRole !== 'driver' && currentUserRole !== 'admin' && currentUserRole !== s.type) return;

            var lat = parseFloat(s.lat);
            var lng = parseFloat(s.lng);
            if (isNaN(lat) || isNaN(lng)) return;

            // Shift duplicate coordinates slightly to prevent overlay overlaps
            var coordKey = lat.toFixed(5) + ',' + lng.toFixed(5);
            if (usedCoords[coordKey]) {
              var count = usedCoords[coordKey];
              var angle = (count * 2 * Math.PI) / 8; // arrange in a small circle around central point
              var offset = 0.00018 * count; // shift distance step
              lat += Math.cos(angle) * offset;
              lng += Math.sin(angle) * offset;
              usedCoords[coordKey] = count + 1;
            } else {
              usedCoords[coordKey] = 1;
            }

            var htmlContent = '';
            var anchor = [11, 11];
            var size = [22, 22];
            
            if (s.type === 'location') {
              htmlContent = '<div class="driver-car-marker" style="font-size: 24px; line-height: 32px; text-align: center;">🚗</div>';
              anchor = [16, 16];
              size = [32, 32];
            } else {
              // Parse SVG icon template matching the dynamic icon name
              var pinIconSvg = wrenchSvg;
              if (s.icon === 'droplet' || s.icon === 'fuel' || s.icon === 'oil') {
                pinIconSvg = oilSvg;
              } else if (s.icon === 'shopping-cart') {
                pinIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
              } else if (s.icon === 'activity' || s.icon === 'hospital') {
                pinIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>';
              } else if (s.icon === 'user') {
                pinIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
              } else if (s.icon === 'truck') {
                pinIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';
              } else if (s.icon === 'database') {
                pinIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>';
              }

              var pinColor = s.color || '#2563EB';
              htmlContent = '<div class="poi-circle" style="background-color: ' + pinColor + '; border-color: #ffffff;">' + pinIconSvg + '</div>';
              anchor = [11, 11];
              size = [22, 22];
            }
            
            var sIcon = L.divIcon({
              className: '',
              html: htmlContent,
              iconSize: size,
              iconAnchor: anchor
            });
            var sMarker = L.marker([lat, lng], { icon: sIcon }).addTo(map);
            sMarker.on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify(s));
            });
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
          <Icon name="car" size={20} color={theme.primary} />
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
            style={[styles.settingsButton, { backgroundColor: theme.surface, borderColor: theme.border, position: 'relative' }]}
            onPress={() => {
              markAllNoticesAsRead();
              router.push('/opportunity');
            }}
          >
            <Icon name="bell" size={18} color={theme.primary} />
            {unreadNoticeCount > 0 && (
              <View style={styles.unreadBadgeDot}>
                <Text style={styles.unreadBadgeText}>
                  {unreadNoticeCount > 9 ? '9+' : unreadNoticeCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/menu')}
          >
            <Icon name="settings" size={18} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notice Banner */}
      <TouchableOpacity
        activeOpacity={isPending ? 0.7 : 1}
        onPress={() => {
          if (isPending) {
            router.push('/register/pending');
          }
        }}
        style={[styles.noticeBanner, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
      >
        <Text style={[styles.noticeText, { color: theme.textPrimary }]}>
          {isApprovedDriver
            ? (currentUserRole === 'workshop'
                ? (isArabic ? 'وضع الورشة — عرض ورش الصيانة فقط' : isUrdu ? 'ورکشاپ موڈ — صرف ورکشاپ پوائنٹس دکھائے جا رہے ہیں' : 'Workshop Mode — Viewing Workshop Hubs Only')
                : currentUserRole === 'oil'
                  ? (isArabic ? 'وضع تغيير الزيت — عرض محطات تغيير الزيت فقط' : isUrdu ? 'ائل چینج موڈ — صرف ائل چینج پوائنٹس دکھائے جا رہے ہیں' : 'Oil Change Mode — Viewing Oil Change Stations Only')
                  : t.allServicesVisible)
            : isPending
              ? (isArabic ? 'بانتظار موافقة المدير — الخريطة مقفلة (اضغط للتحقق) ➔' : isUrdu ? 'ایڈمن کی منظوری کا انتظار ہے — نقشہ مقفل ہے ➔' : 'Pending Admin Approval — Drivers & Services locked (tap to check)')
              : (isArabic ? 'وضع الزائر — قم بتسجيل الدخول والموافقة لرؤية السائقين والخدمات' : isUrdu ? 'وزیٹر موڈ — ڈرائیورز و سروسز دیکھنے کے لیے لاگ ان کریں' : 'Visitor Mode — Login & Get Approved to View Drivers & Services')}
        </Text>
      </TouchableOpacity>

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
            activeOpacity={0.7}
            style={[styles.pendingBanner, { backgroundColor: '#92400e', zIndex: 999, elevation: 20 }]}
            onPress={() => router.push('/register/pending')}
          >
            <Text style={styles.pendingText}>
              {isArabic ? '⏳ بانتظار موافقة المدير — اضغط للتحقق' : isUrdu ? '⏳ ایڈمن کی منظوری کا انتظار ہے — چیک کرنے کے لیے کلک کریں' : '⏳ Pending Admin Approval — tap to check'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Payment Required Banner — admin has enabled payment for this user's role */}
        {isApprovedDriver && registeredUser?.paymentStatus === 'Unpaid' && (() => {
          const role = registeredUser?.role;
          const needsPay = role === 'driver' ? platformSettings.paymentRequiredFor?.driver
            : role === 'workshop' ? platformSettings.paymentRequiredFor?.workshop
            : role === 'oil' ? platformSettings.paymentRequiredFor?.oilchange
            : platformSettings.paymentRequiredFor?.visitor;
          if (!needsPay) return null;
          return (
            <TouchableOpacity
              style={[styles.pendingBanner, { backgroundColor: '#1d4ed8', bottom: isPending ? 60 : 12 }]}
              onPress={() => router.push('/register/payment')}
            >
              <Text style={styles.pendingText}>
                {isArabic ? '💳 حسابك معتمد — أكمل الدفع لتفعيل التتبع المباشر' : isUrdu ? '💳 اکاؤنٹ منظور — لائیو ٹریکنگ کے لیے ادائیگی مکمل کریں' : '💳 Account Approved — Complete Payment to Activate Live Tracking'}
              </Text>
            </TouchableOpacity>
          );
        })()}
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
                  <Icon name={selectedService?.icon || 'car'} size={20} color={theme.primary} />
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
                    <Icon name="car" size={16} color="#FFF" />
                    <Text style={styles.modalActionText}>
                      {isArabic ? 'تأكيد طلب السيارة / الحجز' : isUrdu ? 'ابھی گاڑی / بکنگ کی درخواست کریں' : 'Request Car / Hire Now'}
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
  unreadBadgeDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0f172a',
    zIndex: 10,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center',
  },
});
