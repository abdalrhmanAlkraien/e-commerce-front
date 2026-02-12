# Task 4.5 — Refund Requests

## Objective

Enable customers to request refunds safely.

Refund workflows impact:

* finance
* compliance
* customer satisfaction

Handle carefully.

---

## API

```
POST /api/v1/public/orders/{externalId}/refund-request
```

---

## UI Requirements

Accessible from:

👉 Order History
OR
👉 Order Details

---

## Refund Form

Fields:

* amount
* reason

Validate:

Amount MUST NOT exceed refundable value (use server response).

---

## UX Rules

After submission:

Show status:

```
PENDING
```

Never imply immediate refund.

---

## Deliverables

✅ refund.api.ts
✅ useRefundRequest
✅ RefundForm
✅ Status display

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