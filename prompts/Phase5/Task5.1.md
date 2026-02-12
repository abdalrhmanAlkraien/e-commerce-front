# PHASE 5 — Admin Platform (Operator Control Layer)

This phase builds the **control plane** of the commerce system.

If Phase 4 is the **revenue engine**,
Phase 5 is the **operational brain**.

Admins will rely on this system daily to:

* Manage inventory
* Control product visibility
* Monitor orders
* Handle refunds
* Manage customers

Poor admin UX creates operational friction.

Operational friction destroys scalability.

This phase MUST be built like an **internal SaaS platform**, not an afterthought.

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

# Task 5.1 — Admin Layout

## Objective

Build a scalable **operator workspace**.

Admins spend hours inside this interface — optimize for clarity and efficiency.

---

## Layout Requirements

Create a persistent layout:

```
AdminLayout
```

### Must Include:

✅ Sidebar navigation
✅ Header
✅ Content container
✅ Breadcrumb support
✅ Role-aware menu

---

## Sidebar Navigation

Include:

* Dashboard
* Categories
* Products
* Orders
* Customers

Design for future expansion.

Avoid hardcoding routes.

Use config-driven navigation.

---

## UX Rules

Admin UI should prioritize:

* readability
* fast scanning
* minimal visual noise

Avoid marketing-style design.

This is a tool — not a storefront.

---

## Deliverables

✅ AdminLayout
✅ Sidebar
✅ Header
✅ Breadcrumb component
✅ Protected routing

---

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

# Completion Criteria — Phase 5

Phase is complete ONLY when:

✅ Admin workspace functional
✅ CRUD operations stable
✅ Financial flows protected
✅ Tests passing
✅ Types safe
✅ Zero console errors

---

# Architectural Outcome

After Phase 5, your platform gains:

✅ Operator control plane
✅ Inventory authority
✅ Order governance
✅ Customer oversight
✅ Refund execution

At this point…

You are no longer building an app.

You are operating a **complete commerce platform.**

---

# Engineering Warning

Most startups underinvest in admin UX.

Then operations collapse under scale.

Build tools operators enjoy using.

Good admin UX is a competitive advantage.

---

# Strategic Next Phase

After Admin…

👉 **PHASE 6 — Production Hardening**

Where elite engineering begins:

* Observability
* Audit logs
* Feature flags
* Rate limiting
* Error telemetry
* Performance budgets

This is the phase that separates:

👉 “working software”
from
👉 **production-grade platforms.**
