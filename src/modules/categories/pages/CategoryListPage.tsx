import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { Container } from '@/shared/design-system';
import { CardSkeleton } from '@/shared/components/skeleton';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

function CategoryGrid() {
  const { data: categories, isLoading, isError, error } = useCategories();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <CardSkeleton key={i} withImage={false} lines={2} />
        ))}
      </div>
    );
  }

  if (isError) {
    throw error;
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-secondary-500">No categories available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/products?category=${category.slug}`}
          className="group block rounded-lg border border-secondary-200 bg-white p-6 shadow-sm transition hover:border-primary-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label={`Browse ${category.name} products`}
        >
          <h2 className="text-lg font-semibold text-secondary-800 group-hover:text-primary-600">
            {category.name}
          </h2>
          <p className="mt-1 text-sm text-secondary-500">Browse {category.name}</p>
        </Link>
      ))}
    </div>
  );
}

export function CategoryListPage() {
  return (
    <Container padded>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Categories</h1>
        <p className="mt-2 text-secondary-500">Browse products by category</p>
      </header>

      <ErrorBoundary>
        <CategoryGrid />
      </ErrorBoundary>
    </Container>
  );
}
