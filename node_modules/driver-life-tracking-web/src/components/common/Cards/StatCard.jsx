import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatCard.css';

export const StatCard = ({
  title,
  value,
  change,
  trend = 'up', // up, down, neutral
  icon: Icon,
  color = 'primary', // primary, success, warning, danger, info
  description,
  className = '',
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className={`stat-card stat-card-${color} ${className}`}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className={`stat-icon-wrapper stat-icon-${color}`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="stat-body">
        <div className="stat-value-group">
          <h2 className="stat-value">{value}</h2>
          {change && (
            <div className={`stat-trend-pill trend-${trend}`}>
              <TrendIcon size={14} />
              <span>{change}</span>
            </div>
          )}
        </div>
        {description && <p className="stat-description">{description}</p>}
      </div>
    </div>
  );
};
