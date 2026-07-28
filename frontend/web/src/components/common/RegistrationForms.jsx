import React from 'react';
import { Input, Select } from './Input/Input';
import { Button } from './Button/Button';
import { User, Phone, Mail, Car, MapPin, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const formBoxStyle = {
  width: '100%',
  minHeight: '440px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '16px',
  boxSizing: 'border-box'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px'
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
            onChange={(e) => onChange({ ...formData, firstName: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            placeholder="Last name"
            leftIcon={User}
            value={formData.lastName || ''}
            onChange={(e) => onChange({ ...formData, lastName: e.target.value })}
            required
          />
        </div>

        {/* Mobile + Email Row */}
        <div style={gridStyle}>
          <Input
            label="Mobile Number"
            placeholder="+1 (555) 000-0000"
            leftIcon={Phone}
            value={formData.phone || ''}
            onChange={(e) => onChange({ ...formData, phone: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="email@example.com"
            leftIcon={Mail}
            value={formData.email || ''}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
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

        {/* Plate Number + Subscription Row */}
        <div style={gridStyle}>
          <Input
            label="Plate Number"
            placeholder="e.g. ABC-1234"
            leftIcon={Car}
            value={formData.plateNumber || ''}
            onChange={(e) => onChange({ ...formData, plateNumber: e.target.value })}
            required
          />
          {payRequired && !isFreeSelected ? (
            subscriptionPlans.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  Subscription Plan {freeTrialEnabled && <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '11px', marginLeft: '6px' }}>🎁 {freeTrialDuration} Free Trial Active!</span>}
                </label>
                <Select
                  value={formData.selectedPlanId || subscriptionPlans[0]?.id}
                  onChange={(e) => onChange({ ...formData, selectedPlanId: e.target.value })}
                  options={subscriptionPlans.map(plan => ({
                    label: freeTrialEnabled
                      ? `${plan.name} (${plan.duration}) - ${freeTrialDuration} Free Trial, then $${plan.price}`
                      : `${plan.name} (${plan.duration}) - $${plan.price}`,
                    value: plan.id
                  }))}
                />
              </div>
            ) : null
          ) : payRequired && isFreeSelected ? null : (
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: '6px',
                color: '#10b981',
                fontSize: '13px',
                fontWeight: '600',
                width: '100%'
              }}>
                ✨ Registration is FREE
              </div>
            </div>
          )}
        </div>

        {payRequired && (
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
            onChange={(e) => onChange({ ...formData, lastName: e.target.value })}
          />
        </div>

        {/* Mobile + Email Row */}
        <div style={gridStyle}>
          <Input
            label="Mobile Number"
            placeholder="+1 (555) 000-0000"
            leftIcon={Phone}
            value={formData.phone || ''}
            onChange={(e) => onChange({ ...formData, phone: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="email@example.com"
            leftIcon={Mail}
            value={formData.email || ''}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
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
              value={formData.latitude || '28.6250'}
              onChange={(e) => onChange({ ...formData, latitude: e.target.value })}
              required
            />
            <Input
              label="Longitude"
              placeholder="77.2180"
              value={formData.longitude || '77.2180'}
              onChange={(e) => onChange({ ...formData, longitude: e.target.value })}
              required
            />
          </div>
        </div>

        {!payRequired && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            borderRadius: '6px',
            color: '#10b981',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            ✨ Registration is FREE for this category (Payment requirement disabled by Admin).
          </div>
        )}

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
            {!isFreeSelected && subscriptionPlans.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  Subscription Plan {freeTrialEnabled && <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '11px', marginLeft: '6px' }}>🎁 {freeTrialDuration} Free Trial Active!</span>}
                </label>
                <Select
                  value={formData.selectedPlanId || subscriptionPlans[0]?.id}
                  onChange={(e) => onChange({ ...formData, selectedPlanId: e.target.value })}
                  options={subscriptionPlans.map(plan => ({
                    label: freeTrialEnabled
                      ? `${plan.name} (${plan.duration}) - ${freeTrialDuration} Free Trial, then $${plan.price}`
                      : `${plan.name} (${plan.duration}) - $${plan.price}`,
                    value: plan.id
                  }))}
                />
              </div>
            ) : null}
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
            onChange={(e) => onChange({ ...formData, lastName: e.target.value })}
          />
        </div>

        {/* Mobile + Email Row */}
        <div style={gridStyle}>
          <Input
            label="Mobile Number"
            placeholder="+1 (555) 000-0000"
            leftIcon={Phone}
            value={formData.phone || ''}
            onChange={(e) => onChange({ ...formData, phone: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="email@example.com"
            leftIcon={Mail}
            value={formData.email || ''}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
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
              value={formData.latitude || '28.6250'}
              onChange={(e) => onChange({ ...formData, latitude: e.target.value })}
              required
            />
            <Input
              label="Longitude"
              placeholder="77.2180"
              value={formData.longitude || '77.2180'}
              onChange={(e) => onChange({ ...formData, longitude: e.target.value })}
              required
            />
          </div>
        </div>

        {!payRequired && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            borderRadius: '6px',
            color: '#10b981',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            ✨ Registration is FREE for this category (Payment requirement disabled by Admin).
          </div>
        )}

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
            {!isFreeSelected && subscriptionPlans.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  Subscription Plan {freeTrialEnabled && <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '11px', marginLeft: '6px' }}>🎁 {freeTrialDuration} Free Trial Active!</span>}
                </label>
                <Select
                  value={formData.selectedPlanId || subscriptionPlans[0]?.id}
                  onChange={(e) => onChange({ ...formData, selectedPlanId: e.target.value })}
                  options={subscriptionPlans.map(plan => ({
                    label: freeTrialEnabled
                      ? `${plan.name} (${plan.duration}) - ${freeTrialDuration} Free Trial, then $${plan.price}`
                      : `${plan.name} (${plan.duration}) - $${plan.price}`,
                    value: plan.id
                  }))}
                />
              </div>
            ) : null}
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
            onChange={(e) => onChange({ ...formData, firstName: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            placeholder="Last name"
            leftIcon={User}
            value={formData.lastName || ''}
            onChange={(e) => onChange({ ...formData, lastName: e.target.value })}
            required
          />
        </div>

        {/* Mobile + Email Row */}
        <div style={gridStyle}>
          <Input
            label="Mobile Number"
            placeholder="+1 (555) 000-0000"
            leftIcon={Phone}
            value={formData.phone || ''}
            onChange={(e) => onChange({ ...formData, phone: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="email@example.com"
            leftIcon={Mail}
            value={formData.email || ''}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
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

        {!payRequired && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            borderRadius: '6px',
            color: '#10b981',
            fontSize: '13px',
            fontWeight: '600',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            ✨ Registration is FREE
          </div>
        )}

        {payRequired && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
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
            {!isFreeSelected && subscriptionPlans.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>
                  Subscription Plan {freeTrialEnabled && <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '11px', marginLeft: '6px' }}>🎁 {freeTrialDuration} Free Trial Active!</span>}
                </label>
                <Select
                  value={formData.selectedPlanId || subscriptionPlans[0]?.id}
                  onChange={(e) => onChange({ ...formData, selectedPlanId: e.target.value })}
                  options={subscriptionPlans.map(plan => ({
                    label: freeTrialEnabled
                      ? `${plan.name} (${plan.duration}) - ${freeTrialDuration} Free Trial, then $${plan.price}`
                      : `${plan.name} (${plan.duration}) - $${plan.price}`,
                    value: plan.id
                  }))}
                />
              </div>
            ) : null}
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
