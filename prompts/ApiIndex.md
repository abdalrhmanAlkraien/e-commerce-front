# ApiIndex.md

## Backend API Navigation Map

---

# Purpose

This document provides a categorized index of all backend APIs.

It exists to help engineering agents:

* Locate endpoints quickly
* Avoid hallucinating APIs
* Understand domain boundaries
* Prevent misuse of secured endpoints

This is a **navigation layer**, not the contract itself.

For payload structures → consult Swagger.

For behavioral rules → consult ApiAuthority.md.

---

# Global Base Path

All endpoints are prefixed with:

```
/api/v1
```

You MUST preserve versioning in every request.

Never remove version prefixes.

---

# API Domains

---

# 🔐 Authentication APIs

## Purpose

Handles user identity, login, and registration.

## Security

Public access.

---

### Register User

```
POST /api/v1/auth/register
```

Creates a new CUSTOMER account and returns JWT.

---

### Login User

```
POST /api/v1/auth/login
```

Authenticates user and returns access token.

---

# 🛍 Public APIs

## Purpose

Customer storefront operations accessible to anonymous or authenticated users.

## Security

Mostly public.
Some operations depend on session or cart ownership.

---

## Categories

### List Categories

```
GET /api/v1/public/categories
```

Supports pagination and filtering.

---

## Products

### List Products

```
GET /api/v1/public/products
```

Supports:

* categorySlug
* price filters
* search
* pagination

---

### Get Product Details

```
GET /api/v1/public/products/{slug}
```

---

## Cart

### Create Cart

```
POST /api/v1/public/cart
```

Returns cartId and sessionId.

Agent MUST persist these safely.

---

### Get Cart

```
GET /api/v1/public/cart/{cartId}
```

Requires session header for anonymous carts.

---

### Add Item

```
POST /api/v1/public/cart/{cartId}/items
```

---

### Update Item

```
PUT /api/v1/public/cart/{cartId}/items/{itemId}
```

---

### Remove Item

```
DELETE /api/v1/public/cart/{cartId}/items/{itemId}
```

---

## Refund Requests

### Create Refund Request

```
POST /api/v1/public/orders/{externalId}/refund-request
```

Creates a PENDING refund requiring admin approval.

---

# 💳 Checkout APIs

## Purpose

Transforms carts into orders.

Security depends on cart ownership.

---

### Create Order

```
POST /api/v1/checkout/create-order
```

Validates:

* stock
* totals
* cart state

Returns order summary.

---

# 📁 Content APIs

## Purpose

File upload and retrieval using object storage (S3).

## Security

Requires authenticated access depending on usage context.

---

### Upload File

```
POST /api/v1/content/upload
```

Multipart request.

Agent MUST use FormData.

Never send JSON.

---

### Download File

```
GET /api/v1/content/{id}
```

Streams file.

Do not attempt manual parsing.

---

# 🧠 Admin APIs

## Purpose

Administrative operations for managing the platform.

## Security

Requires ADMIN role.

Unauthorized access must NEVER be attempted.

---

# Admin Categories

### List

```
GET /api/v1/admin/categories
```

### Create

```
POST /api/v1/admin/categories
```

### Update

```
PUT /api/v1/admin/categories/{id}
```

### Delete

```
DELETE /api/v1/admin/categories/{id}
```

---

# Admin Products

### List

```
GET /api/v1/admin/products
```

### Create

```
POST /api/v1/admin/products
```

### Update

```
PUT /api/v1/admin/products/{id}
```

### Delete

```
DELETE /api/v1/admin/products/{id}
```

---

# Admin Orders

### List Orders

```
GET /api/v1/admin/orders
```

---

### Get Order Details

```
GET /api/v1/admin/orders/{externalId}
```

---

### Change Status

```
PUT /api/v1/admin/orders/{externalId}/status
```

Enforces lifecycle transitions.

Agent MUST respect valid status changes.

---

### Execute Refund

```
POST /api/v1/admin/orders/{externalId}/refund
```

Triggers payment provider refund.

---

# Admin Customers

### List Customers

```
GET /api/v1/admin/customers
```

---

### Get Customer

```
GET /api/v1/admin/customers/{id}
```

---

### Enable Customer

```
PUT /api/v1/admin/customers/{id}/enable
```

---

### Disable Customer

```
PUT /api/v1/admin/customers/{id}/disable
```

---

# API Discovery Rule

Before calling ANY endpoint:

1️⃣ Locate it in ApiIndex.md
2️⃣ Validate contract in Swagger
3️⃣ Obey ApiAuthority.md

Never skip discovery.

---

# Architectural Boundary Rule

You MUST NEVER:

* Use Admin APIs in customer flows
* Use Public APIs inside admin dashboards when admin alternatives exist
* Mix domains

Boundary violations are critical failures.

---

# Engineering Mindset

Think of this file as the **table of contents** for backend capabilities.

Navigate first.
Validate second.
Implement third.
