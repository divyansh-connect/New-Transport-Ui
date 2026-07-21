# 🎨 WIREFRAME SPECIFICATION DOCUMENT

## 📱 Mobile App Screens Layouts (React Native / Expo)

### 1. Home Map Screen (`app/app/map.js`)
```
+-------------------------------------------------------------+
| [TRUCK] MAP          [👤 Register]  [Driver Mode]  [⚙️]     |
+-------------------------------------------------------------+
|                                                             |
|           📍 Own Location                                   |
|                                🛠️ Workshop                   |
|                                                             |
|   🛢️ Oil Change                                             |
|                                📍 Car Location              |
|                                                             |
|  +-------------------------------------------------------+  |
|  | All Services are Visible to everyone                   |  |
|  | (Visitor Visible to himself only)                     |  |
|  +-------------------------------------------------------+  |
|                                                             |
|       +---------------------------------------------+       |
|       | Life Tracking     [ (o) ON ]     ON         |       |
|       +---------------------------------------------+       |
+-------------------------------------------------------------+
```
- **Top Bar**: Map Title, Quick `[👤 Register]` button, Mode chip (`Driver`/`Visitor`), and Settings `⚙️` button.
- **Canvas**: Visual grid roads & service markers (`📍`, `🛠️`, `🛢️`, `📍`).
- **Map Notice Box**: Overlay notice displaying visibility rules.
- **Bottom Floating Pill**: `Life Tracking ON / OFF` switch box.

---

### 2. Menu Navigation Screen (`app/app/menu.js`)
```
+-------------------------------------------------------------+
| < Menu Settings                                             |
+-------------------------------------------------------------+
|  MAP                                                      > |
|  Profile                                                  > |
|  Opportunity                                              > |
|  Notification                                             > |
|  Contact us                                               > |
|  Setting                                                  > |
|  Dark-Light Mod                                    [ 🌙 ]   |
+-------------------------------------------------------------+
|  [         REGISTER (OPEN SERVICE LIST) BUTTON            ] |
|  [              LANGUAGE: ENGLISH BUTTON                  ] |
+-------------------------------------------------------------+
```
- **List Items**: `MAP`, `Profile`, `Opportunity`, `Notification`, `Contact us`, `Setting`, `Dark-Light Mod`.
- **Action Buttons**: `Register (open Service List)` & `Language` switcher.

---

### 3. Service List Registration (`app/app/register/index.js`)
```
+-------------------------------------------------------------+
| < Service List Registration                                 |
+-------------------------------------------------------------+
|  Select Service / Role                                      |
|                                                             |
|  Driver (Life Tracking)                                [  ] |
|  Workshop (Location only)                              [  ] |
|  Oil change (Location only)                            [  ] |
|  Car Location (Location only)                          [  ] |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Visitor                                          [  ] |  |
|  | (it is upto Admin to be required or no)               |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```
- Selection cards with check indicators for Driver, Workshop, Oil change, Car location, and Visitor.

---

### 4. Driver Registration Form (`app/app/register/form.js`)
```
+-------------------------------------------------------------+
| < Driver Registration                                       |
+-------------------------------------------------------------+
|  Name                                                       |
|  [ Enter Name                                             ] |
|                                                             |
|  Last Name                                                  |
|  [ Enter Last Name                                        ] |
|                                                             |
|  Mobile NO                                                  |
|  [ Enter Mobile Number                                    ] |
|                                                             |
|  For driver Car plate number                                |
|  [ Enter Car Plate Number                                 ] |
|                                                             |
|  Email Option                                               |
|  [ Enter Email Address                                    ] |
|                                                             |
|  Track Location                                   [ (o) ON ] |
|  Accept Terms & Condition                         [ (o) ON ] |
|                                                             |
|  [                       NEXT BUTTON                      ] |
+-------------------------------------------------------------+
```
- Keyboard avoiding wrapper to prevent iOS/Android input overlap.
- Inputs for Name, Last Name, Mobile NO, Car Plate Number, Email Option, Track Location switch, Terms switch.

---

### 5. Payment & Contact Admin Notice (`app/app/register/success.js`)
```
+-------------------------------------------------------------+
| For Approval Contact Us                                     |
+-------------------------------------------------------------+
|                           ( ✓ )                             |
|                  Payment Gateway Success                    |
|                                                             |
|  +-------------------------------------------------------+  |
|  | For Approval Contact Us                                |  |
|  | +966000000000                                         |  |
|  | Contact admin via WhatsApp or Phone call for account  |  |
|  | activation.                                           |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  [ 💬 Contact via WhatsApp                                ] |
|  [ 📞 Call Admin Direct (+966000000000)                   ] |
|  [ Proceed to Approval Status                             ] |
+-------------------------------------------------------------+
```
- Payment fee summary ($49.99) & direct links to WhatsApp/Phone.

---

### 6. Approval Pending Status (`app/app/register/pending.js`)
```
+-------------------------------------------------------------+
| Approval Status                                             |
+-------------------------------------------------------------+
|                           ( 🕒 )                            |
|                 Waiting For Admin Approval                  |
|                                                             |
|  Current Status: [ Approval Pending ]                       |
|                                                             |
|  [ ⚡ Simulate Admin Dashboard Approval                   ] |
|  [ Go To Map (Pending Mode / Approved Mode)               ] |
+-------------------------------------------------------------+
```
- Status indicator: Pending ➔ Approved, unlocking Map Live Tracking.
