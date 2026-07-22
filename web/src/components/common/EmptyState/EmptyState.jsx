import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '../Button/Button';
import './EmptyState.css';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No Data Available',
  description = 'There are no items or records to display at this moment.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div className={`empty-state-card ${className}`}>
      <div className="empty-state-icon-wrapper">
        <Icon size={36} className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="empty-state-actions">
          {secondaryActionLabel && (
            <Button variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          {actionLabel && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
