import React from 'react';
import { Card } from '../../components/common/Cards/Card';
import { useDrivers } from '../../context/DriverContext';
import { useTheme } from '../../context/ThemeContext';
import { Check, CheckCheck, Trash2 } from 'lucide-react';
import './Notifications.css';

export const Notifications = () => {
  const { checkUserPermission } = useTheme();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, clearAllNotifications } = useDrivers();

  const hasUnread = notifications.some(n => !n.read);

  return (
    <div className="page-container notifications-page">
      <div className="notifications-page-header">
        <div>
          <h1>Notification Panel</h1>
          <p>Admin notifications and system alerts.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {hasUnread && checkUserPermission('Notifications', 'edit') && (
            <button 
              onClick={markAllNotificationsAsRead}
              className="mark-all-read-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md, 6px)',
                backgroundColor: 'var(--color-primary, #2563eb)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <CheckCheck size={16} /> Mark All Read
            </button>
          )}
          {notifications.length > 0 && checkUserPermission('Notifications', 'delete') && (
            <button 
              onClick={clearAllNotifications}
              className="clear-all-btn"
            >
              <Trash2 size={16} /> Clear All
            </button>
          )}
        </div>
      </div>

      <Card title={`Recent Activity Logs (${notifications.length})`}>
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            No recent notifications.
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((item) => (
              <div 
                key={item.id} 
                className={`notification-item ${!item.read ? 'unread' : ''}`}
              >
                <div className="notification-content">
                  <div className="notification-header-row">
                    <strong className="notification-title">
                      {item.title}
                    </strong>
                    <small className="notification-time">{item.time}</small>
                  </div>
                  <p className="notification-message">{item.message}</p>
                </div>
                {!item.read && checkUserPermission('Notifications', 'edit') && (
                  <button
                    onClick={() => markNotificationAsRead(item.id)}
                    className="mark-read-btn"
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
