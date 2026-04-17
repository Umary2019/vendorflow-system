import { useEffect, useMemo, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../lib/api';

export default function BuyerDashboard() {
  const { apiFetch, user } = useApp();
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, cartData] = await Promise.all([
          apiFetch('/api/orders/my-orders'),
          apiFetch('/api/cart'),
        ]);
        setOrders(ordersData.orders || []);
        setCart(cartData.cart || { items: [] });
      } catch {
        setOrders([]);
        setCart({ items: [] });
      }
    };

    loadData();
  }, []);

  const cartTotal = useMemo(
    () =>
      (cart.items || []).reduce(
        (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
        0
      ),
    [cart.items]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Buyer dashboard</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Welcome back, {user?.name}. Here is your marketplace activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Recent orders" value={orders.length} hint="Track your latest purchases" />
        <StatsCard label="Cart items" value={cart.items?.length || 0} hint="Ready for checkout" accent="from-emerald-500 to-teal-600" />
        <StatsCard label="Cart value" value={formatCurrency(cartTotal)} hint="Current subtotal" accent="from-orange-500 to-pink-600" />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent orders</h2>
        <div className="mt-4 space-y-3 text-sm">
          {orders.slice(0, 5).map((order) => (
            <div key={order._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <span className="text-slate-700 dark:text-slate-200">Order #{order._id.slice(-6)}</span>
              <span className="capitalize text-slate-500 dark:text-slate-400">{order.status}</span>
            </div>
          ))}
          {!orders.length ? <p className="text-slate-500 dark:text-slate-400">No orders yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
