import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { SPACING, RADIUS } from '../../../constants/theme';

export const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  error,
  multiline = false,
  numberOfLines = 1,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.textPrimary }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            color: theme.textPrimary,
            borderColor: error ? theme.danger : theme.border,
          },
          multiline && { height: 24 * numberOfLines, textAlignVertical: 'top' },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {error && <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  input: {
    height: 48,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
