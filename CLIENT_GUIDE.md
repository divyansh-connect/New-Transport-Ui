# 🚚 User Life Transport Ecosystem — Complete Client & User Guide

Welcome to the **User Life Transport Telemetry & Operations Ecosystem**. This comprehensive document serves as the master guide for clients, administrators, and partners to understand the application architecture, user roles, feature set, permissions, and step-by-step usage.

---

## 📋 1. Ecosystem Overview

The User Life Transport Platform is a dual-tier system consisting of:
1. **Web Admin Operations Dashboard**: A central web control tower for platform administrators to manage user approvals, view live telemetry data, audit financial logs, control visibility settings, and broadcast real-time opportunity notices.
2. **Mobile Driver & Partner App**: An interactive mobile application for heavy truck drivers, repair workshops, oil change hubs, and visitors with live Leaflet GPS telemetry, instant call/WhatsApp bookings, real-time notification badges, and multi-language support (English, Arabic, Urdu).

---

## 👥 2. User Roles & Permission Matrix

| Role | Access Level | Map Pins Visibility Rules | Features & Capabilities |
| :--- | :--- | :--- | :--- |
| **System Admin** | **Web Dashboard (Full Control)** | Full System Overview | Approve/Reject users, publish notices, toggle visibility, manage payment settings, issue free access, send notifications. |
| **Workshop Partner (`workshop`)** | **Mobile App (Approved)** | **ONLY Workshop Pins (🔧)** | Appears as repair service hub for heavy trucks. Sees ONLY Workshop hubs on map. |
| **Oil Change Partner (`oil`)** | **Mobile App (Approved)** | **ONLY Oil Change Pins (💧)** | Appears as lube/oil change station. Sees ONLY Oil Change stations on map. |
| **Approved Driver (`driver`)** | **Mobile App (Approved)** | **BOTH Workshop (🔧) & Oil Change (💧) Pins + Driver Locations (🚗)** | Live GPS Telemetry broadcasting, toggle live tracking, receive transport bookings, view active opportunity notices. |
| **Pending User / Driver** | **Mobile App (Gated)** | **Locked (Hidden)** | Account submitted, awaiting admin approval. Map pins locked until approved. |
| **Visitor / Guest** | **Mobile App (Public Mode)** | **Locked (Hidden)** | Can view map canvas and own device GPS position. Must register/login and get approved to unlock drivers & service hubs. |

---

## 💻 3. Web Admin Dashboard Features & Guide

**URL**: `http://localhost:3000`  
**Authentication**: Admin session login (`/login`) using system administrator credentials.

### Key Admin Features:

1. **Dashboard Overview (`/`)**:
   - **Real-Time Telemetry Metrics**: Total registered users, pending approvals queue, total platform revenue, active service hubs.
   - **Recent Activity Table**: View latest registrations, filter by status (`Approved`, `Pending`, `Rejected`), and inspect documents.

2. **User Management (`/users`)**:
   - **Approval Gating**: Review incoming driver & service partner registrations.
   - **Document Inspection**: Click the inspect eye icon to view uploaded Commercial Driver Licenses (CDL) and Vehicle Liability Insurance documents.
   - **Approve / Reject Action**: Approve user instantly or provide a custom rejection reason.
   - **Edit & Delete**: Modify user details or delete non-compliant accounts.

3. **Payment Audit Ledger (`/payments`)**:
   - **Transaction Log**: Track all registration fees, subscription payments, and gateway statuses (`Paid`, `Unpaid`, `Free`).
   - **Manual Payment Record**: Add manual payment entries for cash or office counter payments.
   - **Delete Log**: Audit ledger cleanup.

4. **Opportunity & Notices Manager (`/opportunity`)**:
   - **Publish Broadcast**: Post announcements, high-demand cargo routes, partnership notices, and safety guidelines.
   - **Visibility Toggle (Eye Icon)**: Temporarily **Hide** or **Show** notices (`Visible` / `Hidden`). Hidden notices automatically stop appearing on mobile apps.
   - **Edit & Delete**: Update existing notices or permanently delete broadcasts.

5. **System Notifications (`/notifications`)**:
   - **Broadcast Notifications**: Push notifications directly to all registered mobile users.

6. **Platform Control Settings (`/settings`)**:
   - **Role Payment Enforcement**: Select which roles must pay subscription fees (Driver, Workshop, Visitor, Oil Change).
   - **Free Trial Control**: Toggle free trial status and duration (1 Month, 3 Months, 6 Months).
   - **Visitor Service Hub Visibility**: Enable or disable POI visibility for guest users.

---

## 📱 4. Mobile Driver & Partner App Features & Guide

**Platform**: React Native / Expo Mobile App  
**Authentication**: Mobile Number or Email + Password.

### Key Mobile App Features:

1. **Splash Screen & Branding**:
   - Animated brand intro with glowing pulse ring and logo.

2. **Gated Role-Based Live GPS Map (`/map`)**:
   - **Leaflet Interactive Map**: Smooth zooming, English tile labels, and Google Maps-style tilted blue navigation arrow with pulse glow representing own device position.
   - **Role-Specific Pin Visibility**:
     - **Workshop Partner**: Sees **ONLY Workshop pins (🔧)**.
     - **Oil Change Partner**: Sees **ONLY Oil Change pins (💧)**.
     - **Driver**: Sees **BOTH Workshop (🔧) AND Oil Change (💧) pins** (plus active driver locations 🚗).
     - **Visitor / Pending User**: Map pins hidden until approved by admin.
   - **Live Tracking Switch**: Approved drivers can toggle live location broadcasting `ON` / `OFF`.
   - **Direct Call & WhatsApp Hire Buttons**: Customers can tap any active driver or service pin on the map to call directly or initiate WhatsApp booking.

3. **Real-Time Notification System**:
   - **Real-Time 4-Second Background Sync**: New notices posted by admin sync automatically without requiring any manual refresh.
   - **Dynamic Red Count Badge (🔴)**: The Bell Icon (🔔) in the map header displays a red unread badge count (e.g., `1`, `2`, `3`).
   - **Auto-Read Dismissal**: Tapping the Bell Icon or opening the Notice Board automatically marks notices as read and clears the red badge count.

4. **Opportunity & Notices Board (`/opportunity`)**:
   - Review all active admin broadcasts, long-haul freight opportunities, payouts, and safety updates.

5. **Multi-Language & Theme Support (`/menu` & `/settings`)**:
   - Full support for **English**, **Arabic (RTL)**, and **Urdu (RTL)** with right-to-left layout adjustments.
   - Dark Mode and Light Mode switching.

---

## 🔄 5. Step-by-Step Workflow Guide

### Workflow A: New Driver / Partner Registration & Approval
1. User opens Mobile App ➔ Taps **Register Now**.
2. Selects role: **Driver**, **Workshop**, or **Oil Change**.
3. Fills in Name, Mobile Number, Email, Password, and selects subscription duration.
4. Uploads CDL License & Insurance document names/files.
5. Submits registration ➔ Account status becomes **Pending Admin Approval** (Map pins remain locked for safety).
6. Admin opens Web Dashboard ➔ Navigates to **User Requests / Users**.
7. Admin inspects uploaded documents ➔ Clicks **Approve**.
8. Partner logs into Mobile App ➔ Status updates to **Approved (✓)** ➔ Role-based Map Telemetry & Service Pins unlock according to their specific role rules!

### Workflow B: Admin Notice Broadcast
1. Admin opens Web Dashboard ➔ Navigates to **Opportunity & Notices**.
2. Fills in Notice Title (e.g., *High-Demand Cargo Routes Available*), Type (*Freight*), Priority (*High*), Zone (*Northern Ports*), and Description.
3. Clicks **Publish Notice**.
4. Mobile App automatically detects new notice via real-time background sync within 4 seconds.
5. The Bell Icon (🔔) in the Mobile App top header displays a **Red Notification Badge (🔴)** with unread count.
6. Driver taps the Bell Icon ➔ Notice opens ➔ Badge count automatically clears!

---

*Document Generated for User Life Transport Platform Client Presentation.*
