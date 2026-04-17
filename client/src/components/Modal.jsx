export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}
