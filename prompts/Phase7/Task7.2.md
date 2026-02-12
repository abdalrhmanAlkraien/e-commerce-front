# Task 7.2 — Accessibility

## Objective

Ensure the platform is usable by **all users**, including those relying on assistive technologies.

Accessibility is not charity.

It is professional engineering.

Many regions legally require it.

---

## Minimum Compliance Target

👉 **WCAG 2.1 AA**

Do not aim lower.

---

## Core Requirements

### Semantic HTML

Use:

* `<button>` not div-clicks
* `<nav>`
* `<main>`
* `<section>`

Stop accessibility issues at the source.

---

### Keyboard Navigation

Users MUST be able to:

✅ tab through UI
✅ activate controls
✅ escape modals

No keyboard traps allowed.

---

### Focus Management

After:

* modal open
* route change
* error

Focus must move intentionally.

Never strand keyboard users.

---

### ARIA Usage

Use ARIA only when semantic HTML is insufficient.

Avoid over-ARIA.

---

## Color Contrast

Text MUST meet contrast ratios.

Never rely on color alone to convey meaning.

Example:

❌ red text only
✅ icon + label + color

---

## Testing Tools

Use:

👉 axe DevTools
👉 Lighthouse Accessibility

Fix violations immediately.

---

## Deliverables

✅ Accessible components
✅ Focus management
✅ Keyboard-safe navigation
✅ Contrast validation
✅ Axe audit

Accessibility should feel **native**, not patched.

---
# Completion Criteria — Phase 7

Phase is complete ONLY when:

✅ Lighthouse performance improved
✅ Accessibility violations resolved
✅ Metadata present
✅ Logs structured
✅ No console spam

AND:

✅ Zero TypeScript errors
✅ Lint passes
✅ Tests unaffected

---