import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/api';
import { useApp } from '../context/AppContext';
import { FALLBACK_IMAGE_URL, resolveImageUrl } from '../config';

export default function CartPage() {
  const { user, apiFetch, refreshCartCount } = useApp();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const total = useMemo(
    () =>
      (cart.items || []).reduce(
        (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
        0
      ),
    [cart.items]
  );

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/cart');
      setCart(data.cart || { items: [] });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'buyer') {
      loadCart();
    }
  }, [user?.role]);

  const removeItem = async (productId) => {
    try {
      const data = await apiFetch(`/api/cart/remove/${productId}`, { method: 'DELETE' });
      setCart(data.cart);
      await refreshCartCount();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const clearCart = async () => {
    try {
      await apiFetch('/api/cart/clear', { method: 'DELETE' });
      setCart({ items: [] });
      await refreshCartCount();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const placeOrder = async () => {
    try {
      await apiFetch('/api/orders', { method: 'POST' });
      setCart({ items: [] });
      await refreshCartCount();
      setMessage('Order placed successfully.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (user?.role !== 'buyer') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-700">Cart is available for buyers only.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Your cart</h1>
        {cart.items?.length ? (
          <button onClick={clearCart} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">
            Clear cart
          </button>
        ) : null}
      </div>

      {message ? <div className="rounded-2xl bg-brand-50 p-4 text-sm text-brand-700">{message}</div> : null}

      {loading ? (
        <div className="rounded-2xl bg-white p-6 shadow-soft dark:bg-slate-900">Loading cart...</div>
      ) : cart.items?.length ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId?._id || item._id} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-soft dark:bg-slate-900">
                <img
                  src={resolveImageUrl(item.productId?.image)}
                  alt={item.productId?.name}
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE_URL;
                  }}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.productId?.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900 dark:text-white">{formatCurrency((item.productId?.price || 0) * item.quantity)}</div>
                  <button onClick={() => removeItem(item.productId?._id)} className="mt-2 text-sm text-rose-600">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="h-fit rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Order summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <button
              onClick={placeOrder}
              className="mt-6 w-full rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Place order
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your cart is empty</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Browse products and add items to continue.</p>
          <Link to="/products" className="mt-5 inline-flex rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white">
            Browse products
          </Link>
        </div>
      )}
    </div>
  );
}
