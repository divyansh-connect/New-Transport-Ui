import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { RADIUS, SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function CustomAlert() {
  const { theme, language, alertConfig, hideAlert } = useTheme();

  if (!alertConfig) return null;

  const { title, message, buttons = [] } = alertConfig;
  const isArabic = language === 'Arabic';
  const isUrdu = language === 'Urdu';
  const isRTL = isArabic || isUrdu;

  // Default button if none provided
  const alertButtons = buttons.length > 0 
    ? buttons 
    : [{ text: isArabic ? 'موافق' : isUrdu ? 'ٹھیک ہے' : 'OK', onPress: () => {} }];

  const handleButtonPress = (onPress) => {
    if (onPress) {
      onPress();
    }
    hideAlert();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={!!alertConfig}
      onRequestClose={hideAlert}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          {/* Title */}
          {title ? (
            <Text style={[styles.title, { color: theme.textPrimary, textAlign: 'center' }]}>
              {title}
            </Text>
          ) : null}

          {/* Message */}
          {message ? (
            <Text style={[styles.message, { color: theme.textSecondary, textAlign: 'center' }]}>
              {message}
            </Text>
          ) : null}

          {/* Buttons Layout */}
          <View style={[
            styles.buttonContainer, 
            isRTL && { flexDirection: 'row-reverse' }
          ]}>
            {alertButtons.map((btn, index) => {
              const isCancel = btn.style === 'cancel' || btn.text === 'Cancel' || btn.text === 'إلغاء' || btn.text === 'منسوخ کریں';
              const isDestructive = btn.style === 'destructive';

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => handleButtonPress(btn.onPress)}
                  style={[
                    styles.button,
                    isCancel 
                      ? [styles.cancelBtn, { backgroundColor: theme.surface, borderColor: theme.border }] 
                      : [styles.primaryBtn, { backgroundColor: isDestructive ? '#ef4444' : theme.primary }],
                    alertButtons.length > 1 && { flex: 1 }
                  ]}
                >
                  <Text style={[
                    styles.btnText, 
                    { color: isCancel ? theme.textPrimary : '#FFFFFF' }
                  ]}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  card: {
    width: width * 0.84,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 0.25,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    minWidth: 100,
  },
  primaryBtn: {
    // shadowColor: '#3b82f6',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 6,
    // elevation: 3,
  },
  cancelBtn: {
    borderWidth: 1,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
