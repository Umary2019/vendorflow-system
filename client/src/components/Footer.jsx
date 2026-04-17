import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="surface-glass mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl px-6 py-8 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">VendorFlow Marketplace</div>
          <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
            A polished multi-vendor marketplace mini app for buyers, sellers, and admins.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/products" className="rounded-full px-3 py-1 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">Products</Link>
          <Link to="/register" className="rounded-full px-3 py-1 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">Register</Link>
          <Link to="/login" className="rounded-full px-3 py-1 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">Login</Link>
        </div>
      </div>
    </footer>
  );
}
