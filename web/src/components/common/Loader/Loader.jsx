import React from 'react';
import { Loader2, Truck } from 'lucide-react';
import './Loader.css';

export const Loader = ({
  fullPage = false,
  size = 'md', // sm, md, lg
  text = 'Loading...',
  variant = 'spinner' // spinner, brand, skeleton
}) => {
  if (fullPage) {
    return (
      <div className="loader-fullpage-overlay">
        <div className="loader-fullpage-card">
          <div className="loader-brand-icon">
            <Truck size={32} className="loader-truck-icon" />
          </div>
          <Loader2 size={36} className="loader-spinner-icon" />
          {text && <p className="loader-text">{text}</p>}
        </div>
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className="skeleton-container">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-subtitle" />
        <div className="skeleton-line skeleton-body" />
      </div>
    );
  }

  return (
    <div className={`loader-inline loader-${size}`}>
      <Loader2 size={size === 'sm' ? 18 : size === 'lg' ? 32 : 24} className="loader-spinner-icon" />
      {text && <span className="loader-inline-text">{text}</span>}
    </div>
  );
};
