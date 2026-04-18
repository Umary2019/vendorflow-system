import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import { useApp } from '../context/AppContext';
import useDebounce from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { user, apiFetch, refreshCartCount, showToast } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const queryString = useMemo(() => {
    const query = new URLSearchParams();
    if (debouncedSearch) query.set('search', debouncedSearch);
    if (category) query.set('category', category);
    return query.toString();
  }, [debouncedSearch, category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';
      const data = await apiFetch(endpoint);
      setProducts(data.products || []);
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [queryString]);

  const handleAddToCart = async (product) => {
    if (!user) {
      setMessage('Please login first to add items to your cart.');
      showToast('Please login first to add items to cart.', 'warning');
      return;
    }

    if (user.role !== 'buyer') {
      setMessage('Only buyers can add products to cart.');
      return;
    }

    try {
      await apiFetch('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      await refreshCartCount();
      setMessage(`${product.name} added to cart.`);
      showToast(`${product.name} added to cart.`, 'success');
    } catch (addError) {
      setMessage(addError.message);
      showToast(addError.message, 'error');
    }
  };

  const handleGuestAddToCart = () => {
    setMessage('Please login first to add items to your cart.');
    showToast('Please login first to add items to cart.', 'warning');
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-500 p-6 text-white shadow-soft">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/25 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Marketplace</p>
        <h1 className="mt-2 text-2xl font-extrabold">Shop quality products from active vendors</h1>
        <p className="mt-1 text-sm text-cyan-100/90">Search quickly, compare easily, and checkout when ready.</p>
      </div>

      <div className="surface-glass rounded-3xl p-6 shadow-soft">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter value={category} onChange={setCategory} />
        </div>
        {message ? <p className="mt-4 text-sm text-brand-700 dark:text-brand-300">{message}</p> : null}
      </div>

      {loading ? <LoadingSpinner label="Fetching products" /> : null}
      {error ? <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}

      {!loading && !error ? (
        products.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={user ? handleAddToCart : handleGuestAddToCart}
                addToCartLabel={user ? 'Add to cart' : 'Login to add'}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No products found</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try a different search term or category, or add new products from the seller dashboard.
            </p>
          </div>
        )
      ) : null}
    </div>
  );
}
