import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { validateName, validatePrice, validateStock } from '../utils/validation';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiFetch, showToast } = useApp();

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await apiFetch(`/api/products/${id}`);
        const product = data.product;
        setForm({
          name: product.name || '',
          price: product.price || '',
          description: product.description || '',
          image: product.image || '',
          category: product.category || '',
          stock: product.stock || '',
        });
      } catch (loadError) {
        setServerError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const nameCheck = validateName(form.name);
    if (!nameCheck.valid) newErrors.name = nameCheck.message;
    const priceCheck = validatePrice(form.price);
    if (!priceCheck.valid) newErrors.price = priceCheck.message;
    const stockCheck = validateStock(form.stock);
    if (!stockCheck.valid) newErrors.stock = stockCheck.message;
    if (!form.description || form.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters.';
    }
    if (!form.category || form.category.trim().length === 0) {
      newErrors.category = 'Category is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    try {
      setSaving(true);
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          payload.append(key, value);
        }
      });
      if (imageFile) payload.append('imageFile', imageFile);

      await apiFetch(`/api/products/${id}`, {
        method: 'PATCH',
        body: payload,
      });
      showToast('Product updated successfully.', 'success');
      navigate('/dashboard/seller');
    } catch (submitError) {
      setServerError(submitError.message);
      showToast(submitError.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      showToast('Product deleted.', 'success');
      navigate('/dashboard/seller');
    } catch (deleteError) {
      setServerError(deleteError.message);
      showToast(deleteError.message, 'error');
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-soft dark:bg-slate-900">Loading product...</div>;
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Edit product</h1>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700"
        >
          Delete product
        </button>
      </div>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Product name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm transition ${
              errors.name
                ? 'border-rose-400 ring-4 ring-rose-100'
                : 'border-slate-200 dark:border-slate-700'
            } dark:bg-slate-950`}
          />
          {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
        </div>
        <div>
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm transition ${
              errors.category
                ? 'border-rose-400 ring-4 ring-rose-100'
                : 'border-slate-200 dark:border-slate-700'
            } dark:bg-slate-950`}
          />
          {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
        </div>
        <div>
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm transition ${
              errors.price
                ? 'border-rose-400 ring-4 ring-rose-100'
                : 'border-slate-200 dark:border-slate-700'
            } dark:bg-slate-950`}
          />
          {errors.price && <p className="mt-1 text-xs text-rose-600">{errors.price}</p>}
        </div>
        <div>
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => handleChange('stock', e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm transition ${
              errors.stock
                ? 'border-rose-400 ring-4 ring-rose-100'
                : 'border-slate-200 dark:border-slate-700'
            } dark:bg-slate-950`}
          />
          {errors.stock && <p className="mt-1 text-xs text-rose-600">{errors.stock}</p>}
        </div>
        <div className="md:col-span-2">
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => handleChange('image', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
        <div className="md:col-span-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImageFile(e.target.files?.[0] || null);
            }}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
        <div className="md:col-span-2">
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className={`min-h-32 w-full rounded-2xl border px-4 py-3 text-sm transition ${
              errors.description
                ? 'border-rose-400 ring-4 ring-rose-100'
                : 'border-slate-200 dark:border-slate-700'
            } dark:bg-slate-950`}
          />
          {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
        </div>
        {serverError && <p className="text-sm text-rose-600 md:col-span-2">{serverError}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white md:col-span-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? 'Saving changes...' : 'Update product'}
        </button>
      </form>
    </div>
  );
}
