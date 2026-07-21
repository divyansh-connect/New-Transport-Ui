import React from 'react';
import { Card } from '../../components/common/Cards/Card';
import { useTheme } from '../../context/ThemeContext';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard Settings</h1>
        <p>Manage system preferences and appearance tokens.</p>
      </div>

      <Card title="Appearance & Theme">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong>Dark & Light Mode</strong>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Current active theme: {theme.toUpperCase()}</p>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600'
            }}
          >
            Toggle {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </Card>
    </div>
  );
};
