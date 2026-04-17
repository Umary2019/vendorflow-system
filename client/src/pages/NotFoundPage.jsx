import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">404 error</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">The page you are looking for does not exist or was moved.</p>
      <Link to="/" className="mt-8 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
        Return home
      </Link>
    </div>
  );
}
