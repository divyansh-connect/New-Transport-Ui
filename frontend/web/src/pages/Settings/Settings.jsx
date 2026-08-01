import React, { useState, useEffect } from 'react';
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
  Edit2,
  DollarSign,
  Layers,
  Settings2,
  UserPlus,
  Users,
  CheckSquare,
  Key
} from 'lucide-react';
import './Settings.css';
import { API_BASE_URL } from '../../config';

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
    role: 'admin',
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

  const API_BASE = API_BASE_URL;
  const adminToken = localStorage.getItem('admin_token');
  const [dbAdmins, setDbAdmins] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState('admin');

  // Dynamic Categories states & handlers
  const [settingsCategories, setSettingsCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    iconName: 'map-pin',
    pinColor: '#2563EB',
    isActive: true,
    displayOrder: 0
  });

  const fetchSettingsCategories = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE_URL}/service-types`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSettingsCategories(data);
      }
    } catch (err) {
      console.log('Error loading categories:', err);
    }
  };

  useEffect(() => {
    fetchSettingsCategories();
  }, []);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const isEdit = !!editingCategory;
      const url = isEdit ? `${API_BASE}/service-types/${editingCategory.id}` : `${API_BASE}/service-types`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(categoryForm)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category.');
      }
      setCategoryForm({ name: '', iconName: 'map-pin', pinColor: '#2563EB', isActive: true, displayOrder: 0 });
      setEditingCategory(null);
      setSuccessBanner(isEdit ? '✅ Category updated successfully!' : '✅ New Category created successfully!');
      fetchSettingsCategories();
    } catch (err) {
      setSuccessBanner(`❌ ${err.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessBanner(''), 5000);
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Are you sure you want to permanently delete this service category?')) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/service-types/${catId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete category.');
      }
      setSuccessBanner('✅ Category deleted successfully.');
      fetchSettingsCategories();
    } catch (err) {
      setSuccessBanner(`❌ ${err.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessBanner(''), 5000);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`${API_BASE}/users/profile`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUserRole(data.role || 'admin');
        }
      } catch (err) {
        console.warn('Could not fetch user profile:', err);
      }
    };
    fetchProfile();
  }, [API_BASE]);

  // Fetch admin users from DB
  const fetchAdminsFromDb = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/users?role=admin`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map(u => ({
            id: u.customId || u.id,
            realId: u.id,
            name: u.name,
            email: u.email || '—',
            phone: u.mobileNo || '—',
            role: u.role === 'admin' ? 'System Admin' : u.role
          }));
          setDbAdmins(formatted);
        }
      }
    } catch (err) {
      console.warn('Could not fetch admins from DB:', err);
    }
  };

  // State for Coworkers / Staff Granular Permissions
  const [dbCoworkers, setDbCoworkers] = useState([]);
  const [selectedCoworkerId, setSelectedCoworkerId] = useState('');
  const [coworkerPerms, setCoworkerPerms] = useState([]);
  const [newCoworkerForm, setNewCoworkerForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const MODULES_LIST = [
    'Dashboard',
    'Users',
    'Categories',
    'Payments',
    'Notices',
    'Inquiries',
    'Settings',
    'Notifications'
  ];

  const fetchCoworkersFromDb = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/coworkers`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setDbCoworkers(data);
          if (data.length > 0) {
            setSelectedCoworkerId(prev => {
              const match = data.find(c => c.id === prev);
              const target = match || data[0];
              setCoworkerPerms(target.permissions || []);
              return target.id;
            });
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch coworkers from DB:', e);
    }
  };

  useEffect(() => {
    fetchAdminsFromDb();
    fetchCoworkersFromDb();
  }, []);

  const handleSelectCoworker = (cwId) => {
    setSelectedCoworkerId(cwId);
    const target = dbCoworkers.find(c => c.id === cwId);
    if (target) {
      setCoworkerPerms(target.permissions || []);
    }
  };

  const handleTogglePerm = (moduleName, actionField) => {
    setCoworkerPerms(prev => {
      const existing = prev.find(p => p.moduleName === moduleName);
      if (existing) {
        return prev.map(p => p.moduleName === moduleName ? { ...p, [actionField]: !p[actionField] } : p);
      } else {
        return [
          ...prev,
          {
            moduleName,
            canView: actionField === 'canView',
            canAdd: actionField === 'canAdd',
            canEdit: actionField === 'canEdit',
            canDelete: actionField === 'canDelete'
          }
        ];
      }
    });
  };

  const handleSaveCoworkerPerms = async () => {
    if (!selectedCoworkerId) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/coworkers/${selectedCoworkerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ permissions: coworkerPerms })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update permissions.');
      setSuccessBanner('✅ Coworker module permissions saved to database!');
      fetchCoworkersFromDb();
    } catch (err) {
      setSuccessBanner(`❌ ${err.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessBanner(''), 4000);
    }
  };

  const handleAddCoworkerSubmit = async (e) => {
    e.preventDefault();
    if (!newCoworkerForm.name || !newCoworkerForm.phone || !newCoworkerForm.password) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/coworkers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: newCoworkerForm.name,
          email: newCoworkerForm.email,
          mobileNo: newCoworkerForm.phone,
          password: newCoworkerForm.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create coworker staff.');
      setNewCoworkerForm({ name: '', email: '', phone: '', password: '' });
      setSuccessBanner('✅ New Coworker / Sub-Admin account created successfully!');
      fetchCoworkersFromDb();
    } catch (err) {
      setSuccessBanner(`❌ ${err.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessBanner(''), 4000);
    }
  };

  const handleDeleteCoworkerSubmit = async (cwId) => {
    if (!window.confirm('Are you sure you want to delete this coworker staff account?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`${API_BASE}/coworkers/${cwId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      setSuccessBanner('Coworker staff account permanently removed.');
      fetchCoworkersFromDb();
    } catch (err) {
      setSuccessBanner(`❌ ${err.message}`);
    } finally {
      setTimeout(() => setSuccessBanner(''), 3000);
    }
  };

  // Load live settings from DB on mount
  useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then(r => r.json())
      .then(data => {
        if (data && data.paymentRequiredFor) {
          setAccessToggles(prev => ({
            ...prev,
            paymentRequiredFor: data.paymentRequiredFor,
            showVisitorServices: data.showVisitorServices,
          }));
          setFreeTrialEnabled(data.freeTrialEnabled);
          setFreeTrialDuration(data.freeTrialDuration);
          updateSubscriptionConfig({
            paymentRequiredFor: data.paymentRequiredFor,
            showVisitorServices: data.showVisitorServices,
            freeTrialEnabled: data.freeTrialEnabled,
            freeTrialDuration: data.freeTrialDuration,
          });
        }
      })
      .catch(err => console.warn('Could not load platform settings:', err));

    fetchAdminsFromDb();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateProfile(profileData);
      setIsSaving(false);
      setSuccessBanner('Profile details saved successfully!');
      setTimeout(() => setSuccessBanner(''), 3000);
    }, 500);
  };

  const handleSaveFreeTrial = async () => {
    setIsSaving(true);
    try {
      await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ freeTrialEnabled, freeTrialDuration })
      });
      updateSubscriptionConfig({ freeTrialEnabled, freeTrialDuration });
      setSuccessBanner('Free Trial settings saved successfully!');
    } catch (err) {
      setSuccessBanner('Error: Could not save Free Trial settings.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessBanner(''), 3000);
    }
  };

  const handleSaveAccessConfig = async () => {
    setIsSaving(true);
    try {
      await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(accessToggles)
      });
      updateSubscriptionConfig(accessToggles);
      setSuccessBanner('✅ Access & visibility config saved to database!');
    } catch (err) {
      setSuccessBanner('❌ Error: Could not save access config.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessBanner(''), 3000);
    }
  };

  const handleAddAdminSubmit = async (e) => {
    e.preventDefault();
    if (!newAdminForm.name || !newAdminForm.email || !newAdminForm.password) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const isSuperAdmin = newAdminForm.role === 'admin';
      
      const endpoint = isSuperAdmin ? `${API_BASE}/auth/register` : `${API_BASE}/coworkers`;
      const bodyPayload = isSuperAdmin ? {
        name: newAdminForm.name,
        email: newAdminForm.email,
        mobileNo: newAdminForm.phone || `+9665${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: newAdminForm.password,
        role: 'admin',
        status: 'Approved',
        paymentStatus: 'Paid',
        subscriptionDuration: 'Lifetime',
        amountPaid: '$0.00'
      } : {
        name: newAdminForm.name,
        email: newAdminForm.email,
        mobileNo: newAdminForm.phone || `+9665${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: newAdminForm.password
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account.');
      }
      setNewAdminForm({ name: '', email: '', phone: '', role: 'admin', password: '' });
      setSuccessBanner(`✅ New ${isSuperAdmin ? 'administrator' : 'sub-admin staff member'} created in database successfully!`);
      fetchAdminsFromDb();
      fetchCoworkersFromDb();
    } catch (err) {
      setSuccessBanner(`❌ ${err.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessBanner(''), 5000);
    }
  };

  const handleDeleteAdminSubmit = async (adm) => {
    const isCoworker = adm.role === 'coworker' || adm.role === 'Sub-Admin / Staff' || adm.isCoworker;
    const confirmMsg = `Are you sure you want to permanently delete this ${isCoworker ? 'staff account' : 'administrator account'}?`;
    if (!window.confirm(confirmMsg)) return;

    const targetId = adm.realId || adm.id;
    try {
      const token = localStorage.getItem('admin_token');
      const endpoint = isCoworker ? `${API_BASE}/coworkers/${targetId}` : `${API_BASE}/users/${targetId}`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete user.');
      }
      setSuccessBanner('✅ Account permanently removed.');
      fetchAdminsFromDb();
      fetchCoworkersFromDb();
    } catch (err) {
      setSuccessBanner(`❌ ${err.message}`);
    } finally {
      setTimeout(() => setSuccessBanner(''), 3000);
    }
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
          {currentUserRole === 'admin' && (
            <>
              <button
                className={`settings-tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
                onClick={() => setActiveTab('admins')}
              >
                <UserPlus size={18} />
                <span>Manage Admins & Staff</span>
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
              <button
                className={`settings-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <Layers size={18} />
                <span>Manage Categories</span>
              </button>
            </>
          )}
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
            <div className="settings-tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Card
                title="Manage Dashboard Admins & Sub-Admin Staff"
                subtitle="Create and configure access control rules for platform administrators and sub-admin coworkers."
              >
                <form onSubmit={handleAddAdminSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  <Input
                    label="Name"
                    placeholder="Full name"
                    value={newAdminForm.name}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone"
                    placeholder="Mobile number"
                    value={newAdminForm.phone}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Account password"
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                    required
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>Role Type</label>
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
                      <option value="admin">Super Admin (Full Access)</option>
                      <option value="coworker">Sub-Admin / Staff (Custom Access)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                    <Button type="submit" variant="primary" leftIcon={Plus} isLoading={isSaving} disabled={isSaving} style={{ height: '42px', width: '100%', justifyContent: 'center' }}>Create Account</Button>
                  </div>
                </form>

                {(() => {
                  const displayAdminsList = [
                    ...dbAdmins.map(a => ({ ...a, isCoworker: false })),
                    ...dbCoworkers.map(c => ({
                      id: c.customId || c.id,
                      realId: c.id,
                      name: c.name,
                      email: c.email || '—',
                      phone: c.mobileNo || '—',
                      role: 'Sub-Admin / Staff',
                      isCoworker: true
                    }))
                  ];

                  return (
                    <div style={{ overflowX: 'auto', maxHeight: '350px', overflowY: 'auto', marginTop: '16px' }}>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                        💡 <strong>Tip:</strong> Click on any <em>Sub-Admin / Staff</em> row to configure their module permission matrix below.
                      </p>
                      <table className="desktop-view-only" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--color-card-border)', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                            <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>ID</th>
                            <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Name</th>
                            <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Email</th>
                            <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Phone</th>
                            <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Role Type</th>
                            <th style={{ padding: '12px', position: 'sticky', top: 0, backgroundColor: 'var(--color-card-bg)', zIndex: 1 }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayAdminsList.map((adm) => {
                            const isSelected = adm.isCoworker && selectedCoworkerId === adm.realId;
                            return (
                              <tr 
                                key={adm.id} 
                                onClick={() => {
                                  if (adm.isCoworker) {
                                    handleSelectCoworker(adm.realId);
                                  } else {
                                    setSelectedCoworkerId('');
                                  }
                                }}
                                style={{ 
                                  borderBottom: '1px solid var(--color-card-border)', 
                                  fontSize: '14px', 
                                  color: 'var(--color-text-main)',
                                  cursor: adm.isCoworker ? 'pointer' : 'default',
                                  backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                                  transition: 'background-color 0.15s ease'
                                }}
                              >
                                <td style={{ padding: '12px' }}><code>{adm.id}</code></td>
                                <td style={{ padding: '12px', fontWeight: '600' }}>{adm.name}</td>
                                <td style={{ padding: '12px' }}>{adm.email}</td>
                                <td style={{ padding: '12px' }}>{adm.phone || '—'}</td>
                                <td style={{ padding: '12px' }}>
                                  <Badge variant={adm.isCoworker ? 'secondary' : 'primary'}>{adm.role}</Badge>
                                </td>
                                <td style={{ padding: '12px' }}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteAdminSubmit(adm);
                                    }}
                                    style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                                    title="Revoke Access"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      <div className="mobile-view-only" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {displayAdminsList.map((adm) => {
                          const isSelected = adm.isCoworker && selectedCoworkerId === adm.realId;
                          return (
                            <div 
                              key={adm.id} 
                              onClick={() => {
                                  if (adm.isCoworker) {
                                    handleSelectCoworker(adm.realId);
                                  } else {
                                    setSelectedCoworkerId('');
                                  }
                              }}
                              style={{
                                backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.08)' : 'var(--color-surface)',
                                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-card-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                cursor: adm.isCoworker ? 'pointer' : 'default'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{adm.name}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAdminSubmit(adm);
                                  }}
                                  style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                  title="Revoke Access"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>ID: <code>{adm.id}</code></span>
                                <Badge variant={adm.isCoworker ? 'secondary' : 'primary'}>{adm.role}</Badge>
                              </div>
                              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                {adm.email}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </Card>

              {/* Granular Module Permission Matrix (Unified Display) */}
              {selectedCoworkerId ? (
                <Card
                  title={`Module Permission Matrix — ${dbCoworkers.find(c => c.id === selectedCoworkerId)?.name || 'Selected Sub-Admin'}`}
                  subtitle="Configure granular module access (Can View, Can Add, Can Edit, Can Delete) for this staff member."
                >
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                          <th style={{ padding: '12px', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>Module Name</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>Can View</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>Can Add</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>Can Edit</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>Can Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MODULES_LIST.map((mod) => {
                          const perm = coworkerPerms.find(p => p.moduleName === mod) || {};
                          return (
                            <tr key={mod} style={{ borderBottom: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                                {(() => {
                                  const mapping = {
                                    'Dashboard': 'Dashboard',
                                    'Users': 'User Requests',
                                    'Categories': 'Service Categories',
                                    'Payments': 'Payments',
                                    'Notices': 'Opportunity',
                                    'Inquiries': 'Contact',
                                    'Settings': 'User & Settings',
                                    'Notifications': 'Notifications'
                                  };
                                  return mapping[mod] || mod;
                                })()}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={Boolean(perm.canView)}
                                  onChange={() => handleTogglePerm(mod, 'canView')}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={Boolean(perm.canAdd)}
                                  onChange={() => handleTogglePerm(mod, 'canAdd')}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={Boolean(perm.canEdit)}
                                  onChange={() => handleTogglePerm(mod, 'canEdit')}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={Boolean(perm.canDelete)}
                                  onChange={() => handleTogglePerm(mod, 'canDelete')}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="primary"
                      leftIcon={Save}
                      isLoading={isSaving}
                      disabled={isSaving}
                      onClick={handleSaveCoworkerPerms}
                    >
                      Save Module Permission Matrix
                    </Button>
                  </div>
                </Card>
              ) : (
                <div style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--color-card-border)',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-bg-card)'
                }}>
                  ℹ️ Click on any <strong>Sub-Admin / Staff</strong> member in the table above to configure their custom module permission matrix.
                </div>
              )}
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

          {activeTab === 'categories' && (
            <div className="settings-tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Card
                title={editingCategory ? "Edit Service Category" : "Add Dynamic Service Category"}
                subtitle="Create a new service category (e.g. Supermarket, Gym) with specific icon, map pin color, status, and display ordering."
              >
                <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input
                      label="Category Name"
                      placeholder="e.g. Hospital"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      required
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>Lucide Icon Name</label>
                      <select
                        value={categoryForm.iconName}
                        onChange={(e) => setCategoryForm({ ...categoryForm, iconName: e.target.value })}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-card-border)',
                          color: 'var(--color-text-main)',
                          height: '42px'
                        }}
                      >
                        <option value="map-pin">📍 Default Pin (map-pin)</option>
                        <option value="user">👤 User / Person (user)</option>
                        <option value="truck">🚚 Truck / Driver (truck)</option>
                        <option value="wrench">🔧 Workshop / Repair (wrench)</option>
                        <option value="droplet">💧 Oil Change / Drop (droplet)</option>
                        <option value="shopping-cart">🛒 Supermarket / Shop (shopping-cart)</option>
                        <option value="activity">🏥 Hospital / Health (activity)</option>
                        <option value="database">📦 Warehouse / Storage (database)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>Map Pin Color</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={categoryForm.pinColor}
                          onChange={(e) => setCategoryForm({ ...categoryForm, pinColor: e.target.value })}
                          style={{ width: '42px', height: '42px', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', padding: '2px' }}
                        />
                        <Input
                          value={categoryForm.pinColor}
                          onChange={(e) => setCategoryForm({ ...categoryForm, pinColor: e.target.value })}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                      <input
                        type="checkbox"
                        id="cat-active"
                        checked={categoryForm.isActive}
                        onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label htmlFor="cat-active" style={{ fontSize: '14px', color: 'var(--color-text-main)', cursor: 'pointer', fontWeight: '600' }}>
                        Category is Active
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button type="submit" variant="primary">{editingCategory ? "Save Changes" : "Create Category"}</Button>
                    {editingCategory && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setEditingCategory(null);
                          setCategoryForm({ name: '', iconName: 'map-pin', pinColor: '#2563EB', isActive: true, displayOrder: 0 });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Card>

              <Card
                title="Active Categories Registry"
                subtitle="All generic services configured in the system. Note: Default categories cannot be deleted if users are registered under them."
              >
                <Table
                  headers={['Category Name', 'Slug', 'Icon name', 'Color Theme', 'Status', 'Actions']}
                  data={settingsCategories}
                  renderRow={(cat) => (
                    <tr key={cat.id}>
                      <td><strong>{cat.name}</strong></td>
                      <td><code>{cat.slug}</code></td>
                      <td><code>{cat.iconName}</code></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cat.pinColor }} />
                          <code>{cat.pinColor}</code>
                        </div>
                      </td>
                      <td>
                        <Badge variant={cat.isActive ? 'success' : 'neutral'}>
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={Edit2}
                            onClick={() => {
                              setEditingCategory(cat);
                              setCategoryForm({
                                name: cat.name,
                                iconName: cat.iconName,
                                pinColor: cat.pinColor,
                                isActive: cat.isActive,
                                displayOrder: cat.displayOrder
                              });
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={Trash2}
                            onClick={() => handleDeleteCategory(cat.id)}
                            style={{ color: '#ef4444' }}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </Card>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};
