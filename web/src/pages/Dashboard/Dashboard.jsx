import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/common/Cards/StatCard';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { Modal } from '../../components/common/Modal/Modal';
import { Input, Select } from '../../components/common/Input/Input';
import { Users, CreditCard, Clock, Wrench, RefreshCw, Plus, Download, Eye, Check, Search, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { downloadExcel } from '../../utils/excelExport';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const initialRegistrations = [
    { id: 'REG-101', name: 'John Doe', type: 'Commercial Driver', status: 'Pending', date: '2026-07-21', amount: '$49.99', phone: '+1 (555) 234-5678' },
    { id: 'REG-102', name: 'Metro Workshop Hub', type: 'Repair Station', status: 'Approved', date: '2026-07-20', amount: '$149.00', phone: '+1 (555) 876-5432' },
    { id: 'REG-103', name: 'Speedy Lube Express', type: 'Oil Change Center', status: 'Approved', date: '2026-07-20', amount: '$199.00', phone: '+1 (555) 456-7890' },
    { id: 'REG-104', name: 'Alex Smith', type: 'Independent Driver', status: 'Pending', date: '2026-07-19', amount: '$49.99', phone: '+1 (555) 789-0123' },
    { id: 'REG-105', name: 'City Fleet Logistics', type: 'Fleet Manager', status: 'Approved', date: '2026-07-18', amount: '$299.00', phone: '+1 (555) 901-2345' },
    { id: 'REG-106', name: 'Retro Car Rentals', type: 'Fleet Manager', status: 'Expired', date: '2026-07-12', amount: '$299.00', phone: '+1 (555) 654-3210' },
  ];

  const [registrations, setRegistrations] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', type: '', amount: '' });

  useEffect(() => {
    const saved = localStorage.getItem('registrations');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Refresh if saved data is missing the phone field or doesn't have the Expired status item
      if (parsed.length > 0 && (!parsed[0].phone || !parsed.some(r => r.status === 'Expired'))) {
        setRegistrations(initialRegistrations);
        localStorage.setItem('registrations', JSON.stringify(initialRegistrations));
      } else {
        setRegistrations(parsed);
      }
    } else {
      setRegistrations(initialRegistrations);
      localStorage.setItem('registrations', JSON.stringify(initialRegistrations));
    }
  }, []);

  const filteredRegistrations = registrations.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (record) => {
    setSelectedRecord(record);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setEditFormData({ name: record.name, type: record.type, amount: record.amount, status: record.status });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const [deleteRegId, setDeleteRegId] = useState(null);

  const handleDelete = (id) => {
    setDeleteRegId(id);
  };

  const handleSaveEdit = () => {
    const updated = registrations.map(r => {
      if (r.id === selectedRecord.id) {
        return { ...r, name: editFormData.name, type: editFormData.type, amount: editFormData.amount, status: editFormData.status };
      }
      return r;
    });
    setRegistrations(updated);
    localStorage.setItem('registrations', JSON.stringify(updated));
    setIsModalOpen(false);
  };

  const handleApproveRegistration = (record) => {
    const updated = registrations.map(r => {
      if (r.id === record.id) {
        return { ...r, status: 'Approved' };
      }
      return r;
    });
    setRegistrations(updated);
    localStorage.setItem('registrations', JSON.stringify(updated));
    setIsModalOpen(false);
  };

  const handleExport = () => {
    const headers = ["Registration ID", "Name", "Category", "Mobile Number", "Status", "Date", "Amount"];
    const rows = filteredRegistrations.map(e => [
      e.id,
      e.name,
      e.type,
      e.phone || '',
      e.status,
      e.date,
      e.amount
    ]);
    downloadExcel(headers, rows, "Registrations", "registrations_report.xls");
  };

  const handleExportSingle = (record) => {
    const headers = ["Registration ID", "Name", "Category", "Mobile Number", "Status", "Date", "Amount"];
    const rows = [[
      record.id,
      record.name,
      record.type,
      record.phone || '',
      record.status,
      record.date,
      record.amount
    ]];
    downloadExcel(headers, rows, "Registration Details", `registration_${record.id}.xls`);
  };

  const handleNewRegistration = () => {
    navigate('/registration');
  };

  return (
    <div className="dashboard-container">
      {/* Top Header Banner */}
      <div className="dashboard-page-header">
        <div>
          <h1 className="page-title">Admin Dashboard Overview</h1>
          <p className="page-subtitle">Real-time system telemetry, registrations, and layout operations.</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" leftIcon={Download} onClick={handleExport}>Export Report</Button>
          <Button variant="primary" leftIcon={Plus} onClick={handleNewRegistration}>New Registration</Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Registered Drivers"
          value="1,248"
          change="+12.4%"
          trend="up"
          icon={Users}
          color="primary"
          description="Active verified drivers in system"
        />
        <StatCard
          title="Pending Approvals Queue"
          value="18"
          change="Requires Review"
          trend="down"
          icon={Clock}
          color="warning"
          description="4 pending document verifications"
        />
        <StatCard
          title="Total Platform Revenue"
          value="$62,400"
          change="+8.4%"
          trend="up"
          icon={CreditCard}
          color="success"
          description="Processed payment receipts"
        />
        <StatCard
          title="Active Service Hubs"
          value="342"
          change="+3 new today"
          trend="up"
          icon={Wrench}
          color="info"
          description="Workshops & lube centers"
        />
      </div>

      {/* Table Section Card */}
      <Card
        title="Recent Registrations & Activity"
        subtitle="Manage and inspect incoming driver and service partner registrations."
        action={
          <div className="table-filter-bar">
            <Input
              placeholder="Search by name or ID..."
              leftIcon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Approved Only', value: 'APPROVED' },
                { label: 'Pending Approval', value: 'PENDING' },
                { label: 'Expired', value: 'EXPIRED' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        }
      >
        <Table
          className="table-scrollable"
          headers={['Registration ID', 'Name / Entity', 'Category', 'Mobile No', 'Status', 'Date', 'Amount', 'Actions']}
          data={filteredRegistrations}
          emptyTitle="No Registrations Found"
          emptyDescription="No registration records match your current search or filter criteria."
          pagination={{
            currentPage: 1,
            pageSize: 5,
            totalPages: 1,
            totalItems: filteredRegistrations.length,
            onPrev: () => { },
            onNext: () => { },
          }}
          renderRow={(row) => (
            <tr key={row.id}>
              <td><strong className="mono-id">{row.id}</strong></td>
              <td>
                <span className="row-name">{row.name}</span>
              </td>
              <td><span className="row-type">{row.type}</span></td>
              <td>{row.phone || '—'}</td>
              <td>
                <Badge
                  variant={row.status === 'Approved' ? 'success' : row.status === 'Expired' ? 'danger' : 'warning'}
                  pulse={row.status === 'Pending'}
                >
                  {row.status}
                </Badge>
              </td>
              <td><span className="row-date">{row.date}</span></td>
              <td><strong className="row-amount">{row.amount}</strong></td>
              <td>
                <div className="row-actions" style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Eye}
                    onClick={() => handleOpenModal(row)}
                  >
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Download}
                    onClick={() => handleExportSingle(row)}
                    title="Export Single Record"
                  >
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Edit2}
                    onClick={() => handleEditClick(row)}
                  >
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Trash2}
                    onClick={() => handleDelete(row.id)}
                  >
                  </Button>
                </div>
              </td>
            </tr>
          )}
        />
      </Card>

      {/* Record Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? `Edit Registration: ${selectedRecord?.id || ''}` : `Registration Details: ${selectedRecord?.id || ''}`}
        subtitle={isEditMode ? "Update the details of this registration." : "Review registration details and approve or reject request."}
        primaryActionLabel={isEditMode ? "Save Changes" : (selectedRecord?.status === 'Pending' ? "Approve Registration" : null)}
        onPrimaryAction={isEditMode ? handleSaveEdit : () => handleApproveRegistration(selectedRecord)}
        secondaryActionLabel="Close"
      >
        {selectedRecord && !isEditMode && (
          <div className="modal-record-details" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Entity Name</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.name}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Category</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.type}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Mobile Number</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.phone || '—'}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Submission Date</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.date}</div>
              </div>
            </div>

            <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px dashed var(--color-border)' }}>
                <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-text-main)' }}>Registration Receipt</span>
                <Badge variant={selectedRecord.status === 'Approved' ? 'success' : selectedRecord.status === 'Expired' ? 'danger' : 'warning'}>
                  {selectedRecord.status}
                </Badge>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-text-main)' }}>Registration Amount Paid</span>
                <strong style={{ fontSize: '18px', color: 'var(--color-success)', fontWeight: '800' }}>{selectedRecord.amount}</strong>
              </div>
            </div>
          </div>
        )}
        {selectedRecord && isEditMode && (
          <div className="modal-record-details" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Entity Name"
              value={editFormData.name}
              onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
            />
            <Input
              label="Category"
              value={editFormData.type}
              onChange={e => setEditFormData({ ...editFormData, type: e.target.value })}
            />
            <Input
              label="Amount"
              value={editFormData.amount}
              onChange={e => setEditFormData({ ...editFormData, amount: e.target.value })}
            />
            <Select
              label="Status"
              value={editFormData.status}
              onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
              options={[
                { label: 'Pending', value: 'Pending' },
                { label: 'Approved', value: 'Approved' },
                { label: 'Expired', value: 'Expired' }
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation React Modal */}
      <Modal
        isOpen={!!deleteRegId}
        onClose={() => setDeleteRegId(null)}
        title="Confirm Delete Registration"
        subtitle="Are you sure you want to delete this registration record? This action cannot be undone."
        primaryActionLabel="Confirm Delete"
        onPrimaryAction={() => {
          const updated = registrations.filter(r => r.id !== deleteRegId);
          setRegistrations(updated);
          localStorage.setItem('registrations', JSON.stringify(updated));
          setDeleteRegId(null);
        }}
        secondaryActionLabel="Cancel"
      >
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', margin: 0 }}>
          Deleting registration ID: <code style={{ color: 'var(--color-primary)' }}>{deleteRegId}</code>
        </p>
      </Modal>
    </div>
  );
};
