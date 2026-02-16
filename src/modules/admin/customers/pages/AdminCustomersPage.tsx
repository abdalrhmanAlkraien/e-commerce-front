import { useAdminListCustomers } from '../../hooks/useAdminCustomers';
import { CustomersTable } from '../components/CustomersTable';

export function AdminCustomersPage() {
  const { data, isLoading } = useAdminListCustomers();
  const customers = data?.items ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Customers</h1>
      {isLoading ? (
        <p className="py-8 text-center text-sm text-gray-500">Loading…</p>
      ) : (
        <CustomersTable customers={customers} />
      )}
    </div>
  );
}
