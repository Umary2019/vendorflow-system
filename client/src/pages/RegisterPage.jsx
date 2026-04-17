import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { validateEmail, validatePassword, validateName } from '../utils/validation';

export default function RegisterPage() {
  const { register, showToast } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const nameCheck = validateName(form.name);
    if (!nameCheck.valid) newErrors.name = nameCheck.message;
    const emailCheck = validateEmail(form.email);
    if (!emailCheck.valid) newErrors.email = emailCheck.message;
    const passwordCheck = validatePassword(form.password);
    if (!passwordCheck.valid) newErrors.password = passwordCheck.message;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      const user = await register(form);
      if (user.role === 'seller') {
        navigate('/dashboard/seller');
      } else {
        navigate('/dashboard/buyer');
      }
      showToast('Account created successfully.', 'success');
    } catch (submitError) {
      setServerError(submitError.message);
      showToast(submitError.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Join as a buyer or a seller.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => {
                setForm({ ...form, name: event.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                errors.name
                  ? 'border-rose-400 focus:ring-4 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:focus:ring-brand-900/30'
              } dark:bg-slate-950 dark:text-white`}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => {
                setForm({ ...form, email: event.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                errors.email
                  ? 'border-rose-400 focus:ring-4 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:focus:ring-brand-900/30'
              } dark:bg-slate-950 dark:text-white`}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => {
                setForm({ ...form, password: event.target.value });
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                errors.password
                  ? 'border-rose-400 focus:ring-4 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:focus:ring-brand-900/30'
              } dark:bg-slate-950 dark:text-white`}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
            <select
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-brand-900/30"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          {serverError && <p className="text-sm text-rose-600">{serverError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
}
