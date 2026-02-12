# Task 3.4 — Loading Skeletons

## Objective

Eliminate layout shifts and spinner fatigue.

Skeletons create the perception of speed.

This is a **high-quality SaaS pattern**.

---

## Rules

DO NOT use spinners for page loads.

Prefer skeleton placeholders.

---

## Folder

```
src/shared/components/skeleton/
```

---

## Required Skeletons (FIRST WAVE)

### Text Skeleton

### Card Skeleton

### Table Row Skeleton

### Avatar Skeleton

Reusable and composable.

---

## Integration

React Query loading states MUST trigger skeletons.

Example:

```
if (isLoading) return <ProductCardSkeleton />
```

---

## UX Requirements

Skeleton MUST:

✅ match final layout
✅ avoid jumpiness
✅ animate subtly

Avoid aggressive shimmer effects.

---

## Forbidden

❌ giant spinners
❌ blank pages
❌ layout popping

---

## Deliverables

✅ Skeleton components
✅ Integration examples
✅ Export barrel

---