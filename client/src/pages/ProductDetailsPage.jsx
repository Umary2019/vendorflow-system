import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../lib/api';
import { useApp } from '../context/AppContext';
import { FALLBACK_IMAGE_URL, resolveImageUrl } from '../config';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { user, apiFetch, refreshCartCount, showToast } = useApp();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/api/products/${id}`);
        setProduct(data.product);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const addToCart = async () => {
    if (!user || user.role !== 'buyer') {
      setMessage('Please login first to add items to your cart.');
      showToast('Please login first to add items to cart.', 'warning');
      navigate('/login');
      return;
    }

    try {
      await apiFetch('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      await refreshCartCount();
      setMessage('Product added to cart successfully.');
      showToast('Product added to cart successfully.', 'success');
    } catch (addError) {
      setMessage(addError.message);
      showToast(addError.message, 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading product details" />;
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-rose-50 p-5 text-sm text-rose-700">{error || 'Product not found.'}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-soft dark:bg-slate-800">
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE_URL;
            }}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-6 rounded-3xl border border-white/60 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{product.category}</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{product.name}</h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{product.description}</p>
          </div>

          <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <span>Price</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(product.price)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <span>Available stock</span>
              <span className="font-semibold text-slate-900 dark:text-white">{product.stock}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={product.stock || 1}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-24 rounded-2xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              onClick={addToCart}
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Add to cart
            </button>
          </div>
          {message ? <p className="text-sm text-brand-700 dark:text-brand-300">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
