import React from 'react';
import { Card } from '../../components/common/Cards/Card';
import { useDrivers } from '../../context/DriverContext';
import { Check, Trash2 } from 'lucide-react';

export const Notifications = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useDrivers();

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Notification Panel</h1>
          <p>Admin notifications and system alerts.</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={clearAllNotifications}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-danger)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      <Card title={`Recent Activity Logs (${notifications.length})`}>
        {notifications.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No recent notifications.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: 'var(--radius-md)', 
                  backgroundColor: item.read ? 'var(--color-surface)' : 'rgba(37, 99, 235, 0.08)',
                  borderLeft: item.read ? '3px solid transparent' : '3px solid var(--color-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ flex: 1, marginRight: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '14px', color: item.read ? 'var(--color-text-main)' : 'var(--color-primary)' }}>
                      {item.title}
                    </strong>
                    <small style={{ color: 'var(--color-text-muted)' }}>{item.time}</small>
                  </div>
                  <p style={{ fontSize: '13px', marginTop: '3px', color: 'var(--color-text-muted)' }}>{item.message}</p>
                </div>
                {!item.read && (
                  <button
                    onClick={() => markNotificationAsRead(item.id)}
                    style={{
                      padding: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-card-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Mark as Read"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

