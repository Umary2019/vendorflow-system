import { useEffect, useState } from 'react';

const toastQueue = [];
let toastId = 0;

export const showToast = (message, type = 'info', duration = 3000) => {
  const id = toastId++;
  const toast = { id, message, type, duration };
  toastQueue.push(toast);
  return id;
};

export default function Toast({ initialToasts = [] }) {
  const [toasts, setToasts] = useState(initialToasts);

  useEffect(() => {
    const interval = setInterval(() => {
      if (toastQueue.length > 0) {
        const toast = toastQueue.shift();
        setToasts((prev) => [...prev, toast]);

        const timeout = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, toast.duration);

        return () => clearTimeout(timeout);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 text-white';
      case 'error':
      case 'danger':
        return 'bg-rose-500 text-white';
      case 'warning':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-brand-500 text-white';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl px-4 py-3 text-sm font-medium shadow-soft animate-slide-up ${getColor(toast.type)}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
