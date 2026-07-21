import React, { useState } from 'react';
import { useDrivers } from '../../context/DriverContext';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
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
} from 'lucide-react';
import './Drivers.css';

export const Drivers = () => {
  const {
    drivers,
    payments,
    notifications,
    approveDriver,
    rejectDriver,
    updateDriverProfile,
    markNotificationAsRead,
    clearAllNotifications,
  } = useDrivers();

  // Active tab state
  // Can be: 'requests' | 'pending' | 'approved' | 'rejected' | 'payments' | 'notifications'
  const [activeTab, setActiveTab] = useState('requests');

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
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
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Reset pagination on filter or tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
    setCityFilter('');
    setVehicleFilter('');
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

      // City filter
      const matchCity = cityFilter ? driver.city.includes(cityFilter) : true;

      // Vehicle type filter
      const matchVehicle = vehicleFilter ? driver.vehicleType.includes(vehicleFilter) : true;

      return matchSearch && matchCity && matchVehicle;
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
  const cities = Array.from(new Set(drivers.map((d) => d.city.split(',')[0])));
  const vehicleTypes = Array.from(new Set(drivers.map((d) => d.vehicleType)));

  return (
    <div className="page-container drivers-workspace">
      {/* Workspace Header */}
      <div className="page-header">
        <h1>Driver Management Center</h1>
        <p>Manage commercial registrations, audit documentation quality, and dispatch approvals.</p>
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
            <h4>Approved Drivers</h4>
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
          Pending Drivers ({countPending})
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
            ? 'Driver Registrations Inbox'
            : activeTab === 'pending'
            ? 'Pending Approvals Workspace'
            : activeTab === 'approved'
            ? 'Approved Active Fleet'
            : activeTab === 'rejected'
            ? 'Archived Rejections'
            : activeTab === 'payments'
            ? 'Driver Registration Payments'
            : 'Driver Notifications History'
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
                  value={cityFilter}
                  onChange={(e) => {
                    setCityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

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
              </div>
            </div>

            {/* Drivers Table */}
            <Table
              headers={['Driver', 'Contact & Region', 'Vehicle Detail', 'Status', 'Registration Date', 'Actions']}
              data={paginatedList}
              renderRow={(row) => (
                <tr key={row.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={row.avatar} alt={row.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '600' }}>{row.name}</div>
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
                      <code>{row.plateNumber}</code> • {row.vehicleType}
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
                  <td>
                    <div className="action-buttons-flex">
                      <button
                        className="btn-table-action"
                        title="View Details"
                        onClick={() => handleOpenDetails(row)}
                      >
                        <Eye size={16} />
                      </button>
                      {row.status === 'Pending' && (
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
                    </div>
                  </td>
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
                  <h4>{selectedDriver.name}</h4>
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
                      <div className="info-item">
                        <label>Plate Number</label>
                        <span><code>{selectedDriver.plateNumber}</code></span>
                      </div>
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
                          className={`document-status ${
                            doc.status === 'Verified' || doc.status === 'Passed'
                              ? 'verified'
                              : doc.status === 'Pending Verification' || doc.status === 'Pending'
                              ? 'pending'
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

                  {/* Driver Approval Action Panel */}
                  {selectedDriver.status === 'Pending' && (
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
    </div>
  );
};

export default Drivers;
