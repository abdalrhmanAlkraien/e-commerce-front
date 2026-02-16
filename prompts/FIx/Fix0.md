📄 Data Contract Stabilization & Runtime Repair Requirement
===========================================================

**Project:** E-Commerce Frontend**Phase:** Production Repair**Owner:** Frontend Architecture**Priority:** 🔴 HIGH**Goal:** Eliminate runtime crashes and enforce backend contract alignment

1️⃣ Problem Statement
=====================

The frontend application is experiencing runtime crashes caused by:

*   TypeError: Cannot read properties of undefined

*   categories.map is not a function

*   data.items is undefined

*   Direct usage of backend pageable structure (content) inside UI


Root cause:

Frontend components are directly consuming raw backend Swagger response structures instead of using a normalized data contract.

This creates:

*   Tight coupling between UI and backend implementation

*   Runtime crashes when backend shape changes

*   Violations of clean architecture boundaries

*   Test instability


2️⃣ Objective
=============

Stabilize frontend data flow by:

*   Introducing a normalized Page contract

*   Moving Swagger structure handling to API layer

*   Eliminating .content usage in UI components

*   Adding defensive guards against undefined nested objects

*   Preserving architecture and test integrity


3️⃣ Scope of Work
=================

This repair includes:

### ✅ API Layer Normalization

*   Categories API

*   Products API

*   Any pageable endpoint


### ✅ UI Crash Fixes

*   ProductListPage

*   CategoryListPage

*   Cart components

*   Any deep nested object access


### ✅ Runtime Defensive Programming

### ✅ Test Compatibility

4️⃣ Backend Contract Reference
==============================

Swagger defines pageable responses as:

```shell
{
  "content": [],
  "totalElements": 0,
  "totalPages": 0,
  "number": 0,
  "size": 0
}

```
Frontend must NOT consume this directly.

5️⃣ Required Frontend Contract
==============================

Create shared type:

### src/shared/types/page.ts

```
export interface Page<T> {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
  size: number;
}
```
6️⃣ API Layer Refactor (MANDATORY)
==================================

Categories API
--------------

Transform:

```
content → items
totalElements → total

```
Return:

```shell
{
  items,
  total,
  totalPages,
  page,
  size
}

```
Products API
------------

Apply same normalization pattern.

7️⃣ UI Layer Rules
==================

After normalization:

UI must ONLY access:

```
data?.items
data?.total
data?.totalPages
```
❌ UI must NEVER access:

```shell
data.content
data.totalElements
```
8️⃣ Runtime Defensive Guarding
==============================

All nested property access must use optional chaining:

### Replace:

```shell
item.product.name
```
### With:

```shell
item?.product?.name ?? 'Unknown Product'
```
If nested object is missing:

*   Render fallback

*   Return null

*   Never crash


9️⃣ Global Defensive Rules
==========================

The following are mandatory:

*   No .map() without verifying array

*   No deep property access without guard

*   No direct usage of backend DTO shape in components

*   No reliance on Swagger internal naming (content)


🔟 Test Stability Requirement
=============================

After normalization:

*   Update MSW mocks to return Page shape

*   Remove any mock returning content

*   Run integration suite

*   Run auth suite

*   Verify no console errors


11️⃣ Explicit Non-Goals
=======================

This task must NOT:

*   Refactor UI design

*   Change routing structure

*   Modify React Query configuration

*   Change business logic

*   Introduce new architectural patterns


This is strictly a data-layer stabilization task.

12️⃣ Validation Checklist
=========================

The task is complete ONLY if:

*   ProductListPage renders without error

*   CategoryListPage renders without error

*   Cart renders without error

*   Pagination works

*   No TypeError in console

*   No .content usage in components

*   TypeScript passes without any

*   Tests pass

*   MSW mocks updated


13️⃣ Architecture Principle Enforced
====================================

This repair enforces:

```shell
Backend Contract
      ↓
API Normalization Layer
      ↓
Stable Frontend Contract
      ↓
UI Components

```
This is enterprise-grade frontend architecture.

14️⃣ Risk Level
===============

Without this fix:

*   Future backend changes will break UI

*   Production runtime crashes will continue

*   Pagination will remain unstable

*   Testing reliability decreases


15️⃣ Priority
=============

🔴 Execute immediately before implementing new features.