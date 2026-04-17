export default function LoadingState({ title = 'Loading data', subtitle = 'Please wait a moment.' }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-brand-100 dark:bg-brand-900/50" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}
