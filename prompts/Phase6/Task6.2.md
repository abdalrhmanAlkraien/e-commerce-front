# Task 6.2 — Integration Suite

## Objective

Validate **real user flows** across multiple components.

Unit tests verify functions.

Integration tests verify **systems**.

Commerce platforms fail in the seams between components.

This suite protects those seams.

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