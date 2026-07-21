import React from 'react';
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
  Truck,
  HelpCircle,
  X,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

export const Sidebar = ({ isCollapsed, isMobileOpen, onCloseMobile }) => {
  const mainNavItems = [
    { title: 'Dashboard', path: '/', icon: LayoutDashboard },
    { title: 'Driver Requests', path: '/drivers', icon: Users, badge: '18' },
    { title: 'Payments', path: '/payments', icon: CreditCard },
    { title: 'Services', path: '/services', icon: Wrench },
  ];

  const secondaryNavItems = [
    { title: 'Notifications', path: '/notifications', icon: Bell, badge: '3' },
    { title: 'Opportunity', path: '/opportunity', icon: Briefcase },
    { title: 'Contact', path: '/contact', icon: PhoneCall },
    { title: 'Settings', path: '/settings', icon: Settings },
  ];

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
              <Truck size={22} className="logo-truck" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="logo-text">
                <span className="logo-title">Driver Life</span>
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
              onClick={() => { localStorage.removeItem('isAuthenticated'); window.location.href = '/login'; }} 
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
