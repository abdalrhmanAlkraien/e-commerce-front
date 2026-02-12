# Task 0.3 — Install Core Stack

## Objective

Install and configure all mandatory frontend dependencies required for a production-grade architecture.

This task establishes the engineering baseline.

---

## Required Dependencies

Install:

### Core

* react-router-dom
* @tanstack/react-query
* axios
* zustand

### Styling (choose one and remain consistent)

* tailwindcss + postcss + autoprefixer
  OR
* @mui/material + emotion

### Testing

* vitest
* @testing-library/react
* @testing-library/jest-dom
* msw
* @testing-library/user-event

### Dev Tools

* eslint
* prettier
* typescript strict
* eslint-plugin-react-hooks

---

## Required Configuration

### React Query

* Configure QueryClient
* Set default retry strategy
* Set staleTime
* Configure global error handler placeholder

### Vitest

* Configure test environment to jsdom
* Add setupTests.ts
* Integrate jest-dom
* Ensure test script exists

### MSW

* Create mock service setup structure:

```
shared/test/msw/
  handlers.ts
  server.ts
  browser.ts
```

Do NOT implement endpoint mocks yet.

---

## Package.json Scripts

Ensure scripts exist:

```
dev
build
preview
test
coverage
lint
typecheck
```

---

## Forbidden Actions

* No unused dependencies
* No incomplete configuration
* No commented code
* No default scaffold leftover code

---

## Deliverables

* All dependencies installed
* Tailwind or MUI fully configured
* React Query provider ready
* Test environment operational
* MSW setup prepared
* App compiles successfully

---

## Validation

Before completion:

* Run typecheck → no errors
* Run test → passes
* Run lint → passes
* App runs without runtime errors

Task complete only when core stack is fully operational.
