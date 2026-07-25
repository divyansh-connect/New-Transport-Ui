import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Cards/Card';
import { Button } from '../../components/common/Button/Button';
import { Input, Select } from '../../components/common/Input/Input';
import { Modal } from '../../components/common/Modal/Modal';
import { User, UserPlus, Mail, Phone, MapPin, Truck, CheckSquare, Car } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDrivers } from '../../context/DriverContext';
import { 
  DriverRegistrationForm, 
  WorkshopRegistrationForm, 
  OilChangeRegistrationForm, 
  VisitorRegistrationForm 
} from '../../components/common/RegistrationForms';
import './Registration.css';

export const Registration = () => {
  const navigate = useNavigate();
  const { subscriptionPlans, subscriptionConfig } = useTheme();
  const { registerDriver } = useDrivers();
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState({
    type: 'driver',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    plateNumber: '',
    location: '',
    latitude: '28.6250',
    longitude: '77.2180',
    trackingEnabled: true,
    termsAccepted: false,
    selectedPlanId: subscriptionPlans?.[0]?.id || ''
  });

  const isDriver = formData.type === 'driver';
  const isWorkshop = formData.type === 'workshop' || formData.type === 'oil';
  const isVisitor = formData.type === 'visitor';

  const config = subscriptionConfig?.paymentRequiredFor || { driver: true, workshop: false, visitor: false, oilchange: false };
  const payRequired = 
    (formData.type === 'driver' && config.driver) ||
    (formData.type === 'workshop' && config.workshop) ||
    (formData.type === 'oil' && config.oilchange) ||
    (formData.type === 'visitor' && config.visitor);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
      setAlertMessage('Name / Entity Name is required.');
      return;
    }
    if ((isDriver || isVisitor) && !formData.lastName.trim()) {
      setAlertMessage('Last Name is required.');
      return;
    }
    if (!formData.termsAccepted) {
      setAlertMessage('You must accept the Terms and Conditions to proceed.');
      return;
    }
    
    // Read existing
    const saved = localStorage.getItem('registrations');
    let registrations = [];
    if (saved) {
      registrations = JSON.parse(saved);
    }
    
    const freeTrialEnabled = subscriptionConfig?.freeTrialEnabled;
    const freeTrialDuration = subscriptionConfig?.freeTrialDuration || '1 Month';
    
    // Find active plan price or default price based on category
    let planPrice = 'Free';
    if (payRequired) {
      if (freeTrialEnabled) {
        planPrice = `Free (${freeTrialDuration} Trial)`;
      } else {
        if (isDriver) {
          const selectedPlan = subscriptionPlans.find(p => p.id === (formData.selectedPlanId || subscriptionPlans?.[0]?.id));
          planPrice = selectedPlan ? `$${selectedPlan.price}` : '$49.99';
        } else if (formData.type === 'workshop') {
          planPrice = '$149.00';
        } else if (formData.type === 'oil') {
          planPrice = '$199.00';
        } else if (formData.type === 'visitor') {
          planPrice = '$9.99';
        }
      }
    }
    
    const fullName = isDriver 
      ? `${formData.firstName} ${formData.lastName}`
      : (formData.lastName ? `${formData.firstName} ${formData.lastName}` : formData.firstName);

    const displayTypes = {
      driver: 'Commercial Driver',
      workshop: 'Repair Workshop',
      oil: 'Oil Change Center',
      visitor: 'Visitor'
    };

    const targetEntityId = formData.type === 'driver'
      ? `DRV-${Math.floor(1007 + Math.random() * 890)}`
      : formData.type === 'workshop'
        ? `WS-${Math.floor(100 + Math.random() * 900)}`
        : formData.type === 'oil'
          ? `OC-${Math.floor(100 + Math.random() * 900)}`
          : `VIS-${Math.floor(100 + Math.random() * 900)}`;

    // Create new record
    const newRecord = {
      id: `REG-${Math.floor(107 + Math.random() * 890)}`,
      name: fullName,
      type: displayTypes[formData.type] || formData.type,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      amount: planPrice,
      phone: formData.phone || '—',
      driverId: targetEntityId
    };
    
    // Propagate to respective menus
    if (formData.type === 'driver') {
      const newDriver = {
        id: targetEntityId,
        name: fullName,
        email: formData.email,
        phone: formData.phone || '—',
        plateNumber: formData.plateNumber || '—',
        vehicleType: 'Commercial Driver',
        vehicleModel: 'Standard Cargo',
        licenseNumber: 'DL-TEMP-' + Math.floor(100000 + Math.random() * 900000),
        experienceYears: 1,
        city: 'Delhi, IN',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
        status: 'Pending',
        registrationDate: new Date().toISOString().split('T')[0],
        paymentStatus: payRequired ? (freeTrialEnabled ? 'Trial' : 'Unpaid') : 'Paid',
        paymentAmount: planPrice,
        paymentMethod: payRequired ? (freeTrialEnabled ? 'Trial Activation' : 'None') : 'Free Bypass',
        documents: {
          license: { name: 'Commercial Driver License (CDL)', status: 'Pending Verification', url: '#' },
          insurance: { name: 'Vehicle Liability Insurance', status: 'Pending Verification', url: '#' },
          backgroundCheck: { name: 'Criminal Background Check', status: 'Pending', url: '#' }
        },
        rejectionReason: ''
      };
      registerDriver(newDriver);
    } else if (formData.type === 'workshop' || formData.type === 'oil' || formData.type === 'visitor') {
      let displayType;
      if (formData.type === 'workshop') {
        displayType = 'Repair Workshop';
      } else if (formData.type === 'oil') {
        displayType = 'Oil Change Center';
      } else {
        displayType = 'Visitor';
      }
      const newEntityRequest = {
        id: targetEntityId,
        name: fullName,
        email: formData.email,
        phone: formData.phone || '—',
        plateNumber: '—',
        vehicleType: displayType,
        vehicleModel: formData.type === 'workshop' ? 'Workshop Hub' : formData.type === 'oil' ? 'Oil Change Station' : 'Guest Access',
        licenseNumber: 'LIC-' + targetEntityId + '-' + Math.floor(1000 + Math.random() * 9000),
        experienceYears: 1,
        city: formData.location || 'Delhi, IN',
        avatar: formData.type === 'workshop'
          ? 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=256'
          : formData.type === 'oil'
            ? 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=256'
            : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
        status: 'Pending',
        registrationDate: new Date().toISOString().split('T')[0],
        paymentStatus: payRequired ? (freeTrialEnabled ? 'Trial' : 'Unpaid') : 'Paid',
        paymentAmount: planPrice,
        paymentMethod: payRequired ? (freeTrialEnabled ? 'Trial Activation' : 'None') : 'Free Bypass',
        type: formData.type,
        documents: {
          license: { 
            name: formData.type === 'workshop' ? 'Business Trade License' : formData.type === 'oil' ? 'Environmental Permit' : 'Government ID Proof', 
            status: 'Pending Verification', 
            url: '#' 
          },
          insurance: { 
            name: formData.type === 'workshop' ? 'Liability Insurance Policy' : formData.type === 'oil' ? 'Commercial General Liability' : 'Self Declaration / Medical Cert', 
            status: 'Pending Verification', 
            url: '#' 
          },
          backgroundCheck: { 
            name: formData.type === 'workshop' ? 'Safety Audit Report' : formData.type === 'oil' ? 'Pollution Control Board Cert' : 'Address Verification Check', 
            status: 'Pending', 
            url: '#' 
          }
        },
        rejectionReason: ''
      };
      registerDriver(newEntityRequest);
    }

    // Save and redirect
    registrations.unshift(newRecord);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    navigate('/');
  };

  return (
    <div className="page-container registration-page">
      <div className="page-header">
        <h1>New Entity Registration</h1>
        <p>Register a new driver, workshop, or partner in the system.</p>
      </div>

      <div className="registration-content">
        <Card title="Registration Form">
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px', color: 'var(--color-text-main)' }}>Entity Category</label>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              options={[
                { label: 'Commercial Driver', value: 'driver' },
                { label: 'Repair Workshop', value: 'workshop' },
                { label: 'Oil Change Center', value: 'oil' },
                { label: 'Visitor', value: 'visitor' }
              ]}
            />
          </div>

          {formData.type === 'driver' && (
            <DriverRegistrationForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => window.history.back()}
              subscriptionPlans={subscriptionPlans}
              payRequired={payRequired}
            />
          )}
          {formData.type === 'workshop' && (
            <WorkshopRegistrationForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => window.history.back()}
            />
          )}
          {formData.type === 'oil' && (
            <OilChangeRegistrationForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => window.history.back()}
            />
          )}
          {formData.type === 'visitor' && (
            <VisitorRegistrationForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => window.history.back()}
            />
          )}
        </Card>
      </div>

      {/* Validation React Modal */}
      <Modal
        isOpen={!!alertMessage}
        onClose={() => setAlertMessage('')}
        title="Validation Required"
        subtitle="Please check your form inputs."
        primaryActionLabel="OK"
        onPrimaryAction={() => setAlertMessage('')}
      >
        <p style={{ color: 'var(--color-text-main)', fontSize: '14px', margin: 0 }}>
          {alertMessage}
        </p>
      </Modal>
    </div>
  );
};
