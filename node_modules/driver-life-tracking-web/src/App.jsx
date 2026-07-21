import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DriverProvider } from './context/DriverContext';
import { MainLayout } from './components/common/layout/MainLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Drivers } from './pages/Drivers/Drivers';
import { Payments } from './pages/Payments/Payments';
import { Services } from './pages/Services/Services';
import { Notifications } from './pages/Notifications/Notifications';
import { Opportunity } from './pages/Opportunity/Opportunity';
import { Contact } from './pages/Contact/Contact';
import { Settings } from './pages/Settings/Settings';
import { Registration } from './pages/Registration/Registration';
import { Login } from './pages/Login/Login';
import { NotFound } from './pages/NotFound/NotFound';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export function App() {
  return (
    <ThemeProvider>
      <DriverProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
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
                    <Route path="/registration" element={<Registration />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </DriverProvider>
    </ThemeProvider>
  );
}

export default App;
