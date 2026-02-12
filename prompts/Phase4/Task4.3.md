# Task 4.3 — Cart System (HIGH RISK AREA)

## Objective

Implement a **fault-tolerant cart system**.

Cart failures directly cause revenue loss.

This is one of the most sensitive systems in e-commerce.

---

## APIs

```
POST   /api/v1/public/cart
GET    /api/v1/public/cart/{cartId}
POST   /items
PUT    /items/{itemId}
DELETE /items/{itemId}
```

Header requirement:

```
X-SESSION-ID
```

This MUST be preserved.

---

## Architecture Decision (MANDATORY)

Cart state MUST be server-driven.

DO NOT build a local-only cart.

Backend is the source of truth.

---

## Anonymous Cart Strategy

When cart is created:

Store:

* cartId
* sessionId

Use:

👉 memory first
👉 localStorage ONLY as recovery

Never rely purely on localStorage.

---

## Required Capabilities

### Add to Cart

Optimistic updates allowed — BUT must rollback on failure.

---

### Update Quantity

Must validate stock response.

---

### Remove Item

Instant UI update.

---

### Cart Drawer / Page

Accessible from all storefront pages.

---

## React Query Rule

Invalidate cart queries after mutations.

Prevent stale cart totals.

---

## Failure Scenarios (MUST HANDLE)

* insufficient stock
* cart locked
* item unavailable
* session expired

Never fail silently.

Show toast.

---

## Deliverables

✅ cart.api.ts
✅ useCart
✅ useAddToCart
✅ useUpdateCartItem
✅ useRemoveCartItem
✅ Cart UI (drawer or page)

---
# Testing Requirement (MANDATORY FOR ALL TASKS)

Use:

* MSW
* Vitest
* React Testing Library

---

## Critical Flows To Test

### Products

✅ load
✅ filter
✅ error

### Cart

✅ add
✅ update
✅ remove
✅ rollback

### Checkout

✅ success
✅ failure

### Refund

✅ valid request
✅ validation error

---

## Coverage Requirement

```
MINIMUM: 80%
```

Lower = failure.

---