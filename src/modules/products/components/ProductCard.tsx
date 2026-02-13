import { Link } from 'react-router-dom';
import { usePrefetchProduct } from '../hooks/useProducts';
import { Button } from '@/shared/design-system';
import type { ProductDto } from '../api/products.api';

interface ProductCardProps {
  product: ProductDto;
  onAddToCart?: (product: ProductDto) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const prefetch = usePrefetchProduct();
  const outOfStock = product.stock === 0;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-lg border border-secondary-200 bg-white shadow-sm transition hover:shadow-md"
      aria-label={product.name}
    >
      <Link
        to={`/products/${product.slug}`}
        tabIndex={-1}
        onMouseEnter={() => prefetch(product)}
        onFocus={() => prefetch(product)}
        aria-hidden="true"
      >
        <div className="aspect-[4/3] overflow-hidden bg-secondary-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-secondary-400">
              <svg
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">
          {product.category.name}
        </p>

        <Link
          to={`/products/${product.slug}`}
          onMouseEnter={() => prefetch(product)}
          onFocus={() => prefetch(product)}
          className="mt-1 line-clamp-2 text-sm font-semibold text-secondary-800 hover:text-primary-600 focus:outline-none focus-visible:underline"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-base font-bold text-secondary-900">
            ${product.price.toFixed(2)}
          </span>

          {outOfStock ? (
            <span className="text-xs font-medium text-error-600">Out of stock</span>
          ) : (
            onAddToCart && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onAddToCart(product)}
                aria-label={`Add ${product.name} to cart`}
              >
                Add to cart
              </Button>
            )
          )}
        </div>
      </div>
    </article>
  );
}
