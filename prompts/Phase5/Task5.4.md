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

# Task 5.4 — Orders Management

## Objective

Provide operators full visibility into the **order lifecycle**.

Orders are financial records.

Accuracy matters.

---

## APIs

```
GET /api/v1/admin/orders
GET /api/v1/admin/orders/{externalId}
PUT /status
POST /refund
```

---

## Orders Table

Filters:

* status
* customerEmail
* date range
* total range

Columns:

* externalId
* customer
* status
* total
* createdAt

---

## Order Details Page

Display:

* items
* payment info
* refund state
* timeline

Readable layout is critical.

---

## Status Updates

Respect backend state machine.

If invalid transition returns 400:

👉 display backend message clearly.

Do NOT mask it.

---

## Refund Execution

Admins must be able to trigger refunds.

Warn before execution.

Refunds are irreversible operations.

---

## Deliverables

✅ orders.admin.api.ts
✅ OrdersTable
✅ OrderDetails
✅ StatusUpdateControl
✅ RefundAction

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
