# PHASE 6 — Testing Infrastructure & Reliability Layer

This phase establishes the **confidence engine** of the platform.

After Phase 5, your application is functionally a **real commerce SaaS**.

Now the risk shifts from:

👉 *“Can it work?”*
to
👉 *“Will it break in production?”*

Testing infrastructure is what separates:

🚨 fragile startups
from
✅ elite engineering organizations

This phase is NOT optional.

Without it, every deployment is a gamble.

---

# Global Testing Laws (CRITICAL)

## Zero Real Network Calls

Tests MUST NEVER hit:

* localhost
* dev
* staging
* production

ALL network activity MUST be mocked via MSW.

Failure to enforce this creates:

* flaky CI
* slow pipelines
* unreliable tests

Unacceptable for production engineering.

---

## Testing Stack (MANDATORY)

You MUST use:

* **Vitest**
* **React Testing Library**
* **MSW**
* **@testing-library/user-event**

Forbidden:

❌ Enzyme
❌ Cypress for integration layer
❌ Real APIs

---

# Task 6.1 — MSW Setup

## Objective

Create a **network virtualization layer** that simulates backend behavior.

MSW ensures your frontend behaves correctly under:

* success responses
* validation failures
* server errors
* latency
* edge cases

Without MSW, your tests are blind.

---

## Installation

Required packages:

```
msw
@mswjs/data (optional but recommended)
```

---

## Folder Structure

Create:

```
src/test/msw/
```

Structure:

```
msw/
 ├── handlers/
 ├── server.ts
 ├── browser.ts
 ├── test-utils.tsx
 └── fixtures/
```

---

## Handlers Strategy

Organize handlers by domain:

```
handlers/
  auth.handlers.ts
  products.handlers.ts
  cart.handlers.ts
  orders.handlers.ts
  admin.handlers.ts
```

Never place all handlers in one file.

Scalability matters.

---

## Mock Data Rule

Mock data MUST resemble real API schemas.

Use DTO types from:

```
src/shared/types/api.ts
```

Never invent shapes.

Type safety must remain intact even in mocks.

---

## Server Setup (Vitest)

Configure lifecycle:

* start before tests
* reset after each
* close after suite

Prevent handler leakage between tests.

---

## Test Utilities

Create a custom render:

```
renderWithProviders()
```

Wrap with:

* React Query Provider
* Router
* Auth Provider
* Toast Provider

Avoid repetitive boilerplate.

---

## Deliverables

✅ MSW installed
✅ Mock server configured
✅ Domain handlers created
✅ Typed fixtures
✅ renderWithProviders utility

MSW must run automatically during tests.

No manual startup allowed.

---



# Required Test Domains (MANDATORY)

---

## Authentication Flow

### Test Cases:

✅ login success
→ token stored
→ redirected

✅ login failure
→ error toast
→ no auth state

✅ protected route blocked

---

## Product Discovery Flow

Simulate:

User → product list → product details

Verify:

* loading skeleton
* data render
* navigation

---

## Cart Flow (VERY HIGH PRIORITY)

This is revenue-critical.

### Test:

User journey:

1. browse product
2. add to cart
3. update quantity
4. remove item

Verify totals update correctly.

---

## Checkout Flow

Simulate:

cart → checkout → order confirmation

Test:

✅ success path
✅ validation error
✅ server failure

No silent failures allowed.

---

## Admin Critical Paths

Test ONLY high-risk actions:

✅ create product
✅ update stock
✅ change order status

Avoid over-testing trivial UI.

Focus on operational risk.

---

# Testing Quality Rules

Every integration test MUST assert:

✅ loading state
✅ success state
✅ failure state

Skipping failure tests is forbidden.

Production fails in failure paths.

---

# Performance Rule

Tests MUST remain fast.

Target:

```
< 2 seconds per test file
```

If slow:

* reduce DOM complexity
* mock heavy components

Speed is a feature.

---

# Coverage Requirement (NON-NEGOTIABLE)

```
GLOBAL MINIMUM: 80%
CRITICAL FLOWS: 90%+
```

Critical flows include:

* auth
* cart
* checkout

Below threshold = pipeline failure.

---

# Deliverables

✅ Integration test suite
✅ MSW-powered flows
✅ Typed mocks
✅ Provider-based render
✅ Coverage reporting

---

# Completion Criteria — Phase 6

Phase is complete ONLY when:

✅ MSW operational
✅ Integration flows covered
✅ No real network calls
✅ Coverage ≥ 80%
✅ Tests stable
✅ Zero flaky tests

---