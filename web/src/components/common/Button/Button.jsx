import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, ghost, danger, success
  size = 'md',        // sm, md, lg
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="btn-spinner" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : LeftIcon ? (
        <LeftIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="btn-icon-left" />
      ) : null}

      <span className="btn-label">{children}</span>

      {!isLoading && RightIcon && (
        <RightIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="btn-icon-right" />
      )}
    </button>
  );
};
