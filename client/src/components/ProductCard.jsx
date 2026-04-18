import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/api';
import { FALLBACK_IMAGE_URL, resolveImageUrl } from '../config';

export default function ProductCard({ product, onAddToCart, addToCartLabel = 'Add to cart', badge }) {
  return (
    <div className="surface-glass group overflow-hidden rounded-3xl shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Link to={`/products/${product._id || product.id}`} className="relative block">
        {badge ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-sm backdrop-blur dark:bg-slate-950/90 dark:text-slate-200">
            {badge}
          </span>
        ) : null}
        <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE_URL;
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">{product.category}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{product.name}</h3>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-cyan-100 to-emerald-100 px-3 py-1 text-sm font-semibold text-cyan-800 dark:from-cyan-900/40 dark:to-emerald-900/40 dark:text-cyan-200">
            {formatCurrency(product.price)}
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-300">{product.description}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">Stock: {product.stock}</span>
          {onAddToCart ? (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-sky-600 hover:to-emerald-600"
            >
              {addToCartLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
