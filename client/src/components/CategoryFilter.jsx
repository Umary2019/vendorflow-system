const categories = ['All', 'Home Office', 'Audio', 'Accessories', 'Fashion', 'Beauty', 'Tech'];

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const active = value === category || (!value && category === 'All');
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category === 'All' ? '' : category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-soft'
                : 'bg-white/85 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
