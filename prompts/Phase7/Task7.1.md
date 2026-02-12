# PHASE 7 — Production Intelligence Layer

*(Performance • Accessibility • Discoverability • Observability)*

After Phase 6, your platform is **stable and test-protected**.

Now we optimize for what elite platforms optimize for:

👉 Speed
👉 Inclusivity
👉 Discoverability
👉 Operational awareness

This phase is where your system stops being “just functional” and starts behaving like a **high-quality production SaaS / commerce platform**.

---

# Global Engineering Law

⚠️ These tasks are **cross-cutting architecture tasks**.

They are NOT module-specific.

They impact the entire application.

Avoid quick fixes.

Design systemic solutions.

---

# Task 7.1 — Performance

## Objective

Guarantee that the application remains fast under real user conditions.

Slow commerce sites destroy conversion rates.

Milliseconds directly impact revenue.

---

## Performance Targets (MANDATORY)

Aim for:

```
LCP < 2.5s  
TTI < 3s  
CLS < 0.1
```

Treat these as engineering constraints — not suggestions.

---

## Bundle Optimization

### Enable Route-Based Code Splitting

Use dynamic imports:

```
const ProductsPage = lazy(() => import(...))
```

Wrap with Suspense + skeleton fallback.

Never ship the entire app in one bundle.

---

### Vendor Chunking

Ensure large dependencies are separated:

* React
* Router
* UI library

Avoid mega bundles.

---

## React Query Optimization

Use intelligent caching:

### Recommended Defaults:

```
staleTime: 5 minutes  
gcTime: 30 minutes  
retry: 1
```

Prevent refetch storms.

---

## Prefetch Critical Data

Prefetch on:

* product hover
* category hover

This dramatically improves perceived performance.

---

## Image Optimization

MANDATORY rules:

✅ Lazy load images
✅ Provide width/height
✅ Use modern formats (WebP/AVIF when possible)

Never allow layout shift from images.

---

## Avoid Re-render Cascades

Audit:

* memo usage
* dependency arrays
* large context trees

Prefer smaller component boundaries.

---

## Deliverables

✅ Route-based splitting
✅ Query tuning
✅ Image optimization
✅ Suspense fallbacks
✅ Prefetch strategy

Run Lighthouse before and after.

Improvement must be measurable.

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
