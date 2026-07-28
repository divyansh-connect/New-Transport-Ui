import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomAlert from '../src/components/common/CustomAlert';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <CustomAlert />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
