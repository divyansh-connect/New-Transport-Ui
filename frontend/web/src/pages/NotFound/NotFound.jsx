import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button/Button';
import './NotFound.css';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="not-found-badge-icon">
          <Compass size={56} className="compass-icon" />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-description">
          The admin route or layout view you are attempting to access does not exist or has been relocated.
        </p>
        <div className="not-found-actions">
          <Button
            variant="secondary"
            leftIcon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            leftIcon={Home}
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
