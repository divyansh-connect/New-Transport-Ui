import React, { useState } from 'react';
import { StatCard } from '../../components/common/Cards/StatCard';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { Modal } from '../../components/common/Modal/Modal';
import { Input, Select } from '../../components/common/Input/Input';
import { Users, CreditCard, Clock, Wrench, RefreshCw, Plus, Download, Eye, Check, Search } from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const initialRegistrations = [
    { id: 'REG-101', name: 'John Doe', type: 'Commercial Driver', status: 'Pending', date: '2026-07-21', amount: '$49.99' },
    { id: 'REG-102', name: 'Metro Workshop Hub', type: 'Repair Station', status: 'Approved', date: '2026-07-20', amount: '$149.00' },
    { id: 'REG-103', name: 'Speedy Lube Express', type: 'Oil Change Center', status: 'Approved', date: '2026-07-20', amount: '$199.00' },
    { id: 'REG-104', name: 'Alex Smith', type: 'Independent Driver', status: 'Pending', date: '2026-07-19', amount: '$49.99' },
    { id: 'REG-105', name: 'City Fleet Logistics', type: 'Fleet Manager', status: 'Approved', date: '2026-07-18', amount: '$299.00' },
  ];

  const filteredRegistrations = initialRegistrations.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
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
          <Button variant="secondary" leftIcon={Download}>Export Report</Button>
          <Button variant="primary" leftIcon={Plus}>New Registration</Button>
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
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        }
      >
        <Table
          headers={['Registration ID', 'Name / Entity', 'Category', 'Status', 'Date', 'Amount', 'Actions']}
          data={filteredRegistrations}
          emptyTitle="No Registrations Found"
          emptyDescription="No registration records match your current search or filter criteria."
          pagination={{
            currentPage: 1,
            pageSize: 5,
            totalPages: 1,
            totalItems: filteredRegistrations.length,
            onPrev: () => {},
            onNext: () => {},
          }}
          renderRow={(row) => (
            <tr key={row.id}>
              <td><strong className="mono-id">{row.id}</strong></td>
              <td>
                <span className="row-name">{row.name}</span>
              </td>
              <td><span className="row-type">{row.type}</span></td>
              <td>
                <Badge
                  variant={row.status === 'Approved' ? 'success' : 'warning'}
                  pulse={row.status === 'Pending'}
                >
                  {row.status}
                </Badge>
              </td>
              <td><span className="row-date">{row.date}</span></td>
              <td><strong className="row-amount">{row.amount}</strong></td>
              <td>
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Eye}
                    onClick={() => handleOpenModal(row)}
                  >
                    View
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
        title={`Registration Details: ${selectedRecord?.id || ''}`}
        subtitle="Review registration details and approve or reject request."
        primaryActionLabel="Approve Registration"
        onPrimaryAction={() => setIsModalOpen(false)}
        secondaryActionLabel="Close"
      >
        {selectedRecord && (
          <div className="modal-record-details">
            <div className="detail-row">
              <span className="detail-label">Entity Name:</span>
              <strong className="detail-value">{selectedRecord.name}</strong>
            </div>
            <div className="detail-row">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{selectedRecord.type}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <Badge variant={selectedRecord.status === 'Approved' ? 'success' : 'warning'}>
                {selectedRecord.status}
              </Badge>
            </div>
            <div className="detail-row">
              <span className="detail-label">Submission Date:</span>
              <span className="detail-value">{selectedRecord.date}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Amount:</span>
              <strong className="detail-value text-success">{selectedRecord.amount}</strong>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
