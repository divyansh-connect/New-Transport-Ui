import React, { useState } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { ShieldCheck, XCircle, Eye } from 'lucide-react';
import './Drivers.css';

export const Drivers = () => {
  const [drivers, setDrivers] = useState([
    { id: 'DRV-8801', name: 'John Doe', email: 'john@example.com', phone: '+1 987 654 3210', plate: 'ABC-9876', status: 'Pending Approval' },
    { id: 'DRV-8802', name: 'Robert Johnson', email: 'robert@example.com', phone: '+1 888 555 1234', plate: 'XYZ-5521', status: 'Approved' },
    { id: 'DRV-8803', name: 'Michael Brown', email: 'michael@example.com', phone: '+1 777 444 9876', plate: 'LMN-4412', status: 'Pending Approval' },
  ]);

  const [selectedDriver, setSelectedDriver] = useState(null);

  const handleApprove = (id) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Approved' } : d))
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Driver Requests & Approval Screen</h1>
        <p>Review submitted driver profiles, verification details, and trigger admin approvals.</p>
      </div>

      <Card title="Driver Registration List">
        <Table
          headers={['Driver ID', 'Full Name', 'Contact Info', 'Plate Number', 'Approval Status', 'Actions']}
          data={drivers}
          renderRow={(row) => (
            <tr key={row.id}>
              <td><strong>{row.id}</strong></td>
              <td>{row.name}</td>
              <td>
                <div>{row.email}</div>
                <small style={{ color: 'var(--color-text-muted)' }}>{row.phone}</small>
              </td>
              <td><code>{row.plate}</code></td>
              <td>
                <span className={`status-badge ${row.status === 'Approved' ? 'approved' : 'pending'}`}>
                  {row.status}
                </span>
              </td>
              <td>
                <div className="action-row">
                  <button className="icon-action" title="View Details" onClick={() => setSelectedDriver(row)}>
                    <Eye size={16} />
                  </button>
                  {row.status === 'Pending Approval' && (
                    <button className="approve-action" onClick={() => handleApprove(row.id)}>
                      <ShieldCheck size={16} /> Approve
                    </button>
                  )}
                </div>
              </td>
            </tr>
          )}
        />
      </Card>

      {/* Driver Detail Drawer Modal */}
      {selectedDriver && (
        <div className="modal-backdrop" onClick={() => setSelectedDriver(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Driver Details - {selectedDriver.name}</h3>
            <div className="detail-list">
              <p><strong>ID:</strong> {selectedDriver.id}</p>
              <p><strong>Email:</strong> {selectedDriver.email}</p>
              <p><strong>Phone:</strong> {selectedDriver.phone}</p>
              <p><strong>Plate:</strong> {selectedDriver.plate}</p>
              <p><strong>Status:</strong> {selectedDriver.status}</p>
            </div>
            <div className="modal-actions">
              {selectedDriver.status === 'Pending Approval' && (
                <button
                  className="approve-action"
                  onClick={() => {
                    handleApprove(selectedDriver.id);
                    setSelectedDriver(null);
                  }}
                >
                  Approve Driver
                </button>
              )}
              <button className="close-btn" onClick={() => setSelectedDriver(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
