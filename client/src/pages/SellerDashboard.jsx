import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../lib/api';
import { FALLBACK_IMAGE_URL, resolveImageUrl } from '../config';

export default function SellerDashboard() {
  const { apiFetch, user } = useApp();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        apiFetch('/api/products?mine=true'),
        apiFetch('/api/orders/my-orders'),
      ]);
      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + (product.stock || 0), 0),
    [products]
  );

  const pendingProducts = useMemo(() => products.filter((product) => !product.approved), [products]);
  const activeProducts = useMemo(() => products.filter((product) => product.approved), [products]);

  const totalSales = useMemo(() => {
    return orders.reduce((sum, order) => {
      const orderAmount = (order.products || []).reduce((itemTotal, item) => {
        const ownerId = item.productId?.sellerId;
        const sellerId = typeof ownerId === 'object' ? ownerId?._id : ownerId;
        if (String(sellerId) === String(user?.id)) {
          return itemTotal + item.price * item.quantity;
        }
        return itemTotal;
      }, 0);

      return sum + orderAmount;
    }, 0);
  }, [orders, user?.id]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 px-6 py-8 text-white shadow-soft sm:px-8">
        <div className="absolute -left-10 top-0 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Seller workspace</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Catalog, orders, and revenue in one place.</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              Manage inventory like a real operations console, review approvals, and keep product velocity visible at a glance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/seller/products/new" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50">
              Add product
            </Link>
            <Link to="/products" className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
              View storefront
            </Link>
          </div>
        </div>
      </section>

      {error ? <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total products" value={products.length} hint="Active and draft items" />
        <StatsCard label="Pending review" value={pendingProducts.length} hint="Awaiting approval" accent="from-amber-500 to-orange-500" />
        <StatsCard label="Stock units" value={totalStock} hint="All listed inventory" accent="from-emerald-500 to-teal-600" />
        <StatsCard label="Total sales" value={formatCurrency(totalSales)} hint="Revenue from your products" accent="from-orange-500 to-pink-600" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Inventory overview</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Approved products, stock levels, and editing shortcuts.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {activeProducts.length} live
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {products.length ? (
              products.map((product) => (
                <div key={product._id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{product.name}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {product.category} • Stock {product.stock} • {formatCurrency(product.price)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {product.approved ? 'Approved' : 'Pending'}
                      </span>
                      <Link to={`/seller/products/${product._id}/edit`} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No products yet</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Use the demo catalog below as a reference, then create your own listings.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Order performance</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Recent order activity and seller impact.</p>
            <div className="mt-4 space-y-3">
              {orders.length ? (
                orders.slice(0, 4).map((order) => (
                  <div key={order._id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-slate-900 dark:text-white">Order #{order._id.slice(-6)}</div>
                      <span className="capitalize text-slate-500 dark:text-slate-400">{order.status}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {order.products?.length || 0} item{(order.products?.length || 0) === 1 ? '' : 's'} • {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No order data yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Product snapshots</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A compact preview of your product cards with image, price, stock, and status.</p>
            <div className="mt-4 space-y-4">
              {products.length ? (
                products.slice(0, 3).map((product) => (
                  <div key={product._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="grid gap-0 sm:grid-cols-[120px_1fr]">
                      <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 sm:aspect-auto sm:h-full">
                        <img
                          src={resolveImageUrl(product.image)}
                          alt={product.name}
                          onError={(event) => {
                            event.currentTarget.src = FALLBACK_IMAGE_URL;
                          }}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{product.name}</h3>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-brand-600">{product.category}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {product.approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{product.description}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{formatCurrency(product.price)}</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">Stock {product.stock}</span>
                          <Link to={`/seller/products/${product._id}/edit`} className="rounded-full bg-brand-600 px-3 py-1 font-semibold text-white">
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No products yet</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Create your first product to see the image, price, stock, and approval status here.
                  </p>
                  <Link to="/seller/products/new" className="mt-5 inline-flex rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
                    Add product
                  </Link>
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
