import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';

const { width, height } = Dimensions.get('window');

// Import locally copied premium generated assets
const localSplashBg = require('../assets/splash_bg.png');
const localLogo = require('../assets/logo.png');

export default function SplashScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const scaleAnim = useRef(new Animated.Value(0.7)).current; 
  const textSlideAnim = useRef(new Animated.Value(30)).current; 
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequence Premium Animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(textSlideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();

    // Pulse animation for the glowing ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Redirect to main app after 3.2 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/map');
      });
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={localSplashBg}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={8}
    >
      {/* Translucent glass layer overlay */}
      <View style={[styles.overlay, { backgroundColor: theme.background === '#0F172A' ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.75)' }]} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Pulsing ring background */}
        <Animated.View style={[
          styles.glowRing, 
          { 
            borderColor: theme.primary, 
            transform: [{ scale: pulseAnim }],
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.25],
              outputRange: [0.3, 0.05]
            })
          }
        ]} />
        
        {/* Generated Premium Logo Image instead of Icon wrapper */}
        <View style={[styles.logoCircle, { shadowColor: theme.primary }]}>
          <Image source={localLogo} style={styles.logoImage} resizeMode="contain" />
        </View>

        {/* Brand Text Animation */}
        <Animated.View style={{ transform: [{ translateY: textSlideAnim }], alignItems: 'center' }}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Driver Life</Text>
          <Text style={[styles.badgeText, { color: '#FFF', backgroundColor: theme.primary }]}>PARTNER APP</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Smart Telemetry & Map Ecosystem</Text>
        </Animated.View>
      </Animated.View>

      {/* Premium footer branding */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          POWERED BY TRANSPORTER NETWORK
        </Text>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: width,
    height: height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  glowRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1.8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    alignSelf: 'center',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
    letterSpacing: 2,
    overflow: 'hidden',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    opacity: 0.85,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    zIndex: 10,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
