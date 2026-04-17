import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { user } = useApp();

  const statusColor = useMemo(() => {
    if (user?.status === 'active') return 'bg-emerald-100 text-emerald-700';
    if (user?.status === 'pending') return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  }, [user?.status]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Profile</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your account details and role metadata.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Full name</div>
            <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</div>
            <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{user?.email}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Role</div>
            <div className="mt-1 text-lg font-semibold capitalize text-slate-900 dark:text-white">{user?.role}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</div>
            <div className="mt-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusColor}`}>
                {user?.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
