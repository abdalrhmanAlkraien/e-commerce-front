# Task 3.2 — Toast System

## Objective

Create a **centralized notification system** for application-wide feedback.

Every mutation in the system will rely on this.

Avoid scattered alert logic forever.

---

## Technology

Recommended:

```
react-hot-toast
```

OR build a lightweight custom provider.

---

## Requirements

Create:

```
src/shared/components/toast/
```

Expose a simple API:

```
toast.success()
toast.error()
toast.loading()
toast.dismiss()
```

---

## Behavior Rules

### Success Toast

* Short duration
* Non-blocking

### Error Toast

* Longer duration
* Clear message

### Loading Toast

* Optional for long operations

---

## Integration Requirement

Global Error Handler MUST trigger error toasts automatically.

Developers should NOT manually toast errors in most cases.

---

## UX Rule

Toasts must NOT:

❌ stack infinitely
❌ block UI
❌ appear duplicated

---

## Deliverables

✅ Toast provider
✅ Toast hook
✅ Global mounting in App root

---