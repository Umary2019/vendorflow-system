import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import StatsCard from '../components/StatsCard';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../lib/api';
import { demoProducts } from '../data/demoContent';

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

  const recentOrders = orders.slice(0, 5);
  const suggestedProducts = demoProducts.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 px-6 py-8 text-white shadow-soft sm:px-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">Buyer workspace</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Welcome back, {user?.name || 'Buyer'}.</h1>
            <p className="mt-3 max-w-xl text-sm text-cyan-50/90 sm:text-base">
              Track your purchases, review cart value, and jump into recommended products without digging through empty screens.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/products" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50">
              Browse products
            </Link>
            <Link to="/cart" className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
              View cart
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Orders placed" value={orders.length} hint="All tracked orders" />
        <StatsCard label="Cart items" value={cart.items?.length || 0} hint="Items waiting to checkout" accent="from-emerald-500 to-teal-600" />
        <StatsCard label="Cart value" value={formatCurrency(cartTotal)} hint="Current subtotal" accent="from-orange-500 to-pink-600" />
        <StatsCard label="Recommended" value={suggestedProducts.length} hint="Demo picks to explore" accent="from-cyan-500 to-blue-600" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent orders</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your last five purchases with status and totals.</p>
            </div>
            <Link to="/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentOrders.length ? (
              recentOrders.map((order) => (
                <div key={order._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Order #{order._id.slice(-6)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {order.products?.length || 0} item{(order.products?.length || 0) === 1 ? '' : 's'} • {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="capitalize text-sm font-semibold text-slate-700 dark:text-slate-200">{order.status}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{formatCurrency(order.totalAmount)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No orders yet</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Start by browsing the catalog and add a product to your cart.
                </p>
                <Link to="/products" className="mt-5 inline-flex rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
                  Discover products
                </Link>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Cart snapshot</h2>
            <div className="mt-4 space-y-3">
              {(cart.items || []).length ? (
                cart.items.slice(0, 4).map((item) => (
                  <div key={item.productId?._id || item._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{item.productId?.name || 'Product'}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Qty {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-slate-700 dark:text-slate-200">
                      {formatCurrency((item.productId?.price || 0) * item.quantity)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Your cart is empty right now.</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recommended for you</h2>
            <div className="mt-4 grid gap-4">
              {suggestedProducts.map((product) => (
                <ProductCard key={product._id} product={product} badge="Demo" />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
