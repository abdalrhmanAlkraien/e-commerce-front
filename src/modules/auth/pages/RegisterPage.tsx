import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { registerSchema, type RegisterFormValues } from '../utils/authSchemas';

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const { mutate: registerUser, isPending, error } = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {error && (
          <div role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
            {error.message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p id="firstName-error" role="alert" className="text-xs text-red-600 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p id="lastName-error" role="alert" className="text-xs text-red-600 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-xs text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" role="alert" className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
