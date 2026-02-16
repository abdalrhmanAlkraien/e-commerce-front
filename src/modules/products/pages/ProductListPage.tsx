import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { useCategories } from '@/modules/categories/hooks/useCategories';
import { CategoryNav } from '@/modules/categories/components/CategoryNav';
import { Container, Input, Button } from '@/shared/design-system';
import { CardSkeleton } from '@/shared/components/skeleton';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { useState, useCallback } from 'react';

const PAGE_SIZE = 12;

function ProductListContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

  const categorySlug = searchParams.get('category') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const page = Number(searchParams.get('page') ?? '0');

  const { data, isLoading, isError, error } = useProducts({
    categorySlug,
    search,
    page,
    pageSize: PAGE_SIZE,
  });

  const { data: categories } = useCategories();

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        next.delete('page'); // reset pagination on filter change
        return next;
      });
    },
    [setSearchParams],
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateParam('search', searchInput || undefined);
    },
    [searchInput, updateParam],
  );

  if (isError) throw error;

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <div>
      {/* Category navigation */}
      {categories && categories.length > 0 && (
        <div className="mb-6">
          <CategoryNav categories={categories} />
        </div>
      )}

      {/* Search + filter bar */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end"
        aria-label="Product filters"
      >
        <div className="flex-1">
          <Input
            id="product-search"
            label="Search products"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary">
          Search
        </Button>
        {(search || categorySlug) && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSearchInput('');
              setSearchParams({});
            }}
          >
            Clear filters
          </Button>
        )}
      </form>

      {/* Product grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-secondary-500">No products found.</p>
          <Button
            className="mt-4"
            variant="ghost"
            onClick={() => {
              setSearchInput('');
              setSearchParams({});
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateParam('page', String(page - 1))}
                aria-label="Previous page"
              >
                Previous
              </Button>
              <span className="text-sm text-secondary-600" aria-live="polite">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => updateParam('page', String(page + 1))}
                aria-label="Next page"
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export function ProductListPage() {
  return (
    <Container padded>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Products</h1>
      </header>

      <ErrorBoundary>
        <ProductListContent />
      </ErrorBoundary>
    </Container>
  );
}
