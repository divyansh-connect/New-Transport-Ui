import React, { useState } from 'react';
import { useDrivers } from '../../context/DriverContext';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { Button } from '../../components/common/Button/Button';
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  CreditCard,
  Bell,
  Eye,
  Edit2,
  Check,
  X,
  FileText,
  AlertTriangle,
  User,
  Shield,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Download,
  Trash2,
} from 'lucide-react';
import { downloadExcel } from '../../utils/excelExport';
import './Drivers.css';
import { useTheme } from '../../context/ThemeContext';

export const Drivers = () => {
  const { checkUserPermission } = useTheme();
  const {
    drivers,
    payments,
    notifications,
    approveDriver,
    rejectDriver,
    setDriverStatus,
    updateDriverProfile,
    markNotificationAsRead,
    clearAllNotifications,
    deleteDriver,
  } = useDrivers();

  // Active tab state
  // Can be: 'requests' | 'pending' | 'approved' | 'rejected' | 'payments' | 'notifications'
  const [activeTab, setActiveTab] = useState('requests');

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected driver for detail drawer
  const [selectedDriver, setSelectedDriver] = useState(null);
  // Rejection modal state
  const [rejectingDriver, setRejectingDriver] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Reset pagination on filter or tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
    setCategoryFilter('');
    setVehicleFilter('');
  };

  const handleExport = () => {
    const listToExport = getFilteredDrivers();
    const headers = ["Driver ID", "Name", "Email", "Mobile Number", "City", "Vehicle Type", "Vehicle Model", "Plate Number", "Experience", "Status", "Registration Date"];
    const rows = listToExport.map(e => [
      e.id,
      e.name,
      e.email,
      e.phone,
      e.city || '',
      e.vehicleType,
      e.vehicleModel,
      e.plateNumber,
      e.experienceYears,
      e.status,
      e.registrationDate
    ]);
    downloadExcel(headers, rows, "Drivers Report", "drivers_report.xls");
  };

  const handleExportSingle = (driver) => {
    const headers = ["Driver ID", "Name", "Email", "Mobile Number", "City", "Vehicle Type", "Vehicle Model", "Plate Number", "Experience", "Status", "Registration Date"];
    const rows = [[
      driver.id,
      driver.name,
      driver.email,
      driver.phone,
      driver.city || '',
      driver.vehicleType,
      driver.vehicleModel,
      driver.plateNumber,
      driver.experienceYears,
      driver.status,
      driver.registrationDate
    ]];
    downloadExcel(headers, rows, "Driver Details", `driver_${driver.id}.xls`);
  };

  // Filter and Search logic
  const getFilteredDrivers = () => {
    return drivers.filter((driver) => {
      // Tab filter
      if (activeTab === 'pending' && driver.status !== 'Pending') return false;
      if (activeTab === 'approved' && driver.status !== 'Approved') return false;
      if (activeTab === 'rejected' && driver.status !== 'Rejected') return false;

      // Search query
      const matchSearch =
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      let matchCategory = true;
      if (categoryFilter) {
        if (categoryFilter === 'driver') {
          matchCategory = driver.id.startsWith('DRV-') || driver.type === 'driver' || (!driver.id.startsWith('WS-') && !driver.id.startsWith('OC-') && !driver.id.startsWith('VIS-') && driver.type !== 'workshop' && driver.type !== 'oil' && driver.type !== 'visitor');
        } else if (categoryFilter === 'workshop') {
          matchCategory = driver.id.startsWith('WS-') || driver.type === 'workshop' || driver.vehicleType === 'Repair Workshop';
        } else if (categoryFilter === 'oil') {
          matchCategory = driver.id.startsWith('OC-') || driver.type === 'oil' || driver.vehicleType === 'Oil Change Center';
        } else if (categoryFilter === 'visitor') {
          matchCategory = driver.id.startsWith('VIS-') || driver.type === 'visitor' || driver.vehicleType === 'Visitor';
        }
      }

      // Vehicle type filter
      const matchVehicle = vehicleFilter ? driver.vehicleType.includes(vehicleFilter) : true;

      return matchSearch && matchCategory && matchVehicle;
    });
  };

  const filteredList = activeTab === 'payments' ? payments : getFilteredDrivers();

  // Paginated List
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = filteredList.slice(startIndex, startIndex + itemsPerPage);

  // Stats Counters
  const countPending = drivers.filter((d) => d.status === 'Pending').length;
  const countApproved = drivers.filter((d) => d.status === 'Approved').length;
  const countRejected = drivers.filter((d) => d.status === 'Rejected').length;

  const handleOpenDetails = (driver) => {
    setSelectedDriver(driver);
    setEditForm({ ...driver });
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    updateDriverProfile(editForm.id, editForm);
    setSelectedDriver(editForm);
    setIsEditing(false);
  };

  const handleApproveAction = (id) => {
    approveDriver(id);
    if (selectedDriver && selectedDriver.id === id) {
      setSelectedDriver((prev) => ({
        ...prev,
        status: 'Approved',
        documents: {
          license: { ...prev.documents.license, status: 'Verified' },
          insurance: { ...prev.documents.insurance, status: 'Verified' },
          backgroundCheck: { ...prev.documents.backgroundCheck, status: 'Verified' },
        },
      }));
    }
  };

  const handleRejectClick = (driver) => {
    setRejectingDriver(driver);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectingDriver(null);
    setRejectReason('');
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) return;
    const target = rejectingDriver || selectedDriver;
    if (!target) return;
    const finalReason = rejectReason.trim();
    rejectDriver(target.id, finalReason);
    if (selectedDriver && selectedDriver.id === target.id) {
      setSelectedDriver((prev) => ({
        ...prev,
        status: 'Rejected',
        rejectionReason: finalReason,
      }));
    }
    handleCloseRejectModal();
  };

  // Unique lists for filters
  const vehicleTypes = Array.from(new Set(drivers.map((d) => d.vehicleType)));

  return (
    <div className="page-container drivers-workspace">
      {/* Workspace Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>User Management Center</h1>
          <p>Manage registrations, audit documentation quality, and dispatch approvals.</p>
        </div>
        <div>
          <Button variant="secondary" leftIcon={Download} onClick={handleExport}>Export Users</Button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="drivers-stats-grid">
        <div className="stat-card-custom" onClick={() => handleTabChange('requests')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h4>Total Applications</h4>
            <p>{drivers.length}</p>
          </div>
        </div>

        <div className="stat-card-custom" onClick={() => handleTabChange('pending')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper yellow">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h4>Pending Review</h4>
            <p>{countPending}</p>
          </div>
        </div>

        <div className="stat-card-custom" onClick={() => handleTabChange('approved')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h4>Approved Users</h4>
            <p>{countApproved}</p>
          </div>
        </div>

        <div className="stat-card-custom" onClick={() => handleTabChange('rejected')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper red">
            <XCircle size={24} />
          </div>
          <div className="stat-info">
            <h4>Rejected Applicants</h4>
            <p>{countRejected}</p>
          </div>
        </div>
      </div>

      {/* Primary Module Navigation Tabs */}
      <div className="drivers-nav-tabs">
        <button
          className={`drivers-tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => handleTabChange('requests')}
        >
          All Requests ({drivers.length})
        </button>
        <button
          className={`drivers-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => handleTabChange('pending')}
        >
          Pending Requests ({countPending})
        </button>
        <button
          className={`drivers-tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => handleTabChange('approved')}
        >
          Approved ({countApproved})
        </button>
        <button
          className={`drivers-tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => handleTabChange('rejected')}
        >
          Rejected ({countRejected})
        </button>
      </div>

      {/* Main Workspace Card */}
      <Card
        title={
          activeTab === 'requests'
            ? 'User Registrations Inbox'
            : activeTab === 'pending'
              ? 'Pending Approvals Workspace'
              : activeTab === 'approved'
                ? 'Approved Active Users'
                : activeTab === 'rejected'
                  ? 'Archived Rejections'
                  : activeTab === 'payments'
                    ? 'Registration Payments'
                    : 'User Notifications History'
        }
      >
        {/* Render Driver lists / Payment list / Notifications */}
        {activeTab !== 'notifications' && activeTab !== 'payments' && (
          <>
            {/* Search & Filters */}
            <div className="search-filter-bar">
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon-inside" />
                <input
                  type="text"
                  placeholder="Search by ID, Name, Email, or Plate..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="filters-group">
                <select
                  className="filter-select"
                  value={categoryFilter}
                  onChange={(e) => {
                    const selectedVal = e.target.value;
                    setCategoryFilter(selectedVal);
                    if (selectedVal !== 'driver') {
                      setVehicleFilter('');
                    }
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="driver">Drivers</option>
                  <option value="workshop">Workshops</option>
                  <option value="oil">Oil Changes</option>
                  <option value="visitor">Visitors</option>
                </select>

                {categoryFilter === 'driver' && (
                  <select
                    className="filter-select"
                    value={vehicleFilter}
                    onChange={(e) => {
                      setVehicleFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Vehicle Types</option>
                    {vehicleTypes.map((vt) => (
                      <option key={vt} value={vt}>
                        {vt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Drivers Table */}
            <Table
              headers={(() => {
                const list = ['User', 'Contact & Region', 'Details', 'Payment Info', 'Status', 'Registration Date'];
                if (checkUserPermission('Users', 'edit') || checkUserPermission('Users', 'delete')) {
                  list.push('Actions');
                }
                return list;
              })()}
              data={paginatedList}
              renderRow={(row) => (
                <tr key={row.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={row.avatar} alt={row.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '600' }}>{row.name} {row.lastName || ''}</div>
                        <small style={{ color: 'var(--color-text-muted)' }}><code>{row.id}</code></small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{row.email}</div>
                    <small style={{ color: 'var(--color-text-muted)' }}>
                      {row.phone} • {row.city}
                    </small>
                  </td>
                  <td>
                    <div>{row.vehicleModel}</div>
                    <small style={{ color: 'var(--color-text-muted)' }}>
                      {row.type === 'visitor' ? row.vehicleType : <><code style={{ marginRight: '4px' }}>{row.plateNumber}</code> • {row.vehicleType}</>}
                    </small>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: row.paymentStatus === 'Paid' ? '#10b981' : row.paymentStatus === 'Trial' ? '#3b82f6' : '#f59e0b' }}>
                      {row.paymentStatus || 'Unpaid'} ({row.paymentAmount || '$49.99'})
                    </div>
                    <small style={{ color: 'var(--color-text-muted)' }}>
                      💳 {row.paymentMethod || 'Free Bypass'}
                    </small>
                  </td>
                  <td>
                    <span className={`status-pill ${row.status.toLowerCase()}`}>
                      {row.status === 'Pending' && <Clock size={12} />}
                      {row.status === 'Approved' && <CheckCircle size={12} />}
                      {row.status === 'Rejected' && <XCircle size={12} />}
                      {row.status}
                    </span>
                  </td>
                  <td>{row.registrationDate}</td>
                  {(checkUserPermission('Users', 'edit') || checkUserPermission('Users', 'delete')) && (
                    <td>
                      <div className="action-buttons-flex">
                        <button
                          className="btn-table-action"
                          title="View Details"
                          onClick={() => handleOpenDetails(row)}
                        >
                          <Eye size={16} />
                        </button>
                        {row.status === 'Pending' && checkUserPermission('Users', 'edit') && (
                          <>
                            <button
                              className="btn-table-action approve"
                              title="Approve Driver"
                              onClick={() => handleApproveAction(row.id)}
                            >
                              <Check size={16} />
                            </button>
                            <button
                              className="btn-table-action reject"
                              title="Reject Driver"
                              onClick={() => handleRejectClick(row)}
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {row.status === 'Rejected' && checkUserPermission('Users', 'edit') && (
                          <>
                            <button
                              className="btn-table-action approve"
                              title="Re-Approve Account"
                              onClick={() => {
                                setDriverStatus(row.id, 'Approved');
                                if (selectedDriver && selectedDriver.id === row.id) {
                                  setSelectedDriver(prev => ({ ...prev, status: 'Approved' }));
                                }
                              }}
                            >
                              <Check size={16} />
                            </button>
                            <button
                              className="btn-table-action"
                              style={{ color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }}
                              title="Set to Pending"
                              onClick={() => {
                                setDriverStatus(row.id, 'Pending');
                                if (selectedDriver && selectedDriver.id === row.id) {
                                  setSelectedDriver(prev => ({ ...prev, status: 'Pending' }));
                                }
                              }}
                            >
                              <Clock size={16} />
                            </button>
                          </>
                        )}
                        {row.status === 'Approved' && checkUserPermission('Users', 'edit') && (
                          <>
                            <button
                              className="btn-table-action reject"
                              title="Reject / Block"
                              onClick={() => {
                                setDriverStatus(row.id, 'Rejected');
                                if (selectedDriver && selectedDriver.id === row.id) {
                                  setSelectedDriver(prev => ({ ...prev, status: 'Rejected' }));
                                }
                              }}
                            >
                              <X size={16} />
                            </button>
                            <button
                              className="btn-table-action"
                              style={{ color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }}
                              title="Move to Pending"
                              onClick={() => {
                                setDriverStatus(row.id, 'Pending');
                                if (selectedDriver && selectedDriver.id === row.id) {
                                  setSelectedDriver(prev => ({ ...prev, status: 'Pending' }));
                                }
                              }}
                            >
                              <Clock size={16} />
                            </button>
                          </>
                        )}
                        {checkUserPermission('Users', 'delete') && (
                          <button
                            className="btn-table-action reject"
                            title="Delete User Permanently"
                            onClick={() => setDeleteConfirmId(row.id)}
                            style={{ color: '#ef4444', borderColor: '#ef4444' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )}
            />
          </>
        )}

        {/* Payments tab */}
        {activeTab === 'payments' && (
          <Table
            headers={['Transaction ID', 'Driver ID', 'Payer Name', 'Amount', 'Gateway', 'Status', 'Date']}
            data={paginatedList}
            renderRow={(row) => (
              <tr key={row.id}>
                <td><code>{row.id}</code></td>
                <td><code>{row.driverId}</code></td>
                <td><strong>{row.name}</strong></td>
                <td>{row.amount}</td>
                <td>{row.gateway}</td>
                <td>
                  <span className="status-pill approved">
                    <CheckCircle size={12} /> {row.status}
                  </span>
                </td>
                <td>{row.date}</td>
              </tr>
            )}
          />
        )}

        {/* Notifications tab */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              {notifications.length > 0 && (
                <button
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                  onClick={clearAllNotifications}
                >
                  Clear All
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                No notifications logged.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: item.read ? 'var(--color-surface)' : 'rgba(37, 99, 235, 0.06)',
                      borderLeft: item.read ? '3px solid transparent' : '3px solid var(--color-primary)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600' }}>{item.title}</span>
                        <small style={{ color: 'var(--color-text-muted)' }}>{item.time}</small>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        {item.message}
                      </p>
                    </div>
                    {!item.read && (
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => markNotificationAsRead(item.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pagination UI */}
        {totalItems > itemsPerPage && (
          <div className="pagination-container">
            <span className="pagination-text">
              Showing <strong>{startIndex + 1}</strong> to{' '}
              <strong>{Math.min(startIndex + itemsPerPage, totalItems)}</strong> of{' '}
              <strong>{totalItems}</strong> entries
            </span>
            <div className="pagination-buttons">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  className={`pagination-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(idx + 1)}
                  style={{
                    backgroundColor: currentPage === idx + 1 ? 'var(--color-primary)' : 'var(--color-card-bg)',
                    color: currentPage === idx + 1 ? 'white' : 'var(--color-text-main)',
                    borderColor: currentPage === idx + 1 ? 'var(--color-primary)' : 'var(--color-border)',
                  }}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Driver Detail & Profile & Approval Drawer */}
      {selectedDriver && (
        <div className="drawer-backdrop" onClick={() => setSelectedDriver(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Driver Dashboard Workspace</h3>
              <button className="close-icon-btn" onClick={() => setSelectedDriver(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              {/* Profile Card Header */}
              <div className="profile-card-header">
                <img src={selectedDriver.avatar} alt={selectedDriver.name} className="profile-avatar-large" />
                <div className="profile-name-title">
                  <h4>{selectedDriver.name} {selectedDriver.lastName || ''}</h4>
                  <p>
                    ID: <code>{selectedDriver.id}</code> • Status:{' '}
                    <span className={`status-pill ${selectedDriver.status.toLowerCase()}`}>
                      {selectedDriver.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Profile Edit Toggle */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 size={14} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                /* Driver Profile Edit Form */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 className="profile-section-title">Edit Driver Information</h4>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>City / Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Vehicle Model</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.vehicleModel}
                      onChange={(e) => setEditForm({ ...editForm, vehicleModel: e.target.value })}
                    />
                  </div>
                  <button className="btn-primary" onClick={handleSaveProfile}>
                    Save Changes
                  </button>
                </div>
              ) : (
                /* Driver Details Page Display */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* General Info */}
                  <div>
                    <h4 className="profile-section-title">Personal & Vehicle Info</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Email Address</label>
                        <span>{selectedDriver.email}</span>
                      </div>
                      <div className="info-item">
                        <label>Phone Number</label>
                        <span>{selectedDriver.phone}</span>
                      </div>
                      <div className="info-item">
                        <label>License Number</label>
                        <span>{selectedDriver.licenseNumber}</span>
                      </div>
                      <div className="info-item">
                        <label>Experience Years</label>
                        <span>{selectedDriver.experienceYears} Years</span>
                      </div>
                      <div className="info-item">
                        <label>Location Region</label>
                        <span>{selectedDriver.city}</span>
                      </div>
                      <div className="info-item">
                        <label>Vehicle Model</label>
                        <span>{selectedDriver.vehicleModel}</span>
                      </div>
                      <div className="info-item">
                        <label>Vehicle Type</label>
                        <span>{selectedDriver.vehicleType}</span>
                      </div>
                      {selectedDriver.type !== 'visitor' && (
                        <div className="info-item">
                          <label>Plate Number</label>
                          <span><code>{selectedDriver.plateNumber}</code></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents & Credentials */}
                  <div>
                    <h4 className="profile-section-title">Credentials & Documents</h4>
                    {Object.entries(selectedDriver.documents).map(([key, doc]) => (
                      <div className="document-item" key={key}>
                        <div className="document-info">
                          <FileText size={18} style={{ color: 'var(--color-text-muted)' }} />
                          <div>
                            <div className="document-name">{doc.name}</div>
                          </div>
                        </div>
                        <span
                          className={`document-status ${doc.status === 'Verified' || doc.status === 'Passed'
                              ? 'verified'
                              : doc.status === 'Pending Verification' || doc.status === 'Pending'
                                ? 'pending'
                                : doc.status === 'Not Provided'
                                  ? 'missing'
                                  : 'failed'
                            }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Payment Details */}
                  <div>
                    <h4 className="profile-section-title">Registration Payment</h4>
                    <div
                      style={{
                        padding: '12px 16px',
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600' }}>Registration Fee</div>
                        <small style={{ color: 'var(--color-text-muted)' }}>
                          Method: {selectedDriver.paymentMethod}
                        </small>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)' }}>
                          {selectedDriver.paymentAmount}
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: selectedDriver.paymentStatus === 'Paid' ? 'var(--color-success)' : 'var(--color-danger)',
                          }}
                        >
                          {selectedDriver.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rejection comments */}
                  {selectedDriver.status === 'Rejected' && selectedDriver.rejectionReason && (
                    <div
                      style={{
                        padding: '12px 16px',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <h5 style={{ color: 'var(--color-danger)', fontWeight: '600', marginBottom: '4px' }}>
                        Rejection Rationale
                      </h5>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        {selectedDriver.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Driver Approval Action Panel for Pending */}
                  {selectedDriver.status === 'Pending' && checkUserPermission('Users', 'edit') && (
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: 'rgba(245, 158, 11, 0.06)',
                        border: '1px dashed var(--color-warning)',
                        borderRadius: 'var(--radius-md)',
                        marginTop: '12px',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'var(--color-warning)',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Shield size={16} /> Driver Approval Workflow
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Please audit all documents and plate records prior to approving this application.
                      </p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="btn-primary"
                          style={{ flex: 1, backgroundColor: 'var(--color-success)' }}
                          onClick={() => handleApproveAction(selectedDriver.id)}
                        >
                          Approve Registration
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                          onClick={() => handleRejectClick(selectedDriver)}
                        >
                          Reject Request
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Driver Action Panel for Rejected Drivers */}
                  {selectedDriver.status === 'Rejected' && checkUserPermission('Users', 'edit') && (
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: 'rgba(239, 68, 68, 0.04)',
                        border: '1px dashed var(--color-danger)',
                        borderRadius: 'var(--radius-md)',
                        marginTop: '12px',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'var(--color-danger)',
                          marginBottom: '8px',
                        }}
                      >
                        Modify Blocked/Rejected Status
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        You can re-approve this driver or revert status to pending to request documentation updates.
                      </p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="btn-primary"
                          style={{ flex: 1, backgroundColor: 'var(--color-success)' }}
                          onClick={() => {
                            setDriverStatus(selectedDriver.id, 'Approved');
                            setSelectedDriver(prev => ({ ...prev, status: 'Approved' }));
                          }}
                        >
                          Approve Account
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }}
                          onClick={() => {
                            setDriverStatus(selectedDriver.id, 'Pending');
                            setSelectedDriver(prev => ({ ...prev, status: 'Pending' }));
                          }}
                        >
                          Set to Pending
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Driver Action Panel for Approved Drivers (Optional status change helper) */}
                  {selectedDriver.status === 'Approved' && checkUserPermission('Users', 'edit') && (
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: 'rgba(16, 185, 129, 0.04)',
                        border: '1px dashed var(--color-success)',
                        borderRadius: 'var(--radius-md)',
                        marginTop: '12px',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'var(--color-success)',
                          marginBottom: '8px',
                        }}
                      >
                        Revoke or Suspend Access
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        If this driver breaks terms, you can block/reject them or change their status back to pending.
                      </p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                          onClick={() => {
                            setDriverStatus(selectedDriver.id, 'Rejected');
                            setSelectedDriver(prev => ({ ...prev, status: 'Rejected' }));
                          }}
                        >
                          Reject / Block
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }}
                          onClick={() => {
                            setDriverStatus(selectedDriver.id, 'Pending');
                            setSelectedDriver(prev => ({ ...prev, status: 'Pending' }));
                          }}
                        >
                          Move to Pending
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal - Rejection Reason Dialog */}
      {showRejectModal && (
        <div className="dialog-overlay" onClick={handleCloseRejectModal}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 className="dialog-title" style={{ margin: 0 }}>Provide Rejection Reason</h4>
              <button
                className="close-icon-btn"
                onClick={handleCloseRejectModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="dialog-body">
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                Please specify the reason why <strong>{(rejectingDriver || selectedDriver)?.name}</strong>'s application is rejected.
              </p>
              <textarea
                placeholder="e.g. Expired CDL License, blurry vehicle photo, mismatching registration plates..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleCloseRejectModal}>
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                style={{
                  opacity: rejectReason.trim() ? 1 : 0.5,
                  cursor: rejectReason.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="dialog-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 className="dialog-title" style={{ margin: 0, color: '#ef4444' }}>Confirm Permanent Delete</h4>
              <button
                className="close-icon-btn"
                onClick={() => setDeleteConfirmId(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="dialog-body">
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                Are you sure you want to permanently delete this user/service record (ID: <strong>{deleteConfirmId}</strong>)? This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button className="btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={() => {
                  deleteDriver(deleteConfirmId);
                  setDeleteConfirmId(null);
                  if (selectedDriver && selectedDriver.id === deleteConfirmId) {
                    setSelectedDriver(null);
                  }
                }}
                style={{ cursor: 'pointer', backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px' }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
