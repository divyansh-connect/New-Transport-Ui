import React from 'react';
import { StatCard } from '../../components/common/Cards/StatCard';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { Users, CreditCard, Clock, Wrench, ShieldCheck } from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const recentRegistrations = [
    { id: 'REG-101', name: 'John Doe', type: 'Driver', status: 'Pending Approval', date: '2026-07-21' },
    { id: 'REG-102', name: 'Metro Workshop', type: 'Workshop', status: 'Approved', date: '2026-07-20' },
    { id: 'REG-103', name: 'Speedy Lube Hub', type: 'Oil Change', status: 'Approved', date: '2026-07-20' },
    { id: 'REG-104', name: 'Alex Smith', type: 'Driver', status: 'Pending Approval', date: '2026-07-19' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Real-time telemetry, driver requests, and service analytics.</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Registered Drivers" value="1,248" change="+12% this month" icon={Users} color="primary" />
        <StatCard title="Pending Approvals" value="18" change="Requires Admin Review" icon={Clock} color="warning" />
        <StatCard title="Total Payments Received" value="$62,400" change="+8.4% this week" icon={CreditCard} color="success" />
        <StatCard title="Active Service Hubs" value="342" change="Workshops & Oil Centers" icon={Wrench} color="primary" />
      </div>

      <div className="dashboard-content-grid">
        <Card title="Recent Driver & Partner Registrations" className="grid-span-2">
          <Table
            headers={['ID', 'Name / Entity', 'Type', 'Status', 'Date', 'Action']}
            data={recentRegistrations}
            renderRow={(row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td><strong>{row.name}</strong></td>
                <td>{row.type}</td>
                <td>
                  <span className={`status-badge ${row.status === 'Approved' ? 'approved' : 'pending'}`}>
                    {row.status}
                  </span>
                </td>
                <td>{row.date}</td>
                <td>
                  <button className="table-action-btn">View Details</button>
                </td>
              </tr>
            )}
          />
        </Card>

        <Card title="Pending Approvals Queue">
          <div className="pending-list">
            <div className="pending-item">
              <div>
                <strong>John Doe (Commercial Driver)</strong>
                <p>Plate: ABC-9876 | Paid $49.99</p>
              </div>
              <button className="approve-btn">Approve</button>
            </div>
            <div className="pending-item">
              <div>
                <strong>Alex Smith (Fleet Owner)</strong>
                <p>Plate: XYZ-1234 | Paid $49.99</p>
              </div>
              <button className="approve-btn">Approve</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
