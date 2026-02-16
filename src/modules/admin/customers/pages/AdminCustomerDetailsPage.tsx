import { useParams, Link } from 'react-router-dom';
import { useAdminCustomerDetails } from '../../hooks/useAdminCustomers';
import { StatusBadge } from '../../components/StatusBadge';
import { EnableDisableControl } from '../components/EnableDisableControl';

export function AdminCustomerDetailsPage() {
  const { id = '' } = useParams();
  const { data: customer, isLoading } = useAdminCustomerDetails(id);

  if (isLoading) {
    return <p className="py-8 text-center text-sm text-gray-500">Loading…</p>;
  }

  if (!customer) {
    return <p className="py-8 text-center text-sm text-red-500">Customer not found.</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/customers" className="mb-1 block text-sm text-blue-600 hover:underline">
          ← Back to Customers
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{customer.email}</h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <dl className="space-y-4 text-sm">
          <div className="flex gap-3">
            <dt className="w-24 font-medium text-gray-600">ID</dt>
            <dd className="font-mono text-gray-900">{customer.id}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-24 font-medium text-gray-600">Email</dt>
            <dd className="text-gray-900">{customer.email}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-24 font-medium text-gray-600">Role</dt>
            <dd className="text-gray-900">{customer.role}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-24 font-medium text-gray-600">Status</dt>
            <dd>
              <StatusBadge status={customer.enabled ? 'ENABLED' : 'DISABLED'} />
            </dd>
          </div>
          {customer.createdAt && (
            <div className="flex gap-3">
              <dt className="w-24 font-medium text-gray-600">Joined</dt>
              <dd className="text-gray-900">{new Date(customer.createdAt).toLocaleString()}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <EnableDisableControl customerId={customer.id} enabled={customer.enabled} />
        </div>
      </div>
    </div>
  );
}
