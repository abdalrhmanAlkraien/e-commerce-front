import { Skeleton } from './Skeleton';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarSkeletonProps {
  size?: AvatarSize;
  /** Show a name+subtitle line beside the avatar. @default false */
  withLabel?: boolean;
}

const sizeDimensions: Record<AvatarSize, string> = {
  sm: '2rem',    // 32px
  md: '2.5rem',  // 40px
  lg: '3rem',    // 48px
  xl: '4rem',    // 64px
};

/**
 * Circular avatar placeholder, optionally paired with a name/label area.
 */
export function AvatarSkeleton({ size = 'md', withLabel = false }: AvatarSkeletonProps) {
  const dimension = sizeDimensions[size];

  return (
    <div role="status" aria-label="Loading avatar" aria-busy="true" className="inline-flex items-center gap-3">
      <Skeleton
        width={dimension}
        height={dimension}
        rounded="full"
        role={undefined}
        aria-label={undefined}
        aria-busy={undefined}
        className="shrink-0"
      />

      {withLabel && (
        <div className="space-y-1.5">
          <Skeleton height="0.875rem" width="7rem" role={undefined} aria-label={undefined} aria-busy={undefined} />
          <Skeleton height="0.75rem" width="5rem" role={undefined} aria-label={undefined} aria-busy={undefined} />
        </div>
      )}
    </div>
  );
}
