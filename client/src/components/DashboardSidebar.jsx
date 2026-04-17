import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const linkClass = ({ isActive }) =>
  `rounded-2xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-600 text-white shadow-soft'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`;

export default function DashboardSidebar() {
  const { user } = useApp();
  const role = user?.role;

  const links =
    role === 'admin'
      ? [
          { to: '/dashboard/admin', label: 'Overview' },
          { to: '/orders', label: 'Orders' },
          { to: '/profile', label: 'Profile' },
        ]
      : role === 'seller'
      ? [
          { to: '/dashboard/seller', label: 'Overview' },
          { to: '/seller/products/new', label: 'Add Product' },
          { to: '/orders', label: 'Sales Orders' },
          { to: '/profile', label: 'Profile' },
        ]
      : [
          { to: '/dashboard/buyer', label: 'Overview' },
          { to: '/cart', label: 'Cart' },
          { to: '/orders', label: 'Orders' },
          { to: '/profile', label: 'Profile' },
        ];

  return (
    <aside className="rounded-3xl border border-white/60 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 px-2">
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Dashboard</div>
        <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-white capitalize">{role} workspace</div>
      </div>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass} end={link.to.includes('/dashboard')}>
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
