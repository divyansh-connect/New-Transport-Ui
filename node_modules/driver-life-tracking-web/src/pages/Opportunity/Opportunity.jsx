import React from 'react';
import { Card } from '../../components/common/Cards/Card';

export const Opportunity = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Opportunity Notices Manager</h1>
        <p>Post announcements & notices displayed in the Driver Mobile App.</p>
      </div>

      <Card title="Published Opportunities">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <h3>High-Demand Cargo Routes Available</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '6px' }}>
              Long-haul freight opportunities open for heavy truck drivers connecting northern ports.
            </p>
          </div>
          <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <h3>Partner Workshop Expansion Notice</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '6px' }}>
              Register oil change centers & workshops for automatic dispatch requests.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
