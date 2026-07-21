import React from 'react';
import './Input.css';

export const Input = ({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <div className="input-field-wrapper">
        {LeftIcon && <LeftIcon size={18} className="input-icon left" />}
        <input id={inputId} className={`input-element ${LeftIcon ? 'with-left-icon' : ''} ${RightIcon ? 'with-right-icon' : ''}`} {...props} />
        {RightIcon && <RightIcon size={18} className="input-icon right" />}
      </div>
      {error ? (
        <span className="input-error-text">{error}</span>
      ) : helperText ? (
        <span className="input-helper-text">{helperText}</span>
      ) : null}
    </div>
  );
};

export const Select = ({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && <label htmlFor={selectId} className="input-label">{label}</label>}
      <div className="input-field-wrapper">
        <select id={selectId} className="input-element select-element" {...props}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <span className="input-error-text">{error}</span>
      ) : helperText ? (
        <span className="input-helper-text">{helperText}</span>
      ) : null}
    </div>
  );
};
