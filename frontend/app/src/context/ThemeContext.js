import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';

const ThemeContext = createContext();

const defaultTheme = COLORS.dark;

const defaultNotice = {
  title: 'High-Demand Cargo Routes Available',
  category: 'Logistics Opportunity',
  date: 'Today, 10:30 AM',
  description: 'Long-haul freight opportunities open for heavy truck drivers connecting northern ports to regional fulfillment hubs. High competitive payouts.',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('English');
  const [registeredUser, setRegisteredUser] = useState(null);
  const [opportunityNotice, setOpportunityNotice] = useState(defaultNotice);

  const refreshUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return;
      const { apiFetch } = require('../utils/api');
      const data = await apiFetch('/users/profile');
      if (data && data.user) {
        setRegisteredUser(data.user);
        await AsyncStorage.setItem('user_profile', JSON.stringify(data.user));
      }
    } catch (e) {
      console.log('Error refreshing user profile:', e);
    }
  };

  useEffect(() => {
    // Load registered user profile & admin notice from storage
    AsyncStorage.getItem('user_profile').then((data) => {
      if (data) {
        try {
          setRegisteredUser(JSON.parse(data));
        } catch (e) {
          console.log('Error parsing user profile:', e);
        }
      }
      refreshUserProfile();
    }).catch(err => console.log('AsyncStorage error:', err));

    AsyncStorage.getItem('opportunity_notice').then((data) => {
      if (data) {
        try {
          setOpportunityNotice(JSON.parse(data));
        } catch (e) {
          console.log('Error parsing notice:', e);
        }
      }
    });
  }, []);

  const saveUserProfile = async (userData) => {
    setRegisteredUser(userData);
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(userData));
    } catch (e) {
      console.log('Error saving user profile:', e);
    }
  };

  const saveOpportunityNotice = async (noticeData) => {
    setOpportunityNotice(noticeData);
    try {
      await AsyncStorage.setItem('opportunity_notice', JSON.stringify(noticeData));
    } catch (e) {
      console.log('Error saving opportunity notice:', e);
    }
  };

  const [alertConfig, setAlertConfig] = useState(null);

  const showAlert = (title, message, buttons = []) => {
    setAlertConfig({ title, message, buttons });
  };

  const hideAlert = () => {
    setAlertConfig(null);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = (isDarkMode ? COLORS.dark : COLORS.light) || defaultTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleTheme,
        language,
        setLanguage,
        registeredUser,
        saveUserProfile,
        refreshUserProfile,
        opportunityNotice,
        saveOpportunityNotice,
        alertConfig,
        showAlert,
        hideAlert,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: defaultTheme,
      isDarkMode: true,
      toggleTheme: () => {},
      language: 'English',
      setLanguage: () => {},
      registeredUser: null,
      saveUserProfile: () => {},
      refreshUserProfile: () => {},
      opportunityNotice: defaultNotice,
      saveOpportunityNotice: () => {},
      alertConfig: null,
      showAlert: () => {},
      hideAlert: () => {},
    };
  }
  return context;
};
