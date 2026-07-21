import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

import './Navbar.css';

export const Navbar = ({ onToggleSidebar, onMobileToggle }) => {
  const { theme, toggleTheme, profile } = useTheme();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchableItems = [
    { title: 'Dashboard Overview', category: 'Page Navigation', path: '/' },
    { title: 'Driver Requests & Approvals', category: 'Page Navigation', path: '/drivers' },
    { title: 'Payments & Revenue History', category: 'Page Navigation', path: '/payments' },
    { title: 'Services & Workshop Hubs', category: 'Page Navigation', path: '/services' },
    { title: 'Notifications & System Alerts', category: 'Page Navigation', path: '/notifications' },
    { title: 'Opportunity & Broadcast Notices', category: 'Page Navigation', path: '/opportunity' },
    { title: 'Support & Contact Hub', category: 'Page Navigation', path: '/contact' },
    { title: 'Admin Settings & Appearance', category: 'Page Navigation', path: '/settings' },
    { title: 'John Doe (Commercial Driver REG-101)', category: 'Driver Record', path: '/drivers' },
    { title: 'Metro Workshop Hub (Station REG-102)', category: 'Service Partner', path: '/services' },
    { title: 'Payout Receipt #TRP-8821 ($62,400)', category: 'Payment Record', path: '/payments' },
  ];

  const filteredSearchItems = searchableItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + K or Cmd + K toggles search focus
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => {
          if (!prev && searchInputRef.current) {
            searchInputRef.current.focus();
          }
          return !prev;
        });
      }

      // Escape key closes search pop-up
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectSearchItem = (path) => {
    navigate(path);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const notificationsList = [
    { id: 1, title: 'New Driver Registration', time: '5 mins ago', read: false },
    { id: 2, title: 'Service Hub Approved', time: '1 hour ago', read: false },
    { id: 3, title: 'System Security Audit Completed', time: '1 day ago', read: true },
  ];

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-icon-btn mobile-toggle"
          onClick={onMobileToggle || onToggleSidebar}
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <button
          className="navbar-icon-btn desktop-toggle"
          onClick={onToggleSidebar}
          title="Collapse Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar with Live Results, Auto-Close & ESC support */}
        <div className="navbar-popover-wrapper" ref={searchWrapperRef}>
          <div className="navbar-search">
            <Search size={18} className="navbar-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search dashboard, drivers, payments..."
              className="navbar-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
            {isSearchOpen ? (
              <button className="search-close-btn" onClick={handleClearSearch} title="Close search (ESC)">
                <X size={14} />
              </button>
            ) : (
              <kbd className="search-kbd">⌘K</kbd>
            )}
          </div>

          {isSearchOpen && (
            <div className="navbar-dropdown search-results-dropdown">
              <div className="dropdown-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="var(--color-primary)" />
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>
                    {searchQuery.trim() ? 'Search Results' : 'Quick Navigation Items'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge-count">{filteredSearchItems.length} Found</span>
                  <button className="dropdown-close-icon" onClick={() => setIsSearchOpen(false)} title="Close pop-up">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="dropdown-body search-dropdown-body">
                {filteredSearchItems.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  filteredSearchItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="search-result-item"
                      onClick={() => handleSelectSearchItem(item.path)}
                    >
                      <div className="search-item-info">
                        <span className="search-item-title">{item.title}</span>
                        <span className="search-item-category">{item.category}</span>
                      </div>
                      <ArrowRight size={14} className="search-item-arrow" />
                    </div>
                  ))
                )}
              </div>

              <div className="dropdown-footer" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Press <kbd className="search-kbd">⌘K</kbd> or <kbd className="search-kbd">ESC</kbd> or click outside to close
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {/* Theme Switcher Toggle */}
        <button
          className="navbar-icon-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun size={20} className="theme-icon sun-icon" />
          ) : (
            <Moon size={20} className="theme-icon moon-icon" />
          )}
        </button>

        {/* Notifications */}
        <div className="navbar-popover-wrapper">
          <button
            className={`navbar-icon-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
              setIsSearchOpen(false);
            }}
            title="Notifications"
          >
            <Bell size={20} />
            <span className="notification-dot" />
          </button>

          {showNotifications && (
            <div className="navbar-dropdown notifications-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <span className="badge-count">2 New</span>
              </div>
              <div className="dropdown-body">
                {notificationsList.map((n) => (
                  <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                    <div className="notification-bullet" />
                    <div className="notification-content">
                      <p className="notification-title">{n.title}</p>
                      <span className="notification-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button
                  className="dropdown-action-link"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/notifications');
                  }}
                  style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'center' }}
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="navbar-popover-wrapper">
          <div
            className="navbar-user-profile"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setIsSearchOpen(false);
            }}
          >
            <div className="avatar-wrapper">
              <User size={18} className="avatar-icon" />
              <span className="status-dot" />
            </div>
            <div className="user-details">
              <span className="user-name">{profile?.name || 'Admin User'}</span>
              <span className="user-role">{profile?.role || 'System Administrator'}</span>
            </div>
            <ChevronDown size={14} className="dropdown-arrow" />
          </div>

          {showUserMenu && (
            <div className="navbar-dropdown user-menu-dropdown">
              <div className="user-menu-header">
                <strong>{profile?.name || 'Admin User'}</strong>
                <p>{profile?.email || 'admin@driverlife.com'}</p>
              </div>
              <div className="user-menu-items">
                <button className="user-menu-item" onClick={() => { setShowUserMenu(false); navigate('/settings'); }} style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-main)' }}>
                  <User size={16} /> Profile Settings
                </button>
                <button className="user-menu-item" onClick={() => { setShowUserMenu(false); navigate('/settings'); }} style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-main)' }}>
                  <Settings size={16} /> Dashboard Layout Settings
                </button>
                <div className="user-menu-divider" />
                <button className="user-menu-item text-danger" onClick={() => { localStorage.removeItem('isAuthenticated'); navigate('/login'); }} style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-danger)' }}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
