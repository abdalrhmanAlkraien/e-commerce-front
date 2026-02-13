import type { HTMLAttributes, ReactNode } from 'react';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: ContainerSize;
  /**
   * When true, adds vertical padding to the container.
   * Use for top-level page wrappers.
   */
  padded?: boolean;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
};

export function Container({
  children,
  size = 'xl',
  padded = false,
  className = '',
  ...rest
}: ContainerProps) {
  return (
    <div
      className={[
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        padded ? 'py-8' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
