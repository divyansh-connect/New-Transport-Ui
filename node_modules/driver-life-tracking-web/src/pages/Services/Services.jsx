import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { Modal } from '../../components/common/Modal/Modal';
import { Input } from '../../components/common/Input/Input';
import { Button } from '../../components/common/Button/Button';
import { Wrench, Droplet, MapPin, Plus, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import './Services.css';

export const Services = () => {
  const [activeTab, setActiveTab] = useState('workshop');

  const initialServices = [
    { id: 'WS-01', name: 'Central Maintenance Garage', type: 'workshop', location: 'Zone 4, Sector B', status: 'Active', rating: '4.8', contact: '+1 (555) 0192' },
    { id: 'WS-02', name: 'Heavy Duty Repair Hub', type: 'workshop', location: 'Industrial Park West', status: 'Inactive', rating: '4.2', contact: '+1 (555) 0122' },
    { id: 'OC-01', name: 'Quick Lube & Oil Express', type: 'oil change', location: 'Zone 1, Highway 9', status: 'Active', rating: '4.9', contact: '+1 (555) 0881' },
    { id: 'OC-02', name: 'Express Fleet Fluids', type: 'oil change', location: 'South Terminal', status: 'Active', rating: '4.5', contact: '+1 (555) 0912' },
    { id: 'CL-01', name: 'North Terminal Fleet Hub', type: 'car location', location: 'North Terminal', status: 'Active', rating: '-', contact: 'Internal' },
    { id: 'CL-02', name: 'Downtown Secure Parking', type: 'car location', location: 'Downtown Hub', status: 'Maintenance', rating: '-', contact: 'Internal' },
  ];

  const [allServices, setAllServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', latitude: '', longitude: '', contact: '', status: 'Active' });

  useEffect(() => {
    const saved = localStorage.getItem('services_data');
    if (saved) {
      setAllServices(JSON.parse(saved));
    } else {
      setAllServices(initialServices);
      localStorage.setItem('services_data', JSON.stringify(initialServices));
    }
  }, []);

  const filteredServices = allServices.filter(s => 
    s.type === activeTab.replace('-', ' ') &&
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'workshop', label: 'Workshops', icon: Wrench, prefix: 'WS' },
    { id: 'oil change', label: 'Oil Changes', icon: Droplet, prefix: 'OC' },
    { id: 'car location', label: 'Car Locations', icon: MapPin, prefix: 'CL' },
  ];

  const saveToStorage = (data) => {
    setAllServices(data);
    localStorage.setItem('services_data', JSON.stringify(data));
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Service ID,Name,Location,Latitude,Longitude,Contact,Rating,Status\n" + 
      filteredServices.map(e => `${e.id},${e.name},${e.location},${e.latitude || ''},${e.longitude || ''},${e.contact},${e.rating},${e.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTab}_services.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddClick = () => {
    setModalMode('add');
    setFormData({ name: '', location: '', latitude: '28.6250', longitude: '77.2180', contact: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleEditClick = (record) => {
    setModalMode('edit');
    setSelectedRecord(record);
    setFormData({ name: record.name, location: record.location, latitude: record.latitude || '28.6250', longitude: record.longitude || '77.2180', contact: record.contact, status: record.status });
    setIsModalOpen(true);
  };

  const handleViewClick = (record) => {
    setModalMode('view');
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      saveToStorage(allServices.filter(s => s.id !== id));
    }
  };

  const handleSaveModal = () => {
    if (!formData.name) return alert('Name is required');
    if (modalMode === 'add') {
      const prefix = tabs.find(t => t.id === activeTab)?.prefix || 'SRV';
      const newId = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
      const newService = {
        id: newId,
        name: formData.name,
        type: activeTab,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        contact: formData.contact,
        status: formData.status,
        rating: 'New'
      };
      saveToStorage([newService, ...allServices]);
    } else if (modalMode === 'edit') {
      const updated = allServices.map(s => {
        if (s.id === selectedRecord.id) {
          return { ...s, name: formData.name, location: formData.location, latitude: formData.latitude, longitude: formData.longitude, contact: formData.contact, status: formData.status };
        }
        return s;
      });
      saveToStorage(updated);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="page-container services-page">
      <div className="page-header d-flex justify-between align-center">
        <div>
          <h1>Registered Services</h1>
          <p>Manage workshop, oil change, and car location nodes visible on driver map telemetry.</p>
        </div>
        <button className="btn-primary d-flex align-center gap-sm" onClick={handleAddClick}>
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
            <input 
              type="text" 
              placeholder={`Search ${activeTab}s...`} 
              className="search-input" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-outline" onClick={handleExport}>Export CSV</button>
        </div>

        <Table
          headers={['Service ID', 'Name & Location', 'GPS Coordinates', 'Contact', 'Rating', 'Status', 'Actions']}
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
              <td>
                <code>{row.latitude || '28.6250'}, {row.longitude || '77.2180'}</code>
              </td>
              <td>{row.contact}</td>
              <td>{row.rating !== '-' ? `⭐ ${row.rating}` : '-'}</td>
              <td>
                <span className={`status-badge ${row.status.toLowerCase()}`}>
                  {row.status}
                </span>
              </td>
              <td>
                <div className="row-actions" style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="ghost" size="sm" leftIcon={Eye} onClick={() => handleViewClick(row)}></Button>
                  <Button variant="ghost" size="sm" leftIcon={Edit2} onClick={() => handleEditClick(row)}></Button>
                  <Button variant="ghost" size="sm" leftIcon={Trash2} onClick={() => handleDelete(row.id)}></Button>
                </div>
              </td>
            </tr>
          )}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? `Add New ${activeTab}` : modalMode === 'edit' ? `Edit Service` : `Service Details`}
        primaryActionLabel={modalMode !== 'view' ? "Save" : "Close"}
        onPrimaryAction={modalMode !== 'view' ? handleSaveModal : () => setIsModalOpen(false)}
        secondaryActionLabel={modalMode !== 'view' ? "Cancel" : null}
      >
        {modalMode === 'view' && selectedRecord && (
          <div className="modal-record-details">
            <div className="detail-row"><span className="detail-label">Name:</span><strong className="detail-value">{selectedRecord.name}</strong></div>
            <div className="detail-row"><span className="detail-label">Location:</span><span className="detail-value">{selectedRecord.location}</span></div>
            <div className="detail-row"><span className="detail-label">Coordinates:</span><span className="detail-value">{selectedRecord.latitude || '28.6250'}, {selectedRecord.longitude || '77.2180'}</span></div>
            <div className="detail-row"><span className="detail-label">Contact:</span><span className="detail-value">{selectedRecord.contact}</span></div>
            <div className="detail-row"><span className="detail-label">Status:</span><span className="status-badge approved">{selectedRecord.status}</span></div>
          </div>
        )}
        {modalMode !== 'view' && (
          <div className="modal-record-details" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <Input label="Location Name / Zone" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <Input label="Latitude (e.g. 28.6250)" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} />
              <Input label="Longitude (e.g. 77.2180)" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} />
            </div>
            <Input label="Contact" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
            <Input label="Status" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} />
          </div>
        )}
      </Modal>
    </div>
  );
};
