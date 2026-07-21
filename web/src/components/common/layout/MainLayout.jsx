import React, { useState } from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { Navbar } from './Navbar/Navbar';
import './MainLayout.css';

export const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar isCollapsed={isCollapsed} />
      <div className="layout-main">
        <Navbar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
};
