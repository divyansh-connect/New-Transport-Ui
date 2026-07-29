import React from 'react';
import { Input, Select } from './Input/Input';
import { Button } from './Button/Button';
import { User, Phone, Mail, Car, MapPin, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const formBoxStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  boxSizing: 'border-box'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px'
};

const sectionBadgeStyle = {
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#3b82f6',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '4px'
};

export const DriverRegistrationForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  subscriptionPlans = [],
  payRequired = true
}) => {
  const { subscriptionConfig } = useTheme();
  const freeTrialEnabled = subscriptionConfig?.freeTrialEnabled;
  const freeTrialDuration = subscriptionConfig?.freeTrialDuration || '1 Month';
  const isFreeSelected = formData.paymentStatus === 'Free';

  return (
    <form onSubmit={onSubmit} style={formBoxStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Name Row */}
        <div style={gridStyle}>
          <Input
            label="First Name"
            placeholder="First name"
            leftIcon={User}
            value={formData.firstName || ''}
            onChange={(e) => onChange({ ...formData, firstName: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
            required
          />
          <Input
            label="Last Name"
            placeholder="Last name"
            leftIcon={User}
            value={formData.lastName || ''}
            onChange={(e) => onChange({ ...formData, lastName: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
            required
          />
        </div>

        {/* Mobile + Email Row */}
        <div style={gridStyle}>
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            leftIcon={Phone}
            value={formData.phone || ''}
            onChange={(e) => onChange({ ...formData, phone: e.target.value.replace(/[^0-9+]/g, '') })}
            required
          />
          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="email@example.com (Optional)"
            leftIcon={Mail}
            value={formData.email || ''}
            onChange={(e) => onChange({ ...formData, email: e.target.value.toLowerCase() })}
          />
        </div>

        {/* Password Row */}
        <div style={gridStyle}>
          <Input
            label="Password"
            type="password"
            placeholder="Assign password (or default: password123)"
            leftIcon={Lock}
            value={formData.password || ''}
            onChange={(e) => onChange({ ...formData, password: e.target.value })}
          />
        </div>

        {/* Plate Number Row */}
        <div style={gridStyle}>
          <Input
            label="Plate Number"
            placeholder="e.g. ABC-1234"
            leftIcon={Car}
            value={formData.plateNumber || ''}
            onChange={(e) => onChange({ ...formData, plateNumber: e.target.value })}
            required
          />
        </div>
        <div style={{ ...sectionBadgeStyle, marginTop: '8px' }}>Credentials & Documents</div>
        <div style={gridStyle}>
          <Input
            label="Commercial Driver License (CDL #)"
            placeholder="e.g. CDL-9874520"
            value={formData.licenseName || ''}
            onChange={(e) => onChange({ ...formData, licenseName: e.target.value })}
          />
          <Input
            label="Vehicle Liability Insurance"
            placeholder="e.g. Policy #INS-44910"
            value={formData.insuranceName || ''}
            onChange={(e) => onChange({ ...formData, insuranceName: e.target.value })}
          />
        </div>
        {/* Payment Status Selection & Subscription Plan */}
        {payRequired && (
          <div style={gridStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>Payment Status Selection</label>
              <Select
                value={formData.paymentStatus || 'Paid'}
                onChange={(e) => onChange({ ...formData, paymentStatus: e.target.value })}
                options={[
                  { label: 'Paid', value: 'Paid' },
                  { label: 'Free', value: 'Free' }
                ]}
              />
            </div>

            {formData.paymentStatus !== 'Free' && subscriptionPlans.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  Subscription Plan
                </label>
                <Select
                  value={formData.selectedPlanId || subscriptionPlans[0]?.id}
                  onChange={(e) => onChange({ ...formData, selectedPlanId: e.target.value })}
                  options={subscriptionPlans.map(plan => ({
                    label: `${plan.name} (${plan.duration}) - $${plan.price}`,
                    value: plan.id
                  }))}
                />
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            <input
              type="checkbox"
              checked={formData.trackingEnabled !== false}
              onChange={(e) => onChange({ ...formData, trackingEnabled: e.target.checked })}
              disabled
            />
            Tracking location always on for driver
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-main)' }}>
            <input
              type="checkbox"
              checked={!!formData.termsAccepted}
              onChange={(e) => onChange({ ...formData, termsAccepted: e.target.checked })}
              required
            />
            I accept the Terms and Conditions
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Next / Submit</Button>
      </div>
    </form>
  );
};

export const WorkshopRegistrationForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  subscriptionPlans = [],
  payRequired = false
}) => {
  const { subscriptionConfig } = useTheme();
  const freeTrialEnabled = subscriptionConfig?.freeTrialEnabled;
  const freeTrialDuration = subscriptionConfig?.freeTrialDuration || '1 Month';
  const isFreeSelected = formData.paymentStatus === 'Free';

  return (
    <form onSubmit={onSubmit} style={formBoxStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Business Name + Contact Row */}
        <div style={gridStyle}>
          <Input
            label="Entity / Business Name"
            placeholder="Entity / Business name"
            leftIcon={User}
            value={formData.firstName || ''}
            onChange={(e) => onChange({ ...formData, firstName: e.target.value })}
            required
          />
          <Input
            label="Contact Person (Optional)"
            placeholder="Contact person name"
            leftIcon={User}
            value={formData.lastName || ''}
            onChange={(e) => onChange({ ...formData, lastName: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
          />
        </div>

        {/* Mobile + Email Row */}
        <div style={gridStyle}>
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            leftIcon={Phone}
            value={formData.phone || ''}
            onChange={(e) => onChange({ ...formData, phone: e.target.value.replace(/[^0-9+]/g, '') })}
            required
          />
          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="email@example.com (Optional)"
            leftIcon={Mail}
            value={formData.email || ''}
            onChange={(e) => onChange({ ...formData, email: e.target.value.toLowerCase() })}
          />
        </div>

        {/* Password Row */}
        <div style={gridStyle}>
          <Input
            label="Password"
            type="password"
            placeholder="Assign password (or default: password123)"
            leftIcon={Lock}
            value={formData.password || ''}
            onChange={(e) => onChange({ ...formData, password: e.target.value })}
          />
        </div>

        {/* Location + Coordinates Row */}
        <div style={gridStyle}>
          <Input
            label="Location Name / Zone"
            placeholder="e.g. Sector 5, Telemetry Zone"
            leftIcon={MapPin}
            value={formData.location || ''}
            onChange={(e) => onChange({ ...formData, location: e.target.value })}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Input
              label="Latitude"
              placeholder="28.6250"
              value={formData.latitude || ''}
              onChange={(e) => onChange({ ...formData, latitude: e.target.value })}
              required
            />
            <Input
              label="Longitude"
              placeholder="77.2180"
              value={formData.longitude || ''}
              onChange={(e) => onChange({ ...formData, longitude: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={{ ...sectionBadgeStyle, marginTop: '8px' }}>Credentials & Documents</div>
        <div style={gridStyle}>
          <Input
            label="Business Trade License"
            placeholder="e.g. LIC-WS-998811"
            value={formData.licenseName || ''}
            onChange={(e) => onChange({ ...formData, licenseName: e.target.value })}
          />
          <Input
            label="Liability Insurance Policy"
            placeholder="e.g. Policy #LIAB-99201"
            value={formData.insuranceName || ''}
            onChange={(e) => onChange({ ...formData, insuranceName: e.target.value })}
          />
        </div>

        {/* Payment Status Selection & Subscription Plan */}
        {payRequired && (
          <div style={gridStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>Payment Status Selection</label>
              <Select
                value={formData.paymentStatus || 'Paid'}
                onChange={(e) => onChange({ ...formData, paymentStatus: e.target.value })}
                options={[
                  { label: 'Paid', value: 'Paid' },
                  { label: 'Free', value: 'Free' }
                ]}
              />
            </div>

            {formData.paymentStatus !== 'Free' && subscriptionPlans.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  Subscription Plan
                </label>
                <Select
                  value={formData.selectedPlanId || subscriptionPlans[0]?.id}
                  onChange={(e) => onChange({ ...formData, selectedPlanId: e.target.value })}
                  options={subscriptionPlans.map(plan => ({
                    label: `${plan.name} (${plan.duration}) - $${plan.price}`,
                    value: plan.id
                  }))}
                />
              </div>
            )}
          </div>
        )}

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-main)' }}>
          <input
            type="checkbox"
            checked={!!formData.termsAccepted}
            onChange={(e) => onChange({ ...formData, termsAccepted: e.target.checked })}
            required
          />
          I accept the Terms and Conditions
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Next / Submit</Button>
      </div>
    </form>
  );
};

export const OilChangeRegistrationForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  subscriptionPlans = [],
  payRequired = false
}) => {
  const { subscriptionConfig } = useTheme();
  const freeTrialEnabled = subscriptionConfig?.freeTrialEnabled;
  const freeTrialDuration = subscriptionConfig?.freeTrialDuration || '1 Month';
  const isFreeSelected = formData.paymentStatus === 'Free';

  return (
    <form onSubmit={onSubmit} style={formBoxStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Business Name + Contact Row */}
        <div style={gridStyle}>
          <Input
            label="Entity / Business Name"
            placeholder="Entity / Business name"
            leftIcon={User}
            value={formData.firstName || ''}
            onChange={(e) => onChange({ ...formData, firstName: e.target.value })}
            required
          />
          <Input
            label="Contact Person (Optional)"
            placeholder="Contact person name"
            leftIcon={User}
            value={formData.lastName || ''}
            onChange={(e) => onChange({ ...formData, lastName: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
          />
        </div>

        {/* Mobile + Email Row */}
        <div style={gridStyle}>
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            leftIcon={Phone}
            value={formData.phone || ''}
            onChange={(e) => onChange({ ...formData, phone: e.target.value.replace(/[^0-9+]/g, '') })}
            required
          />
          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="email@example.com (Optional)"
            leftIcon={Mail}
            value={formData.email || ''}
            onChange={(e) => onChange({ ...formData, email: e.target.value.toLowerCase() })}
          />
        </div>

        {/* Password Row */}
        <div style={gridStyle}>
          <Input
            label="Password"
            type="password"
            placeholder="Assign password (or default: password123)"
            leftIcon={Lock}
            value={formData.password || ''}
            onChange={(e) => onChange({ ...formData, password: e.target.value })}
          />
        </div>

        {/* Location + Coordinates Row */}
        <div style={gridStyle}>
          <Input
            label="Location Name / Zone"
            placeholder="e.g. Sector 5, Telemetry Zone"
            leftIcon={MapPin}
            value={formData.location || ''}
            onChange={(e) => onChange({ ...formData, location: e.target.value })}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Input
              label="Latitude"
              placeholder="28.6250"
              value={formData.latitude || ''}
              onChange={(e) => onChange({ ...formData, latitude: e.target.value })}
              required
            />
            <Input
              label="Longitude"
              placeholder="77.2180"
              value={formData.longitude || ''}
              onChange={(e) => onChange({ ...formData, longitude: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={{ ...sectionBadgeStyle, marginTop: '8px' }}>Credentials & Documents</div>
        <div style={gridStyle}>
          <Input
            label="Environmental Permit Details"
            placeholder="e.g. Permit #ENV-99882"
            value={formData.licenseName || ''}
            onChange={(e) => onChange({ ...formData, licenseName: e.target.value })}
          />
          <Input
            label="Commercial General Liability"
            placeholder="e.g. Policy #GLIB-1102"
            value={formData.insuranceName || ''}
            onChange={(e) => onChange({ ...formData, insuranceName: e.target.value })}
          />
        </div>

        {/* Payment Status Selection & Subscription Plan */}
        {payRequired && (
          <div style={gridStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>Payment Status Selection</label>
              <Select
                value={formData.paymentStatus || 'Paid'}
                onChange={(e) => onChange({ ...formData, paymentStatus: e.target.value })}
                options={[
                  { label: 'Paid', value: 'Paid' },
                  { label: 'Free', value: 'Free' }
                ]}
              />
            </div>

            {formData.paymentStatus !== 'Free' && subscriptionPlans.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  Subscription Plan
                </label>
                <Select
                  value={formData.selectedPlanId || subscriptionPlans[0]?.id}
                  onChange={(e) => onChange({ ...formData, selectedPlanId: e.target.value })}
                  options={subscriptionPlans.map(plan => ({
                    label: `${plan.name} (${plan.duration}) - $${plan.price}`,
                    value: plan.id
                  }))}
                />
              </div>
            )}
          </div>
        )}

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-main)' }}>
          <input
            type="checkbox"
            checked={!!formData.termsAccepted}
            onChange={(e) => onChange({ ...formData, termsAccepted: e.target.checked })}
            required
          />
          I accept the Terms and Conditions
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Next / Submit</Button>
      </div>
    </form>
  );
};

export const VisitorRegistrationForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  subscriptionPlans = [],
  payRequired = false
}) => {
  const { subscriptionConfig } = useTheme();
  const freeTrialEnabled = subscriptionConfig?.freeTrialEnabled;
  const freeTrialDuration = subscriptionConfig?.freeTrialDuration || '1 Month';
  const isFreeSelected = formData.paymentStatus === 'Free';

  return (
    <form onSubmit={onSubmit} style={formBoxStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Name Row */}
        <div style={gridStyle}>
          <Input
            label="First Name"
            placeholder="First name"
            leftIcon={User}
            value={formData.firstName || ''}
            onChange={(e) => onChange({ ...formData, firstName: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
            required
          />
          <Input
            label="Last Name"
            placeholder="Last name"
            leftIcon={User}
            value={formData.lastName || ''}
            onChange={(e) => onChange({ ...formData, lastName: e.target.value.replace(/[^a-zA-Z\s]/g, '') })}
            required
          />
        </div>

        {/* Mobile + Email Row */}
        <div style={gridStyle}>
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            leftIcon={Phone}
            value={formData.phone || ''}
            onChange={(e) => onChange({ ...formData, phone: e.target.value.replace(/[^0-9+]/g, '') })}
            required
          />
          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="email@example.com (Optional)"
            leftIcon={Mail}
            value={formData.email || ''}
            onChange={(e) => onChange({ ...formData, email: e.target.value.toLowerCase() })}
          />
        </div>

        {/* Password Row */}
        <div style={gridStyle}>
          <Input
            label="Password"
            type="password"
            placeholder="Assign password (or default: password123)"
            leftIcon={Lock}
            value={formData.password || ''}
            onChange={(e) => onChange({ ...formData, password: e.target.value })}
          />
        </div>

        {/* Payment Status Selection & Subscription Plan */}
        {payRequired && (
          <div style={gridStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>Payment Status Selection</label>
              <Select
                value={formData.paymentStatus || 'Paid'}
                onChange={(e) => onChange({ ...formData, paymentStatus: e.target.value })}
                options={[
                  { label: 'Paid', value: 'Paid' },
                  { label: 'Free', value: 'Free' }
                ]}
              />
            </div>

            {formData.paymentStatus !== 'Free' && subscriptionPlans.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  Subscription Plan
                </label>
                <Select
                  value={formData.selectedPlanId || subscriptionPlans[0]?.id}
                  onChange={(e) => onChange({ ...formData, selectedPlanId: e.target.value })}
                  options={subscriptionPlans.map(plan => ({
                    label: `${plan.name} (${plan.duration}) - $${plan.price}`,
                    value: plan.id
                  }))}
                />
              </div>
            )}
          </div>
        )}

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-main)' }}>
          <input
            type="checkbox"
            checked={!!formData.termsAccepted}
            onChange={(e) => onChange({ ...formData, termsAccepted: e.target.checked })}
            required
          />
          I accept the Terms and Conditions
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Next / Submit</Button>
      </div>
    </form>
  );
};
