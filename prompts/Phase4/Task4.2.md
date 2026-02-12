# Task 4.2 — Products Module

## Objective

Build the **primary revenue surface** of the application.

Products must load fast, filter smoothly, and display reliably.

Performance directly impacts conversion.

---

## APIs

```
GET /api/v1/public/products
GET /api/v1/public/products/{slug}
```

---

## Required Pages

### Product Listing

Route:

```
/products
```

Capabilities:

✅ pagination
✅ filters (price, category, search query)
✅ skeleton loaders
✅ zero layout shift

---

### Product Details

Route:

```
/products/:slug
```

Must include:

* image
* price
* description
* stock state
* add-to-cart CTA

---

## Performance Rule (VERY IMPORTANT)

Use **prefetching** when hovering product cards.

React Query supports this.

It dramatically improves perceived speed.

---

## Error Handling

If slug not found:

👉 show proper 404 page
NOT a blank screen.

---

## Deliverables

✅ products.api.ts
✅ useProducts
✅ useProductDetails
✅ ProductCard
✅ ProductList page
✅ ProductDetails page

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