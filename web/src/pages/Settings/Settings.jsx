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
    updateSubscriptionConfig,
    activeSettingsTab: activeTab,
    setActiveSettingsTab: setActiveTab
  } = useTheme();

  const [isSaving, setIsSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  // Local Profile data
  const [profileData, setProfileData] = useState({
    name: profile?.name || 'Admin User',
    email: profile?.email || 'admin@userlife.com',
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
    paymentRequiredFor: subscriptionConfig.paymentRequiredFor || {
      driver: true,
      workshop: false,
      visitor: false,
      oilchange: false
    },
    showVisitorServices: subscriptionConfig.showVisitorServices
  });

  // Local Plan Add form state
  const [newPlanForm, setNewPlanForm] = useState({
    name: '',
    duration: '',
    price: ''
  });

  const [freeTrialEnabled, setFreeTrialEnabled] = useState(subscriptionConfig.freeTrialEnabled);
  const [freeTrialDuration, setFreeTrialDuration] = useState(subscriptionConfig.freeTrialDuration);

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateProfile(profileData);
      setIsSaving(false);
      setSuccessBanner('Profile details saved successfully!');
      setTimeout(() => setSuccessBanner(''), 3000);
    }, 500);
  };

  const handleSaveFreeTrial = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSubscriptionConfig({ freeTrialEnabled, freeTrialDuration });
      setIsSaving(false);
      setSuccessBanner('Free Trial settings saved successfully!');
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
                <div className="profile-form-grid">
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
                <form onSubmit={handleAddAdminSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
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
                  <Input
                    label="Phone"
                    value={newAdminForm.phone}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                    required
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
                      <option value="System Admin">System Admin</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                    <Button type="submit" variant="primary" leftIcon={Plus} isLoading={isSaving} disabled={isSaving} style={{ height: '42px', width: '100%', justifyContent: 'center' }}>Add Admin</Button>
                  </div>
                </form>

                <div style={{ overflowX: 'auto', maxHeight: '250px', overflowY: 'auto', marginTop: '16px' }}>
                  <table className="desktop-view-only" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--color-card-border)', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>ID</th>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Name</th>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Email</th>
                        <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Phone</th>
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
                          <td style={{ padding: '12px' }}>{adm.phone || '—'}</td>
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

                  <div className="mobile-view-only">
                    {adminsList.map((adm) => (
                      <div key={adm.id} style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-card-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{adm.name}</span>
                          <button
                            onClick={() => deleteAdmin(adm.id)}
                            style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title="Revoke Admin Access"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>ID: <code>{adm.id}</code></span>
                          <Badge variant="primary">{adm.role}</Badge>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                          {adm.email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="settings-tab-content">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
                <Card
                  title="Create Subscription Plan"
                  subtitle="Define a new driver tracking access plan rate and duration."
                >
                  <form onSubmit={handleAddPlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                    <div className="admin-form-row">
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
                    <div className="admin-form-row align-end">
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
                  title="Free Trial Configuration"
                  subtitle="Configure a free trial period before users/drivers are charged."
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        id="enable-free-trial"
                        checked={freeTrialEnabled}
                        onChange={(e) => setFreeTrialEnabled(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label htmlFor="enable-free-trial" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)', cursor: 'pointer' }}>
                        Enable Free Trial Period
                      </label>
                    </div>

                    <div style={{ maxWidth: '400px', opacity: freeTrialEnabled ? 1 : 0.5, pointerEvents: freeTrialEnabled ? 'auto' : 'none', transition: 'opacity 0.2s ease' }}>
                      <Input
                        label="Trial Duration"
                        placeholder="e.g. 1 Month, 15 Days"
                        value={freeTrialDuration}
                        onChange={(e) => setFreeTrialDuration(e.target.value)}
                        required={freeTrialEnabled}
                        disabled={!freeTrialEnabled}
                      />
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <Button
                        onClick={handleSaveFreeTrial}
                        variant="primary"
                        leftIcon={Save}
                        isLoading={isSaving}
                        disabled={isSaving}
                      >
                        Save Trial Settings
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <Card
                title="Active Subscription Plans"
                subtitle="Review and manage existing pricing models."
              >
                <div style={{ overflowX: 'auto', maxHeight: '200px', overflowY: 'auto' }}>
                  <table className="desktop-view-only" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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

                  <div className="mobile-view-only">
                    {subscriptionPlans.map((plan) => (
                      <div key={plan.id} style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-card-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{plan.name}</span>
                          <button
                            onClick={() => deleteSubscriptionPlan(plan.id)}
                            style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title="Delete Plan"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>ID: <code>{plan.id}</code></span>
                          <span style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '14px' }}>${plan.price}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                          Duration: {plan.duration}
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <div style={{ borderBottom: '1px solid var(--color-card-border)', paddingBottom: '20px', marginBottom: '8px' }}>
                    <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--color-text-main)' }}>Payment Requirements Control</strong>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '16px' }}>
                      Configure which registering user categories are required to pay fees.
                    </span>

                    {/* Quick Preset Buttons */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                      <Button 
                        type="button"
                        variant="secondary" 
                        size="sm" 
                        onClick={() => setAccessToggles({
                          ...accessToggles,
                          paymentRequiredFor: { driver: true, workshop: true, visitor: true, oilchange: true }
                        })}
                      >
                        Enable for Everyone
                      </Button>
                      <Button 
                        type="button"
                        variant="secondary" 
                        size="sm" 
                        onClick={() => setAccessToggles({
                          ...accessToggles,
                          paymentRequiredFor: { driver: false, workshop: false, visitor: false, oilchange: false }
                        })}
                      >
                        Disable for Everyone
                      </Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                          type="checkbox"
                          id="pay-driver"
                          checked={!!accessToggles.paymentRequiredFor?.driver}
                          onChange={(e) => setAccessToggles({
                            ...accessToggles,
                            paymentRequiredFor: { ...accessToggles.paymentRequiredFor, driver: e.target.checked }
                          })}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor="pay-driver" style={{ fontSize: '14px', color: 'var(--color-text-main)', cursor: 'pointer' }}>
                          Enable payment only for <strong>Drivers</strong>
                        </label>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                          type="checkbox"
                          id="pay-workshop"
                          checked={!!accessToggles.paymentRequiredFor?.workshop}
                          onChange={(e) => setAccessToggles({
                            ...accessToggles,
                            paymentRequiredFor: { ...accessToggles.paymentRequiredFor, workshop: e.target.checked }
                          })}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor="pay-workshop" style={{ fontSize: '14px', color: 'var(--color-text-main)', cursor: 'pointer' }}>
                          Enable payment only for <strong>Workshops</strong>
                        </label>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                          type="checkbox"
                          id="pay-visitor"
                          checked={!!accessToggles.paymentRequiredFor?.visitor}
                          onChange={(e) => setAccessToggles({
                            ...accessToggles,
                            paymentRequiredFor: { ...accessToggles.paymentRequiredFor, visitor: e.target.checked }
                          })}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor="pay-visitor" style={{ fontSize: '14px', color: 'var(--color-text-main)', cursor: 'pointer' }}>
                          Enable payment only for <strong>Visitors</strong>
                        </label>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                          type="checkbox"
                          id="pay-oilchange"
                          checked={!!accessToggles.paymentRequiredFor?.oilchange}
                          onChange={(e) => setAccessToggles({
                            ...accessToggles,
                            paymentRequiredFor: { ...accessToggles.paymentRequiredFor, oilchange: e.target.checked }
                          })}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor="pay-oilchange" style={{ fontSize: '14px', color: 'var(--color-text-main)', cursor: 'pointer' }}>
                          Enable payment only for <strong>Oil Changes</strong>
                        </label>
                      </div>
                    </div>
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
