import React, { useState } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { useDrivers } from '../../context/DriverContext';
import { Button } from '../../components/common/Button/Button';
import { Modal } from '../../components/common/Modal/Modal';
import { Input } from '../../components/common/Input/Input';
import { Download, Eye, Edit2, Trash2 } from 'lucide-react';

export const Payments = () => {
  const { payments, deletePayment, updatePayment } = useDrivers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', amount: '', gateway: '', status: '' });

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Transaction ID,Driver ID,Payer Name,Amount,Payment Gateway,Status,Date\n" + 
      payments.map(e => `${e.id},${e.driverId},${e.name},${e.amount},${e.gateway},${e.status},${e.date}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payments_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditFormData({ name: record.name, amount: record.amount, gateway: record.gateway, status: record.status });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleDelete = (id) => {
    setDeleteTargetId(id);
  };

  const handleSaveEdit = () => {
    updatePayment(selectedRecord.id, editFormData);
    setIsModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Payment Transactions</h1>
          <p>Real-time audit log of registration fee payments.</p>
        </div>
        <div>
          <Button variant="secondary" leftIcon={Download} onClick={handleExport}>Export Report</Button>
        </div>
      </div>

      <Card title="Payment List">
        <Table
          headers={['Transaction ID', 'Driver ID', 'Payer Name', 'Amount', 'Payment Gateway', 'Status', 'Date', 'Actions']}
          data={payments}
          renderRow={(row) => (
            <tr key={row.id}>
              <td><code>{row.id}</code></td>
              <td><code>{row.driverId}</code></td>
              <td><strong>{row.name}</strong></td>
              <td>{row.amount}</td>
              <td>{row.gateway}</td>
              <td><span className="status-badge approved">{row.status}</span></td>
              <td>{row.date}</td>
              <td>
                <div className="row-actions" style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="ghost" size="sm" leftIcon={Eye} onClick={() => handleView(row)}></Button>
                  <Button variant="ghost" size="sm" leftIcon={Edit2} onClick={() => handleEdit(row)}></Button>
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
        title={isEditMode ? `Edit Payment: ${selectedRecord?.id || ''}` : `Payment Details: ${selectedRecord?.id || ''}`}
        subtitle={isEditMode ? "Update the details of this payment." : "Review payment transaction details."}
        primaryActionLabel={isEditMode ? "Save Changes" : "Close"}
        onPrimaryAction={isEditMode ? handleSaveEdit : () => setIsModalOpen(false)}
        secondaryActionLabel={isEditMode ? "Cancel" : null}
      >
        {selectedRecord && !isEditMode && (
          <div className="modal-record-details">
            <div className="detail-row">
              <span className="detail-label">Payer Name:</span>
              <strong className="detail-value">{selectedRecord.name}</strong>
            </div>
            <div className="detail-row">
              <span className="detail-label">Driver ID:</span>
              <span className="detail-value">{selectedRecord.driverId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Gateway:</span>
              <span className="detail-value">{selectedRecord.gateway}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="status-badge approved">{selectedRecord.status}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{selectedRecord.date}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <strong className="detail-value text-success">{selectedRecord.amount}</strong>
            </div>
          </div>
        )}
        {selectedRecord && isEditMode && (
          <div className="modal-record-details" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input 
              label="Payer Name" 
              value={editFormData.name} 
              onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
            />
            <Input 
              label="Amount" 
              value={editFormData.amount} 
              onChange={e => setEditFormData({...editFormData, amount: e.target.value})} 
            />
            <Input 
              label="Payment Gateway" 
              value={editFormData.gateway} 
              onChange={e => setEditFormData({...editFormData, gateway: e.target.value})} 
            />
            <Input 
              label="Status" 
              value={editFormData.status} 
              onChange={e => setEditFormData({...editFormData, status: e.target.value})} 
            />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation React Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Delete Payment"
        subtitle="Are you sure you want to delete this payment record? This action cannot be undone."
        primaryActionLabel="Confirm Delete"
        onPrimaryAction={() => {
          deletePayment(deleteTargetId);
          setDeleteTargetId(null);
        }}
        secondaryActionLabel="Cancel"
      >
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', margin: 0 }}>
          Deleting transaction ID: <code style={{ color: 'var(--color-primary)' }}>{deleteTargetId}</code>
        </p>
      </Modal>
    </div>
  );
};

