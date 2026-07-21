<<<<<<< HEAD
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
      </div>
    </div>
  );
};
=======
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
      </div>
    </div>
  );
};
>>>>>>> 2d211b9c039170f4c2e28daef61b96f1b72e1793
