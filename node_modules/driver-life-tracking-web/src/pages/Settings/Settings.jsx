import React, { useState } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { useTheme } from '../../context/ThemeContext';
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
        </div>
      </div>
    </div>
  );
};
