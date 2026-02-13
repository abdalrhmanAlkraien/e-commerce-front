import { useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string;
  label?: string;
  error?: string;
  helperText?: string;
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
}

export function Input({
  id,
  label,
  error,
  helperText,
  type = 'text',
  leftAdornment,
  rightAdornment,
  className = '',
  disabled,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-secondary-700"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftAdornment && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 text-secondary-400"
          >
            {leftAdornment}
          </span>
        )}

        <input
          id={id}
          type={resolvedType}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
            'w-full rounded-md border bg-white px-3 py-2 text-sm',
            'text-secondary-900 placeholder:text-secondary-400',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
              : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500',
            disabled ? 'cursor-not-allowed bg-secondary-50 opacity-60' : '',
            leftAdornment ? 'pl-9' : '',
            isPassword || rightAdornment ? 'pr-10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 text-secondary-400 hover:text-secondary-600 focus:outline-none"
          >
            {showPassword ? (
              // Eye-off icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              // Eye icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}

        {!isPassword && rightAdornment && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 text-secondary-400"
          >
            {rightAdornment}
          </span>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-error-600">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="mt-1 text-xs text-secondary-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
