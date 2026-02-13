import { Skeleton } from './Skeleton';

interface CardSkeletonProps {
  /** Show an image/banner area at the top. @default true */
  withImage?: boolean;
  /** Number of text lines in the body. @default 3 */
  lines?: number;
}

/**
 * Mirrors the Card component layout:
 * [image] + [title] + [body text lines] + [action area]
 */
export function CardSkeleton({ withImage = true, lines = 3 }: CardSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading card"
      aria-busy="true"
      className="overflow-hidden rounded-lg border border-secondary-200 bg-white shadow-sm"
    >
      {withImage && <Skeleton width="100%" height="12rem" rounded="sm" role={undefined} aria-label={undefined} aria-busy={undefined} />}

      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton height="1.25rem" width="70%" role={undefined} aria-label={undefined} aria-busy={undefined} />

        {/* Body lines */}
        <div className="space-y-2">
          {Array.from({ length: lines }, (_, i) => (
            <Skeleton
              key={i}
              height="1rem"
              width={i === lines - 1 ? '55%' : '100%'}
              role={undefined}
              aria-label={undefined}
              aria-busy={undefined}
            />
          ))}
        </div>

        {/* Action area */}
        <div className="flex items-center justify-between pt-1">
          <Skeleton height="1rem" width="30%" role={undefined} aria-label={undefined} aria-busy={undefined} />
          <Skeleton height="2rem" width="5rem" role={undefined} aria-label={undefined} aria-busy={undefined} />
        </div>
      </div>
    </div>
  );
}
