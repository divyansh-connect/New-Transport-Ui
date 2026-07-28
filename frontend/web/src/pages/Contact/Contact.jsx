import React, { useState } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { Modal } from '../../components/common/Modal/Modal';
import { Badge } from '../../components/common/Badge/Badge';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';
import { Phone, MessageSquare, Mail, ExternalLink, Clock, User, CheckCircle2, Send, Inbox } from 'lucide-react';
import './Contact.css';

export const Contact = () => {
  const [inquiries, setInquiries] = React.useState([]);

  const defaultContactInfo = {
    emergency1: '+91 1800 123 4567',
    emergency2: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    partner: 'partners@userlife.com'
  };

  const [contactInfo, setContactInfo] = React.useState(defaultContactInfo);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('support_inquiries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filter out old seed dummy tickets (TKT-101, TKT-102, TKT-103)
        const realOnly = parsed.filter(item => !['TKT-101', 'TKT-102', 'TKT-103'].includes(item.id));
        setInquiries(realOnly);
        localStorage.setItem('support_inquiries', JSON.stringify(realOnly));
      } catch (e) {
        setInquiries([]);
      }
    } else {
      setInquiries([]);
    }

    const savedContact = localStorage.getItem('support_contact_info');
    if (savedContact) {
      try {
        setContactInfo(JSON.parse(savedContact));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveContactInfo = () => {
    localStorage.setItem('support_contact_info', JSON.stringify(contactInfo));
    setIsEditing(false);
  };

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

    const updated = inquiries.map((item) =>
      item.id === selectedTicket.id ? { ...item, status: ticketStatus } : item
    );
    setInquiries(updated);
    localStorage.setItem('support_inquiries', JSON.stringify(updated));

    setSuccessToast(`Ticket ${selectedTicket.id} updated & response sent to ${selectedTicket.user}!`);

    setTimeout(() => {
      setIsModalOpen(false);
      setSuccessToast('');
    }, 1200);
  };

  return (
    <div className="page-container contact-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Support & Contact Hub</h1>
          <p>Manage driver and partner support channels and incoming inquiries.</p>
        </div>
        <button
          onClick={() => {
            if (isEditing) {
              handleSaveContactInfo();
            } else {
              setIsEditing(true);
            }
          }}
          className="btn-primary"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontWeight: '600',
            border: 'none',
            backgroundColor: isEditing ? 'var(--color-success, #10b981)' : 'var(--color-primary, #2563eb)',
            color: '#fff'
          }}
        >
          {isEditing ? 'Save Changes' : 'Edit Contact Info'}
        </button>
      </div>

      <div className="contact-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="contact-card">
          <div className="icon-wrapper primary">
            <Phone size={24} />
          </div>
          <div className="contact-details" style={{ width: '100%' }}>
            <h3>Emergency Hotline 1</h3>
            <p>Primary Support for Drivers</p>
            {isEditing ? (
              <input
                type="text"
                value={contactInfo.emergency1}
                onChange={(e) => setContactInfo({ ...contactInfo, emergency1: e.target.value })}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm, 4px)',
                  border: '1px solid var(--color-border, #ccc)',
                  backgroundColor: 'var(--color-input-bg, #1e293b)',
                  color: 'var(--color-text-main, #fff)',
                  fontSize: '14px',
                  width: '100%',
                  marginTop: '4px'
                }}
              />
            ) : (
              <span className="contact-value">{contactInfo.emergency1}</span>
            )}
          </div>
        </div>

        <div className="contact-card">
          <div className="icon-wrapper primary">
            <Phone size={24} />
          </div>
          <div className="contact-details" style={{ width: '100%' }}>
            <h3>Emergency Hotline 2</h3>
            <p>Secondary Support for Drivers</p>
            {isEditing ? (
              <input
                type="text"
                value={contactInfo.emergency2}
                onChange={(e) => setContactInfo({ ...contactInfo, emergency2: e.target.value })}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm, 4px)',
                  border: '1px solid var(--color-border, #ccc)',
                  backgroundColor: 'var(--color-input-bg, #1e293b)',
                  color: 'var(--color-text-main, #fff)',
                  fontSize: '14px',
                  width: '100%',
                  marginTop: '4px'
                }}
              />
            ) : (
              <span className="contact-value">{contactInfo.emergency2}</span>
            )}
          </div>
        </div>

        <div className="contact-card">
          <div className="icon-wrapper success">
            <MessageSquare size={24} />
          </div>
          <div className="contact-details" style={{ width: '100%' }}>
            <h3>WhatsApp Dispatch</h3>
            <p>Quick chat & document upload</p>
            {isEditing ? (
              <input
                type="text"
                value={contactInfo.whatsapp}
                onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm, 4px)',
                  border: '1px solid var(--color-border, #ccc)',
                  backgroundColor: 'var(--color-input-bg, #1e293b)',
                  color: 'var(--color-text-main, #fff)',
                  fontSize: '14px',
                  width: '100%',
                  marginTop: '4px'
                }}
              />
            ) : (
              <span className="contact-value">{contactInfo.whatsapp}</span>
            )}
          </div>
        </div>

        <div className="contact-card">
          <div className="icon-wrapper warning">
            <Mail size={24} />
          </div>
          <div className="contact-details" style={{ width: '100%' }}>
            <h3>Partner Email Support</h3>
            <p>For workshops & corporate</p>
            {isEditing ? (
              <input
                type="text"
                value={contactInfo.partner}
                onChange={(e) => setContactInfo({ ...contactInfo, partner: e.target.value })}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm, 4px)',
                  border: '1px solid var(--color-border, #ccc)',
                  backgroundColor: 'var(--color-input-bg, #1e293b)',
                  color: 'var(--color-text-main, #fff)',
                  fontSize: '14px',
                  width: '100%',
                  marginTop: '4px'
                }}
              />
            ) : (
              <span className="contact-value">{contactInfo.partner}</span>
            )}
          </div>
        </div>
      </div>

      <Card title="Recent Support Inquiries" subtitle="Latest tickets from the mobile app and partner portal. Click icon to inspect.">
        {inquiries.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No Support Inquiries Yet"
            description="Support tickets raised from the mobile app will appear here automatically."
          />
        ) : (
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
        )}
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
