import React from 'react';
import './Badge.css';

export const Badge = ({
  children,
  variant = 'neutral', // success, warning, danger, info, primary, neutral
  pulse = false,
  size = 'md', // sm, md
  className = '',
}) => {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {pulse && <span className="badge-pulse-dot" />}
      <span>{children}</span>
    </span>
  );
};
