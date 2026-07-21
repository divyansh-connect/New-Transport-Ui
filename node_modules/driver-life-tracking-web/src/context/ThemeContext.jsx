import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const [profile, setProfile] = useState(() => {
    const savedName = localStorage.getItem('admin_name');
    const savedEmail = localStorage.getItem('admin_email');
    return {
      name: savedName || 'Admin User',
      email: savedEmail || 'admin@driverlife.com',
      role: 'System Administrator',
      phone: '+1 (555) 234-5678',
    };
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateProfile = (newProfile) => {
    setProfile((prev) => {
      const updated = { ...prev, ...newProfile };
      if (updated.name) localStorage.setItem('admin_name', updated.name);
      if (updated.email) localStorage.setItem('admin_email', updated.email);
      return updated;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, profile, updateProfile }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
