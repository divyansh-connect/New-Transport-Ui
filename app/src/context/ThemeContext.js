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
        opportunityNotice,
        saveOpportunityNotice,
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
      opportunityNotice: defaultNotice,
      saveOpportunityNotice: () => {},
    };
  }
  return context;
};
