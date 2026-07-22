import React, { createContext, useContext, useState } from 'react';

const DriverContext = createContext();

const initialDrivers = [
  {
    id: 'DRV-1001',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    phone: '+1 (555) 234-5678',
    plateNumber: 'TX-987-XYZ',
    vehicleType: 'Semi-Truck (Box)',
    vehicleModel: 'Peterbilt 579',
    licenseNumber: 'DL-8837192-TX',
    experienceYears: 6,
    city: 'Dallas, TX',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    status: 'Pending',
    registrationDate: '2026-07-20',
    paymentStatus: 'Paid',
    paymentAmount: '$49.99',
    paymentMethod: 'Credit Card',
    documents: {
      license: { name: 'Commercial Driver License (CDL)', status: 'Pending Verification', url: '#' },
      insurance: { name: 'Vehicle Liability Insurance', status: 'Pending Verification', url: '#' },
      backgroundCheck: { name: 'Criminal Background Check', status: 'Passed', url: '#' }
    },
    rejectionReason: ''
  },
  {
    id: 'DRV-1002',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    phone: '+1 (555) 876-5432',
    plateNumber: 'CA-102-ABC',
    vehicleType: 'Cargo Van',
    vehicleModel: 'Ford Transit',
    licenseNumber: 'DL-1928374-CA',
    experienceYears: 4,
    city: 'Los Angeles, CA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    status: 'Approved',
    registrationDate: '2026-07-18',
    paymentStatus: 'Paid',
    paymentAmount: '$49.99',
    paymentMethod: 'Apple Pay',
    documents: {
      license: { name: 'Commercial Driver License (CDL)', status: 'Verified', url: '#' },
      insurance: { name: 'Vehicle Liability Insurance', status: 'Verified', url: '#' },
      backgroundCheck: { name: 'Criminal Background Check', status: 'Passed', url: '#' }
    },
    rejectionReason: ''
  },
  {
    id: 'DRV-1003',
    name: 'Alejandro Gomez',
    email: 'alejandro.g@example.com',
    phone: '+1 (555) 456-7890',
    plateNumber: 'FL-445-ZET',
    vehicleType: 'Heavy Duty Flatbed',
    vehicleModel: 'Kenworth T680',
    licenseNumber: 'DL-7738291-FL',
    experienceYears: 10,
    city: 'Miami, FL',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    status: 'Pending',
    registrationDate: '2026-07-21',
    paymentStatus: 'Paid',
    paymentAmount: '$49.99',
    paymentMethod: 'Bank Wire',
    documents: {
      license: { name: 'Commercial Driver License (CDL)', status: 'Pending Verification', url: '#' },
      insurance: { name: 'Vehicle Liability Insurance', status: 'Verified', url: '#' },
      backgroundCheck: { name: 'Criminal Background Check', status: 'Pending', url: '#' }
    },
    rejectionReason: ''
  },
  {
    id: 'DRV-1004',
    name: 'Elena Rostova',
    email: 'elena.r@example.com',
    phone: '+1 (555) 789-0123',
    plateNumber: 'NY-882-PLM',
    vehicleType: 'Box Truck',
    vehicleModel: 'Isuzu NPR',
    licenseNumber: 'DL-5524319-NY',
    experienceYears: 3,
    city: 'Brooklyn, NY',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    status: 'Rejected',
    registrationDate: '2026-07-15',
    paymentStatus: 'Paid',
    paymentAmount: '$49.99',
    paymentMethod: 'Credit Card',
    documents: {
      license: { name: 'Commercial Driver License (CDL)', status: 'Failed Verification', url: '#' },
      insurance: { name: 'Vehicle Liability Insurance', status: 'Verified', url: '#' },
      backgroundCheck: { name: 'Criminal Background Check', status: 'Passed', url: '#' }
    },
    rejectionReason: 'Driver license scan was blurry and expired on 2026-06-12.'
  },
  {
    id: 'DRV-1005',
    name: 'David Beck',
    email: 'david.b@example.com',
    phone: '+1 (555) 901-2345',
    plateNumber: 'IL-505-KLO',
    vehicleType: 'Refrigerated Truck',
    vehicleModel: 'Volvo VNL 860',
    licenseNumber: 'DL-6629381-IL',
    experienceYears: 8,
    city: 'Chicago, IL',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    status: 'Approved',
    registrationDate: '2026-07-10',
    paymentStatus: 'Paid',
    paymentAmount: '$49.99',
    paymentMethod: 'Credit Card',
    documents: {
      license: { name: 'Commercial Driver License (CDL)', status: 'Verified', url: '#' },
      insurance: { name: 'Vehicle Liability Insurance', status: 'Verified', url: '#' },
      backgroundCheck: { name: 'Criminal Background Check', status: 'Passed', url: '#' }
    },
    rejectionReason: ''
  },
  {
    id: 'DRV-1006',
    name: 'Leah Vance',
    email: 'leah.v@example.com',
    phone: '+1 (555) 345-6789',
    plateNumber: 'WA-731-MNO',
    vehicleType: 'Cargo Van',
    vehicleModel: 'Mercedes Sprinter',
    licenseNumber: 'DL-3948271-WA',
    experienceYears: 5,
    city: 'Seattle, WA',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256',
    status: 'Pending',
    registrationDate: '2026-07-21',
    paymentStatus: 'Unpaid',
    paymentAmount: '$49.99',
    paymentMethod: 'None',
    documents: {
      license: { name: 'Commercial Driver License (CDL)', status: 'Pending Verification', url: '#' },
      insurance: { name: 'Vehicle Liability Insurance', status: 'Pending Verification', url: '#' },
      backgroundCheck: { name: 'Criminal Background Check', status: 'Pending', url: '#' }
    },
    rejectionReason: ''
  }
];

const initialPayments = [
  { id: 'PAY-1001', driverId: 'DRV-1001', name: 'Marcus Vance', amount: '$49.99', gateway: 'Credit Card', status: 'Completed', date: '2026-07-20' },
  { id: 'PAY-1002', driverId: 'DRV-1002', name: 'Sarah Connor', amount: '$49.99', gateway: 'Apple Pay', status: 'Completed', date: '2026-07-18' },
  { id: 'PAY-1003', driverId: 'DRV-1003', name: 'Alejandro Gomez', amount: '$49.99', gateway: 'Bank Wire', status: 'Completed', date: '2026-07-21' },
  { id: 'PAY-1004', driverId: 'DRV-1004', name: 'Elena Rostova', amount: '$49.99', gateway: 'Credit Card', status: 'Completed', date: '2026-07-15' },
  { id: 'PAY-1005', driverId: 'DRV-1005', name: 'David Beck', amount: '$49.99', gateway: 'Credit Card', status: 'Completed', date: '2026-07-10' }
];

const initialNotifications = [
  { id: 'NOT-1', type: 'registration', title: 'New Registration Submitted', message: 'Marcus Vance submitted a Commercial Driver application.', time: '1 day ago', read: false },
  { id: 'NOT-2', type: 'payment', title: 'Registration Fee Paid', message: 'Payment of $49.99 confirmed for Alejandro Gomez.', time: '3 hours ago', read: false },
  { id: 'NOT-3', type: 'registration', title: 'New Registration Submitted', message: 'Leah Vance started registration (payment pending).', time: '1 hour ago', read: true },
  { id: 'NOT-4', type: 'verification', title: 'Background Check Passed', message: 'Background check completed for Sarah Connor.', time: '3 days ago', read: true }
];

export const DriverProvider = ({ children }) => {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [payments, setPayments] = useState(initialPayments);
  const [notifications, setNotifications] = useState(initialNotifications);

  const approveDriver = (id) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const updatedDocs = { ...d.documents };
          Object.keys(updatedDocs).forEach(key => {
            updatedDocs[key].status = 'Verified';
          });
          return { ...d, status: 'Approved', documents: updatedDocs, rejectionReason: '' };
        }
        return d;
      })
    );

    // Add notification & maybe payment entry if they just paid
    const driver = drivers.find(d => d.id === id);
    if (driver) {
      const newNotif = {
        id: `NOT-${Date.now()}`,
        type: 'approval',
        title: 'Driver Approved',
        message: `${driver.name} (ID: ${driver.id}) has been approved and marked active.`,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);

      // If they were unpaid, pay now for verification flow
      if (driver.paymentStatus === 'Unpaid') {
        const newPayId = `PAY-${Date.now()}`;
        setPayments(prevPay => [
          {
            id: newPayId,
            driverId: driver.id,
            name: driver.name,
            amount: '$49.99',
            gateway: 'Credit Card',
            status: 'Completed',
            date: new Date().toISOString().split('T')[0]
          },
          ...prevPay
        ]);
        setDrivers(prev =>
          prev.map(d => (d.id === id ? { ...d, paymentStatus: 'Paid', paymentMethod: 'Credit Card' } : d))
        );
      }
    }
  };

  const rejectDriver = (id, reason) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return { ...d, status: 'Rejected', rejectionReason: reason };
        }
        return d;
      })
    );

    // Add notification
    const driver = drivers.find(d => d.id === id);
    if (driver) {
      const newNotif = {
        id: `NOT-${Date.now()}`,
        type: 'rejection',
        title: 'Driver Rejected',
        message: `${driver.name} (ID: ${driver.id}) has been rejected. Reason: ${reason}`,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const setDriverStatus = (id, newStatus) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const updatedDocs = { ...d.documents };
          if (newStatus === 'Approved') {
            Object.keys(updatedDocs).forEach(key => {
              updatedDocs[key].status = 'Verified';
            });
          } else if (newStatus === 'Pending') {
            Object.keys(updatedDocs).forEach(key => {
              updatedDocs[key].status = 'Pending Verification';
            });
          }
          return { ...d, status: newStatus, documents: updatedDocs, rejectionReason: '' };
        }
        return d;
      })
    );
  };

  const updateDriverProfile = (id, updatedProfile) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedProfile } : d))
    );

    const newNotif = {
      id: `NOT-${Date.now()}`,
      type: 'profile_update',
      title: 'Profile Updated',
      message: `Driver profile for ${updatedProfile.name || id} was updated successfully.`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deletePayment = (id) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePayment = (id, updatedData) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
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
        updatePayment
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
