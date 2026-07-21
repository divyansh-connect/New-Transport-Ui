# 🔄 WORKFLOW SPECIFICATION DOCUMENT

## 🚀 End-to-End System Integration Flow

```mermaid
flowchart TD
    A[App Launch] --> B[Splash Screen]
    B --> C[Map Screen - Default Home]
    
    C -->|Click Top ⚙️ Button| D[Menu Screen]
    C -->|Click Top Quick Register| E[Service List Registration]
    
    D -->|Click Register Button| E
    
    E --> F[Select Role: Driver / Workshop / Visitor]
    F --> G[Registration Form]
    G --> H[Payment Gateway - $49.99]
    H --> I[Payment Success - Contact Admin +966000000000]
    I --> J[Approval Pending Screen]
    
    J -.->|Sends Notification| K[Web Admin Dashboard]
    K -->|Admin Reviews & Approves| L[Driver Status = Approved]
    
    L -.->|Updates Mobile State| M[Go To Map - Live Tracking ON/OFF Activated]
    
    D -->|View Profile| N[Profile Screen - Displays Registered Name & Plate No]
    D -->|View Opportunity| O[Opportunity Board - Displays Admin Written Notice]
```

---

## 📱 Mobile App ↔ 💻 Web Admin Dashboard Data Interconnection

1. **Driver Registration & Approval**:
   - **Mobile**: Driver fills form (`Name`, `Mobile`, `Car Plate Number`) & pays $49.99.
   - **Web**: Admin receives alert on **Driver Requests (`Drivers.jsx`)**, views details, and clicks **`Approve`**.
   - **Mobile**: Driver screen updates status to **`Approved`**, enabling **Life Tracking ON/OFF** switch on Map.

2. **Registered Profile Sync**:
   - **Mobile**: Driver profile details (`app/app/profile.js`) automatically show the registered driver's name and plate number instead of static placeholders. Unregistered visitors see "Unregistered Visitor" with a "Register Now" trigger.

3. **Services & GPS Coordinates Sync**:
   - **Web**: Admin manages Workshops, Oil Stations & Car Locations with Latitude/Longitude input fields in **Services (`Services.jsx`)**.
   - **Mobile**: Locations automatically populate as service pins (`🛠️`, `🛢️`, `📍`) on the Driver Map.

4. **Opportunity Notice Board Sync**:
   - **Web**: Admin writes announcements in **Opportunity (`Opportunity.jsx`)**.
   - **Mobile**: Drivers view published notices inside **Menu ➔ Opportunity (`opportunity.js`)**.
