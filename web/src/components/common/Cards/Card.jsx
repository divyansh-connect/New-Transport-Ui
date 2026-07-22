import React from 'react';
import './Card.css';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  footer,
  glass = false,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <div className={`web-card ${glass ? 'glass-card' : ''} ${className}`}>
      {(title || subtitle || action) && (
        <div className="web-card-header">
          <div>
            {title && <h3 className="web-card-title">{title}</h3>}
            {subtitle && <p className="web-card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="web-card-action">{action}</div>}
        </div>
      )}
      <div className={`web-card-content ${bodyClassName}`}>{children}</div>
      {footer && <div className="web-card-footer">{footer}</div>}
    </div>
  );
};
