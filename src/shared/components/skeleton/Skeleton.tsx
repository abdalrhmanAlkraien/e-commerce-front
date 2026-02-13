import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the skeleton element. Accepts any valid CSS width value.
   * @default '100%'
   */
  width?: string;
  /**
   * Height of the skeleton element. Accepts any valid CSS height value.
   */
  height?: string;
  /**
   * Use 'rounded-full' for circular skeletons (avatars).
   */
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

/**
 * Base skeleton element with a subtle pulse animation.
 * All skeleton variants are built on top of this primitive.
 */
export function Skeleton({
  width = '100%',
  height,
  rounded = 'md',
  className = '',
  style,
  ...rest
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      aria-busy="true"
      className={[
        'animate-pulse bg-secondary-200',
        roundedClasses[rounded],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}
