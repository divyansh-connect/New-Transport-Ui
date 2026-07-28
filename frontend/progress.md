# 📊 PROJECT PROGRESS SPECIFICATION DOCUMENT

## 📊 Implementation Status & Verification Matrix

| Module | Feature / Component | Implementation Status | Target File Location |
|---|---|---|---|
| **Mobile** | Splash Direct to Map Auto-redirect | ✅ Completed | `app/app/index.js` ➔ `map.js` |
| **Mobile** | Map Visual Canvas & Markers | ✅ Completed | `app/app/map.js` |
| **Mobile** | Life Tracking ON/OFF Switch Box | ✅ Completed | `app/app/map.js` |
| **Mobile** | Top Header Quick Register & Settings | ✅ Completed | `app/app/map.js` |
| **Mobile** | Menu Navigation & Item List | ✅ Completed | `app/app/menu.js` |
| **Mobile** | Service List Role Selector | ✅ Completed | `app/app/register/index.js` |
| **Mobile** | Registration Form (Blank & Keyboard Avoid) | ✅ Completed | `app/app/register/form.js` |
| **Mobile** | Payment Gateway ($49.99 Setup Fee) | ✅ Completed | `app/app/register/payment.js` |
| **Mobile** | Payment Success (+966000000000 Notice) | ✅ Completed | `app/app/register/success.js` |
| **Mobile** | Approval Pending Status & Trigger | ✅ Completed | `app/app/register/pending.js` |
| **Mobile** | Dynamic User Profile Screen | ✅ Completed | `app/app/profile.js` |
| **Mobile** | Dynamic Opportunity Notice Board | ✅ Completed | `app/app/opportunity.js` |
| **Mobile** | Standard Expo Vector Icons Integration | ✅ Completed | `app/src/components/common/Icon.js` |
| **Web** | Responsive Sidebar & Navigation Layout | ✅ Completed | `web/src/components/common/layout/` |
| **Web** | Driver Requests & Detail Modal | ✅ Completed | `web/src/pages/Drivers/Drivers.jsx` |
| **Web** | Services & GPS Lat/Lng Manager | ✅ Completed | `web/src/pages/Services/Services.jsx` |
| **Web** | Opportunity Notice Publisher | ✅ Completed | `web/src/pages/Opportunity/Opportunity.jsx` |
| **Web** | Payments Audit Log | ✅ Completed | `web/src/pages/Payments/Payments.jsx` |
| **Web** | Support Routing (+966000000000 Setup) | ✅ Completed | `web/src/pages/Contact/Contact.jsx` |
| **Web** | Settings & Theme Toggle | ✅ Completed | `web/src/pages/Settings/Settings.jsx` |

---

## 🎯 Verification & Testing Summary
- **App Platform**: React Native (Expo SDK 57, JavaScript `.js` files).
- **Web Platform**: React + Vite (JSX `.jsx` files, Lucide icons).
- **Git Repository**: Pushed and synchronized to `https://github.com/divyansh-connect/New-Transport-Ui.git`.

---

## 🛡️ Database Field Mapping & Security Analysis (Prisma ORM + MySQL)

### 1. Extracted Entities & Fields From Frontend

Through detailed analysis of the mobile screens (`app/app/register/form.js`, `app/app/profile.js`, `app/app/login.js`) and admin web pages (`web/src/context/DriverContext.jsx`, `web/src/pages/Drivers/Drivers.jsx`, `web/src/pages/Services/Services.jsx`, `web/src/pages/Payments/Payments.jsx`), we have identified the following system entities and their corresponding schema properties:

#### A. User/Entity (Driver, Workshop, Oil change, Visitor)
- `id` (String, Unique Primary Key): E.g., `DRV-XXXX`, `WS-XXXX`, `OC-XXXX`, `VIS-XXXX`.
- `name` (String, Required): First Name.
- `lastName` (String, Optional): Family Name.
- `mobileNo` (String, Required, Unique): Phone number used for authentication and contact.
- `carPlateNumber` (String, Nullable): Mandatory only if role is `Driver`.
- `email` (String, Nullable, Unique): Optional email address.
- `role` / `type` (Enum): `driver`, `workshop`, `oil`, `visitor`.
- `status` (Enum): `Pending`, `Approved`, `Rejected`.
- `registrationDate` (DateTime): Date of signup.
- `subscriptionDuration` (String): e.g. `1 Month`, `6 Months`, `1 Year`.
- `amountPaid` / `paymentAmount` (String): The price paid (e.g. `$49.99`, `$199.99`, `$349.99`).
- `paymentStatus` (Enum): `Paid`, `Unpaid`, `Trial`.
- `paymentMethod` (String): e.g. `Credit Card`, `Apple Pay`, `Bank Wire`, `Free Bypass`.
- `latitude` (Decimal, Nullable): GPS latitude for tracking (real-time for Drivers, static for Workshops/Oil Change).
- `longitude` (Decimal, Nullable): GPS longitude.
- `trackLocation` (Boolean): Consent flag for live tracking.
- `rejectionReason` (String, Nullable): Notes from admin if application is rejected.
- **Documents Object**:
  - `licenseName` / `licenseStatus` / `licenseUrl`
  - `insuranceName` / `insuranceStatus` / `insuranceUrl`
  - `backgroundCheckName` / `backgroundCheckStatus` / `backgroundCheckUrl`

#### B. Payment Transaction Log
- `id` (String, Primary Key): Transaction ID (e.g. `PAY-XXXX`).
- `driverId` (String, Foreign Key -> User.id): Association to the registering entity.
- `name` (String): Name of the payer.
- `amount` (String): Payment amount.
- `gateway` (String): Method (e.g. `Credit Card`, `Apple Pay`).
- `status` (String): `Completed`, `Failed`, `Pending`.
- `date` (DateTime): Date of transaction.

#### C. Notification Log
- `id` (String, Primary Key): Notification ID (e.g. `NOT-XXXX`).
- `type` (String): e.g. `registration`, `payment`, `verification`, `approval`, `rejection`, `profile_update`.
- `title` (String): Notification heading.
- `message` (String): Notification body.
- `time` / `createdAt` (DateTime): Timestamp of creation.
- `read` (Boolean): Read/unread flag.

---

### 2. Security Best Practices & Database Hardening (MySQL + Prisma)
1. **Input Validation & Sanitization**: Ensure backend routes strictly validate inputs (like mobile phone numbers matching Regex `/^\+?[1-9]\d{1,14}$/` and email addresses using standard RFC 5322 regex).
2. **Access Control (RBAC)**: Ensure that API endpoints for approving/rejecting drivers, modifying payments, or managing services require admin-role authorization tokens.
3. **Data Privacy**: Encrypt user email and mobile number fields at-rest or mask them in generic public listings to avoid leakage of PII (Personally Identifiable Information).
4. **GPS Integrity**: Implement rate-limiting on live coordinate updates (e.g., driver tracking status) and validate coordinates (`latitude` between -90 and 90, `longitude` between -180 and 180).
5. **No Direct ID Exposure**: Use auto-generated secure IDs internally (e.g., UUID or Auto-Increment) and map them to custom external strings (`DRV-XXX`, `WS-XXX`) to avoid predictability attacks (Insecure Direct Object References - IDOR).
6. **Parameterized Queries**: Prisma automatically uses parameterized queries to protect against SQL Injection. We will ensure MySQL tables use correct indexes to speed up lookup times.

