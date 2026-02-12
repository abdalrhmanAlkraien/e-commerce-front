---

# Global Admin Rules (CRITICAL)

## Security Boundary

ALL admin routes MUST be protected by:

```
AdminRoute
```

Never rely on UI hiding alone.

Unauthorized users MUST be redirected to:

```
/403
```

---

## Admin Module Structure

```
src/modules/admin/
 ├── layout/
 ├── dashboard/
 ├── categories/
 ├── products/
 ├── orders/
 ├── customers/
```

Each sub-module MUST follow:

```
api/
hooks/
components/
pages/
utils/
types/
```

---

## Data Authority

Admin panels MUST use server-driven state.

Never mutate UI assumptions.

Always refetch or invalidate queries after mutations.

---

# Task 5.3 — Admin Products (VERY HIGH VALUE)

## Objective

This is the **highest financial leverage module** in the admin panel.

Operators control:

* pricing
* stock
* visibility
* categorization

Mistakes here directly affect revenue.

Treat this as **mission critical**.

---

## APIs

```
GET    /api/v1/admin/products
POST   /api/v1/admin/products
PUT    /api/v1/admin/products/{id}
DELETE /api/v1/admin/products/{id}
```

---

## Product Table

Must support:

✅ advanced filtering
✅ pagination
✅ category filter
✅ price range
✅ active toggle

Columns:

* image
* name
* price
* stock
* active

---

## Product Form (CRITICAL UI)

Fields:

* name
* slug
* description
* price
* currency
* stock
* categoryId
* imageUrl
* active

Use category dropdown from cached query.

---

## Stock Safety Pattern

When editing stock:

Never assume local values.

Always trust server response.

---

## Image Handling

Use:

```
POST /api/v1/content/upload
```

Upload first → then attach URL.

Never store raw files in forms.

---

## Deliverables

✅ products.admin.api.ts
✅ useAdminProducts
✅ ProductTable
✅ ProductForm
✅ ImageUpload component

---
# Testing Requirements (MANDATORY)

Use:

* MSW
* Vitest
* React Testing Library

---

## Critical Admin Flows

### Categories

✅ create
✅ update
✅ delete conflict

### Products

✅ create
✅ edit
✅ upload image

### Orders

✅ view
✅ change status
✅ refund

### Customers

✅ enable
✅ disable

---

## Coverage Requirement

```
MINIMUM: 80%
```

Failure to meet coverage = task incomplete.

---
