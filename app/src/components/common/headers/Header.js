import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';
import { Icon } from '../Icon';
import { SPACING } from '../../../constants/theme';

export const Header = ({ title, showBack = true, rightElement }) => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="back" size={22} color={theme.primary} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      </View>
      {rightElement && <View>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
});
