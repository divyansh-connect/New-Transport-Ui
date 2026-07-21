import React from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { useDrivers } from '../../context/DriverContext';

export const Payments = () => {
  const { payments } = useDrivers();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Payment Transactions</h1>
        <p>Real-time audit log of registration fee payments.</p>
      </div>

      <Card title="Payment List">
        <Table
          headers={['Transaction ID', 'Driver ID', 'Payer Name', 'Amount', 'Payment Gateway', 'Status', 'Date']}
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
            </tr>
          )}
        />
      </Card>
    </div>
  );
};

