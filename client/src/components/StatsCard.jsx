export default function StatsCard({ label, value, hint, accent = 'from-cyan-500 to-blue-600' }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className={`mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r ${accent}`} />
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</div>
      {hint ? <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{hint}</div> : null}
    </div>
  );
}
