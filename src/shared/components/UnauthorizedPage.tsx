import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen"
      role="main"
      aria-labelledby="error-heading"
    >
      <h1 id="error-heading" className="text-6xl font-bold text-gray-800 mb-4">
        403
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        You don&apos;t have permission to access this page.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
      >
        Go home
      </Link>
    </main>
  );
}
