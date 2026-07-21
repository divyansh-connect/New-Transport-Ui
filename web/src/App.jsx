import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/common/layout/MainLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Drivers } from './pages/Drivers/Drivers';
import { Payments } from './pages/Payments/Payments';
import { Services } from './pages/Services/Services';
import { Notifications } from './pages/Notifications/Notifications';
import { Opportunity } from './pages/Opportunity/Opportunity';
import { Contact } from './pages/Contact/Contact';
import { Settings } from './pages/Settings/Settings';
import './index.css';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/services" element={<Services />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/opportunity" element={<Opportunity />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
