import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../lib/api';

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Seller dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage your catalog, performance, and sales.</p>
        </div>
        <Link to="/seller/products/new" className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
          Add product
        </Link>
      </div>

      {error ? <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Total products" value={products.length} hint="Active and pending approvals" />
        <StatsCard label="Sales orders" value={orders.length} hint="Orders containing your products" accent="from-emerald-500 to-teal-600" />
        <StatsCard label="Total sales" value={formatCurrency(totalSales)} hint="Revenue from your products" accent="from-orange-500 to-pink-600" />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your products</h2>
        <div className="mt-4 space-y-3 text-sm">
          {products.map((product) => (
            <div key={product._id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <div>
                <div className="font-medium text-slate-900 dark:text-white">{product.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Stock: {product.stock}</div>
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
          ))}
          {!products.length ? <p className="text-slate-500 dark:text-slate-400">You have not added products yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
