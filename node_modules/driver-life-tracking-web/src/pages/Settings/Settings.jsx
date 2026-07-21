import React, { useState } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Button } from '../../components/common/Button/Button';
import { Input, Select } from '../../components/common/Input/Input';
import { Badge } from '../../components/common/Badge/Badge';
import { useTheme } from '../../context/ThemeContext';
<<<<<<< HEAD
import {
  Sun,
  Moon,
  User,
  Shield,
  Bell,
  Palette,
  Save,
  Check,
  Lock,
  Mail,
  Smartphone
} from 'lucide-react';
import './Settings.css';

export const Settings = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@driverlife.com',
    role: 'System Administrator',
    phone: '+1 (555) 234-5678',
    timezone: 'UTC-05:00 Eastern Time',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    newDriverPush: true,
    serviceHubAlerts: true,
    weeklyReport: false,
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="settings-container">
      <div className="settings-page-header">
        <div>
          <h1 className="page-title">Admin Dashboard Settings</h1>
          <p className="page-subtitle">Configure layout theme, user profile, security preferences, and system notifications.</p>
        </div>
        <Button
          variant="primary"
          leftIcon={Save}
          isLoading={isSaving}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>

      <div className="settings-layout-grid">
        {/* Settings Tab Sidebar */}
        <div className="settings-tabs-card">
          <button
            className={`settings-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette size={18} />
            <span>Theme & Appearance</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile Details</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} />
            <span>Security & Auth</span>
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
                  {/* Dark Mode Card */}
                  <div
                    className={`theme-option-card dark-option ${theme === 'dark' ? 'selected' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="theme-card-preview dark-preview">
                      <div className="preview-navbar" />
                      <div className="preview-content">
                        <div className="preview-block" />
                        <div className="preview-block short" />
                      </div>
                    </div>
                    <div className="theme-option-footer">
                      <div className="theme-option-title">
                        <Moon size={18} className="text-primary" />
                        <strong>Dark Mode UI</strong>
                      </div>
                      {theme === 'dark' && <Badge variant="primary">Active</Badge>}
                    </div>
                  </div>

                  {/* Light Mode Card */}
                  <div
                    className={`theme-option-card light-option ${theme === 'light' ? 'selected' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="theme-card-preview light-preview">
                      <div className="preview-navbar" />
                      <div className="preview-content">
                        <div className="preview-block" />
                        <div className="preview-block short" />
                      </div>
                    </div>
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

              <Card
                title="Layout Display Preferences"
                subtitle="Customize UI spacing, sidebar default state, and animations."
              >
                <div className="setting-toggle-row">
                  <div>
                    <strong>Compact Layout Spacing</strong>
                    <p className="setting-desc">Reduce layout margins for higher density dashboards.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={false} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="setting-toggle-row">
                  <div>
                    <strong>Enable Micro-Animations</strong>
                    <p className="setting-desc">Smooth UI transitions and interactive hover effects.</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={true} />
                    <span className="toggle-slider" />
                  </label>
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
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-tab-content">
              <Card
                title="Alert & Notification Subscriptions"
                subtitle="Control when and how you receive admin platform alerts."
              >
                <div className="setting-toggle-row">
                  <div>
                    <strong>New Driver Approvals Alert</strong>
                    <p className="setting-desc">Instant notification when a new driver registers.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newDriverPush}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, newDriverPush: e.target.checked })
                      }
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="setting-toggle-row">
                  <div>
                    <strong>Service Hub Verification Notifications</strong>
                    <p className="setting-desc">Alerts when oil change centers or workshops register.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.serviceHubAlerts}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, serviceHubAlerts: e.target.checked })
                      }
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-tab-content">
              <Card
                title="Security & Password"
                subtitle="Manage authentication options and change admin account credentials."
              >
                <div className="profile-form-grid">
                  <Input label="Current Password" type="password" leftIcon={Lock} placeholder="••••••••" />
                  <Input label="New Password" type="password" leftIcon={Lock} placeholder="••••••••" />
                </div>
              </Card>
            </div>
          )}
=======
import { Globe, Bell, Moon, Sun, Smartphone, Mail, Shield } from 'lucide-react';
import './Settings.css';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="page-container settings-page">
      <div className="page-header">
        <h1>System Settings</h1>
        <p>Manage localization, appearance, and communication preferences.</p>
      </div>

      <div className="settings-grid">
        <div className="settings-column">
          <Card title="Appearance & Theme" subtitle="Customize the admin dashboard interface.">
            <div className="settings-row">
              <div className="settings-info">
                <div className="icon-box"><Moon size={20} /></div>
                <div>
                  <h4>Dark Mode</h4>
                  <p>Current active theme: {theme.toUpperCase()}</p>
                </div>
              </div>
              <button 
                className={`theme-toggle ${theme === 'dark' ? 'active' : ''}`}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>
          </Card>

          <Card title="Localization & Language" subtitle="Set your regional preferences.">
            <div className="settings-form">
              <div className="form-group">
                <label className="d-flex align-center gap-xs"><Globe size={16} /> Display Language</label>
                <select className="form-control" defaultValue="en">
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>
              <div className="form-group mt-md">
                <label className="d-flex align-center gap-xs"><Globe size={16} /> Timezone</label>
                <select className="form-control" defaultValue="ist">
                  <option value="utc">UTC (Coordinated Universal Time)</option>
                  <option value="est">EST (Eastern Standard Time)</option>
                  <option value="ist">IST (Indian Standard Time)</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        <div className="settings-column">
          <Card title="Notification Preferences" subtitle="Control how you receive alerts and updates.">
            <div className="toggle-list">
              <div className="toggle-item">
                <div className="settings-info">
                  <div className="icon-box bg-primary"><Mail size={18} /></div>
                  <div>
                    <h4>Email Notifications</h4>
                    <p>Receive daily summaries and critical alerts via email.</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={notifications.email} onChange={() => toggleNotification('email')} />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="settings-info">
                  <div className="icon-box bg-success"><Smartphone size={18} /></div>
                  <div>
                    <h4>SMS Alerts</h4>
                    <p>Text messages for urgent dispatch issues.</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={notifications.sms} onChange={() => toggleNotification('sms')} />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="toggle-item">
                <div className="settings-info">
                  <div className="icon-box bg-warning"><Bell size={18} /></div>
                  <div>
                    <h4>Push Notifications</h4>
                    <p>Browser notifications for real-time updates.</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={notifications.push} onChange={() => toggleNotification('push')} />
                  <span className="slider round"></span>
                </label>
              </div>
              
              <div className="toggle-item">
                <div className="settings-info">
                  <div className="icon-box bg-muted"><Shield size={18} /></div>
                  <div>
                    <h4>Marketing & News</h4>
                    <p>Updates about new features and partnerships.</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={notifications.marketing} onChange={() => toggleNotification('marketing')} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </Card>
>>>>>>> ffff98a3d8fb31d5a6da9946db77ef5cd78da7ad
        </div>
      </div>
    </div>
  );
};
