import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductDetails } from '../hooks/useProducts';
import { Container, Button } from '@/shared/design-system';
import { TextSkeleton, CardSkeleton } from '@/shared/components/skeleton';
import { isApiError } from '@/shared/api/apiError';
import { useAddToCart } from '@/modules/cart/hooks/useCart';
import { useCartStore } from '@/modules/cart/store/cartStore';

function ProductDetailContent({ slug }: { slug: string }) {
  const { data: product, isLoading, isError, error } = useProductDetails(slug);
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const openDrawer = useCartStore((s) => s.openDrawer);

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <CardSkeleton withImage lines={1} />
        <div className="space-y-4">
          <TextSkeleton lines={2} />
          <TextSkeleton lines={4} />
          <TextSkeleton lines={1} lastLineWidth="40%" />
        </div>
      </div>
    );
  }

  if (isError) {
    const status = isApiError(error) ? error.status : 0;
    if (status === 404) {
      return (
        <div className="py-20 text-center" role="alert">
          <h2 className="text-2xl font-semibold text-secondary-700">Product not found</h2>
          <p className="mt-2 text-secondary-500">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button className="mt-6" onClick={() => navigate('/products')}>
            Back to products
          </Button>
        </div>
      );
    }
    throw error;
  }

  if (!product) return null;

  const outOfStock = product.stock === 0;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-secondary-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-secondary-300">
            <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <Link
          to={`/products?category=${product.category.slug}`}
          className="text-sm font-medium uppercase tracking-wide text-primary-600 hover:text-primary-700"
        >
          {product.category.name}
        </Link>

        <h1 className="mt-2 text-3xl font-bold text-secondary-900">{product.name}</h1>

        <p className="mt-4 text-3xl font-bold text-secondary-900">
          ${product.price.toFixed(2)}
        </p>

        <p className="mt-4 leading-relaxed text-secondary-600">{product.description}</p>

        <div className="mt-4">
          {outOfStock ? (
            <p className="text-sm font-semibold text-error-600" role="status">
              Out of stock
            </p>
          ) : (
            <p className="text-sm text-success-600" role="status">
              In stock ({product.stock} available)
            </p>
          )}
        </div>

        <div className="mt-6">
          <Button
            variant="primary"
            size="lg"
            disabled={outOfStock || addToCart.isPending}
            loading={addToCart.isPending}
            className="w-full sm:w-auto"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => {
              addToCart.mutate(
                { productId: product.id, quantity: 1 },
                { onSuccess: () => openDrawer() },
              );
            }}
          >
            {outOfStock ? 'Out of stock' : addToCart.isPending ? 'Adding\u2026' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <Container padded>
        <p className="text-secondary-500">Invalid product URL.</p>
      </Container>
    );
  }

  return (
    <Container padded>
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-secondary-500">
          <li>
            <Link to="/products" className="hover:text-primary-600">
              Products
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-secondary-800 font-medium" aria-current="page">
            {slug}
          </li>
        </ol>
      </nav>

      <ProductDetailContent slug={slug} />
    </Container>
  );
}
