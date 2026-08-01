import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wrench,
  Bell,
  Briefcase,
  PhoneCall,
  Settings,
  Car,
  HelpCircle,
  X,
  LogOut,
  ChevronDown,
  User
} from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import { useDrivers } from '../../../../context/DriverContext';
import './Sidebar.css';
import { API_BASE_URL } from '../../../../config';

export const Sidebar = ({ isCollapsed, isMobileOpen, onCloseMobile }) => {
  const { activeSettingsTab, setActiveSettingsTab } = useTheme();
  const { drivers, notifications } = useDrivers();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [userRole, setUserRole] = useState('admin');
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPerms = async () => {
      try {
        const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/permissions/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
          setPermissions(data.permissions || []);
        }
      } catch (err) {
        console.warn('Failed to fetch user permissions:', err);
      }
    };
    fetchPerms();
  }, []);

  const hasPermission = (moduleName) => {
    if (userRole === 'admin') return true;
    const perm = permissions.find(p => p.moduleName === moduleName);
    return perm ? perm.canView : false;
  };

  const mainNavItems = [
    { title: 'Dashboard', path: '/', icon: LayoutDashboard, moduleName: 'Dashboard' },
    { title: 'User Requests', path: '/users', icon: Users, badge: drivers.filter(d => d.status === 'Pending').length.toString(), moduleName: 'Users' },
    { title: 'Payments', path: '/payments', icon: CreditCard, moduleName: 'Payments' },
    { title: 'User/Service', path: '/services', icon: User, moduleName: 'Settings' },
  ].filter(item => hasPermission(item.moduleName));

  const secondaryNavItems = [
    { title: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount.toString() : null, moduleName: 'Notifications' },
    { title: 'Opportunity', path: '/opportunity', icon: Briefcase, moduleName: 'Notices' },
    { title: 'Contact', path: '/contact', icon: PhoneCall, moduleName: 'Inquiries' },
    { title: 'Settings', path: '/settings', icon: Settings, moduleName: 'Settings' },
  ].filter(item => hasPermission(item.moduleName));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div className="sidebar-mobile-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon-bg">
              <Car size={22} className="logo-car" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="logo-text">
                <span className="logo-title">User Life</span>
                <span className="logo-version">Admin v2.0</span>
              </div>
            )}
          </div>

          {isMobileOpen && (
            <button className="sidebar-close-mobile" onClick={onCloseMobile}>
              <X size={20} />
            </button>
          )}
        </div>

        <div className="sidebar-scroll">
          <nav className="sidebar-nav-section">
            {(!isCollapsed || isMobileOpen) && <span className="section-label">MAIN</span>}
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  title={isCollapsed && !isMobileOpen ? item.title : ''}
                >
                  <Icon size={20} className="sidebar-icon" />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="sidebar-label">{item.title}</span>
                  )}
                  {item.badge && (!isCollapsed || isMobileOpen) && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <nav className="sidebar-nav-section">
            {(!isCollapsed || isMobileOpen) && <span className="section-label">SYSTEM & HELP</span>}
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              if (item.title === 'Settings' && isMobile) {
                return (
                  <div key={item.path}>
                    <button
                      onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                      className={`sidebar-item ${window.location.pathname === '/settings' ? 'active' : ''}`}
                      style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title={isCollapsed && !isMobileOpen ? item.title : ''}
                    >
                      <Icon size={20} className="sidebar-icon" />
                      {(!isCollapsed || isMobileOpen) && (
                        <>
                          <span className="sidebar-label" style={{ flex: 1 }}>{item.title}</span>
                          <ChevronDown size={14} style={{ transform: isSettingsExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--color-text-muted)' }} />
                        </>
                      )}
                    </button>
                    {isSettingsExpanded && (!isCollapsed || isMobileOpen) && (
                      <div className="sidebar-submenu" style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                        <NavLink to="/settings" onClick={() => { setActiveSettingsTab('appearance'); onCloseMobile(); }} className={`sidebar-submenu-item ${activeSettingsTab === 'appearance' && window.location.pathname === '/settings' ? 'active' : ''}`}>
                          Theme & Layout
                        </NavLink>
                        <NavLink to="/settings" onClick={() => { setActiveSettingsTab('profile'); onCloseMobile(); }} className={`sidebar-submenu-item ${activeSettingsTab === 'profile' && window.location.pathname === '/settings' ? 'active' : ''}`}>
                          My Profile
                        </NavLink>
                        <NavLink to="/settings" onClick={() => { setActiveSettingsTab('admins'); onCloseMobile(); }} className={`sidebar-submenu-item ${activeSettingsTab === 'admins' && window.location.pathname === '/settings' ? 'active' : ''}`}>
                          Manage Admins
                        </NavLink>
                        <NavLink to="/settings" onClick={() => { setActiveSettingsTab('subscriptions'); onCloseMobile(); }} className={`sidebar-submenu-item ${activeSettingsTab === 'subscriptions' && window.location.pathname === '/settings' ? 'active' : ''}`}>
                          Subscription Settings
                        </NavLink>
                        <NavLink to="/settings" onClick={() => { setActiveSettingsTab('config'); onCloseMobile(); }} className={`sidebar-submenu-item ${activeSettingsTab === 'config' && window.location.pathname === '/settings' ? 'active' : ''}`}>
                          Access Configuration
                        </NavLink>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  title={isCollapsed && !isMobileOpen ? item.title : ''}
                >
                  <Icon size={20} className="sidebar-icon" />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="sidebar-label">{item.title}</span>
                  )}
                  {item.badge && (!isCollapsed || isMobileOpen) && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {(!isCollapsed || isMobileOpen) && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="sidebar-footer-card">
              <HelpCircle size={18} className="help-icon" />
              <div className="footer-card-text">
                <strong>Need Assistance?</strong>
                <p>Check Developer API & Docs</p>
              </div>
            </div>
            
            <button 
              onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/login'; }} 
              style={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                width: '100%',
                padding: '12px',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-danger)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = 'var(--color-danger)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
