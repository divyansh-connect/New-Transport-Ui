import React from 'react';
import './Card.css';

export const Card = ({ children, title, subtitle, className = '' }) => {
  return (
    <div className={`web-card ${className}`}>
      {(title || subtitle) && (
        <div className="web-card-header">
          {title && <h3 className="web-card-title">{title}</h3>}
          {subtitle && <p className="web-card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="web-card-content">{children}</div>
    </div>
  );
};
