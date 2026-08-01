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
import { useDrivers } from '../../../../context/DriverContext';

import { API_BASE_URL } from '../../../../config';
import './Navbar.css';

export const Navbar = ({ onToggleSidebar, onMobileToggle }) => {
  const { theme, toggleTheme, profile, isProfileLoading } = useTheme();
  const { notifications, markNotificationAsRead } = useDrivers();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const notificationsWrapperRef = useRef(null);
  const userMenuWrapperRef = useRef(null);
  const servicesWrapperRef = useRef(null);

  const searchableItems = [
    { title: 'Dashboard Overview', category: 'Page Navigation', path: '/' },
    { title: 'User Requests & Approvals', category: 'Page Navigation', path: '/users' },
    { title: 'Payments & Revenue History', category: 'Page Navigation', path: '/payments' },
    { title: 'User Services & Workshop Hubs', category: 'Page Navigation', path: '/services' },
    { title: 'Notifications & System Alerts', category: 'Page Navigation', path: '/notifications' },
    { title: 'Opportunity & Broadcast Notices', category: 'Page Navigation', path: '/opportunity' },
    { title: 'Support & Contact Hub', category: 'Page Navigation', path: '/contact' },
    { title: 'Admin Settings & Appearance', category: 'Page Navigation', path: '/settings' },
    { title: 'John Doe (Commercial Driver REG-101)', category: 'Driver Record', path: '/users' },
    { title: 'Metro Workshop Hub (Station REG-102)', category: 'Service Partner', path: '/services' },
    { title: 'Payout Receipt #TRP-8821 ($62,400)', category: 'Payment Record', path: '/payments' },
  ];

  const filteredSearchItems = searchableItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/service-types`);
        if (res.ok) {
          const data = await res.json();
          const activeCats = data
            .filter(c => c.isActive)
            .sort((a, b) => a.displayOrder - b.displayOrder);
          setCategories(activeCats);
        }
      } catch (err) {
        console.warn('Failed to fetch categories in navbar:', err);
      }
    };
    fetchCategories();
    
    // Refresh list every 12 seconds in case admin updates categories in dashboard
    const interval = setInterval(fetchCategories, 12000);
    return () => clearInterval(interval);
  }, []);

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

      // Escape key closes search/dropdowns pop-ups
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowServicesDropdown(false);
      }
    };

    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (notificationsWrapperRef.current && !notificationsWrapperRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuWrapperRef.current && !userMenuWrapperRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (servicesWrapperRef.current && !servicesWrapperRef.current.contains(e.target)) {
        setShowServicesDropdown(false);
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

  const unreadCount = notifications.filter(n => !n.read).length;

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
              placeholder="Search dashboard, user requests, payments..."
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
        <div className="navbar-popover-wrapper" ref={notificationsWrapperRef}>
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
                <span className="badge-count">{unreadCount > 0 ? `${unreadCount} New` : 'All Read'}</span>
              </div>
              <div className="dropdown-body">
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item ${n.read ? 'read' : 'unread'}`}
                      onClick={() => markNotificationAsRead(n.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="notification-bullet" />
                      <div className="notification-content">
                        <p className="notification-title">{n.title}</p>
                        <span className="notification-time">{n.message?.slice(0, 50)}{n.message?.length > 50 ? '...' : ''}</span>
                      </div>
                    </div>
                  ))
                )}
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
        <div className="navbar-popover-wrapper" ref={userMenuWrapperRef}>
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
              <span className="user-name">{profile?.name || (isProfileLoading ? 'Loading...' : 'User')}</span>
              <span className="user-role">{profile?.role || (isProfileLoading ? '...' : '')}</span>
            </div>
            <ChevronDown size={14} className="dropdown-arrow" />
          </div>

          {showUserMenu && (
            <div className="navbar-dropdown user-menu-dropdown">
              <div className="user-menu-header">
                <strong>{profile?.name || 'User'}</strong>
                <p>{profile?.email || ''}</p>
              </div>
              <div className="user-menu-items">
                <button className="user-menu-item" onClick={() => { setShowUserMenu(false); navigate('/settings'); }} style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-main)' }}>
                  <User size={16} /> Profile Settings
                </button>
                {/* 
                <button className="user-menu-item" onClick={() => { setShowUserMenu(false); navigate('/settings'); }} style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-main)' }}>
                  <Settings size={16} /> Dashboard Layout Settings
                </button>
                */}
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
