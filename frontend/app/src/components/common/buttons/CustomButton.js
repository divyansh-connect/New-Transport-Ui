import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { RADIUS, SPACING } from '../../../constants/theme';

export const CustomButton = ({ title, onPress, variant = 'primary', style }) => {
  const { theme } = useTheme();

  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';

  const buttonStyle = {
    backgroundColor: isOutline
      ? 'transparent'
      : isSecondary
      ? theme.surface
      : theme.primary,
    borderColor: isOutline ? theme.primary : 'transparent',
    borderWidth: isOutline ? 1 : 0,
  };

  const textColor = isOutline
    ? theme.primary
    : isSecondary
    ? theme.textPrimary
    : '#FFFFFF';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.button, buttonStyle, style]}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xs,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
