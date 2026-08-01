import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Briefcase, Clock, Map, Send, Edit2, Trash2, ShieldAlert, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Modal } from '../../components/common/Modal/Modal';
import { useDrivers } from '../../context/DriverContext';
import { useTheme } from '../../context/ThemeContext';
import { API_BASE_URL } from '../../config';
import './Opportunity.css';

const DEFAULT_NOTICES = [
  {
    id: 1,
    title: 'High-Demand Cargo Routes Available',
    date: '24 Jul 2026',
    type: 'Freight',
    location: 'Northern Ports',
    priority: 'High',
    description: 'Long-haul freight opportunities open for heavy truck drivers connecting northern ports. Premium rates applied for weekend dispatch.',
    isVisible: true
  },
  {
    id: 2,
    title: 'Partner Workshop Expansion Notice',
    date: '21 Jul 2026',
    type: 'Partnership',
    location: 'All Zones',
    priority: 'Normal',
    description: 'Register oil change centers & workshops for automatic dispatch requests. New API endpoints available for third-party systems.',
    isVisible: true
  },
  {
    id: 3,
    title: 'Monsoon Safety Guidelines',
    date: '18 Jul 2026',
    type: 'Safety',
    location: 'System Wide',
    priority: 'Critical',
    description: 'Mandatory speed limits enforced across all active tracking nodes due to heavy rainfall warnings.',
    isVisible: true
  }
];

export const Opportunity = () => {
  const { checkUserPermission } = useTheme();
  const { broadcastNotification } = useDrivers();
  const [validationAlert, setValidationAlert] = useState('');
  const [opportunities, setOpportunities] = useState(DEFAULT_NOTICES);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Freight',
    priority: 'Normal',
    location: '',
    description: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notices/all`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setOpportunities(data);
        }
      }
    } catch (err) {
      console.log('Error fetching notices in Web Admin:', err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (opp) => {
    setEditingId(opp.id);
    setFormData({
      title: opp.title,
      type: opp.type || 'Freight',
      priority: opp.priority || 'Normal',
      location: opp.location === 'All Zones' ? '' : opp.location,
      description: opp.description
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      type: 'Freight',
      priority: 'Normal',
      location: '',
      description: ''
    });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setValidationAlert('Please fill out Notice Title and Detailed Description.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        // Call backend API to update
        await fetch(`${API_BASE_URL}/notices/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title.trim(),
            type: formData.type,
            priority: formData.priority,
            location: formData.location.trim() || 'All Zones',
            description: formData.description.trim()
          })
        });

        setEditingId(null);
        setSuccessMessage('Notice successfully updated!');
      } else {
        const today = new Date();
        const formattedDate = `${today.getDate()} ${today.toLocaleString('en', { month: 'short' })} ${today.getFullYear()}`;

        // Call backend API to create notice
        await fetch(`${API_BASE_URL}/notices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title.trim(),
            type: formData.type,
            priority: formData.priority,
            location: formData.location.trim() || 'All Zones',
            date: formattedDate,
            description: formData.description.trim()
          })
        });

        // Broadcast notification to database to sync with mobile app
        await broadcastNotification(
          `[${formData.type}] ${formData.title.trim()}`,
          formData.description.trim(),
          formData.type.toLowerCase()
        );

        setSuccessMessage('Notice successfully published & live broadcasted to Driver App!');
      }

      await fetchNotices();

      setFormData({
        title: '',
        type: 'Freight',
        priority: 'Normal',
        location: '',
        description: ''
      });
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }
  };

  const handleDelete = async (id) => {
    if (editingId === id) {
      handleCancelEdit();
    }
    try {
      await fetch(`${API_BASE_URL}/notices/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.log('Error deleting notice:', err);
    }
    setOpportunities((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleVisibility = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notices/${id}/toggle-visibility`, { method: 'PUT' });
      if (response.ok) {
        await fetchNotices();
      } else {
        setOpportunities((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item))
        );
      }
    } catch (err) {
      console.log('Error toggling visibility:', err);
      setOpportunities((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item))
      );
    }
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

      <div className="opportunity-grid" style={{ gridTemplateColumns: (checkUserPermission('Notices', 'add') || checkUserPermission('Notices', 'edit')) ? '1fr 1.2fr' : '1fr' }}>
        {(checkUserPermission('Notices', 'add') || checkUserPermission('Notices', 'edit')) && (
          <div className="form-column">
            <Card 
              title={editingId ? "Edit Notice" : "Publish New Notice"} 
              subtitle={editingId ? "Modify notice details for broadcasting." : "Broadcast information to all registered drivers."}
            >
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

                <div className="d-flex gap-sm">
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
                    <Send size={18} /> {isSubmitting ? (editingId ? 'Updating...' : 'Publishing...') : (editingId ? 'Update Notice' : 'Publish Notice')}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn-secondary w-100 d-flex justify-center align-center mt-sm"
                      style={{
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '600',
                        border: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-main)'
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </Card>
          </div>
        )}

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
                <div key={opp.id} className="opportunity-card" style={{ opacity: opp.isVisible === false ? 0.65 : 1 }}>
                  <div className="opportunity-card-header">
                    <div className="d-flex align-center gap-sm">
                      {opp.priority === 'Critical' ? (
                        <ShieldAlert size={18} color="var(--color-danger)" />
                      ) : (
                        <Briefcase size={18} color="var(--color-primary)" />
                      )}
                      <h4 className="opportunity-title">{opp.title}</h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`priority-badge ${opp.priority ? opp.priority.toLowerCase() : 'normal'}`}>{opp.priority}</span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: opp.isVisible !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: opp.isVisible !== false ? '#10b981' : '#ef4444'
                      }}>
                        {opp.isVisible !== false ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  <p className="opportunity-desc">{opp.description}</p>

                  <div className="opportunity-card-footer">
                    <div className="meta-info">
                      <span className="meta-item"><Clock size={14} /> {opp.date}</span>
                      <span className="meta-item"><Map size={14} /> {opp.location}</span>
                    </div>
                    {(checkUserPermission('Notices', 'edit') || checkUserPermission('Notices', 'delete')) && (
                      <div className="action-buttons" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {checkUserPermission('Notices', 'edit') && (
                          <>
                            <button
                              className="btn-icon primary"
                              onClick={() => handleToggleVisibility(opp.id)}
                              title={opp.isVisible !== false ? "Hide Notice from Startup Popup" : "Show Notice on Startup Popup"}
                              style={{ color: opp.isVisible !== false ? 'var(--color-primary)' : 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              {opp.isVisible !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button className="btn-icon primary" onClick={() => handleEdit(opp)} title="Edit Broadcast" style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                              <Edit2 size={16} />
                            </button>
                          </>
                        )}
                        {checkUserPermission('Notices', 'delete') && (
                          <button className="btn-icon danger" onClick={() => handleDelete(opp.id)} title="Delete Broadcast" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <Trash2 size={16} color="var(--color-danger)" />
                          </button>
                        )}
                      </div>
                    )}
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
