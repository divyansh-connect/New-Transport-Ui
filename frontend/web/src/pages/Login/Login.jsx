import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Mail, Lock } from 'lucide-react';
import { Input } from '../../components/common/Input/Input';
import { Button } from '../../components/common/Button/Button';
import './Login.css';
import { API_BASE_URL } from '../../config';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }
      if (data.user?.role !== 'admin' && data.user?.role !== 'coworker') {
        throw new Error('Access Denied: This Web Panel is exclusively for System Administrators & Sub-Admins. Driver & Workshop partners must use the Mobile App.');
      }
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('admin_token', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('admin_token', data.token);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-bg">
      <div className="floating-login-card">
        {/* Left Side: Image & Branding */}
        <div className="login-left">
          <div className="login-image-overlay">
            <div className="login-branding">
              <div className="logo-icon-bg">
                <Car size={32} className="logo-car" />
              </div>
              <h1>User Life</h1>
              <p>Admin Operations Platform v2.0</p>
            </div>
            <div className="login-quote">
              <p>"Empowering logistics with real-time tracking, seamless payments, and streamlined driver management."</p>
            </div>
          </div>
        </div>

        {/* Right Side: Admin Login Form */}
        <div className="login-right">
          <div className="login-form-wrapper">
            {/* Mobile Branding Header */}
            <div className="mobile-branding">
              <div className="mobile-logo-bg">
                <Car size={24} className="logo-car" />
              </div>
              <div>
                <h3>User Life</h3>
                <p>Admin Platform v2.0</p>
              </div>
            </div>

            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to the administration panel to continue.</p>
            </div>

            {errorMsg && (
              <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px', fontWeight: '500', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <Input
                  type="email"
                  placeholder="admin@userlife.com"
                  leftIcon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  leftIcon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="login-actions">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-100 login-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="quick-access-box" style={{ marginTop: '16px', padding: '12px', background: 'var(--color-bg-base)', border: '1px dashed var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                  ⚡ Quick Demo Access
                </span>
                <Button 
                  type="button" 
                  variant="secondary"
                  size="sm"
                  className="w-100"
                  onClick={async () => {
                    setEmail('admin@userlife.com');
                    setPassword('admin123');
                    setIsLoading(true);
                    try {
                      const response = await fetch(`${API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: 'admin@userlife.com', password: 'admin123' })
                      });
                      const data = await response.json();
                      if (response.ok && data.token) {
                        sessionStorage.setItem('isAuthenticated', 'true');
                        sessionStorage.setItem('admin_token', data.token);
                        localStorage.setItem('isAuthenticated', 'true');
                        localStorage.setItem('admin_token', data.token);
                        navigate('/');
                      } else {
                        setErrorMsg(data.error || 'Auto-login failed.');
                      }
                    } catch (err) {
                      setErrorMsg('Cannot connect to server. Is backend running?');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  Auto-login as Admin
                </Button>
              </div>
            </form>
            
            <div className="login-footer">
              <p>Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
