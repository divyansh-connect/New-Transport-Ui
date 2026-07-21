import React from 'react';
import { Card } from '../../components/common/Cards/Card';

export const Notifications = () => {
  const notifications = [
    { title: 'New Registration Submitted', message: 'John Doe submitted a Commercial Driver application.', time: '10m ago' },
    { title: 'Payment Confirmed', message: 'Payment #PAY-901 confirmed for $49.99.', time: '12m ago' },
    { title: 'System Telemetry Online', message: 'Live GPS sync server status operational.', time: '1h ago' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Notification Panel</h1>
        <p>Admin notifications and system alerts.</p>
      </div>

      <Card title="Recent Activity Logs">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.map((item, idx) => (
            <div key={idx} style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{item.title}</strong>
                <small style={{ color: 'var(--color-text-muted)' }}>{item.time}</small>
              </div>
              <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--color-text-muted)' }}>{item.message}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
