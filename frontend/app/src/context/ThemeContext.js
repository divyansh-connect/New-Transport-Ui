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

const DEFAULT_FALLBACK_NOTICES = [
  { id: 'notice-1', title: 'High-Demand Cargo Routes Available' },
  { id: 'notice-2', title: 'Partner Workshop Expansion Notice' },
  { id: 'notice-3', title: 'Monsoon Safety Guidelines' }
];

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('English');
  const [registeredUser, setRegisteredUser] = useState(null);
  const [opportunityNotice, setOpportunityNotice] = useState(defaultNotice);
  const [readNoticeIds, setReadNoticeIds] = useState([]);
  const [unreadNoticeCount, setUnreadNoticeCount] = useState(0);

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
      if (e.message && (e.message.includes('not found') || e.message.includes('Server connection error'))) {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_profile');
        setRegisteredUser(null);
      }
    }
  };

  useEffect(() => {
    // Load registered user profile, admin notice, and read notice IDs from storage
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

    AsyncStorage.getItem('read_notice_ids').then((data) => {
      if (data) {
        try {
          setReadNoticeIds(JSON.parse(data));
        } catch (e) {
          console.log('Error parsing read notice IDs:', e);
        }
      }
    });
  }, []);

  const updateUnreadNotices = (activeNotices = []) => {
    if (!Array.isArray(activeNotices) || activeNotices.length === 0) {
      setUnreadNoticeCount(0);
      return;
    }
    const unread = activeNotices.filter((n) => {
      const idStr = String(n.id || n.customId || '');
      return idStr && !readNoticeIds.includes(idStr);
    });
    setUnreadNoticeCount(unread.length);
  };

  // ── Real-time background sync for notices & red count badge ──
  useEffect(() => {
    const fetchLiveNotices = async () => {
      try {
        const { apiFetch } = require('../utils/api');
        const notices = await apiFetch('/notices');
        if (Array.isArray(notices) && notices.length > 0) {
          updateUnreadNotices(notices);
        } else {
          updateUnreadNotices(DEFAULT_FALLBACK_NOTICES);
        }
      } catch (err) {
        updateUnreadNotices(DEFAULT_FALLBACK_NOTICES);
      }
    };

    fetchLiveNotices();
    const interval = setInterval(fetchLiveNotices, 4000);
    return () => clearInterval(interval);
  }, [readNoticeIds]);

  const markAllNoticesAsRead = async (noticesToMark = []) => {
    try {
      const targets = noticesToMark.length > 0 ? noticesToMark : DEFAULT_FALLBACK_NOTICES;
      const newIds = targets.map((n) => String(n.id || n.customId || '')).filter(Boolean);
      const updatedReadIds = Array.from(new Set([...readNoticeIds, ...newIds]));
      setReadNoticeIds(updatedReadIds);
      setUnreadNoticeCount(0);
      await AsyncStorage.setItem('read_notice_ids', JSON.stringify(updatedReadIds));
    } catch (e) {
      console.log('Error marking notices as read:', e);
    }
  };

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
        unreadNoticeCount,
        readNoticeIds,
        updateUnreadNotices,
        markAllNoticesAsRead,
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
      unreadNoticeCount: 0,
      readNoticeIds: [],
      updateUnreadNotices: () => {},
      markAllNoticesAsRead: () => {},
    };
  }
  return context;
};
