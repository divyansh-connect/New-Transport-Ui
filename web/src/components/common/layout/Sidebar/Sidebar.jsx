import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  CreditCard,
  Wrench,
  Bell,
  Briefcase,
  PhoneCall,
  Settings,
  Truck,
} from 'lucide-react';
import './Sidebar.css';

export const Sidebar = ({ isCollapsed }) => {
  const navItems = [
    { title: 'Dashboard', path: '/', icon: LayoutDashboard },
    { title: 'Driver Requests', path: '/drivers', icon: Users },
    { title: 'Payments', path: '/payments', icon: CreditCard },
    { title: 'Services', path: '/services', icon: Wrench },
    { title: 'Notifications', path: '/notifications', icon: Bell },
    { title: 'Opportunity', path: '/opportunity', icon: Briefcase },
    { title: 'Contact', path: '/contact', icon: PhoneCall },
    { title: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-icon">
          <Truck size={24} />
        </div>
        {!isCollapsed && <span className="logo-title">Driver Life</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.title : ''}
            >
              <Icon size={20} className="nav-icon" />
              {!isCollapsed && <span className="nav-label">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
