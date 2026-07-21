import React from 'react';
import './StatCard.css';

export const StatCard = ({ title, value, change, icon: Icon, color = 'primary' }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className={`stat-icon icon-${color}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="stat-body">
        <h2 className="stat-value">{value}</h2>
        {change && <span className="stat-change">{change}</span>}
      </div>
    </div>
  );
};
