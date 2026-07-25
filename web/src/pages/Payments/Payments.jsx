import React, { useState } from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { useDrivers } from '../../context/DriverContext';
import { Button } from '../../components/common/Button/Button';
import { Modal } from '../../components/common/Modal/Modal';
import { Input } from '../../components/common/Input/Input';
import { Download, Eye, Edit2, Trash2 } from 'lucide-react';
import { downloadExcel } from '../../utils/excelExport';

export const Payments = () => {
  const { payments, drivers, deletePayment, updatePayment } = useDrivers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', amount: '', gateway: '', status: '' });

  const getNumericAmount = (amtStr) => {
    if (!amtStr) return 0;
    const cleanStr = amtStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleanStr) || 0;
  };

  const totalVal = getNumericAmount(selectedRecord?.amount);
  const baseVal = totalVal / 1.15;
  const vatVal = baseVal * 0.05;
  const taxVal = baseVal * 0.10;

  const currencySymbol = selectedRecord?.amount?.startsWith('$') ? '$' : '₹';
  const baseAmountFormatted = `${currencySymbol}${baseVal.toFixed(2)}`;
  const vatFormatted = `${currencySymbol}${vatVal.toFixed(2)}`;
  const taxFormatted = `${currencySymbol}${taxVal.toFixed(2)}`;

  const currentDriverObj = selectedRecord ? drivers.find(d => d.id === selectedRecord.driverId) : null;

  const handleExport = () => {
    const headers = ["Transaction ID", "User ID", "Payer Name", "Mobile Number", "Email Address", "Amount", "Payment Gateway", "Status", "Date"];
    const rows = payments.map(e => {
      const driverObj = drivers.find(d => d.id === e.driverId);
      const mobileNumber = driverObj ? driverObj.phone : '—';
      const email = driverObj ? driverObj.email : '—';
      return [
        e.id,
        e.driverId,
        e.name,
        mobileNumber,
        email,
        e.amount,
        e.gateway,
        e.status,
        e.date
      ];
    });
    downloadExcel(headers, rows, "Payments", "payments_report.xls");
  };

  const handleExportSingle = (record) => {
    const headers = ["Transaction ID", "User ID", "Payer Name", "Mobile Number", "Email Address", "Amount", "Payment Gateway", "Status", "Date"];
    const driverObj = drivers.find(d => d.id === record.driverId);
    const mobileNumber = driverObj ? driverObj.phone : '—';
    const email = driverObj ? driverObj.email : '—';
    const rows = [[
      record.id,
      record.driverId,
      record.name,
      mobileNumber,
      email,
      record.amount,
      record.gateway,
      record.status,
      record.date
    ]];
    downloadExcel(headers, rows, "Payment Details", `payment_${record.id}.xls`);
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
          className="table-scrollable"
          headers={['Transaction ID', 'User ID', 'Payer Name', 'Mobile Number', 'Email', 'Amount', 'Payment Gateway', 'Status', 'Date', 'Actions']}
          data={payments}
          renderRow={(row) => {
            const driverObj = drivers.find(d => d.id === row.driverId);
            const mobileNumber = driverObj ? driverObj.phone : '—';
            const email = driverObj ? driverObj.email : '—';
            return (
              <tr key={row.id}>
                <td><code>{row.id}</code></td>
                <td><code>{row.driverId}</code></td>
                <td><strong>{row.name}</strong></td>
                <td>{mobileNumber}</td>
                <td>{email}</td>
                <td>{row.amount}</td>
                <td>{row.gateway}</td>
                <td><span className="status-badge approved">{row.status}</span></td>
                <td>{row.date}</td>
                <td>
                  <div className="row-actions" style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="ghost" size="sm" leftIcon={Eye} onClick={() => handleView(row)}></Button>
                    <Button variant="ghost" size="sm" leftIcon={Download} onClick={() => handleExportSingle(row)}></Button>
                    <Button variant="ghost" size="sm" leftIcon={Edit2} onClick={() => handleEdit(row)}></Button>
                    <Button variant="ghost" size="sm" leftIcon={Trash2} onClick={() => handleDelete(row.id)}></Button>
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
        title={isEditMode ? `Edit Payment: ${selectedRecord?.id || ''}` : `Payment Details: ${selectedRecord?.id || ''}`}
        subtitle={isEditMode ? "Update the details of this payment." : "Review payment transaction details."}
        primaryActionLabel={isEditMode ? "Save Changes" : "Close"}
        onPrimaryAction={isEditMode ? handleSaveEdit : () => setIsModalOpen(false)}
        secondaryActionLabel={isEditMode ? "Cancel" : null}
      >
        {selectedRecord && !isEditMode && (
          <div className="modal-record-details" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Payer Name</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.name}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>User ID</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.driverId}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Email Address</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{currentDriverObj?.email || '—'}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Mobile / Phone</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{currentDriverObj?.phone || '—'}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Payment Gateway</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.gateway}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Transaction Date</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.date}</div>
              </div>
            </div>

            <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px dashed var(--color-border)' }}>
                <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-text-main)' }}>Receipt Breakdown</span>
                <span className="status-badge approved" style={{ margin: 0 }}>{selectedRecord.status}</span>
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
                <strong style={{ fontSize: '18px', color: 'var(--color-success)', fontWeight: '800' }}>{selectedRecord.amount}</strong>
              </div>
            </div>
          </div>
        )}
        {selectedRecord && isEditMode && (
          <div className="modal-record-details" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Payer Name"
              value={editFormData.name}
              onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
            />
            <Input
              label="Amount"
              value={editFormData.amount}
              onChange={e => setEditFormData({ ...editFormData, amount: e.target.value })}
            />
            <Input
              label="Payment Gateway"
              value={editFormData.gateway}
              onChange={e => setEditFormData({ ...editFormData, gateway: e.target.value })}
            />
            <Input
              label="Status"
              value={editFormData.status}
              onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
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

