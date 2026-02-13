import { Skeleton } from './Skeleton';

interface TableRowSkeletonProps {
  /** Number of columns to render. @default 4 */
  columns?: number;
  /** Number of rows to render. @default 5 */
  rows?: number;
}

/**
 * Simulates a table body.
 * Renders rows × columns skeleton cells with natural width variation.
 */
export function TableRowSkeleton({ columns = 4, rows = 5 }: TableRowSkeletonProps) {
  // Pre-compute widths so rows differ slightly — looks more natural
  const widths = ['80%', '65%', '90%', '75%', '85%'];

  return (
    <div role="status" aria-label="Loading table" aria-busy="true" className="w-full">
      {Array.from({ length: rows }, (_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-4 border-b border-secondary-100 px-4 py-3"
        >
          {Array.from({ length: columns }, (_, colIdx) => (
            <Skeleton
              key={colIdx}
              height="1rem"
              width={widths[(rowIdx + colIdx) % widths.length]}
              className="flex-1"
              role={undefined}
              aria-label={undefined}
              aria-busy={undefined}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
