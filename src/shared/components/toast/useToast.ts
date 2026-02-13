import { toast } from 'sonner';

/**
 * useToast — thin wrapper over sonner's toast API.
 *
 * All application code MUST use this hook instead of importing sonner directly.
 * This ensures a single integration point; swapping libraries only requires
 * changing this file.
 *
 * Configuration:
 * - success: 4 s duration, non-blocking
 * - error:   6 s duration, clear message
 * - loading: persists until manually dismissed
 */
export function useToast() {
  return {
    success: (message: string) =>
      toast.success(message, { duration: 4000 }),

    error: (message: string) =>
      toast.error(message, { duration: 6000 }),

    loading: (message: string) =>
      toast.loading(message, { duration: Infinity }),

    dismiss: (toastId?: string | number) =>
      toast.dismiss(toastId),

    promise: toast.promise,
  };
}
