import { useEffect, useMemo, useState } from 'react';
import StatsCard from '../components/StatsCard';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const { apiFetch } = useApp();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadData = async () => {
    try {
      const [usersData, productsData, ordersData] = await Promise.all([
        apiFetch('/api/users'),
        apiFetch('/api/products'),
        apiFetch('/api/orders/all'),
      ]);
      setUsers(usersData.users || []);
      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = useMemo(() => {
    const totalSellers = users.filter((user) => user.role === 'seller').length;
    const pendingApprovals = products.filter((product) => !product.approved).length;

    return {
      totalUsers: users.length,
      totalSellers,
      totalProducts: products.length,
      pendingApprovals,
      totalOrders: orders.length,
    };
  }, [users, products, orders]);

  const approveProduct = async (id) => {
    try {
      await apiFetch(`/api/products/${id}/approve`, { method: 'PATCH' });
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      await apiFetch(`/api/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await apiFetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
      setModalOpen(false);
      setSelectedUser(null);
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Admin dashboard</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Platform moderation, role control, and overall analytics.</p>
      </div>

      {message ? <div className="rounded-2xl bg-brand-50 p-4 text-sm text-brand-700">{message}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard label="Total users" value={metrics.totalUsers} />
        <StatsCard label="Total sellers" value={metrics.totalSellers} accent="from-emerald-500 to-teal-600" />
        <StatsCard label="Total products" value={metrics.totalProducts} accent="from-orange-500 to-pink-600" />
        <StatsCard label="Pending approvals" value={metrics.pendingApprovals} accent="from-amber-500 to-red-600" />
        <StatsCard label="Total orders" value={metrics.totalOrders} accent="from-violet-500 to-indigo-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">User management</h2>
          <div className="mt-4 space-y-3 text-sm">
            {users.map((user) => (
              <div key={user._id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-slate-900">
                    {user.role}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => updateUserStatus(user._id, 'active')} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Activate</button>
                  <button onClick={() => updateUserStatus(user._id, 'pending')} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Pending</button>
                  <button onClick={() => updateUserStatus(user._id, 'blocked')} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Block</button>
                  <button onClick={() => updateUserRole(user._id, 'buyer')} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Buyer</button>
                  <button onClick={() => updateUserRole(user._id, 'seller')} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Seller</button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setModalOpen(true);
                    }}
                    className="rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Pending product approvals</h2>
          <div className="mt-4 space-y-3 text-sm">
            {products
              .filter((product) => !product.approved)
              .map((product) => (
                <div key={product._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">{product.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{product.category}</div>
                  </div>
                  <button onClick={() => approveProduct(product._id)} className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                    Approve
                  </button>
                </div>
              ))}
            {!products.some((product) => !product.approved) ? (
              <p className="text-slate-500 dark:text-slate-400">No pending products.</p>
            ) : null}
          </div>
        </section>
      </div>

      <Modal
        open={modalOpen}
        title="Delete user"
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        footer={
          <>
            <button
              onClick={() => {
                setModalOpen(false);
                setSelectedUser(null);
              }}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteUser(selectedUser?._id)}
              className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Confirm delete
            </button>
          </>
        }
      >
        Are you sure you want to delete {selectedUser?.name}? This removes their products and cart.
      </Modal>
    </div>
  );
}
