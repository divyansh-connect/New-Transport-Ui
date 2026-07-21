import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Mail, Lock } from 'lucide-react';
import { Input } from '../../components/common/Input/Input';
import { Button } from '../../components/common/Button/Button';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-image-overlay">
          <div className="login-branding">
            <div className="logo-icon-bg">
              <Truck size={32} className="logo-truck" />
            </div>
            <h1>Driver Life</h1>
            <p>Admin Operations Platform v2.0</p>
          </div>
          <div className="login-quote">
            <p>"Empowering logistics with real-time tracking, seamless payments, and streamlined driver management."</p>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to the administration panel to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <Input
                type="email"
                placeholder="admin@driverlife.com"
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
                onClick={() => {
                  setEmail('admin@driverlife.com');
                  setPassword('admin123');
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    localStorage.setItem('isAuthenticated', 'true');
                    navigate('/');
                  }, 500);
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
  );
};
