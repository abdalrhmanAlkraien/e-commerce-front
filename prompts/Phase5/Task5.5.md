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

# Task 5.5 — Customer Management

## Objective

Allow operators to monitor and control customer accounts.

Useful for:

* fraud mitigation
* support
* compliance

---

## APIs

```
GET /api/v1/admin/customers
GET /{id}
PUT /enable
PUT /disable
```

---

## Customers Table

Filters:

* email
* enabled
* search

Columns:

* name
* email
* role
* enabled
* createdAt

---

## Enable / Disable Pattern

This is a sensitive action.

Require confirmation modal.

Never allow accidental clicks.

---

## Customer Details Page

Display:

* identity
* status
* timestamps

Prepare structure for future order linking.

---

## Deliverables

✅ customers.admin.api.ts
✅ CustomersTable
✅ CustomerDetails
✅ EnableDisableControl

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
