# Task 0.1 — Generate Folder Architecture

## Objective

Establish a scalable, production-grade frontend folder structure aligned with modular architecture rules defined in GeneralInstruction.md.

This task creates the architectural foundation of the entire React application.

No business logic is implemented in this task.

---

## Functional Requirements

* Create full folder hierarchy
* Ensure clear separation of concerns
* Support both Admin and Customer domains
* Prepare structure for testing and scalability

---

## Technical Requirements

* React 18+
* TypeScript strict mode
* Vite-based project
* Modular architecture

---

## Required Folder Structure

Create the following structure:

```
src/
  modules/
    auth/
      components/
      hooks/
      pages/
      api/
      types/
      __tests__/

    products/
      components/
      hooks/
      pages/
      api/
      types/
      __tests__/

    categories/
      components/
      hooks/
      pages/
      api/
      types/
      __tests__/

    cart/
      components/
      hooks/
      pages/
      api/
      types/
      __tests__/

    checkout/
      components/
      hooks/
      pages/
      api/
      types/
      __tests__/

    orders/
      components/
      hooks/
      pages/
      api/
      types/
      __tests__/

    customers/
      components/
      hooks/
      pages/
      api/
      types/
      __tests__/

    admin/
      components/
      hooks/
      pages/
      api/
      types/
      __tests__/

  shared/
    api/
    components/
    hooks/
    utils/
    types/
    test/
    constants/

  layouts/
  routes/
  providers/

  assets/
  styles/
```

---

## Architectural Rules

* No files outside defined boundaries
* No mixing domain logic into shared
* No placeholder business code
* Empty index.ts files allowed for module exports
* No TODO comments

---

## Deliverables

* Full folder tree
* No runtime errors
* Project compiles successfully
* ESLint passes

---

## Validation

Before completion:

* Ensure folder structure matches exactly
* Ensure TypeScript compiles
* Ensure no unused imports exist

Task complete only when structure is clean and compilable.
