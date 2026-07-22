import React, { useState } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Briefcase, Clock, Map, Send, Edit2, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal/Modal';
import './Opportunity.css';

export const Opportunity = () => {
  const [validationAlert, setValidationAlert] = useState('');
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      title: 'High-Demand Cargo Routes Available',
      date: '24 Jul 2026',
      type: 'Freight',
      location: 'Northern Ports',
      priority: 'High',
      description: 'Long-haul freight opportunities open for heavy truck drivers connecting northern ports. Premium rates applied for weekend dispatch.'
    },
    {
      id: 2,
      title: 'Partner Workshop Expansion Notice',
      date: '21 Jul 2026',
      type: 'Partnership',
      location: 'All Zones',
      priority: 'Normal',
      description: 'Register oil change centers & workshops for automatic dispatch requests. New API endpoints available for third-party systems.'
    },
    {
      id: 3,
      title: 'Monsoon Safety Guidelines',
      date: '18 Jul 2026',
      type: 'Safety',
      location: 'System Wide',
      priority: 'Critical',
      description: 'Mandatory speed limits enforced across all active tracking nodes due to heavy rainfall warnings.'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Freight',
    priority: 'Normal',
    location: '',
    description: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setValidationAlert('Please fill out Notice Title and Detailed Description.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const today = new Date();
      const formattedDate = `${today.getDate()} ${today.toLocaleString('en', { month: 'short' })} ${today.getFullYear()}`;

      const newNotice = {
        id: Date.now(),
        title: formData.title.trim(),
        type: formData.type,
        priority: formData.priority,
        location: formData.location.trim() || 'All Zones',
        date: formattedDate,
        description: formData.description.trim()
      };

      setOpportunities((prev) => [newNotice, ...prev]);
      setFormData({
        title: '',
        type: 'Freight',
        priority: 'Normal',
        location: '',
        description: ''
      });
      setIsSubmitting(false);
      setSuccessMessage('Notice successfully published & live broadcasted to Driver App!');

      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }, 800);
  };

  const handleDelete = (id) => {
    setOpportunities((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="page-container opportunity-page">
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
          borderLeft: '4px solid #047857'
        }}>
          <CheckCircle2 size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="page-header">
        <h1>Opportunity & Notices</h1>
        <p>Post announcements & notices displayed directly in the Driver Mobile App.</p>
      </div>

      <div className="opportunity-grid">
        <div className="form-column">
          <Card title="Publish New Notice" subtitle="Broadcast information to all registered drivers.">
            <form className="opportunity-form" onSubmit={handlePublish}>
              <div className="form-group">
                <label>Notice Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. New Route Available..."
                  className="form-control"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="form-control">
                    <option value="Freight">Freight</option>
                    <option value="Safety">Safety</option>
                    <option value="Partnership">Partnership</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="form-control">
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Target Location / Zone</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. All Zones"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Detailed Description</label>
                <textarea
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write the full notice content here..."
                  className="form-control"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-100 d-flex justify-center align-center gap-sm mt-sm"
                style={{
                  padding: '9px 12px',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '600',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                <Send size={18} /> {isSubmitting ? 'Publishing...' : 'Publish Notice'}
              </button>
            </form>
          </Card>
        </div>

        <div className="list-column">
          <div className="d-flex justify-between align-center mb-md">
            <h3>Active Broadcasts</h3>
            <span className="badge-count">{opportunities.length} Total</span>
          </div>

          <div className="opportunity-list">
            {opportunities.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '24px' }}>
                No active broadcasts. Use the form on the left to publish a notice.
              </p>
            ) : (
              opportunities.map((opp) => (
                <div key={opp.id} className="opportunity-card">
                  <div className="opportunity-card-header">
                    <div className="d-flex align-center gap-sm">
                      {opp.priority === 'Critical' ? (
                        <ShieldAlert size={18} color="var(--color-danger)" />
                      ) : (
                        <Briefcase size={18} color="var(--color-primary)" />
                      )}
                      <h4 className="opportunity-title">{opp.title}</h4>
                    </div>
                    <span className={`priority-badge ${opp.priority.toLowerCase()}`}>{opp.priority}</span>
                  </div>

                  <p className="opportunity-desc">{opp.description}</p>

                  <div className="opportunity-card-footer">
                    <div className="meta-info">
                      <span className="meta-item"><Clock size={14} /> {opp.date}</span>
                      <span className="meta-item"><Map size={14} /> {opp.location}</span>
                    </div>
                    <div className="action-buttons">
                      <button className="btn-icon danger" onClick={() => handleDelete(opp.id)} title="Delete Broadcast">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Validation React Modal */}
      <Modal
        isOpen={!!validationAlert}
        onClose={() => setValidationAlert('')}
        title="Validation Required"
        subtitle="Please check broadcast notice details."
        primaryActionLabel="OK"
        onPrimaryAction={() => setValidationAlert('')}
      >
        <p style={{ color: 'var(--color-text-main)', fontSize: '14px', margin: 0 }}>
          {validationAlert}
        </p>
      </Modal>
    </div>
  );
};
