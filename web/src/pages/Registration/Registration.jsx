import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Cards/Card';
import { Button } from '../../components/common/Button/Button';
import { Input, Select } from '../../components/common/Input/Input';
import { Modal } from '../../components/common/Modal/Modal';
import { User, UserPlus, Mail, Phone, MapPin, Truck, CheckSquare } from 'lucide-react';
import './Registration.css';

export const Registration = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState({
    type: 'driver',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    plateNumber: '',
    trackingEnabled: true,
    termsAccepted: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setAlertMessage('First Name and Last Name are required.');
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
    
    // Create new record
    const newRecord = {
      id: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${formData.firstName} ${formData.lastName}`,
      type: formData.type === 'driver' ? 'Commercial Driver' : formData.type === 'workshop' ? 'Repair Station' : 'Oil Change Center',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      amount: '$49.99'
    };
    
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
                    { label: 'Oil Change Center', value: 'oil' }
                  ]}
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <Input 
                  placeholder="First name" 
                  leftIcon={User} 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Last Name</label>
                <Input 
                  placeholder="Last name" 
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
              {formData.type === 'driver' && (
                <div className="form-group">
                  <label>Plate Number</label>
                  <Input 
                    placeholder="e.g. ABC-1234" 
                    leftIcon={Truck} 
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                  />
                </div>
              )}
            </div>

            {formData.type === 'driver' && (
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
