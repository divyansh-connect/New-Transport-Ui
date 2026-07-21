import React from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { Phone, MessageSquare, Mail, ExternalLink, Clock } from 'lucide-react';
import './Contact.css';

export const Contact = () => {
  const inquiries = [
    { id: 'TKT-101', user: 'Rajesh Kumar', role: 'Driver', subject: 'Payment Delay', status: 'Open', time: '10 mins ago' },
    { id: 'TKT-102', user: 'North Fleet Hub', role: 'Workshop', subject: 'API Sync Issue', status: 'In Progress', time: '1 hr ago' },
    { id: 'TKT-103', user: 'Amit Singh', role: 'Driver', subject: 'App Crashing on Login', status: 'Resolved', time: '3 hrs ago' }
  ];

  return (
    <div className="page-container contact-page">
      <div className="page-header">
        <h1>Support & Contact Hub</h1>
        <p>Manage driver and partner support channels and incoming inquiries.</p>
      </div>

      <div className="contact-cards-grid">
        <div className="contact-card">
          <div className="icon-wrapper primary">
            <Phone size={24} />
          </div>
          <div className="contact-details">
            <h3>Emergency Hotline</h3>
            <p>24/7 Support for Drivers</p>
            <span className="contact-value">+1 (800) 555-0199</span>
          </div>
        </div>

        <div className="contact-card">
          <div className="icon-wrapper success">
            <MessageSquare size={24} />
          </div>
          <div className="contact-details">
            <h3>WhatsApp Dispatch</h3>
            <p>Quick chat & document upload</p>
            <span className="contact-value">+1 (800) 555-0199</span>
          </div>
        </div>

        <div className="contact-card">
          <div className="icon-wrapper warning">
            <Mail size={24} />
          </div>
          <div className="contact-details">
            <h3>Partner Email Support</h3>
            <p>For workshops & corporate</p>
            <span className="contact-value">partners@herologistics.com</span>
          </div>
        </div>
      </div>

      <Card title="Recent Support Inquiries" subtitle="Latest tickets from the mobile app and partner portal.">
        <Table
          headers={['Ticket ID', 'User Details', 'Subject', 'Status', 'Time', '']}
          data={inquiries}
          renderRow={(row) => (
            <tr key={row.id}>
              <td><span className="id-badge">{row.id}</span></td>
              <td>
                <div className="d-flex flex-column">
                  <strong>{row.user}</strong>
                  <span className="text-muted text-sm">{row.role}</span>
                </div>
              </td>
              <td>{row.subject}</td>
              <td>
                <span className={`status-badge ${row.status.toLowerCase().replace(' ', '-')}`}>
                  {row.status}
                </span>
              </td>
              <td>
                <span className="d-flex align-center gap-xs text-muted text-sm">
                  <Clock size={12} /> {row.time}
                </span>
              </td>
              <td>
                <button className="btn-icon">
                  <ExternalLink size={16} color="var(--color-primary)" />
                </button>
              </td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};
