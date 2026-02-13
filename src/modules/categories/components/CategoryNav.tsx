import { Link, useSearchParams } from 'react-router-dom';
import type { CategoryDto } from '../api/categories.api';

interface CategoryNavProps {
  categories: CategoryDto[];
}

/**
 * CategoryNav — horizontal filter strip used on the storefront.
 * Decoupled from the page; works as a standalone navigation component.
 * Syncs selection with the `category` URL search param.
 */
export function CategoryNav({ categories }: CategoryNavProps) {
  const [searchParams] = useSearchParams();
  const activeSlug = searchParams.get('category');

  return (
    <nav aria-label="Product categories" className="w-full overflow-x-auto">
      <ul className="flex gap-2 pb-1" role="list">
        <li>
          <Link
            to="/products"
            className={[
              'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              !activeSlug
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
            ].join(' ')}
            aria-current={!activeSlug ? 'page' : undefined}
          >
            All
          </Link>
        </li>

        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              to={`/products?category=${cat.slug}`}
              className={[
                'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                activeSlug === cat.slug
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
              ].join(' ')}
              aria-current={activeSlug === cat.slug ? 'page' : undefined}
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
