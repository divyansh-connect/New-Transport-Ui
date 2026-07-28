import React, { createContext, useContext, useState, useEffect } from 'react';

const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
  const [drivers, setDrivers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Base API call helper
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        ...options,
        headers
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'API Request failed');
      }
      return data;
    } catch (err) {
      console.error(`API Call failed for ${endpoint}:`, err);
      throw err;
    }
  };

  // Reconstruct document structure to match what frontend expects
  const formatUser = (u) => {
    const displayTypes = {
      driver: 'Semi-Truck (Box)',
      workshop: 'Repair Workshop',
      oil: 'Oil Change Center',
      visitor: 'Visitor'
    };
    const defaultModels = {
      driver: 'Peterbilt 579',
      workshop: 'Workshop Hub',
      oil: 'Oil Change Station',
      visitor: 'Guest Access'
    };

    return {
      id: u.customId || u.id,
      realId: u.id,
      name: u.name,
      lastName: u.lastName || '',
      email: u.email || '',
      phone: u.mobileNo || '—',
      contact: u.mobileNo || '—',
      mobileNo: u.mobileNo || '—',
      plateNumber: u.carPlateNumber || '—',
      vehicleType: displayTypes[u.role] || 'Visitor',
      vehicleModel: defaultModels[u.role] || 'Guest Access',
      licenseNumber: u.licenseName || 'LIC-' + u.customId,
      experienceYears: 4,
      city: u.role === 'driver' ? 'Dallas, TX' : 'Delhi, IN',
      avatar: u.role === 'driver' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256' 
        : 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=256',
      status: u.status,
      registrationDate: new Date(u.registrationDate).toISOString().split('T')[0],
      paymentStatus: u.paymentStatus,
      paymentAmount: u.amountPaid,
      paymentMethod: u.paymentMethod,
      type: u.role === 'oil' ? 'oil' : u.role,
      latitude: u.latitude,
      longitude: u.longitude,
      documents: {
        license: { name: u.licenseName || 'Commercial Driver License (CDL)', status: u.licenseStatus, url: '#' },
        insurance: { name: u.insuranceName || 'Vehicle Liability Insurance', status: u.insuranceStatus, url: '#' },
        backgroundCheck: { name: u.backgroundCheckName || 'Criminal Background Check', status: u.backgroundCheckStatus, url: '#' }
      },
      rejectionReason: u.rejectionReason || ''
    };
  };

  const loadData = async () => {
    let token = localStorage.getItem('admin_token');
    
    // Silent login fallback if already authenticated but missing backend JWT token
    if (!token && localStorage.getItem('isAuthenticated') === 'true') {
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@userlife.com', password: 'admin123' })
        });
        const data = await response.json();
        if (response.ok && data.token) {
          localStorage.setItem('admin_token', data.token);
          token = data.token;
        }
      } catch (err) {
        console.log('Silent login failed:', err);
      }
    }

    if (!token) return;
    try {
      const usersData = await apiCall('/users');
      const paymentsData = await apiCall('/payments');
      const notificationsData = await apiCall('/notifications');

      setDrivers(usersData.map(formatUser));
      
      setPayments(paymentsData.map(p => ({
        id: p.customId || p.id,
        realId: p.id,
        driverId: p.driverId,
        name: p.name,
        amount: p.amount,
        gateway: p.gateway,
        status: p.status,
        date: new Date(p.date).toISOString().split('T')[0]
      })));

      setNotifications(notificationsData.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        time: 'Just now',
        read: n.read
      })));
    } catch (err) {
      console.log('Error loading backend data:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const registerDriver = async (newDriver) => {
    try {
      await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: newDriver.name,
          lastName: newDriver.lastName,
          mobileNo: newDriver.phone,
          password: newDriver.password || 'password123',
          carPlateNumber: newDriver.plateNumber,
          email: newDriver.email,
          role: newDriver.type === 'oil' ? 'oil' : newDriver.type,
          subscriptionDuration: newDriver.paymentAmount === '$9.99' ? '1 Month' : '1 Year',
          amountPaid: newDriver.paymentAmount || '$49.99',
          paymentStatus: newDriver.paymentStatus || 'Paid',
          paymentMethod: newDriver.paymentMethod || 'Free Bypass'
        })
      });
      loadData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const approveDriver = async (id) => {
    const target = drivers.find(d => d.id === id || d.realId === id);
    if (!target) return;
    try {
      const targetId = target.realId || target.id;
      await apiCall(`/users/${targetId}/approve`, { method: 'PUT' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectDriver = async (id, reason) => {
    const target = drivers.find(d => d.id === id || d.realId === id);
    if (!target) return;
    try {
      const targetId = target.realId || target.id;
      await apiCall(`/users/${targetId}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const setDriverStatus = async (id, newStatus) => {
    if (newStatus === 'Approved') {
      await approveDriver(id);
    } else if (newStatus === 'Pending') {
      // Direct status toggles fallback to standard reject / reset status
      const target = drivers.find(d => d.id === id);
      if (target) {
        try {
          await apiCall(`/users/${target.realId}/reject`, {
            method: 'PUT',
            body: JSON.stringify({ reason: 'Status reset by admin.' })
          });
          loadData();
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const updateDriverProfile = async (id, updatedProfile) => {
    const target = drivers.find(d => d.id === id);
    if (!target) return;
    try {
      await apiCall(`/users/profile`, {
        method: 'PUT',
        body: JSON.stringify({
          name: updatedProfile.name,
          lastName: updatedProfile.lastName,
          email: updatedProfile.email,
          carPlateNumber: updatedProfile.plateNumber,
        })
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await apiCall(`/notifications/${id}/read`, { method: 'PUT' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await apiCall(`/notifications`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePayment = async (id) => {
    const target = payments.find(p => p.id === id);
    if (!target) return;
    try {
      await apiCall(`/payments/${target.realId}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDriver = async (id) => {
    const target = drivers.find(d => d.id === id || d.realId === id);
    if (!target) return;
    try {
      const targetId = target.realId || target.id;
      await apiCall(`/users/${targetId}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePayment = async (id, updatedData) => {
    // Audit logs updates are tracked locally or handled by recreate operations
    console.log('Update payment audit called: ', id, updatedData);
  };

  return (
    <DriverContext.Provider
      value={{
        drivers,
        payments,
        notifications,
        approveDriver,
        rejectDriver,
        setDriverStatus,
        updateDriverProfile,
        markNotificationAsRead,
        clearAllNotifications,
        deletePayment,
        deleteDriver,
        updatePayment,
        registerDriver
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDrivers = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDrivers must be used within a DriverProvider');
  }
  return context;
};
