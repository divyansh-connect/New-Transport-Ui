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

  // Admin Management state loaded from localStorage or default
  const [adminsList, setAdminsList] = useState(() => {
    const savedAdmins = localStorage.getItem('admins_list');
    if (savedAdmins) return JSON.parse(savedAdmins);
    return [
      { id: 'ADM-01', name: 'Yash Ji', email: 'yash_ji@driverlife.com', role: 'Super Admin', phone: '+966 50 123 4567' },
      { id: 'ADM-02', name: 'Nalini Dev', email: 'nalini.dev@driverlife.com', role: 'System Admin', phone: '+966 50 987 6543' }
    ];
  });

  // Dynamic Subscription Plans state
  const [subscriptionPlans, setSubscriptionPlans] = useState(() => {
    const savedPlans = localStorage.getItem('subscription_plans');
    if (savedPlans) return JSON.parse(savedPlans);
    return [
      { id: 'SUB-01', name: '1 Month Standard', duration: '1 Month', price: '49.99' },
      { id: 'SUB-02', name: '6 Months Saver', duration: '6 Months', price: '199.99' },
      { id: 'SUB-03', name: '1 Year Premium', duration: '1 Year', price: '349.99' }
    ];
  });

  // Subscription and Pay Configuration
  const [subscriptionConfig, setSubscriptionConfig] = useState(() => {
    const savedConfig = localStorage.getItem('subscription_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      delete parsed.fee1Month;
      delete parsed.fee6Months;
      delete parsed.fee1Year;
      return parsed;
    }
    return {
      activeForEveryone: true, // If false, payment is bypassed or only for select roles
      showVisitorServices: true // If true, visitors see available services as well, but are invisible themselves
    };
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('admins_list', JSON.stringify(adminsList));
  }, [adminsList]);

  useEffect(() => {
    localStorage.setItem('subscription_plans', JSON.stringify(subscriptionPlans));
  }, [subscriptionPlans]);

  useEffect(() => {
    localStorage.setItem('subscription_config', JSON.stringify(subscriptionConfig));
  }, [subscriptionConfig]);

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

  const addNewAdmin = (newAdmin) => {
    setAdminsList((prev) => [...prev, { id: `ADM-${Math.floor(10 + Math.random() * 90)}`, ...newAdmin }]);
  };

  const deleteAdmin = (id) => {
    setAdminsList((prev) => prev.filter(admin => admin.id !== id));
  };

  const addSubscriptionPlan = (newPlan) => {
    setSubscriptionPlans((prev) => [...prev, { id: `SUB-${Math.floor(10 + Math.random() * 90)}`, ...newPlan }]);
  };

  const deleteSubscriptionPlan = (id) => {
    setSubscriptionPlans((prev) => prev.filter(plan => plan.id !== id));
  };

  const updateSubscriptionConfig = (newConfig) => {
    setSubscriptionConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      profile,
      updateProfile,
      adminsList,
      addNewAdmin,
      deleteAdmin,
      subscriptionPlans,
      addSubscriptionPlan,
      deleteSubscriptionPlan,
      subscriptionConfig,
      updateSubscriptionConfig
    }}>
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
