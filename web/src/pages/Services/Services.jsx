import React, { useState } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { Wrench, Droplet, MapPin, Plus, MoreVertical, Search } from 'lucide-react';
import './Services.css';

export const Services = () => {
  const [activeTab, setActiveTab] = useState('workshop');

  const allServices = [
    { id: 'WS-01', name: 'Central Maintenance Garage', type: 'workshop', location: 'Zone 4, Sector B', status: 'Active', rating: '4.8', contact: '+1 (555) 0192' },
    { id: 'WS-02', name: 'Heavy Duty Repair Hub', type: 'workshop', location: 'Industrial Park West', status: 'Inactive', rating: '4.2', contact: '+1 (555) 0122' },
    { id: 'OC-01', name: 'Quick Lube & Oil Express', type: 'oil change', location: 'Zone 1, Highway 9', status: 'Active', rating: '4.9', contact: '+1 (555) 0881' },
    { id: 'OC-02', name: 'Express Fleet Fluids', type: 'oil change', location: 'South Terminal', status: 'Active', rating: '4.5', contact: '+1 (555) 0912' },
    { id: 'CL-01', name: 'North Terminal Fleet Hub', type: 'car location', location: 'North Terminal', status: 'Active', rating: '-', contact: 'Internal' },
    { id: 'CL-02', name: 'Downtown Secure Parking', type: 'car location', location: 'Downtown Hub', status: 'Maintenance', rating: '-', contact: 'Internal' },
  ];

  const filteredServices = allServices.filter(s => s.type === activeTab.replace('-', ' '));

  const tabs = [
    { id: 'workshop', label: 'Workshops', icon: Wrench },
    { id: 'oil change', label: 'Oil Changes', icon: Droplet },
    { id: 'car location', label: 'Car Locations', icon: MapPin },
  ];

  return (
    <div className="page-container services-page">
      <div className="page-header d-flex justify-between align-center">
        <div>
          <h1>Registered Services</h1>
          <p>Manage workshop, oil change, and car location nodes visible on driver map telemetry.</p>
        </div>
        <button className="btn-primary d-flex align-center gap-sm">
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="services-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`service-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={20} />
              {tab.label}
              <span className="tab-count">
                {allServices.filter(s => s.type === tab.id).length}
              </span>
            </button>
          );
        })}
      </div>

      <Card>
        <div className="card-toolbar d-flex justify-between align-center mb-md">
          <div className="search-bar d-flex align-center gap-sm">
            <Search size={18} color="var(--color-text-muted)" />
            <input type="text" placeholder={`Search ${activeTab}s...`} className="search-input" />
          </div>
          <button className="btn-outline">Export CSV</button>
        </div>

        <Table
          headers={['Service ID', 'Name & Location', 'Contact', 'Rating', 'Status', '']}
          data={filteredServices}
          renderRow={(row) => (
            <tr key={row.id}>
              <td>
                <span className="id-badge">{row.id}</span>
              </td>
              <td>
                <div className="d-flex flex-column">
                  <strong>{row.name}</strong>
                  <span className="text-muted text-sm">{row.location}</span>
                </div>
              </td>
              <td>{row.contact}</td>
              <td>{row.rating !== '-' ? `⭐ ${row.rating}` : '-'}</td>
              <td>
                <span className={`status-badge ${row.status.toLowerCase()}`}>
                  {row.status}
                </span>
              </td>
              <td>
                <button className="btn-icon">
                  <MoreVertical size={18} color="var(--color-text-muted)" />
                </button>
              </td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};
