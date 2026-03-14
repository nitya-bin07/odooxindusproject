# CoreInventory — Backend API

A production-ready **Inventory Management System** backend built with **Node.js · Express.js · PostgreSQL · Sequelize · JWT**.

---

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Runtime        | Node.js                           |
| Framework      | Express.js                        |
| Database       | PostgreSQL                        |
| ORM            | Sequelize v6                      |
| Auth           | Custom JWT (jsonwebtoken + bcrypt)|
| Architecture   | MVC (Models → Controllers → Routes)|
| Validation     | Custom middleware (no Zod)        |
| Environment    | dotenv                            |

---

## Project Structure

```
coreinventory/
├── app.js                    # Express app setup & route mounting
├── server.js                 # Entry point – DB connect & listen
├── .env.example              # Environment variable template
├── config/
│   └── database.js           # Sequelize connection
├── models/
│   ├── index.js              # Load models + define associations
│   ├── user.model.js
│   ├── otp.model.js
│   ├── warehouse.model.js
│   ├── location.model.js
│   ├── category.model.js
│   ├── product.model.js
│   ├── stock.model.js        # Per-location quantity table
│   ├── receipt.model.js      # Incoming goods header
│   ├── receiptLine.model.js
│   ├── delivery.model.js     # Outgoing goods header
│   ├── deliveryLine.model.js
│   ├── transfer.model.js     # Internal movement header
│   ├── transferLine.model.js
│   ├── adjustment.model.js   # Stock count correction header
│   ├── adjustmentLine.model.js
│   └── stockLedger.model.js  # Immutable movement log
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── warehouse.controller.js
│   ├── location.controller.js
│   ├── category.controller.js
│   ├── product.controller.js
│   ├── receipt.controller.js
│   ├── delivery.controller.js
│   ├── transfer.controller.js
│   ├── adjustment.controller.js
│   ├── ledger.controller.js
│   └── dashboard.controller.js
├── middleware/
│   ├── auth.middleware.js    # protect + restrictTo
│   └── validate.middleware.js# Custom field validation (no Zod)
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── warehouse.routes.js
│   ├── location.routes.js
│   ├── category.routes.js
│   ├── product.routes.js
│   ├── receipt.routes.js
│   ├── delivery.routes.js
│   ├── transfer.routes.js
│   ├── adjustment.routes.js
│   ├── ledger.routes.js
│   └── dashboard.routes.js
├── utils/
│   ├── jwt.js                # signToken / verifyToken
│   ├── response.js           # sendSuccess / sendError helpers
│   ├── otp.js                # generateOTP / otpExpiry
│   ├── reference.js          # Auto document reference codes
│   └── stockService.js       # Core stock mutation + ledger write
└── seeders/
    └── index.js              # Demo data seed script
```

---

## Setup & Installation

### 1. Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14 running locally or via Docker

### 2. Clone & Install

```bash
git clone <repo-url>
cd coreinventory
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=coreinventory
DB_USER=postgres
DB_PASSWORD=yourpassword

JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d

OTP_EXPIRES_MINUTES=10
```

### 4. Create the Database

```sql
CREATE DATABASE coreinventory;
```

### 5. Start the Server

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Sequelize will **auto-sync** all models on startup (`alter: true`).

### 6. Seed Demo Data (optional)

```bash
npm run seed
```

> ⚠️ The seed script uses `force: true` — it **drops and recreates** all tables.

**Demo credentials after seeding:**

| Role              | Email                          | Password    |
|-------------------|--------------------------------|-------------|
| Admin             | admin@coreinventory.com        | password123 |
| Inventory Manager | manager@coreinventory.com      | password123 |
| Warehouse Staff   | staff@coreinventory.com        | password123 |

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require:

```
Authorization: Bearer <token>
```

---

### Auth  `/api/auth`

| Method | Endpoint           | Auth | Body                                    | Description          |
|--------|--------------------|------|-----------------------------------------|----------------------|
| POST   | /register          | ✗    | name, email, password, role?            | Create account       |
| POST   | /login             | ✗    | email, password                         | Get JWT token        |
| POST   | /forgot-password   | ✗    | email                                   | Generate OTP         |
| POST   | /reset-password    | ✗    | email, otp, password                    | Reset with OTP       |
| GET    | /me                | ✓    | —                                       | Current user profile |

---

### Users  `/api/users`

| Method | Endpoint              | Role         | Description         |
|--------|-----------------------|--------------|---------------------|
| GET    | /                     | admin        | List all users      |
| GET    | /:id                  | any          | Get user by ID      |
| PATCH  | /:id                  | any          | Update user         |
| PATCH  | /change-password      | any          | Change own password |
| DELETE | /:id                  | admin        | Soft-delete user    |

---

### Warehouses  `/api/warehouses`

| Method | Endpoint | Role             | Body                   |
|--------|----------|------------------|------------------------|
| GET    | /        | any              | —                      |
| GET    | /:id     | any              | —                      |
| POST   | /        | admin, manager   | name, code, address?   |
| PATCH  | /:id     | admin, manager   | name?, address?, isActive? |
| DELETE | /:id     | admin            | —                      |

---

### Locations  `/api/locations`

| Method | Endpoint | Role           | Body / Query                        |
|--------|----------|----------------|-------------------------------------|
| GET    | /        | any            | ?warehouseId= &type=                |
| GET    | /:id     | any            | —                                   |
| POST   | /        | admin, manager | warehouseId, name, code, type?      |
| PATCH  | /:id     | admin, manager | name?, type?, isActive?             |
| DELETE | /:id     | admin          | —                                   |

**Location types:** `internal` · `vendor` · `customer` · `virtual`

---

### Categories  `/api/categories`

| Method | Endpoint | Role           | Body              |
|--------|----------|----------------|-------------------|
| GET    | /        | any            | —                 |
| GET    | /:id     | any            | —                 |
| POST   | /        | admin, manager | name, parentId?   |
| PATCH  | /:id     | admin, manager | name?, parentId?  |
| DELETE | /:id     | admin          | —                 |

---

### Products  `/api/products`

| Method | Endpoint | Role           | Body / Query                                              |
|--------|----------|----------------|-----------------------------------------------------------|
| GET    | /        | any            | ?search= &categoryId= &lowStock=true                      |
| GET    | /:id     | any            | —                                                         |
| POST   | /        | admin, manager | name, sku, categoryId?, unitOfMeasure?, reorderPoint?     |
| PATCH  | /:id     | admin, manager | name?, categoryId?, unitOfMeasure?, reorderPoint?, isActive? |
| DELETE | /:id     | admin          | —                                                         |

---

### Receipts  `/api/receipts`  (Incoming Goods)

| Method | Endpoint       | Role           | Description                     |
|--------|----------------|----------------|---------------------------------|
| GET    | /              | any            | List — ?warehouseId= &status=   |
| GET    | /:id           | any            | Get with lines                  |
| POST   | /              | admin, manager | Create receipt (draft)          |
| PATCH  | /:id           | admin, manager | Edit draft header / line qtys   |
| POST   | /:id/validate  | admin, manager | Confirm → stock increases       |
| POST   | /:id/cancel    | admin, manager | Cancel receipt                  |

**Create body:**
```json
{
  "warehouseId": "<uuid>",
  "supplier": "ABC Traders",
  "scheduledDate": "2024-06-01",
  "notes": "Urgent order",
  "lines": [
    { "productId": "<uuid>", "locationId": "<uuid>", "expectedQty": 100 }
  ]
}
```

---

### Deliveries  `/api/deliveries`  (Outgoing Goods)

| Method | Endpoint       | Role           | Description                   |
|--------|----------------|----------------|-------------------------------|
| GET    | /              | any            | List — ?warehouseId= &status= |
| GET    | /:id           | any            | Get with lines                |
| POST   | /              | admin, manager | Create delivery (draft)       |
| PATCH  | /:id           | admin, manager | Edit draft                    |
| POST   | /:id/validate  | admin, manager | Confirm → stock decreases     |
| POST   | /:id/cancel    | admin, manager | Cancel                        |

**Create body:**
```json
{
  "warehouseId": "<uuid>",
  "customer": "XYZ Corp",
  "scheduledDate": "2024-06-05",
  "lines": [
    { "productId": "<uuid>", "locationId": "<uuid>", "demandQty": 10 }
  ]
}
```

---

### Transfers  `/api/transfers`  (Internal Movements)

| Method | Endpoint       | Role           | Description                          |
|--------|----------------|----------------|--------------------------------------|
| GET    | /              | any            | List — ?fromWarehouseId= &toWarehouseId= &status= |
| GET    | /:id           | any            | Get with lines                       |
| POST   | /              | admin, manager | Create transfer (draft)              |
| PATCH  | /:id           | admin, manager | Edit draft notes/date                |
| POST   | /:id/validate  | admin, manager | Move stock: source − · dest +        |
| POST   | /:id/cancel    | admin, manager | Cancel                               |

**Create body:**
```json
{
  "fromWarehouseId": "<uuid>",
  "toWarehouseId": "<uuid>",
  "scheduledDate": "2024-06-10",
  "lines": [
    {
      "productId": "<uuid>",
      "fromLocationId": "<uuid>",
      "toLocationId": "<uuid>",
      "qty": 50
    }
  ]
}
```

---

### Adjustments  `/api/adjustments`  (Stock Corrections)

| Method | Endpoint       | Role           | Description                     |
|--------|----------------|----------------|---------------------------------|
| GET    | /              | any            | List — ?warehouseId= &status=   |
| GET    | /:id           | any            | Get with lines                  |
| POST   | /              | admin, manager | Create adjustment (draft)       |
| POST   | /:id/validate  | admin, manager | Apply diff → stock corrected    |
| POST   | /:id/cancel    | admin, manager | Cancel                          |

**Create body:**
```json
{
  "warehouseId": "<uuid>",
  "reason": "Annual physical count",
  "lines": [
    { "productId": "<uuid>", "locationId": "<uuid>", "countedQty": 95 }
  ]
}
```

---

### Stock Ledger  `/api/ledger`

| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | /                         | Paginated ledger — ?productId= &locationId= &warehouseId= &movementType= &from= &to= &page= &limit= |
| GET    | /summary                  | Movement counts grouped by type    |
| GET    | /product/:productId       | Full history for one product       |

**movementType values:** `receipt` · `delivery` · `transfer_out` · `transfer_in` · `adjustment`

---

### Dashboard  `/api/dashboard`

| Method | Endpoint              | Description                            |
|--------|-----------------------|----------------------------------------|
| GET    | /                     | KPIs snapshot — ?warehouseId=          |
| GET    | /stock-by-warehouse   | Total stock qty per warehouse          |
| GET    | /movement-trend       | Daily movement totals (last 30 days)   |

**KPI Response includes:**
- `totalProducts`, `lowStockItems`, `outOfStockItems`
- `pendingReceipts`, `pendingDeliveries`, `scheduledTransfers`, `draftAdjustments`
- `recentReceiptsLast7Days`, `recentDeliveriesLast7Days`
- `lowStockProducts[]` — top 10 products needing attention

---

## User Roles & Permissions

| Action                      | admin | inventory_manager | warehouse_staff |
|-----------------------------|:-----:|:-----------------:|:---------------:|
| Register/Login              | ✓     | ✓                 | ✓               |
| View all resources          | ✓     | ✓                 | ✓               |
| Create / Edit documents     | ✓     | ✓                 | ✗               |
| Validate / Cancel documents | ✓     | ✓                 | ✗               |
| Create warehouses/locations | ✓     | ✓                 | ✗               |
| Delete resources            | ✓     | ✗                 | ✗               |
| Manage users / roles        | ✓     | ✗                 | ✗               |

---

## Inventory Flow

```
Vendor → [Receipt VALIDATE]  → Stock +qty at location
                                      ↕
                          [Transfer VALIDATE] → Stock moves between locations/warehouses
                                      ↕
         [Delivery VALIDATE] → Stock -qty at location → Customer
                                      ↕
               [Adjustment VALIDATE] → Stock corrected to physical count
                                      ↕
                              Stock Ledger (immutable log of every move)
```

---

## Standard API Response Format

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "...",
  "errors": ["field error 1", "field error 2"]
}
```

---

## Document Statuses

All operation documents (Receipt, Delivery, Transfer, Adjustment) follow this lifecycle:

```
draft → waiting → ready → done
                        ↘ canceled
```

Stock is only affected when a document reaches **done** (via `/validate`).

---

## Notes

- All IDs are **UUID v4**.
- Soft-delete (`paranoid: true`) on Users, Warehouses, Locations, Products, and all document headers.
- The `stock_ledger` table is **append-only** — rows are never updated or deleted.
- OTP-based password reset is implemented without any third-party email service. In production, replace the OTP response with an email/SMS integration.
- All stock mutations run inside **Sequelize transactions** to ensure atomicity.
