import { useEffect, useState } from 'react';
import { formatCurrency } from '../lib/api';
import { useApp } from '../context/AppContext';

const statusOptions = ['pending', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const { user, apiFetch, showToast } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const endpoint = user?.role === 'admin' ? '/api/orders/all' : '/api/orders/my-orders';
      const data = await apiFetch(endpoint);
      setOrders(data.orders || []);
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user?.role]);

  const updateStatus = async (orderId, status) => {
    try {
      await apiFetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await loadOrders();
      showToast(`Order marked ${status}.`, 'success');
    } catch (error) {
      setMessage(error.message);
      showToast(error.message, 'error');
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await apiFetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      await loadOrders();
      showToast('Order deleted successfully.', 'success');
    } catch (error) {
      setMessage(error.message);
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Orders</h1>
      {message ? <div className="rounded-2xl bg-brand-50 p-4 text-sm text-brand-700">{message}</div> : null}

      {loading ? (
        <div className="rounded-2xl bg-white p-6 shadow-soft dark:bg-slate-900">Loading orders...</div>
      ) : orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Order #{order._id.slice(-6)}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900 dark:text-white">{formatCurrency(order.totalPrice)}</div>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {order.products.map((item) => (
                  <div key={item._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                    <span>{item.productId?.name || 'Unavailable product'} × {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {user?.role === 'admin' ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(order._id, status)}
                      className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Mark {status}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="rounded-full border border-rose-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-700 transition hover:bg-rose-50"
                  >
                    Delete Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No orders yet</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your order history will appear here once you place an order.</p>
        </div>
      )}
    </div>
  );
}
