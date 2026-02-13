import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-gray-200 bg-gray-900 p-4">
        <div className="mb-6">
          <span className="text-lg font-semibold text-white">Admin Panel</span>
        </div>
        <nav aria-label="Admin navigation">
          <ul className="space-y-1" />
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <nav aria-label="Admin top navigation" />
        </header>
        <main className="flex-1 bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
