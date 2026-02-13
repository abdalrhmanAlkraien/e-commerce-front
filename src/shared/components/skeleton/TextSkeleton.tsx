import { Skeleton } from './Skeleton';

interface TextSkeletonProps {
  /** Number of lines to render. @default 1 */
  lines?: number;
  /** Width of the last line as a fraction — creates natural text appearance. @default '60%' */
  lastLineWidth?: string;
}

/**
 * Simulates a block of text content.
 * Multiple lines include a shorter last line to mimic natural paragraph endings.
 */
export function TextSkeleton({ lines = 1, lastLineWidth = '60%' }: TextSkeletonProps) {
  return (
    <div className="space-y-2" aria-label="Loading text" aria-busy="true" role="status">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
          height="1rem"
          role={undefined}
          aria-label={undefined}
          aria-busy={undefined}
        />
      ))}
    </div>
  );
}
