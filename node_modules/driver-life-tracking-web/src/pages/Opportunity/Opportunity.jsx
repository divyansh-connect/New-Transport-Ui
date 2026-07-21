import React from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Briefcase, Clock, Map, Send, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import './Opportunity.css';

export const Opportunity = () => {
  const opportunities = [
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
  ];

  return (
    <div className="page-container opportunity-page">
      <div className="page-header">
        <h1>Opportunity & Notices</h1>
        <p>Post announcements & notices displayed directly in the Driver Mobile App.</p>
      </div>

      <div className="opportunity-grid">
        <div className="form-column">
          <Card title="Publish New Notice" subtitle="Broadcast information to all registered drivers.">
            <form className="opportunity-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Notice Title</label>
                <input type="text" placeholder="e.g. New Route Available..." className="form-control" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select className="form-control">
                    <option>Freight</option>
                    <option>Safety</option>
                    <option>Partnership</option>
                    <option>General</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="form-control">
                    <option>Normal</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Target Location / Zone</label>
                <input type="text" placeholder="e.g. All Zones" className="form-control" />
              </div>

              <div className="form-group">
                <label>Detailed Description</label>
                <textarea rows="5" placeholder="Write the full notice content here..." className="form-control"></textarea>
              </div>

              <button type="submit" className="btn-primary w-100 d-flex justify-center align-center gap-sm mt-md">
                <Send size={18} /> Publish Notice
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
            {opportunities.map(opp => (
              <div key={opp.id} className="opportunity-card">
                <div className="opportunity-card-header">
                  <div className="d-flex align-center gap-sm">
                    {opp.priority === 'Critical' ? <ShieldAlert size={18} color="var(--color-danger)" /> : <Briefcase size={18} color="var(--color-primary)" />}
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
                    <button className="btn-icon"><Edit2 size={16} /></button>
                    <button className="btn-icon danger"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
