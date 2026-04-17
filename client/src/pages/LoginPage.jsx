import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { validateEmail, validatePassword } from '../utils/validation';

export default function LoginPage() {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const redirectPath = location.state?.from?.pathname;

  const validateForm = () => {
    const newErrors = {};
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

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const user = await login(form.email, form.password);
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role === 'seller') {
        navigate('/dashboard/seller');
      } else {
        navigate('/dashboard/buyer');
      }
      showToast('Logged in successfully.', 'success');
    } catch (submitError) {
      setServerError(submitError.message);
      showToast(submitError.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Login to continue your marketplace workflow.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
          {serverError && <p className="text-sm text-rose-600">{serverError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
          New here?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
