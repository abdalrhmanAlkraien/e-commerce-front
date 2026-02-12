# Task 4.4 — Checkout

## Objective

Transform cart into a validated order.

Checkout is a **conversion-critical flow**.

Friction here kills revenue.

---

## API

```
POST /api/v1/checkout/create-order
```

---

## Checkout Form

Collect:

* name
* email
* phone

Use Zod validation.

---

## UX Rules

NEVER allow double submission.

Disable button during mutation.

---

## Success Behavior

After order creation:

👉 redirect to confirmation page

Example:

```
/order-confirmation/:externalId
```

---

## Failure Handling

Display server validation messages clearly.

Avoid generic “Something went wrong”.

---

## Deliverables

✅ checkout.api.ts
✅ useCheckout
✅ CheckoutPage
✅ ConfirmationPage

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