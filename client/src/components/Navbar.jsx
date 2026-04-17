import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`;

export default function Navbar() {
  const { user, logout, theme, setTheme, cartCount } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath =
    user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-sm font-bold text-white shadow-soft">
            VF
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">VendorFlow</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Marketplace OS</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {!user ? <NavLink to="/" className={navLinkClass}>Home</NavLink> : null}
          <NavLink to="/products" className={navLinkClass}>Products</NavLink>
          {user ? <NavLink to={dashboardPath} className={navLinkClass}>Dashboard</NavLink> : null}
          {user?.role === 'buyer' ? <NavLink to="/cart" className={navLinkClass}>Cart {cartCount ? `(${cartCount})` : ''}</NavLink> : null}
          {user ? <NavLink to="/orders" className={navLinkClass}>Orders</NavLink> : null}
          {user ? <NavLink to="/profile" className={navLinkClass}>Profile</NavLink> : null}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          {user ? (
            <>
              <div className="hidden text-right md:block">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
                <div className="text-xs capitalize text-slate-500 dark:text-slate-400">{user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-slate-800 hover:to-slate-600 dark:from-white dark:to-slate-200 dark:text-slate-900"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Login</Link>
              <Link to="/register" className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-sky-600 hover:to-emerald-600">Register</Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen((value) => !value)}
          className="rounded-full border border-slate-200 p-2 text-slate-700 lg:hidden dark:border-slate-800 dark:text-slate-200"
        >
          <span className="sr-only">Toggle menu</span>
          ☰
        </button>
      </div>

      {open ? (
        <div className="mx-auto max-w-7xl border-t border-slate-200 px-4 py-4 lg:hidden dark:border-slate-800">
          <div className="flex flex-col gap-2">
            {!user ? <NavLink to="/" className={navLinkClass}>Home</NavLink> : null}
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            {user ? <NavLink to={dashboardPath} className={navLinkClass}>Dashboard</NavLink> : null}
            {user?.role === 'buyer' ? <NavLink to="/cart" className={navLinkClass}>Cart {cartCount ? `(${cartCount})` : ''}</NavLink> : null}
            {user ? <NavLink to="/orders" className={navLinkClass}>Orders</NavLink> : null}
            {user ? <NavLink to="/profile" className={navLinkClass}>Profile</NavLink> : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200"
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Login</Link>
                <Link to="/register" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Register</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
