import React, { useState } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { Modal } from '../../components/common/Modal/Modal';
import { Badge } from '../../components/common/Badge/Badge';
import { Phone, MessageSquare, Mail, ExternalLink, Clock, User, CheckCircle2, Send } from 'lucide-react';
import './Contact.css';

export const Contact = () => {
  const [inquiries, setInquiries] = useState([
    {
      id: 'TKT-101',
      user: 'Rajesh Kumar',
      role: 'Driver',
      phone: '+91 98765 43210',
      subject: 'Payment Delay',
      status: 'Open',
      time: '10 mins ago',
      details: 'Payout for last week trip #TRP-8821 has not credited to bank account yet. Requesting urgent verification.'
    },
    {
      id: 'TKT-102',
      user: 'North Fleet Hub',
      role: 'Workshop',
      phone: '+91 98123 45678',
      subject: 'API Sync Issue',
      status: 'In Progress',
      time: '1 hr ago',
      details: 'Automatic workshop dispatch requests are timing out on mobile client node. Need API key status re-check.'
    },
    {
      id: 'TKT-103',
      user: 'Amit Singh',
      role: 'Driver',
      phone: '+91 97654 32109',
      subject: 'App Crashing on Login',
      status: 'Resolved',
      time: '3 hrs ago',
      details: 'App shuts down immediately after entering OTP on Android 14. Issue fixed after cache clearing.'
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [ticketStatus, setTicketStatus] = useState('Open');
  const [successToast, setSuccessToast] = useState('');

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setTicketStatus(ticket.status);
    setReplyMessage('');
    setSuccessToast('');
    setIsModalOpen(true);
  };

  const handleUpdateTicket = () => {
    if (!selectedTicket) return;

    setInquiries((prev) =>
      prev.map((item) =>
        item.id === selectedTicket.id ? { ...item, status: ticketStatus } : item
      )
    );

    setSuccessToast(`Ticket ${selectedTicket.id} updated & response sent to ${selectedTicket.user}!`);

    setTimeout(() => {
      setIsModalOpen(false);
      setSuccessToast('');
    }, 1200);
  };

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

      <Card title="Recent Support Inquiries" subtitle="Latest tickets from the mobile app and partner portal. Click icon to inspect.">
        <Table
          headers={['Ticket ID', 'User Details', 'Subject', 'Status', 'Time', 'Inspect']}
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
                <Badge
                  variant={
                    row.status === 'Resolved'
                      ? 'success'
                      : row.status === 'In Progress'
                        ? 'info'
                        : 'warning'
                  }
                >
                  {row.status}
                </Badge>
              </td>
              <td>
                <span className="d-flex align-center gap-xs text-muted text-sm">
                  <Clock size={12} /> {row.time}
                </span>
              </td>
              <td>
                <button
                  className="btn-icon"
                  onClick={() => handleOpenTicket(row)}
                  title="Inspect Ticket Details"
                  style={{
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)'
                  }}
                >
                  <ExternalLink size={16} color="var(--color-primary)" />
                </button>
              </td>
            </tr>
          )}
        />
      </Card>

      {/* Interactive Ticket Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Support Ticket Details (${selectedTicket?.id || ''})`}
        subtitle="Review inquiry details and dispatch admin resolution response."
        primaryActionLabel="Send Reply & Update Ticket"
        onPrimaryAction={handleUpdateTicket}
        secondaryActionLabel="Close"
      >
        {selectedTicket && (
          <div className="ticket-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {successToast && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--color-success)',
                color: 'var(--color-success)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                <CheckCircle2 size={18} />
                <span>{successToast}</span>
              </div>
            )}

            <div className="ticket-info-grid">
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>User Name</span>
                <p style={{ fontWeight: '600', marginTop: '2px' }}>{selectedTicket.user} ({selectedTicket.role})</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Contact Phone</span>
                <p style={{ fontWeight: '600', marginTop: '2px' }}>{selectedTicket.phone}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Inquiry Subject</span>
                <p style={{ fontWeight: '600', marginTop: '2px' }}>{selectedTicket.subject}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Current Status</span>
                <div style={{ marginTop: '4px' }}>
                  <select
                    value={ticketStatus}
                    onChange={(e) => setTicketStatus(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-bg)',
                      color: 'var(--color-text-main)',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Original Inquiry Message
              </label>
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                color: 'var(--color-text-main)',
                lineHeight: '1.5'
              }}>
                {selectedTicket.details}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Admin Response & Dispatch Note
              </label>
              <textarea
                rows="3"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type resolution response to be sent to user mobile app..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-input-bg)',
                  color: 'var(--color-text-main)',
                  fontFamily: 'inherit',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
