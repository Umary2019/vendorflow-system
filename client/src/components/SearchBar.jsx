export default function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 pl-11 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-cyan-900/30"
      />
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600 dark:text-cyan-300">⌕</span>
    </div>
  );
}
