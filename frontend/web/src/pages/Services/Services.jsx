import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../components/common/Cards/Card';
import { Table } from '../../components/common/Tables/Table';
import { Modal } from '../../components/common/Modal/Modal';
import { Input, Select } from '../../components/common/Input/Input';
import { Button } from '../../components/common/Button/Button';
import { Wrench, Droplet, MapPin, Plus, Search, Eye, Edit2, Trash2, Download, Users, User } from 'lucide-react';
import { useDrivers } from '../../context/DriverContext';
import { useTheme } from '../../context/ThemeContext';
import { downloadExcel } from '../../utils/excelExport';
import { 
  DriverRegistrationForm, 
  WorkshopRegistrationForm, 
  OilChangeRegistrationForm, 
  VisitorRegistrationForm 
} from '../../components/common/RegistrationForms';
import { API_BASE_URL } from '../../config';
import './Services.css';

export const Services = () => {
  const { drivers, registerDriver, deleteDriver, updateDriverProfile } = useDrivers();
  const { subscriptionPlans, subscriptionConfig, checkUserPermission } = useTheme();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('type') || 'driver';
  
  const setActiveTab = (newTab) => {
    setSearchParams({ type: newTab });
  };

  const getPermissionModule = () => {
    return (activeTab === 'driver' || activeTab === 'visitor') ? 'Users' : 'Categories';
  };

  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/service-types`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data.filter(c => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder));
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const config = subscriptionConfig?.paymentRequiredFor || { driver: true, workshop: false, visitor: false, oilchange: false };
  const payRequiredForTab = 
    (activeTab === 'driver' && config.driver) ||
    (activeTab === 'workshop' && config.workshop) ||
    (activeTab === 'oil change' && config.oilchange) ||
    (activeTab === 'visitor' && config.visitor);

  const initialServices = [];

  const [allServices, setAllServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [addFormType, setAddFormType] = useState('driver');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Quick Add Category State inside Add User Modal
  const [showQuickCategoryForm, setShowQuickCategoryForm] = useState(false);
  const [quickCategory, setQuickCategory] = useState({ name: '', iconName: 'map-pin', pinColor: '#2563EB' });
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const handleQuickAddCategory = async () => {
    if (!quickCategory.name.trim()) return;
    setIsSavingCategory(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE_URL}/service-types`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: quickCategory.name.trim(),
          iconName: quickCategory.iconName,
          pinColor: quickCategory.pinColor,
          isActive: true,
          displayOrder: categories.length + 1
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add category');
      
      setCategories(prev => [...prev, data]);
      setAddFormType(data.slug);
      setFormData(prev => ({ ...prev, type: data.slug }));
      setQuickCategory({ name: '', iconName: 'map-pin', pinColor: '#2563EB' });
      setShowQuickCategoryForm(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const [formData, setFormData] = useState({ 
    name: '', 
    location: '', 
    latitude: '', 
    longitude: '', 
    contact: '', 
    email: '', 
    status: 'Active', 
    amount: '',
    licenseName: '',
    insuranceName: '',
    backgroundCheckName: ''
  });

  const payRequiredForType = 
    (addFormType === 'driver' && config.driver) ||
    (addFormType === 'workshop' && config.workshop) ||
    (addFormType === 'oil change' && config.oilchange) ||
    (addFormType === 'visitor' && config.visitor);

  const getNumericAmount = (amtStr) => {
    if (!amtStr) return 0;
    const cleanStr = amtStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleanStr) || 0;
  };

  const totalVal = getNumericAmount(selectedRecord?.paymentAmount || selectedRecord?.amount || '$49.99');
  const baseVal = totalVal / 1.15;
  const vatVal = baseVal * 0.05;
  const taxVal = baseVal * 0.10;

  const currencySymbol = (selectedRecord?.paymentAmount || selectedRecord?.amount || '$49.99').startsWith('$') ? '$' : '₹';
  const baseAmountFormatted = `${currencySymbol}${baseVal.toFixed(2)}`;
  const vatFormatted = `${currencySymbol}${vatVal.toFixed(2)}`;
  const taxFormatted = `${currencySymbol}${taxVal.toFixed(2)}`;

  useEffect(() => {
    // Always clear cached mock data — data comes from backend via context
    localStorage.removeItem('services_data');
    setAllServices([]);
  }, []);

  const getFilteredData = () => {
    return drivers.filter(d => {
      if (d.status !== 'Approved') return false;
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (d.email && d.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (d.phone && d.phone.includes(searchTerm));
      if (!matchesSearch) return false;

      // 'all' tab shows every approved user
      if (activeTab === 'all') return true;

      // Filter by dynamic category type slug (handle oil/oil change alias)
      return d.type === activeTab || (activeTab === 'oil' && d.type === 'oil change');
    });
  };
  const filteredServices = getFilteredData();

  // Build tabs: 'All' first, then one tab per dynamic category
  const tabs = [
    { id: 'all', label: 'All Users', icon: Users },
    ...categories.map(c => {
      const slug = c.slug;
      let IconComponent = User;
      if (slug === 'workshop') IconComponent = Wrench;
      else if (slug === 'oil' || slug === 'oil-change') IconComponent = Droplet;
      else if (slug === 'visitor') IconComponent = Users;
      return {
        id: slug,
        label: c.name,
        icon: IconComponent,
        categoryName: c.name
      };
    })
  ];

  const saveToStorage = (data) => {
    setAllServices(data);
    localStorage.setItem('services_data', JSON.stringify(data));
  };

  const handleExport = () => {
    if (activeTab === 'driver') {
      const headers = ["Driver ID", "Name", "City", "Email", "Mobile Number", "Status"];
      const rows = filteredServices.map(e => [
        e.id,
        e.name,
        e.city || '—',
        e.email || '—',
        e.phone,
        e.status
      ]);
      downloadExcel(headers, rows, "Approved Drivers", "approved_drivers.xls");
    } else {
      const headers = ["Service ID", "Name", "Location", "Email", "Latitude", "Longitude", "Mobile / Contact Number", "Status"];
      const rows = filteredServices.map(e => [
        e.id,
        e.name,
        e.location,
        e.email || '—',
        e.latitude || '',
        e.longitude || '',
        e.contact,
        e.status
      ]);
      downloadExcel(headers, rows, `${activeTab === 'workshop' ? 'Workshops' : activeTab === 'oil change' ? 'Oil Changes' : 'Visitors'}`, `${activeTab}_services.xls`);
    }
  };

  const handleExportSingle = (record) => {
    if (activeTab === 'driver') {
      const headers = ["Driver ID", "Name", "City", "Email", "Mobile Number", "Status"];
      const rows = [[
        record.id,
        record.name,
        record.city || '—',
        record.email || '—',
        record.phone,
        record.status
      ]];
      downloadExcel(headers, rows, "Driver Details", `driver_${record.id}.xls`);
    } else {
      const headers = ["Service ID", "Name", "Location", "Email", "Latitude", "Longitude", "Mobile / Contact Number", "Status"];
      const rows = [[
        record.id,
        record.name,
        record.location,
        record.email || '—',
        record.latitude || '',
        record.longitude || '',
        record.contact,
        record.status
      ]];
      downloadExcel(headers, rows, "Service Details", `service_${record.id}.xls`);
    }
  };

  const handleAddClick = () => {
    setModalMode('add');
    const defaultType = activeTab === 'all' ? (categories[0]?.slug || 'driver') : activeTab;
    setAddFormType(defaultType);
    setFormData({ 
      type: defaultType, 
      firstName: '', 
      lastName: '', 
      phone: '', 
      email: '', 
      plateNumber: '', 
      location: '', 
      latitude: '28.6250', 
      longitude: '77.2180', 
      termsAccepted: false,
      licenseName: '',
      insuranceName: '',
      backgroundCheckName: ''
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (record) => {
    setModalMode('edit');
    setSelectedRecord(record);
    setFormData({
      name: record.name,
      location: record.location || '',
      latitude: record.latitude || '',
      longitude: record.longitude || '',
      contact: record.contact || record.phone || '',
      email: record.email || '',
      status: record.status,
      amount: record.amount || record.paymentAmount || '$49.99',
      licenseName: record.licenseName || (record.documents?.license?.name !== 'Commercial Driver License (CDL)' && record.documents?.license?.name !== 'License / ID' ? record.documents?.license?.name : '') || '',
      insuranceName: record.insuranceName || (record.documents?.insurance?.name !== 'Vehicle Liability Insurance' && record.documents?.insurance?.name !== 'Insurance Policy' ? record.documents?.insurance?.name : '') || '',
      backgroundCheckName: record.backgroundCheckName || (record.documents?.backgroundCheck?.name !== 'Criminal Background Check' && record.documents?.backgroundCheck?.name !== 'Safety/Background Check' ? record.documents?.backgroundCheck?.name : '') || ''
    });
    setIsModalOpen(true);
  };

  const handleViewClick = (record) => {
    setModalMode('view');
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const [deleteServiceId, setDeleteServiceId] = useState(null);

  const handleDelete = (id) => {
    setDeleteServiceId(id);
  };

  const [validationAlert, setValidationAlert] = useState('');

  const handleSaveModal = () => {
    if (!formData.name.trim()) {
      setValidationAlert('Service Name is required.');
      return;
    }
    if (modalMode === 'add') {
      const prefix = tabs.find(t => t.id === activeTab)?.prefix || 'SRV';
      const newId = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
      const newService = {
        id: newId,
        name: formData.name,
        type: activeTab,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        contact: formData.contact,
        email: formData.email,
        status: formData.status,
        rating: 'New',
        amount: formData.amount
      };
      saveToStorage([newService, ...allServices]);
    } else if (modalMode === 'edit') {
      updateDriverProfile(selectedRecord.id, {
        name: formData.name,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        contact: formData.contact,
        email: formData.email,
        status: formData.status,
        amount: formData.amount,
        licenseName: formData.licenseName,
        insuranceName: formData.insuranceName,
        backgroundCheckName: formData.backgroundCheckName
      });
    }
    setIsModalOpen(false);
  };

  const handleFormSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    const isDriver = addFormType === 'driver';
    const isVisitor = addFormType === 'visitor';
    
    const fullName = isDriver || isVisitor
      ? `${formData.firstName} ${formData.lastName}`
      : (formData.lastName ? `${formData.firstName} ${formData.lastName}` : formData.firstName);

    const displayTypes = {
      driver: 'Commercial Driver',
      workshop: 'Repair Workshop',
      'oil change': 'Oil Change Center',
      visitor: 'Visitor'
    };

    const freeTrialEnabled = subscriptionConfig?.freeTrialEnabled;
    const freeTrialDuration = subscriptionConfig?.freeTrialDuration || '1 Month';

    const payRequired = 
      (addFormType === 'driver' && config.driver) ||
      (addFormType === 'workshop' && config.workshop) ||
      (addFormType === 'oil change' && config.oilchange) ||
      (addFormType === 'visitor' && config.visitor);

    let planPrice = 'Free';
    if (payRequired) {
      if (formData.paymentStatus === 'Free') {
        planPrice = 'Free';
      } else if (freeTrialEnabled) {
        planPrice = `Free (${freeTrialDuration} Trial)`;
      } else {
        const selectedPlan = subscriptionPlans.find(p => p.id === (formData.selectedPlanId || subscriptionPlans?.[0]?.id));
        planPrice = selectedPlan ? `$${selectedPlan.price}` : (
          addFormType === 'driver' ? '$49.99' : (addFormType === 'workshop' ? '$149.00' : addFormType === 'oil change' ? '$199.00' : '$9.99')
        );
      }
    }

    const targetEntityId = addFormType === 'driver'
      ? `DRV-${Math.floor(1007 + Math.random() * 890)}`
      : addFormType === 'workshop'
        ? `WS-${Math.floor(100 + Math.random() * 900)}`
        : addFormType === 'oil change'
          ? `OC-${Math.floor(100 + Math.random() * 900)}`
          : `VIS-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord = {
      id: `REG-${Math.floor(107 + Math.random() * 890)}`,
      name: fullName,
      type: displayTypes[addFormType] || addFormType,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      amount: planPrice,
      phone: formData.phone || '—',
      driverId: targetEntityId
    };

    // Save to registrations in localStorage
    const savedRegs = JSON.parse(localStorage.getItem('registrations') || '[]');
    savedRegs.unshift(newRecord);
    localStorage.setItem('registrations', JSON.stringify(savedRegs));

    // Register in context
    const newEntityRequest = {
      id: targetEntityId,
      name: fullName,
      email: formData.email,
      phone: formData.phone || '—',
      plateNumber: formData.plateNumber || '—',
      vehicleType: displayTypes[addFormType] || addFormType,
      vehicleModel: addFormType === 'workshop' ? 'Workshop Hub' : addFormType === 'oil change' ? 'Oil Change Station' : addFormType === 'visitor' ? 'Guest Access' : 'Standard Cargo',
      licenseNumber: 'LIC-' + targetEntityId + '-' + Math.floor(1000 + Math.random() * 9000),
      experienceYears: 1,
      city: formData.location || 'Delhi, IN',
      avatar: addFormType === 'workshop'
        ? 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=256'
        : addFormType === 'oil change'
          ? 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=256'
          : addFormType === 'visitor'
            ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
      status: 'Pending',
      registrationDate: new Date().toISOString().split('T')[0],
      paymentStatus: payRequired ? (formData.paymentStatus || 'Paid') : 'Paid',
      paymentAmount: planPrice,
      paymentMethod: payRequired ? (formData.paymentMethod || 'Free Bypass') : 'Free Bypass',
      type: addFormType === 'oil change' ? 'oil' : addFormType,
      password: formData.password || 'password123',
      documents: {
        license: { name: 'License / ID', status: 'Pending Verification', url: '#' },
        insurance: { name: 'Insurance Policy', status: 'Pending Verification', url: '#' },
        backgroundCheck: { name: 'Safety/Background Check', status: 'Pending', url: '#' }
      },
      rejectionReason: '',
      latitude: formData.latitude,
      longitude: formData.longitude,
      licenseName: formData.licenseName,
      insuranceName: formData.insuranceName,
      backgroundCheckName: formData.backgroundCheckName
    };

    registerDriver(newEntityRequest);
    setIsModalOpen(false);
  };

  return (
    <div className="page-container services-page">
      <div className="page-header d-flex justify-between align-center">
        <div>
          <h1>Registered User Services</h1>
          <p>View and manage all registered service entities across every category.</p>
        </div>
        {activeTab && (() => {
          const targetModule = (activeTab === 'driver' || activeTab === 'visitor') ? 'Users' : 'Categories';
          const canAdd = activeTab === 'all'
            ? (checkUserPermission('Users', 'add') || checkUserPermission('Categories', 'add'))
            : checkUserPermission(targetModule, 'add');
          
          if (!canAdd) return null;
          
          return (
            <button className="btn-primary d-flex align-center gap-sm" onClick={handleAddClick}>
              <Plus size={18} /> Add Service
            </button>
          );
        })()}
      </div>

      <div className="services-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const count = tab.id === 'all'
            ? drivers.filter(d => d.status === 'Approved').length
            : drivers.filter(d =>
                d.status === 'Approved' && (
                  d.type === tab.id || (tab.id === 'oil' && d.type === 'oil change')
                )
              ).length;
          return (
            <button
              key={tab.id}
              className={`service-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={20} />
              {tab.label}
              <span className="tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      <Card>
        <div className="card-toolbar d-flex justify-between align-center mb-md">
          <div className="search-bar d-flex align-center gap-sm">
            <Search size={18} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder={activeTab === 'all' ? 'Search all services...' : `Search ${tabs.find(t => t.id === activeTab)?.label || activeTab}...`}
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-outline" onClick={handleExport}>Export Excel</button>
        </div>

        <Table
          className="table-scrollable"
          headers={(() => {
            const isPeopleTab = activeTab === 'driver' || activeTab === 'visitor';
            const isAllTab = activeTab === 'all';
            let list;
            if (isAllTab) {
              list = ['ID', 'Name', 'Category', 'Email', 'Mobile Number', 'Status'];
            } else if (isPeopleTab) {
              list = [activeTab === 'driver' ? 'Driver ID' : 'Visitor ID', 'Name', 'Email', 'Mobile Number', 'Status'];
            } else {
              list = ['Service ID', 'Name & Location', 'Email', 'GPS Coordinates', 'Mobile / Contact Number', 'Status'];
            }
            const targetModule = (activeTab === 'driver' || activeTab === 'visitor') ? 'Users' : 'Categories';
            const canEdit = activeTab === 'all' 
              ? (checkUserPermission('Users', 'edit') || checkUserPermission('Categories', 'edit'))
              : checkUserPermission(targetModule, 'edit');
            const canDelete = activeTab === 'all' 
              ? (checkUserPermission('Users', 'delete') || checkUserPermission('Categories', 'delete'))
              : checkUserPermission(targetModule, 'delete');

            if (canEdit || canDelete) {
              list.push('Actions');
            }
            return list;
          })()}
          data={filteredServices}
          renderRow={(row) => {
            const isPeopleTab = activeTab === 'driver' || activeTab === 'visitor' || (activeTab === 'all' && (row.type === 'driver' || row.type === 'visitor'));
            const isAllTab = activeTab === 'all';
            return (
              <tr key={row.id}>
                <td>
                  <span className="id-badge">{row.id}</span>
                </td>
                <td>
                  <div className="d-flex flex-column">
                    <strong>{row.name} {row.lastName || ''}</strong>
                    {!isPeopleTab && !isAllTab && <span className="text-muted text-sm">{row.location}</span>}
                    {activeTab === 'driver' && row.city && <span className="text-muted text-sm">{row.city}</span>}
                  </div>
                </td>
                {isAllTab && (
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-muted)',
                      textTransform: 'capitalize'
                    }}>
                      {categories.find(c => c.slug === row.type)?.name || row.type || '—'}
                    </span>
                  </td>
                )}
                <td>{row.email || '—'}</td>
                {!isPeopleTab && !isAllTab && (
                  <td>
                    <code>
                      {row.latitude && row.longitude 
                        ? `${row.latitude}, ${row.longitude}` 
                        : 'Not Set'}
                    </code>
                  </td>
                )}
                <td>{row.phone || row.contact || row.mobileNo || '—'}</td>

                <td>
                  <span className={`status-badge ${row.status.toLowerCase()}`}>
                    {row.status}
                  </span>
                </td>
                {(checkUserPermission(isPeopleTab ? 'Users' : 'Categories', 'edit') || checkUserPermission(isPeopleTab ? 'Users' : 'Categories', 'delete')) && (
                  <td>
                    <div className="row-actions" style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="ghost" size="sm" leftIcon={Eye} onClick={() => handleViewClick(row)}></Button>
                      <Button variant="ghost" size="sm" leftIcon={Download} onClick={() => handleExportSingle(row)} title="Export Single Record"></Button>
                      {!isPeopleTab && (
                        <>
                          {checkUserPermission('Categories', 'edit') && (
                            <Button variant="ghost" size="sm" leftIcon={Edit2} onClick={() => handleEditClick(row)}></Button>
                          )}
                          {checkUserPermission('Categories', 'delete') && (
                            <Button variant="ghost" size="sm" leftIcon={Trash2} onClick={() => handleDelete(row.id)}></Button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          }}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'view' ? `${activeTab === 'oil change' ? 'Oil Change' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Details` : modalMode === 'add' ? `Add New ${activeTab === 'oil change' ? 'Oil Change' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` : `Edit Service`}
        primaryActionLabel={modalMode === 'add' ? null : (modalMode !== 'view' ? (checkUserPermission(getPermissionModule(), 'edit') ? "Save" : null) : "Close")}
        onPrimaryAction={modalMode === 'add' ? null : (modalMode !== 'view' ? handleSaveModal : () => setIsModalOpen(false))}
        secondaryActionLabel={modalMode === 'add' ? null : (modalMode !== 'view' ? "Cancel" : null)}
      >
        {modalMode === 'view' && selectedRecord && (
          <div className="modal-record-details" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Name / Contact Person</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>
                  {selectedRecord.name} {selectedRecord.lastName || ''}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Email</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.email || '—'}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Contact / Mobile</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.phone || selectedRecord.contact || '—'}</div>
              </div>
              
              {activeTab === 'driver' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Plate Number</span>
                  <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.plateNumber || '—'}</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Location Name / Zone</span>
                  <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>{selectedRecord.location || '—'}</div>
                </div>
              )}
            </div>

            {activeTab !== 'driver' && activeTab !== 'visitor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>Coordinates</span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)', fontFamily: 'monospace' }}>
                  {selectedRecord.latitude && selectedRecord.longitude 
                    ? `${selectedRecord.latitude}, ${selectedRecord.longitude}` 
                    : 'Not Set'}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                  {activeTab === 'driver' 
                    ? 'Commercial Driver License (CDL #)'
                    : activeTab === 'workshop'
                      ? 'Business Trade License'
                      : activeTab === 'oil change'
                        ? 'Environmental Permit'
                        : 'License / ID Details'}
                </span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>
                  {selectedRecord.licenseName || selectedRecord.documents?.license?.name || 'Not Provided'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                  {activeTab === 'driver'
                    ? 'Vehicle Liability Insurance'
                    : activeTab === 'workshop'
                       ? 'Liability Insurance Policy'
                       : activeTab === 'oil change'
                         ? 'Commercial General Liability'
                         : 'Insurance Policy Details'}
                </span>
                <div style={{ fontSize: '14px', fontWeight: '600', padding: '8px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-main)' }}>
                  {selectedRecord.insuranceName || selectedRecord.documents?.insurance?.name || 'Not Provided'}
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px dashed var(--color-border)' }}>
                <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-text-main)' }}>Payment & Registration Status</span>
                <span className={`status-badge ${selectedRecord.status.toLowerCase()}`} style={{ margin: 0 }}>
                  {selectedRecord.status}
                </span>
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
                <strong style={{ fontSize: '18px', color: 'var(--color-success)', fontWeight: '800' }}>{selectedRecord.paymentAmount || selectedRecord.amount || '$49.99'}</strong>
              </div>
            </div>
          </div>
        )}
        {modalMode === 'edit' && (
          <div className="modal-record-details" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            {activeTab !== 'driver' && activeTab !== 'visitor' && (
              <>
                <Input label="Location Name / Zone" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Input label="Latitude (e.g. 28.6250)" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: e.target.value })} />
                  <Input label="Longitude (e.g. 77.2180)" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: e.target.value })} />
                </div>
              </>
            )}
            <Input label="Contact" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
            <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <Input 
              label={activeTab === 'driver' ? 'Commercial Driver License (CDL #)' : activeTab === 'workshop' ? 'Business Trade License' : activeTab === 'oil change' ? 'Environmental Permit' : 'License / ID Details'} 
              value={formData.licenseName || ''} 
              onChange={e => setFormData({ ...formData, licenseName: e.target.value })} 
            />
            <Input 
              label={activeTab === 'driver' ? 'Vehicle Liability Insurance' : activeTab === 'workshop' ? 'Liability Insurance Policy' : activeTab === 'oil change' ? 'Commercial General Liability' : 'Insurance Policy Details'} 
              value={formData.insuranceName || ''} 
              onChange={e => setFormData({ ...formData, insuranceName: e.target.value })} 
            />
            <Input label="Status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} />
            <Input label="Amount" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
          </div>
        )}
        {modalMode === 'add' && (
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)', margin: 0 }}>Entity Category</label>
              {checkUserPermission('Categories', 'add') && (
                <button
                  type="button"
                  onClick={() => setShowQuickCategoryForm(!showQuickCategoryForm)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary, #2563eb)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={14} /> {showQuickCategoryForm ? 'Cancel' : 'Add New Category'}
                </button>
              )}
            </div>

            {showQuickCategoryForm ? (
              <div style={{
                backgroundColor: 'var(--color-surface, rgba(255,255,255,0.03))',
                border: '1px solid var(--color-card-border, rgba(255,255,255,0.1))',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-main)' }}>Create New Service Category</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px', gap: '10px', alignItems: 'center' }}>
                  <Input
                    placeholder="Category Name (e.g. Hospital)"
                    value={quickCategory.name}
                    onChange={(e) => setQuickCategory({ ...quickCategory, name: e.target.value })}
                  />
                  <select
                    value={quickCategory.iconName}
                    onChange={(e) => setQuickCategory({ ...quickCategory, iconName: e.target.value })}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--color-input-bg)',
                      border: '1px solid var(--color-input-border)',
                      color: 'var(--color-text-main)',
                      height: '38px',
                      fontSize: '12px'
                    }}
                  >
                    <option value="map-pin" style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}>📍 Default Pin</option>
                    <option value="user" style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}>👤 User</option>
                    <option value="truck" style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}>🚚 Driver</option>
                    <option value="wrench" style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}>🔧 Workshop</option>
                    <option value="droplet" style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}>💧 Oil Change</option>
                    <option value="shopping-cart" style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}>🛒 Supermarket</option>
                    <option value="activity" style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}>🏥 Hospital</option>
                    <option value="database" style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}>📦 Warehouse</option>
                  </select>
                  <input
                    type="color"
                    value={quickCategory.pinColor}
                    onChange={(e) => setQuickCategory({ ...quickCategory, pinColor: e.target.value })}
                    style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--color-input-border)', backgroundColor: 'var(--color-input-bg)', cursor: 'pointer', padding: '2px' }}
                    title="Pick Map Pin Color"
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Button type="button" variant="secondary" size="sm" onClick={() => setShowQuickCategoryForm(false)}>Cancel</Button>
                  <Button type="button" variant="primary" size="sm" isLoading={isSavingCategory} onClick={handleQuickAddCategory}>Save & Select</Button>
                </div>
              </div>
            ) : (
              <Select
                value={addFormType}
                onChange={(e) => {
                  setAddFormType(e.target.value);
                  setFormData({
                    type: e.target.value,
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: '',
                    plateNumber: '',
                    location: '',
                    latitude: '28.6250',
                    longitude: '77.2180',
                    termsAccepted: false,
                    paymentStatus: 'Paid',
                    selectedPlanId: subscriptionPlans?.[0]?.id || ''
                  });
                }}
                options={categories.length > 0 
                  ? categories.map(c => ({ label: c.name, value: c.slug })) 
                  : [
                      { label: 'Commercial Driver', value: 'driver' },
                      { label: 'Repair Workshop', value: 'workshop' },
                      { label: 'Oil Change Center', value: 'oil' },
                      { label: 'Visitor', value: 'visitor' }
                    ]}
              />
            )}
          </div>
        )}
        {modalMode === 'add' && addFormType === 'driver' && (
          <DriverRegistrationForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            subscriptionPlans={subscriptionPlans}
            payRequired={payRequiredForType}
          />
        )}
        {modalMode === 'add' && (addFormType === 'workshop' || (!['driver', 'oil', 'oil change', 'visitor'].includes(addFormType))) && (
          <WorkshopRegistrationForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            subscriptionPlans={subscriptionPlans}
            payRequired={payRequiredForType}
          />
        )}
        {modalMode === 'add' && (addFormType === 'oil' || addFormType === 'oil change') && (
          <OilChangeRegistrationForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            subscriptionPlans={subscriptionPlans}
            payRequired={payRequiredForType}
          />
        )}
        {modalMode === 'add' && addFormType === 'visitor' && (
          <VisitorRegistrationForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            subscriptionPlans={subscriptionPlans}
            payRequired={payRequiredForType}
          />
        )}
      </Modal>

      {/* Delete Confirmation React Modal */}
      <Modal
        isOpen={!!deleteServiceId}
        onClose={() => setDeleteServiceId(null)}
        title="Confirm Delete Service"
        subtitle="Are you sure you want to delete this registered service? This action cannot be undone."
        primaryActionLabel="Confirm Delete"
        onPrimaryAction={() => {
          deleteDriver(deleteServiceId);
          setDeleteServiceId(null);
        }}
        secondaryActionLabel="Cancel"
      >
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', margin: 0 }}>
          Deleting service node ID: <code style={{ color: 'var(--color-primary)' }}>{deleteServiceId}</code>
        </p>
      </Modal>

      {/* Validation React Modal */}
      <Modal
        isOpen={!!validationAlert}
        onClose={() => setValidationAlert('')}
        title="Validation Required"
        subtitle="Please check service details."
        primaryActionLabel="OK"
        onPrimaryAction={() => setValidationAlert('')}
      >
        <p style={{ color: 'var(--color-text-main)', fontSize: '14px', margin: 0 }}>
          {validationAlert}
        </p>
      </Modal>
    </div>
  );
};
