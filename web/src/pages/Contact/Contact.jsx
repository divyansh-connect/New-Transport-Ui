import React from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Phone, MessageSquare, Mail } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Support Channels</h1>
        <p>Driver & Partner inquiry routing channels.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <Card title="Hotline Phone Support">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
            <Phone color="var(--color-primary)" />
            <span style={{ fontSize: '18px', fontWeight: '700' }}>+1 (800) 555-0199</span>
          </div>
        </Card>

        <Card title="WhatsApp Dispatch Line">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
            <MessageSquare color="var(--color-success)" />
            <span style={{ fontSize: '18px', fontWeight: '700' }}>+1 (800) 555-0199</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
