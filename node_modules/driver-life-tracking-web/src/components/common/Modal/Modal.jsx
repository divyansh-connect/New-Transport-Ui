import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../Button/Button';
import './Modal.css';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  isPrimaryLoading = false,
  size = 'md', // sm, md, lg
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-content modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            {title && <h3 className="modal-title">{title}</h3>}
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close Modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {(primaryActionLabel || secondaryActionLabel) && (
          <div className="modal-footer">
            {secondaryActionLabel && (
              <Button variant="secondary" onClick={onSecondaryAction || onClose}>
                {secondaryActionLabel}
              </Button>
            )}
            {primaryActionLabel && (
              <Button
                variant="primary"
                onClick={onPrimaryAction}
                isLoading={isPrimaryLoading}
              >
                {primaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
