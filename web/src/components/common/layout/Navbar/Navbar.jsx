import React from 'react';
import { Menu, Sun, Moon, Bell, Search, User } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import './Navbar.css';

export const Navbar = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-btn" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search drivers, payments, requests..." />
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="notification-wrapper">
          <button className="icon-btn">
            <Bell size={20} />
            <span className="badge-dot"></span>
          </button>
        </div>

        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="name">Admin User</span>
            <span className="role">System Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};
