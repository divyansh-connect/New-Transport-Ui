import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Cards/Card';
import { Button } from '../../components/common/Button/Button';
import { Input, Select } from '../../components/common/Input/Input';
import { Modal } from '../../components/common/Modal/Modal';
import { User, UserPlus, Mail, Phone, MapPin, Truck, CheckSquare, Car } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDrivers } from '../../context/DriverContext';
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
    
    // Find active plan price or default price based on category
    let planPrice = 'Free';
    if (payRequired) {
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
        paymentStatus: payRequired ? 'Unpaid' : 'Paid',
        paymentAmount: planPrice,
        paymentMethod: payRequired ? 'None' : 'Free Bypass',
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
        paymentStatus: payRequired ? 'Unpaid' : 'Paid',
        paymentAmount: planPrice,
        paymentMethod: payRequired ? 'None' : 'Free Bypass',
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
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Entity Category</label>
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
              <div className="form-group">
                <label>{(isDriver || isVisitor) ? 'First Name' : 'Entity / Business Name'}</label>
                <Input 
                  placeholder={(isDriver || isVisitor) ? 'First name' : 'Entity / Business name'} 
                  leftIcon={User} 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{(isDriver || isVisitor) ? 'Last Name' : 'Contact Person (Optional)'}</label>
                <Input 
                  placeholder={(isDriver || isVisitor) ? 'Last name' : 'Contact person name'} 
                  leftIcon={User} 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <Input 
                  placeholder="+1 (555) 000-0000" 
                  leftIcon={Phone} 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <Input 
                  type="email" 
                  placeholder="email@example.com" 
                  leftIcon={Mail} 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              {(isDriver || isVisitor) ? (
                <div className="form-group">
                  <label>Plate Number</label>
                  <Input 
                    placeholder="e.g. ABC-1234" 
                    leftIcon={Car} 
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label>Location Name / Zone</label>
                  <Input 
                    placeholder="e.g. Sector 5, Telemetry Zone" 
                    leftIcon={MapPin} 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              )}
            </div>

            {!(isDriver || isVisitor) && (
              <div className="form-row">
                <div className="form-group">
                  <label>Latitude (e.g. 28.6250)</label>
                  <Input 
                    placeholder="28.6250" 
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Longitude (e.g. 77.2180)</label>
                  <Input 
                    placeholder="77.2180" 
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                  />
                </div>
              </div>
            )}

            {isDriver && (
              <div className="form-checkbox">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.trackingEnabled}
                    onChange={(e) => setFormData({...formData, trackingEnabled: e.target.checked})}
                    disabled
                  />
                  Tracking location always on for driver
                </label>
              </div>
            )}
            {isDriver && payRequired && (
              <div className="form-row">
                <div className="form-group">
                  <label>Subscription Plan</label>
                  <Select
                    value={formData.selectedPlanId || (subscriptionPlans?.[0]?.id || '')}
                    onChange={(e) => setFormData({...formData, selectedPlanId: e.target.value})}
                    options={subscriptionPlans.map(plan => ({
                      label: `${plan.name} (${plan.duration}) - $${plan.price}`,
                      value: plan.id
                    }))}
                  />
                </div>
              </div>
            )}

            {!payRequired && (
              <div className="form-row">
                <div className="form-group" style={{ margin: '10px 0' }}>
                  <div style={{
                    padding: '14px 18px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid #10b981',
                    borderRadius: 'var(--radius-md)',
                    color: '#10b981',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>✨ Registration is <strong>FREE</strong> for this category (Payment requirement disabled by Admin).</span>
                  </div>
                </div>
              </div>
            )}

            {payRequired && !isDriver && (
              <div className="form-row">
                <div className="form-group" style={{ margin: '10px 0' }}>
                  <div style={{
                    padding: '14px 18px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid #3b82f6',
                    borderRadius: 'var(--radius-md)',
                    color: '#3b82f6',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>💳 A flat registration fee of <strong>{formData.type === 'workshop' ? '$149.00' : formData.type === 'oil' ? '$199.00' : '$9.99'}</strong> will be charged.</span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-checkbox" style={{ marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input 
                  type="checkbox" 
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                />
                I accept the Terms and Conditions
              </label>
            </div>

            <div className="form-actions mt-md">
              <Button variant="secondary" type="button" onClick={() => window.history.back()}>Cancel</Button>
              <Button variant="primary" type="submit">Next / Submit</Button>
            </div>
          </form>
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
