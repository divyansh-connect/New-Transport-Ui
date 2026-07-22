import React, { useState } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Badge } from '../../components/common/Badge/Badge';
import { Table } from '../../components/common/Tables/Table';
import { useTheme } from '../../context/ThemeContext';
import {
  Sun,
  Moon,
  User,
  Shield,
  Bell,
  Palette,
  Save,
  CheckCircle2,
  Lock,
  Mail,
  Smartphone,
  Plus,
  Trash2,
  DollarSign,
  Layers,
  Settings2,
  UserPlus
} from 'lucide-react';
import './Settings.css';

export const Settings = () => {
  const {
    theme,
    setTheme,
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
  } = useTheme();

  const [activeTab, setActiveTab] = useState('appearance');
  const [isSaving, setIsSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  // Local Profile data
  const [profileData, setProfileData] = useState({
    name: profile?.name || 'Admin User',
    email: profile?.email || 'admin@driverlife.com',
    role: profile?.role || 'System Administrator',
    phone: profile?.phone || '+1 (555) 234-5678',
  });

  // Local Admin Add form state
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'System Admin',
    password: ''
  });

  // Local Access Config toggles
  const [accessToggles, setAccessToggles] = useState({
    activeForEveryone: subscriptionConfig.activeForEveryone,
    showVisitorServices: subscriptionConfig.showVisitorServices
  });

  // Local Plan Add form state
  const [newPlanForm, setNewPlanForm] = useState({
    name: '',
    duration: '',
    price: ''
  });

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateProfile(profileData);
      setIsSaving(false);
      setSuccessBanner('Profile details saved successfully!');
      setTimeout(() => setSuccessBanner(''), 3000);
    }, 500);
  };

  const handleSaveAccessConfig = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSubscriptionConfig(accessToggles);
      setIsSaving(false);
      setSuccessBanner('Access & visibility config saved successfully!');
      setTimeout(() => setSuccessBanner(''), 3000);
    }, 500);
  };

  const handleAddAdminSubmit = (e) => {
    e.preventDefault();
    if (!newAdminForm.name || !newAdminForm.email || !newAdminForm.password) return;
    setIsSaving(true);
    setTimeout(() => {
      addNewAdmin(newAdminForm);
      setNewAdminForm({ name: '', email: '', phone: '', role: 'System Admin', password: '' });
      setIsSaving(false);
      setSuccessBanner('New administrator added successfully!');
      setTimeout(() => setSuccessBanner(''), 3000);
    }, 800);
  };

  const handleAddPlanSubmit = (e) => {
    e.preventDefault();
    if (!newPlanForm.name || !newPlanForm.duration || !newPlanForm.price) return;
    setIsSaving(true);
    setTimeout(() => {
      addSubscriptionPlan(newPlanForm);
      setNewPlanForm({ name: '', duration: '', price: '' });
      setIsSaving(false);
      setSuccessBanner('New subscription plan added successfully!');
      setTimeout(() => setSuccessBanner(''), 3000);
    }, 800);
  };

  return (
    <div className="settings-container">
      <div className="settings-page-header">
        <div>
          <h1 className="page-title">Admin Settings Panel</h1>
          <p className="page-subtitle">Configure pricing plans, permissions, layouts, and manage system administrators.</p>
        </div>
      </div>

      {successBanner && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
          borderLeft: '4px solid #047857'
        }}>
          <CheckCircle2 size={20} />
          <span>{successBanner}</span>
        </div>
      )}

      <div className="settings-layout-grid">
        {/* Settings Tab Sidebar */}
        <div className="settings-tabs-card">
          <button
            className={`settings-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette size={18} />
            <span>Theme & Layout</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>My Profile</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            <UserPlus size={18} />
            <span>Manage Admins</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            <DollarSign size={18} />
            <span>Subscription Settings</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <Settings2 size={18} />
            <span>Access Configuration</span>
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="settings-content-area">
          {activeTab === 'appearance' && (
            <div className="settings-tab-content">
              <Card
                title="Theme Customization"
                subtitle="Select your preferred admin interface theme color mode."
              >
                <div className="theme-options-grid">
                  <div
                    className={`theme-option-card dark-option ${theme === 'dark' ? 'selected' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="theme-card-preview dark-preview" />
                    <div className="theme-option-footer">
                      <div className="theme-option-title">
                        <Moon size={18} className="text-primary" />
                        <strong>Dark Mode UI</strong>
                      </div>
                      {theme === 'dark' && <Badge variant="primary">Active</Badge>}
                    </div>
                  </div>

                  <div
                    className={`theme-option-card light-option ${theme === 'light' ? 'selected' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="theme-card-preview light-preview" />
                    <div className="theme-option-footer">
                      <div className="theme-option-title">
                        <Sun size={18} className="text-warning" />
                        <strong>Light Mode UI</strong>
                      </div>
                      {theme === 'light' && <Badge variant="primary">Active</Badge>}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="settings-tab-content">
              <Card
                title="Admin Profile Information"
                subtitle="Update your contact details and system administrator role information."
              >
                <div className="profile-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <Input
                    label="Full Name"
                    leftIcon={User}
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    leftIcon={Mail}
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                  <Input
                    label="Role / Permission"
                    value={profileData.role}
                    disabled
                    helperText="System assigned administrator permission level."
                  />
                  <Input
                    label="Phone Number"
                    leftIcon={Smartphone}
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <Button variant="primary" leftIcon={Save} isLoading={isSaving} disabled={isSaving} onClick={handleSaveProfile}>Save Profile</Button>
              </Card>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="settings-tab-content">
              <Card
                title="Manage Dashboard Administrators"
                subtitle="Add, configure roles, or revoke access for platform system admins."
              >
                <form onSubmit={handleAddAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  {/* Row 1: Name and Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input
                      label="Name"
                      value={newAdminForm.name}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={newAdminForm.email}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* Row 2: Phone and Role */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input
                      label="Phone"
                      value={newAdminForm.phone}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>Role</label>
                      <select
                        value={newAdminForm.role}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-card-border)',
                          color: 'var(--color-text-main)',
                          height: '42px'
                        }}
                      >
                        {/* <option value="Super Admin">Super Admin</option> */}
                        <option value="System Admin">System Admin</option>
                        {/* <option value="Billing Admin">Billing Admin</option> */}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Password and Add Admin Button */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'end' }}>
                    <Input
                      label="Password"
                      type="password"
                      value={newAdminForm.password}
                      onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                      required
                    />
                    <Button type="submit" variant="primary" leftIcon={Plus} isLoading={isSaving} disabled={isSaving} style={{ height: '42px', width: '100%', justifyContent: 'center' }}>Add Admin</Button>
                  </div>
                </form>

                <div style={{ overflowX: 'auto', maxHeight: '250px', overflowY: 'auto', marginTop: '16px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--color-card-border)', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>ID</th>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Name</th>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Email</th>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Role</th>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminsList.map((adm) => (
                        <tr key={adm.id} style={{ borderBottom: '1px solid var(--color-card-border)', fontSize: '14px', color: 'var(--color-text-main)' }}>
                          <td style={{ padding: '12px' }}><code>{adm.id}</code></td>
                          <td style={{ padding: '12px', fontWeight: '600' }}>{adm.name}</td>
                          <td style={{ padding: '12px' }}>{adm.email}</td>
                          <td style={{ padding: '12px' }}><Badge variant="primary">{adm.role}</Badge></td>
                          <td style={{ padding: '12px' }}>
                            <button
                              onClick={() => deleteAdmin(adm.id)}
                              style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                              title="Revoke Admin Access"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="settings-tab-content">
              <Card
                title="Create Subscription Plan"
                subtitle="Define a new driver tracking access plan rate and duration."
              >
                <form onSubmit={handleAddPlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input
                      label="Plan Name"
                      placeholder="e.g. Monthly Standard"
                      value={newPlanForm.name}
                      onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Duration"
                      placeholder="e.g. 1 Month"
                      value={newPlanForm.duration}
                      onChange={(e) => setNewPlanForm({ ...newPlanForm, duration: e.target.value })}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'end' }}>
                    <Input
                      label="Price ($)"
                      type="number"
                      placeholder="e.g. 49.99"
                      value={newPlanForm.price}
                      onChange={(e) => setNewPlanForm({ ...newPlanForm, price: e.target.value })}
                      required
                    />
                    <Button type="submit" variant="primary" leftIcon={Plus} isLoading={isSaving} disabled={isSaving} style={{ height: '42px', width: '100%', justifyContent: 'center' }}>Add Plan</Button>
                  </div>
                </form>
              </Card>

              <Card
                title="Active Subscription Plans"
                subtitle="Review and manage existing pricing models."
              >
                <div style={{ overflowX: 'auto', maxHeight: '200px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--color-card-border)', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Plan ID</th>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Plan Name</th>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Duration</th>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Price</th>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionPlans.map((plan) => (
                        <tr key={plan.id} style={{ borderBottom: '1px solid var(--color-card-border)', fontSize: '14px', color: 'var(--color-text-main)' }}>
                          <td style={{ padding: '12px' }}><code>{plan.id}</code></td>
                          <td style={{ padding: '12px', fontWeight: '600' }}>{plan.name}</td>
                          <td style={{ padding: '12px' }}>{plan.duration}</td>
                          <td style={{ padding: '12px', color: 'var(--color-primary)', fontWeight: '700' }}>${plan.price}</td>
                          <td style={{ padding: '12px' }}>
                            <button
                              onClick={() => deleteSubscriptionPlan(plan.id)}
                              style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                              title="Delete Plan"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="settings-tab-content">
              <Card
                title="Visibility & Access Control Toggles"
                subtitle="Control map capabilities and platform paywall policies for different user roles."
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-main)' }}>Enable Paywall for Drivers</strong>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>If enabled, Drivers must pay the active subscription rate to go Live.</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={accessToggles.activeForEveryone}
                        onChange={(e) => setAccessToggles({ ...accessToggles, activeForEveryone: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--color-text-main)' }}>Allow Visitors to View Service Hubs</strong>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>If enabled, visitors see themselves and all static service points (Workshops/Oil centers). Visitors remain completely private.</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={accessToggles.showVisitorServices}
                        onChange={(e) => setAccessToggles({ ...accessToggles, showVisitorServices: e.target.checked })}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <Button variant="primary" leftIcon={Save} isLoading={isSaving} disabled={isSaving} onClick={handleSaveAccessConfig}>Save Access Config</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
