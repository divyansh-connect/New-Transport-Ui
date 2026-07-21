import React, { useState } from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { Navbar } from './Navbar/Navbar';
import './MainLayout.css';

export const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
      <div className="layout-main">
        <Navbar
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
        />
        <main className="layout-content">
          <div className="layout-content-inner">{children}</div>
        </main>
        <footer className="layout-footer">
          <span>© 2026 Driver Life Admin Platform. All rights reserved.</span>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#support">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
};
