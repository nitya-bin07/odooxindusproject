# 📦 StockPulse

> **Hackathon Project - Odoo × Indus Hackathon**
> A modern, full-stack inventory management system built to simplify warehouse operations, track stock movements in real-time, and surface actionable insights through a clean dashboard.

---

## 🧭 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Seeding the Database](#-seeding-the-database)
- [How It Works](#-how-it-works)
- [Team](#-team)

---

## 🌟 Overview

**StockPulse** is a full-stack inventory management web application designed for businesses that operate across multiple warehouses and locations. It provides end-to-end tracking of stock — from the moment goods arrive (receipts), through internal movement (transfers), to outgoing deliveries — while keeping an immutable audit trail via a stock ledger.

The system is modeled on real-world warehouse workflows (inspired by Odoo's inventory module) and built with a focus on reliability, clarity, and developer experience.



---

## ✨ Features

### 🏭 Warehouse & Location Management
- Create and manage multiple warehouses, each with custom storage locations.
- Assign stock to specific locations within a warehouse for fine-grained control.
- Soft-delete support — deactivate warehouses/locations without losing historical data.

### 📦 Product & Category Management
- Full product catalog with SKU, unit of measure, and description.
- Categorize products for better organization and filtering.
- Configure **reorder points** per product — StockPulse automatically flags items as low-stock or out-of-stock.

### 🔄 Inventory Operations
StockPulse supports the core four warehouse operations, each with a draft → validate lifecycle:

| Operation | Description |
|---|---|
| **Receipt** | Incoming goods from a supplier into a warehouse location |
| **Delivery** | Outgoing goods from a warehouse location |
| **Transfer** | Internal movement of stock between warehouses or locations |
| **Adjustment** | Manual correction of stock quantities (shrinkage, damage, counts) |

### 📒 Stock Ledger (Immutable Audit Trail)
- Every stock movement writes a **ledger entry** that is never edited or deleted.
- Tracks: movement type, quantity delta, running balance after move, and source document reference.
- Provides a complete, time-ordered history of every unit of stock.

### 📊 Dashboard & KPIs
- Real-time KPI cards: total products, low-stock count, out-of-stock count, pending operations.
- Recent activity summary (last 7 days): receipts validated, deliveries completed.
- **Stock by Warehouse** breakdown — product count and total quantity per warehouse.
- **Movement Trend** chart — daily stock movement totals over the last 30 days, by movement type.
- Low-stock product list (top 10 most critical items).

### 🔐 Authentication & User Management
- JWT-based authentication with secure token handling.
- OTP-based **Forgot Password** flow (OTPs stored in DB, expire after 10 minutes).
- Password hashing with bcrypt.
- User profile management and settings page.
- Protected routes on the frontend — unauthenticated users are redirected to login.

---

## 🛠 Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| ORM | Sequelize v6 |
| Database | PostgreSQL |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcrypt |
| Email / OTP | Nodemailer (custom mailer utility) |
| Environment Config | dotenv |
| Dev Server | Nodemon |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v3 |
| HTTP Client | Axios |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | React Toastify |
| Font | Inter (@fontsource) |

---

## 📁 Project Structure

```
odooxindusproject-main/
│
├── backend/
│   ├── controllers/          # Route handler logic
│   │   ├── auth.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── product.controller.js
│   │   ├── warehouse.controller.js
│   │   ├── receipt.controller.js
│   │   ├── delivery.controller.js
│   │   ├── transfer.controller.js
│   │   ├── adjustment.controller.js
│   │   ├── ledger.controller.js
│   │   ├── location.controller.js
│   │   ├── category.controller.js
│   │   └── user.controller.js
│   │
│   ├── models/               # Sequelize models
│   │   ├── index.js          # Model registry & associations
│   │   ├── user.model.js
│   │   ├── warehouse.model.js
│   │   ├── location.model.js
│   │   ├── category.model.js
│   │   ├── product.model.js
│   │   ├── stock.model.js
│   │   ├── stockLedger.model.js
│   │   ├── receipt.model.js
│   │   ├── receiptLine.model.js
│   │   ├── delivery.model.js
│   │   ├── deliveryLine.model.js
│   │   ├── transfer.model.js
│   │   ├── transferLine.model.js
│   │   ├── adjustment.model.js
│   │   ├── adjustmentLine.model.js
│   │   └── otp.model.js
│   │
│   ├── routes/               # Express route definitions
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verification
│   │   └── validate.middleware.js # Request validation
│   ├── utils/
│   │   ├── stockService.js   # Core stock movement engine
│   │   ├── jwt.js            # Token helpers
│   │   ├── mailer.js         # Email / OTP sending
│   │   ├── otp.js            # OTP generation
│   │   ├── reference.js      # Document reference number generator
│   │   └── response.js       # Standardized API response helpers
│   ├── db/
│   │   └── database.js       # Sequelize connection setup
│   ├── seeders/
│   │   └── index.js          # DB seed script
│   ├── app.js                # Express app (routes, middleware)
│   ├── server.js             # Entry point (DB sync + listen)
│   └── .env.example          # Environment variable template
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Overview.jsx      # Dashboard KPIs and charts
│   │   │   ├── Products.jsx      # Product catalog
│   │   │   ├── Operations.jsx    # Receipts/Deliveries/Transfers/Adjustments
│   │   │   ├── MoveHistory.jsx   # Stock ledger viewer
│   │   │   ├── Warehouses.jsx    # Warehouse management
│   │   │   ├── Categories.jsx    # Category management
│   │   │   ├── Profile.jsx       # User profile
│   │   │   └── Settings.jsx      # App settings
│   │   ├── Authentications/
│   │   │   └── Authforms.jsx     # Login / Signup form
│   │   ├── AuthContext.jsx       # Global auth state (React Context)
│   │   ├── ProtectedRoute.jsx    # Auth guard HOC
│   │   ├── Homepage.jsx          # Landing page
│   │   ├── App.jsx               # Root router
│   │   ├── api.js                # Axios instance with base URL
│   │   └── main.jsx              # React entry point
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── package.json              # Root-level scripts (optional monorepo runner)
```

---

## 🗄 Database Schema

StockPulse uses **PostgreSQL** managed through Sequelize ORM. All primary keys are **UUIDs**. Deletable entities use **soft-delete** (`paranoid: true` in Sequelize) to preserve historical integrity.

### Core Entities

```
users
  id, name, email, passwordHash, role, isActive

warehouses
  id, name, code, address, isActive

locations
  id, warehouseId → warehouses, name, code, isActive

categories
  id, name, description

products
  id, name, sku, categoryId → categories, unitOfMeasure, description, reorderPoint, isActive

stocks
  id, productId → products, locationId → locations, quantity
  (Current live stock per product per location)

stock_ledger
  id, productId, locationId, warehouseId, movementType (ENUM), qty, balanceAfter,
  referenceId, referenceType, notes, createdBy
  (Immutable — updatedAt disabled)

receipts / deliveries / transfers / adjustments
  id, referenceNumber, warehouseId, status (draft→waiting→ready→done), dates, notes

receipt_lines / delivery_lines / transfer_lines / adjustment_lines
  id, parentId, productId, locationId, expectedQty, doneQty

otps
  id, userId, code, expiresAt, isUsed
```

### Key Relationships
- A **Warehouse** has many **Locations**
- A **Product** belongs to a **Category**
- **Stock** is the live quantity of a product at a specific location
- **StockLedger** entries are written atomically with every stock mutation — never edited
- All operation documents (Receipt, Delivery, etc.) have header + line-item tables

---

## 🔌 API Reference

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/forgot-password` | Request OTP for password reset |
| POST | `/api/auth/reset-password` | Reset password using OTP |

### Warehouses & Locations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/warehouses` | List all warehouses |
| POST | `/api/warehouses` | Create warehouse |
| PUT | `/api/warehouses/:id` | Update warehouse |
| DELETE | `/api/warehouses/:id` | Soft-delete warehouse |
| GET | `/api/locations` | List locations (filterable by warehouseId) |
| POST | `/api/locations` | Create location |

### Products & Categories
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products with stock info |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |

### Inventory Operations
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/receipts` | List / create receipts |
| PUT | `/api/receipts/:id/validate` | Validate receipt (triggers stock-in) |
| GET/POST | `/api/deliveries` | List / create deliveries |
| PUT | `/api/deliveries/:id/validate` | Validate delivery (triggers stock-out) |
| GET/POST | `/api/transfers` | List / create transfers |
| PUT | `/api/transfers/:id/validate` | Validate transfer (transfer_out + transfer_in) |
| GET/POST | `/api/adjustments` | List / create adjustments |
| PUT | `/api/adjustments/:id/validate` | Validate adjustment |

### Stock Ledger
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ledger` | Full movement history (filterable by product, warehouse, type, date) |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | KPI snapshot (totals, low stock, pending ops) |
| GET | `/api/dashboard/stock-by-warehouse` | Stock summary per warehouse |
| GET | `/api/dashboard/movement-trend` | Daily movement totals (last 30 days) |

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** v14+
- **npm** or **yarn**

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/stockpulse.git
cd stockpulse
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` (see [Environment Variables](#-environment-variables) below).

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts on `http://localhost:5000` by default.

---

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173` by default (Vite).

---

### 4. Build for Production (Frontend)

```bash
cd frontend
npm run build
```

The output is in `frontend/dist/`, ready to be served by any static host or Nginx.

---

## 🌿 Environment Variables

Create a `.env` file inside the `backend/` directory using `.env.example` as a template:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coreinventory
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# OTP (stored in DB, no external SMS service needed)
OTP_EXPIRES_MINUTES=10
```

> **Note:** The OTP flow for forgot-password uses the `mailer.js` utility. If you want OTP emails to actually send, configure SMTP credentials inside `backend/utils/mailer.js`.

---

## 🌱 Seeding the Database

To populate the database with sample warehouses, locations, categories, products, and a default admin user:

```bash
cd backend
npm run seed
```

This will create initial data so you can explore all features immediately after setup.

---

## ⚙️ How It Works

### Stock Movement Engine

The heart of StockPulse is `backend/utils/stockService.js`. Every time an operation is validated (receipt, delivery, transfer, adjustment), the system calls `applyStockMovement()` for each line item. This function:

1. **Finds or creates** the `Stock` row for the given product + location.
2. **Validates** that a stock-out won't push quantity below zero (throws a 422 if it would).
3. **Atomically updates** the live stock quantity.
4. **Writes an immutable ledger entry** with the delta, balance after, and reference to the source document.

All of this happens inside a **Sequelize database transaction** — if any step fails, the entire operation is rolled back. This guarantees that stock counts and the ledger are always consistent.

### Operation Lifecycle

Each operation (receipt, delivery, transfer, adjustment) follows a **state machine**:

```
draft → waiting → ready → done
```

Stock is only affected when an operation reaches the **done** state via a validate action. Until then, it can be freely edited or cancelled.

### Authentication Flow

1. User registers or logs in → receives a signed **JWT** (7-day expiry by default).
2. JWT is stored client-side and attached to every API request as a Bearer token.
3. The `auth.middleware.js` verifies the token and injects the user into `req.user`.
4. For password reset: user requests an OTP → OTP is stored in the `otps` table with a 10-minute TTL → user submits OTP + new password → password is updated and OTP is marked used.

---

## 👥 Team

Built during the **Odoo × Indus Hackathon**.

| Name | Role |
|---|---|
| Himanshi Srivastava | Frontend Development |
| Nityanand Maurya | Frontend Development |
| Divyanshi Sahu | Backend Development |
| Divyanshu Choubey | Backend Development |

---

## 📄 License

This project was built for a hackathon and is currently unlicensed. Feel free to fork and build on it.

---

