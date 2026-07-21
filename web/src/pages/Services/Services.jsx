import React from 'react';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';

export const Services = () => {
  const services = [
    { id: 'SRV-01', hub: 'Central Maintenance Garage', type: 'Workshop', location: 'Zone 4, Sector B', status: 'Active' },
    { id: 'SRV-02', hub: 'Quick Lube & Oil Express', type: 'Oil Change', location: 'Zone 1, Highway 9', status: 'Active' },
    { id: 'SRV-03', hub: 'North Terminal Fleet Hub', type: 'Car Location', location: 'North Terminal', status: 'Active' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Registered Service Centers</h1>
        <p>Manage workshop, oil change, and car location nodes visible on driver map telemetry.</p>
      </div>

      <Card title="Service List">
        <Table
          headers={['Service ID', 'Hub Name', 'Type', 'Location Node', 'Status']}
          data={services}
          renderRow={(row) => (
            <tr key={row.id}>
              <td><code>{row.id}</code></td>
              <td><strong>{row.hub}</strong></td>
              <td>{row.type}</td>
              <td>{row.location}</td>
              <td><span className="status-badge approved">{row.status}</span></td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};
