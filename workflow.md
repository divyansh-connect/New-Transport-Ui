# 📋 User Life Transport — Complete System Workflow

> **Project:** User Life Transport Management System  
> **Stack:** React Native (Mobile) + React.js (Web Admin) + Node.js/Express (Backend) + MySQL  
> **Database:** `user_logistic` (MySQL)  
> **Backend Port:** `5000` | **Web Admin Port:** `3000`

---

## 🏗️ System Architecture

```
┌─────────────────────┐         ┌──────────────────────────┐
│   📱 Mobile App      │         │  💻 Web Admin Dashboard   │
│   (Expo / RN)        │         │  (React.js)              │
│  • Login            │         │  • Login Page            │
│  • Register         │◄──JWT──►│  • Dashboard             │
│  • Map (GPS Live)   │  REST   │  • User Requests         │
│  • Profile          │  API    │  • Payments              │
│  • Edit Profile     │         │  • User/Service          │
│  • Notification     │         │  • Notifications         │
└──────────┬──────────┘         └────────────┬─────────────┘
           │                                 │
           └──────────┬──────────────────────┘
                      ▼
           ┌────────────────────┐
           │  ⚙️ Backend API     │
           │  Node.js / Express │
           │  localhost:5000    │
           └────────┬───────────┘
                    ▼
           ┌────────────────────┐
           │  🗄️ MySQL Database  │
           │  user_logistic     │
           │  • User table      │
           │  • Payment table   │
           │  • Notification    │
           └────────────────────┘
```

---

## 👤 User Roles

| Role | Description | Login Method |
|------|-------------|-------------|
| `driver` | Commercial Driver / Truck Driver | Mobile Number |
| `workshop` | Repair Workshop Partner | Mobile Number |
| `oil` | Oil Change Center | Mobile Number |
| `visitor` | Guest / Visitor | Mobile Number |
| `admin` | System Administrator | Email + Password |

---

## 🔄 Complete User Flows

### Flow 1: Mobile User Registration
```
📱 Register Screen
    ├─ Name, Mobile Number (required)
    ├─ Car Plate (drivers only), Email (optional)
    ├─ Plan: 1 Month/$49.99 | 6 Month/$199.99 | 1 Year/$349.99
    └─ Track Location toggle
         ↓
POST /api/auth/register
    ├─ Password: "password123" (auto-set)
    ├─ Status: "Pending" (auto-set)
    ├─ DB: User record created
    └─ DB: Notification → "New Registration Submitted"
         ↓
📱 Payment Screen → Map Screen (Pending badge shown)
         ↓
💻 Web Admin → User Requests page → NEW ENTRY appears
```

---

### Flow 2: Mobile Login
```
📱 Login Screen → Enter Mobile Number → Login button
         ↓
POST /api/auth/login  { mobileNo, password: "password123" }
    ├─ JWT Token generated (30 days)
    ├─ Token saved → AsyncStorage ("auth_token")
    └─ User profile saved locally
         ↓
📱 Map Screen
    ├─ Status Pending → "Waiting for Approval" shown
    └─ Status Approved → GPS tracking starts
```

---

### Flow 3: Web Admin Login
```
💻 Login Page
    ├─ Email: admin@userlife.com
    └─ Password: admin123
         ↓
POST /api/auth/login  { email, password }
    ├─ Admin not in DB → Auto-created (ADM-101)
    ├─ JWT Token generated
    └─ Token saved → localStorage ("admin_token")
         ↓
💻 Dashboard
    └─ DriverContext auto-fetches every 15 seconds:
        ├─ GET /api/users        → All registered users
        ├─ GET /api/payments     → All payment records
        └─ GET /api/notifications → All system notifications
```

---

### Flow 4: Admin Approves a User ⭐
```
💻 User Requests Page → Click "Approve"
         ↓
PUT /api/users/:id/approve
    ├─ DB: status → "Approved"
    ├─ DB: documents → "Verified"
    ├─ DB: paymentStatus → "Paid"
    ├─ DB: Notification → "Entity Approved"
    └─ DB: Payment record auto-created
         ↓
📱 Mobile (next refresh):
    ├─ Map shows live GPS pin
    └─ Notification: "✅ Account Approved"
💻 Web Admin:
    ├─ Notification badge count +1
    ├─ Payments page: new entry
    └─ Dashboard stats update
```

---

### Flow 5: Admin Rejects a User
```
💻 User Requests Page → Click "Reject" → Enter reason
         ↓
PUT /api/users/:id/reject  { reason: "..." }
    ├─ DB: status → "Rejected"
    ├─ DB: rejectionReason saved
    └─ DB: Notification → "Entity Rejected"
         ↓
📱 Mobile Notification: "❌ Registration Rejected" + reason
```

---

### Flow 6: Live GPS Tracking (Approved Users)
```
📱 Map Screen — Approved Driver
    └─ Every 10 seconds:
         PUT /api/users/coordinates  { latitude, longitude }
         └─ DB: GPS coordinates updated
              ↓
         Every 12 seconds (all users & web):
         GET /api/users/pins
         └─ Returns Approved users with valid coordinates
              → Map shows live moving pins
```

---

### Flow 7: Edit Profile (Mobile)
```
📱 Edit Profile → Update Name/Email/Plate → Save
         ↓
PUT /api/users/profile  { name, lastName, email, carPlateNumber }
    ├─ DB: User profile updated
    └─ AsyncStorage: Local copy updated
```

---

## 📡 All API Endpoints

### 🔐 Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Mobile user registration |
| POST | `/api/auth/login` | Login (mobile or admin) |
| GET | `/health` | Server & DB health check |

### 👥 Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | Admin | Get all users |
| PUT | `/api/users/profile` | Logged-in | Update own profile |
| PUT | `/api/users/coordinates` | Logged-in | Push GPS location |
| GET | `/api/users/pins` | Public | Get approved user map pins |
| PUT | `/api/users/:id/approve` | Admin | Approve user |
| PUT | `/api/users/:id/reject` | Admin | Reject user |
| DELETE | `/api/users/:id` | Admin | Delete user permanently |

### 💳 Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/payments` | Admin | Get all payments |
| POST | `/api/payments` | Admin | Create payment |
| DELETE | `/api/payments/:id` | Admin | Delete payment |

### 🔔 Notifications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications` | Admin | Get all notifications |
| PUT | `/api/notifications/:id/read` | Admin | Mark as read |
| DELETE | `/api/notifications` | Admin | Clear all |

---

## 💻 Web Admin Pages

| Page | Data Source | Actions Available |
|------|-------------|------------------|
| **Dashboard** | `/api/users` + `/api/payments` | Stats cards, Registration table |
| **User Requests** | `/api/users` | Approve, Reject, Delete, Edit, Export |
| **Payments** | `/api/payments` | View, Delete, Export Excel |
| **User/Service** | `/api/users` (Approved) | View workshops, oil, visitors |
| **Notifications** | `/api/notifications` | Mark read, Clear all |
| **Opportunity** | Static | View only |
| **Contact** | Static | View only |
| **Settings** | LocalStorage | Theme, preferences |

---

## 📱 Mobile App Screens

| Screen | Data Source | Actions |
|--------|-------------|---------|
| **Login** | `POST /api/auth/login` | JWT login |
| **Register** | `POST /api/auth/register` | Create account |
| **Map** | `GET /api/users/pins` (12s) | View live pins |
| **GPS Push** | `PUT /api/users/coordinates` (10s) | Auto background push |
| **Profile** | AsyncStorage | View profile data |
| **Edit Profile** | `PUT /api/users/profile` | Update + DB sync |
| **Notification** | `/api/notifications` + status fallback | View updates |
| **Settings** | AsyncStorage | Language (En/Ar/Ur), Theme |
| **Opportunity** | Static | View only |
| **Contact** | Static | View only |

---

## 🔔 Notification System

| Event | Auto-Triggered By | Title |
|-------|-------------------|-------|
| Mobile user registers | `/api/auth/register` | "New Registration Submitted" |
| Admin approves user | `/api/users/:id/approve` | "Entity Approved" |
| Admin rejects user | `/api/users/:id/reject` | "Entity Rejected" |

**Where it appears:**
- 💻 **Sidebar badge** — unread count (live)
- 💻 **Navbar Bell dropdown** — top 5 notifications
- 💻 **Notifications page** — all with mark read / clear
- 📱 **Mobile notification screen** — status-based messages

---

## 🗄️ Database Schema (MySQL)

### User Table
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| customId | String UNIQUE | DRV-1001, WS-201, etc. |
| name, lastName | String | User's name |
| mobileNo | String UNIQUE | Login identifier |
| email | String UNIQUE | Optional |
| password | String | bcrypt hashed |
| role | Enum | driver/workshop/oil/visitor/admin |
| status | Enum | Pending/Approved/Rejected |
| latitude, longitude | Decimal | Live GPS |
| paymentStatus | Enum | Paid/Unpaid/Trial |
| amountPaid | String | "$49.99" |
| registrationDate | DateTime | Auto on create |

### Payment Table
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| customId | String | PAY-1001 |
| driverId | FK→User | Linked user |
| name | String | Payer name |
| amount | String | "$49.99" |
| gateway | String | Credit Card, Apple Pay |
| status | String | Completed/Failed |

### Notification Table
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| customId | String | NOT-1234 |
| type | String | registration/approval/rejection |
| title | String | Short heading |
| message | String | Full description |
| read | Boolean | false = unread |
| userId | FK→User | Optional link |

---

## 🚀 How to Start

```bash
# 1️⃣ Backend
cd d:\Kiaan\Trasnport\backend
npm run dev
# → http://localhost:5000 ✅

# 2️⃣ Web Admin
cd d:\Kiaan\Trasnport\frontend
npm run dev
# → http://localhost:3000 ✅

# 3️⃣ Mobile App
cd d:\Kiaan\Trasnport\frontend\app
npx expo start
# Android emulator → http://10.0.2.2:5000/api
# iOS/Web → http://localhost:5000/api
```

### Admin Credentials
```
Email:    admin@userlife.com
Password: admin123
```

---

## ✅ System Completion Checklist

- [x] MySQL database `user_logistic` created & migrated
- [x] Backend REST API running on port 5000
- [x] JWT Authentication (Web + Mobile)
- [x] Web Admin connected to backend
- [x] Mobile App connected to backend (AsyncStorage JWT)
- [x] All dummy/mock data removed from all pages
- [x] Dashboard stat cards — live DB data
- [x] Notification badge — live unread count
- [x] Navbar bell — live notifications dropdown
- [x] Live GPS map pins — approved users from DB only
- [x] GPS coordinates pushed to DB every 10 seconds
- [x] Auto notifications on Register / Approve / Reject
- [x] Edit Profile synced to backend DB
- [x] Auto 15-second refresh on Web Admin data
- [x] Admin user auto-created on first login
- [x] Mobile notification screen — real data + status fallback
- [x] Map dummy pins removed — only real DB pins shown
