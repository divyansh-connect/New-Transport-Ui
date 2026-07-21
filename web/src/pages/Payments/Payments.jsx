import React from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';

export const Payments = () => {
  const payments = [
    { id: 'PAY-901', name: 'John Doe', amount: '$49.99', gateway: 'Credit Card', status: 'Completed', date: '2026-07-21' },
    { id: 'PAY-902', name: 'Metro Workshop', amount: '$49.99', gateway: 'Apple Pay', status: 'Completed', date: '2026-07-20' },
    { id: 'PAY-903', name: 'Alex Smith', amount: '$49.99', gateway: 'Bank Wire', status: 'Completed', date: '2026-07-19' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Payment Transactions</h1>
        <p>Real-time audit log of registration fee payments.</p>
      </div>

      <Card title="Payment List">
        <Table
          headers={['Transaction ID', 'Payer Name', 'Amount', 'Payment Gateway', 'Status', 'Date']}
          data={payments}
          renderRow={(row) => (
            <tr key={row.id}>
              <td><code>{row.id}</code></td>
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
