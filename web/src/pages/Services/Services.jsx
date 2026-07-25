import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { Modal } from '../../components/common/Modal/Modal';
import { Input } from '../../components/common/Input/Input';
import { Button } from '../../components/common/Button/Button';
import { Wrench, Droplet, MapPin, Plus, Search, Eye, Edit2, Trash2, Download, Users, User } from 'lucide-react';
import { useDrivers } from '../../context/DriverContext';
import { downloadExcel } from '../../utils/excelExport';
import './Services.css';

export const Services = () => {
  const { drivers } = useDrivers();
  const [activeTab, setActiveTab] = useState('workshop');

  const initialServices = [
    { id: 'WS-01', name: 'Central Maintenance Garage', type: 'workshop', location: 'Zone 4, Sector B', status: 'Active', rating: '4.8', contact: '+1 (555) 0192', email: 'central.garage@example.com', amount: '$99.99' },
    { id: 'WS-02', name: 'Heavy Duty Repair Hub', type: 'workshop', location: 'Industrial Park West', status: 'Inactive', rating: '4.2', contact: '+1 (555) 0122', email: 'heavy.duty@example.com', amount: '$99.99' },
    { id: 'OC-01', name: 'Quick Lube & Oil Express', type: 'oil change', location: 'Zone 1, Highway 9', status: 'Active', rating: '4.9', contact: '+1 (555) 0881', email: 'quick.lube@example.com', amount: '$49.99' },
    { id: 'OC-02', name: 'Express Fleet Fluids', type: 'oil change', location: 'South Terminal', status: 'Active', rating: '4.5', contact: '+1 (555) 0912', email: 'express.fleet@example.com', amount: '$49.99' },
    { id: 'CL-01', name: 'North Terminal Fleet Hub', type: 'car location', location: 'North Terminal', status: 'Active', rating: '-', contact: 'Internal', email: 'north.terminal@example.com', amount: '$49.99' },
    { id: 'CL-02', name: 'Downtown Secure Parking', type: 'car location', location: 'Downtown Hub', status: 'Maintenance', rating: '-', contact: 'Internal', email: 'downtown.parking@example.com', amount: '$49.99' },
    { id: 'VIS-01', name: 'Aarav Mehta', type: 'visitor', location: 'Zone 2, Sector C', status: 'Active', rating: '-', contact: '+91 98765 43210', email: 'aarav.mehta@example.com', amount: '$9.99' },
    { id: 'VIS-02', name: 'Neha Sharma', type: 'visitor', location: 'Zone 3, Sector D', status: 'Active', rating: '-', contact: '+91 99999 88888', email: 'neha.sharma@example.com', amount: '$9.99' }
  ];

  const [allServices, setAllServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', latitude: '', longitude: '', contact: '', email: '', status: 'Active', amount: '' });

  const getNumericAmount = (amtStr) => {
    if (!amtStr) return 0;
    const cleanStr = amtStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleanStr) || 0;
  };

  const totalVal = getNumericAmount(selectedRecord?.paymentAmount || selectedRecord?.amount || '$49.99');
  const baseVal = totalVal / 1.15;
  const vatVal = baseVal * 0.05;
  const taxVal = baseVal * 0.10;

  const currencySymbol = (selectedRecord?.paymentAmount || selectedRecord?.amount || '$49.99').startsWith('$') ? '$' : '₹';
  const baseAmountFormatted = `${currencySymbol}${baseVal.toFixed(2)}`;
  const vatFormatted = `${currencySymbol}${vatVal.toFixed(2)}`;
  const taxFormatted = `${currencySymbol}${taxVal.toFixed(2)}`;

  useEffect(() => {
    const saved = localStorage.getItem('services_data');
    if (saved) {
      setAllServices(JSON.parse(saved));
    } else {
      setAllServices(initialServices);
      localStorage.setItem('services_data', JSON.stringify(initialServices));
    }
  }, []);

  const getFilteredData = () => {
    if (activeTab === 'driver') {
      return drivers
        .filter(d => d.status === 'Approved')
        .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return allServices.filter(s =>
      s.type === activeTab.replace('-', ' ') &&
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  const filteredServices = getFilteredData();

  const tabs = [
    { id: 'workshop', label: 'Workshops', icon: Wrench, prefix: 'WS' },
    { id: 'oil change', label: 'Oil Changes', icon: Droplet, prefix: 'OC' },
    { id: 'visitor', label: 'Visitors', icon: User, prefix: 'VIS' },
    { id: 'driver', label: 'Drivers', icon: Users, prefix: 'DRV' },
  ];

  const saveToStorage = (data) => {
    setAllServices(data);
    localStorage.setItem('services_data', JSON.stringify(data));
  };

  const handleExport = () => {
    if (activeTab === 'driver') {
      const headers = ["Driver ID", "Name", "City", "Email", "Mobile Number", "Status"];
      const rows = filteredServices.map(e => [
        e.id,
        e.name,
        e.city || '—',
        e.email || '—',
        e.phone,
        e.status
      ]);
      downloadExcel(headers, rows, "Approved Drivers", "approved_drivers.xls");
    } else {
      const headers = ["Service ID", "Name", "Location", "Email", "Latitude", "Longitude", "Mobile / Contact Number", "Status"];
      const rows = filteredServices.map(e => [
        e.id,
        e.name,
        e.location,
        e.email || '—',
        e.latitude || '',
        e.longitude || '',
        e.contact,
        e.status
      ]);
      downloadExcel(headers, rows, `${activeTab === 'workshop' ? 'Workshops' : activeTab === 'oil change' ? 'Oil Changes' : 'Visitors'}`, `${activeTab}_services.xls`);
    }
  };

  const handleExportSingle = (record) => {
    if (activeTab === 'driver') {
      const headers = ["Driver ID", "Name", "City", "Email", "Mobile Number", "Status"];
      const rows = [[
        record.id,
        record.name,
        record.city || '—',
        record.email || '—',
        record.phone,
        record.status
      ]];
      downloadExcel(headers, rows, "Driver Details", `driver_${record.id}.xls`);
    } else {
      const headers = ["Service ID", "Name", "Location", "Email", "Latitude", "Longitude", "Mobile / Contact Number", "Status"];
      const rows = [[
        record.id,
        record.name,
        record.location,
        record.email || '—',
        record.latitude || '',
        record.longitude || '',
        record.contact,
        record.status
      ]];
      downloadExcel(headers, rows, "Service Details", `service_${record.id}.xls`);
    }
  };

  const handleAddClick = () => {
    setModalMode('add');
    setFormData({ name: '', location: '', latitude: '28.6250', longitude: '77.2180', contact: '', email: '', status: 'Active', amount: '$49.99' });
    setIsModalOpen(true);
  };

  const handleEditClick = (record) => {
    setModalMode('edit');
    setSelectedRecord(record);
    setFormData({ name: record.name, location: record.location, latitude: record.latitude || '28.6250', longitude: record.longitude || '77.2180', contact: record.contact, email: record.email || '', status: record.status, amount: record.amount || '$49.99' });
    setIsModalOpen(true);
  };

  const handleViewClick = (record) => {
    setModalMode('view');
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const [deleteServiceId, setDeleteServiceId] = useState(null);

  const handleDelete = (id) => {
    setDeleteServiceId(id);
  };

  const [validationAlert, setValidationAlert] = useState('');

  const handleSaveModal = () => {
    if (!formData.name.trim()) {
      setValidationAlert('Service Name is required.');
      return;
    }
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
        email: formData.email,
        status: formData.status,
        rating: 'New',
        amount: formData.amount
      };
      saveToStorage([newService, ...allServices]);
    } else if (modalMode === 'edit') {
      const updated = allServices.map(s => {
        if (s.id === selectedRecord.id) {
          return { ...s, name: formData.name, location: formData.location, latitude: formData.latitude, longitude: formData.longitude, contact: formData.contact, email: formData.email, status: formData.status, amount: formData.amount };
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
          <h1>Registered User Services</h1>
          <p>Manage workshop, oil change, and car location nodes visible on driver map telemetry.</p>
        </div>
        {activeTab !== 'driver' && activeTab !== 'visitor' && (
          <button className="btn-primary d-flex align-center gap-sm" onClick={handleAddClick}>
            <Plus size={18} /> Add Service
          </button>
        )}
      </div>

      <div className="services-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const count = tab.id === 'driver'
            ? drivers.filter(d => d.status === 'Approved').length
            : allServices.filter(s => s.type === tab.id).length;
          return (
            <button
              key={tab.id}
              className={`service-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={20} />
              {tab.label}
              <span className="tab-count">
                {count}
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
          <button className="btn-outline" onClick={handleExport}>Export Excel</button>
        </div>

        <Table
          className="table-scrollable"
          headers={activeTab === 'driver'
            ? ['Driver ID', 'Name & City', 'Email', 'Mobile Number', 'Status', 'Actions']
            : ['Service ID', 'Name & Location', 'Email', 'GPS Coordinates', 'Mobile / Contact Number', 'Status', 'Actions']}
          data={filteredServices}
          renderRow={(row) => {
            const isDriverTab = activeTab === 'driver';
            return (
              <tr key={row.id}>
                <td>
                  <span className="id-badge">{row.id}</span>
                </td>
                <td>
                  <div className="d-flex flex-column">
                    <strong>{row.name}</strong>
                    <span className="text-muted text-sm">{isDriverTab ? (row.city || '—') : row.location}</span>
                  </div>
                </td>
                <td>{row.email || '—'}</td>
                {!isDriverTab && (
                  <td>
                    <code>{row.latitude || '28.6250'}, {row.longitude || '77.2180'}</code>
                  </td>
                )}
                <td>{isDriverTab ? row.phone : row.contact}</td>

                <td>
                  <span className={`status-badge ${row.status.toLowerCase()}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <div className="row-actions" style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="ghost" size="sm" leftIcon={Eye} onClick={() => handleViewClick(row)}></Button>
                    <Button variant="ghost" size="sm" leftIcon={Download} onClick={() => handleExportSingle(row)} title="Export Single Record"></Button>
                    {!isDriverTab && (
                      <>
                        <Button variant="ghost" size="sm" leftIcon={Edit2} onClick={() => handleEditClick(row)}></Button>
                        <Button variant="ghost" size="sm" leftIcon={Trash2} onClick={() => handleDelete(row.id)}></Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          }}
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
          <div className="modal-record-details" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Name</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.name}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>{activeTab === 'driver' ? 'City' : 'Location'}</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{activeTab === 'driver' ? (selectedRecord.city || '—') : selectedRecord.location}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Email</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.email || '—'}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Contact / Mobile</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{activeTab === 'driver' ? selectedRecord.phone : selectedRecord.contact}</div>
              </div>
            </div>

            {activeTab !== 'driver' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Coordinates</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)', fontFamily: 'monospace' }}>{selectedRecord.latitude || '28.6250'}, {selectedRecord.longitude || '77.2180'}</div>
              </div>
            )}

            <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px dashed var(--color-border)' }}>
                <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-text-main)' }}>Payment & Registration Status</span>
                <span className={`status-badge ${selectedRecord.status.toLowerCase()}`} style={{ margin: 0 }}>
                  {selectedRecord.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Registration Fee (Base)</span>
                  <span style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>{baseAmountFormatted}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>VAT (5%)</span>
                  <span style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>{vatFormatted}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Service Tax (10%)</span>
                  <span style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>{taxFormatted}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-text-main)' }}>Total Amount Paid</span>
                <strong style={{ fontSize: '18px', color: 'var(--color-success)', fontWeight: '800' }}>{selectedRecord.paymentAmount || selectedRecord.amount || '$49.99'}</strong>
              </div>
            </div>
          </div>
        )}
        {modalMode !== 'view' && (
          <div className="modal-record-details" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <Input label="Location Name / Zone" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <Input label="Latitude (e.g. 28.6250)" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: e.target.value })} />
              <Input label="Longitude (e.g. 77.2180)" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: e.target.value })} />
            </div>
            <Input label="Contact" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
            <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <Input label="Status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} />
            <Input label="Amount" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation React Modal */}
      <Modal
        isOpen={!!deleteServiceId}
        onClose={() => setDeleteServiceId(null)}
        title="Confirm Delete Service"
        subtitle="Are you sure you want to delete this registered service? This action cannot be undone."
        primaryActionLabel="Confirm Delete"
        onPrimaryAction={() => {
          saveToStorage(allServices.filter(s => s.id !== deleteServiceId));
          setDeleteServiceId(null);
        }}
        secondaryActionLabel="Cancel"
      >
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', margin: 0 }}>
          Deleting service node ID: <code style={{ color: 'var(--color-primary)' }}>{deleteServiceId}</code>
        </p>
      </Modal>

      {/* Validation React Modal */}
      <Modal
        isOpen={!!validationAlert}
        onClose={() => setValidationAlert('')}
        title="Validation Required"
        subtitle="Please check service details."
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
