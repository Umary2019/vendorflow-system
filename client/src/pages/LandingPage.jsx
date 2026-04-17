import { Link } from 'react-router-dom';

const features = [
  {
    title: 'For buyers',
    text: 'Browse trusted products, save to cart, and place orders in minutes.',
  },
  {
    title: 'For sellers',
    text: 'Launch products quickly, track sales, and manage inventory from one dashboard.',
  },
  {
    title: 'For admins',
    text: 'Review users, approve products, and monitor marketplace performance in real time.',
  },
];

const steps = [
  { title: 'Create an account', detail: 'Sign up as a buyer or seller in under a minute.' },
  { title: 'List or discover products', detail: 'Sellers upload products while buyers explore curated listings.' },
  { title: 'Place and track orders', detail: 'Buyers checkout and everyone monitors status through dashboards.' },
];

const trustPoints = [
  'Role-based security and protected routes',
  'Seller moderation and product approvals',
  'Fast search and category filters',
  'Responsive modern UI with dark mode support',
];

export default function LandingPage() {
  return (
    <div className="space-y-14 pb-16 pt-4">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-hero-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_42%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-28">
          <div className="max-w-2xl text-white">
            <p className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100">
              Marketplace startup template
            </p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Build a marketplace your users instantly trust.
            </h1>
            <p className="mt-6 text-lg text-cyan-100/90">
              VendorFlow combines conversion-focused shopping with serious operations tooling for buyers, sellers, and admins.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50">
                Explore products
              </Link>
              <Link to="/register" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Get started free
              </Link>
            </div>
          </div>
          <div className="mt-10 grid w-full max-w-md gap-4 lg:mt-0">
            {features.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/20 bg-white/15 p-5 backdrop-blur-md">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-cyan-50/90">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Featured</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Trending marketplace categories</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Home Office', 'Audio', 'Accessories', 'Tech'].map((category) => (
            <div key={category} className="surface-glass rounded-3xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{category}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Curated products from verified sellers with quality checks.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="surface-glass rounded-3xl p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">How it works</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Why choose us</p>
            <h3 className="mt-3 text-3xl font-semibold">Built for a real marketplace workflow</h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              {trustPoints.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </div>
          <div className="surface-glass rounded-3xl p-8 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Testimonials</p>
            <div className="mt-5 space-y-5">
              <blockquote className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                "VendorFlow helped us launch a multi-seller catalog in one week with clear admin controls."
                <div className="mt-2 text-xs font-semibold text-slate-500">Ops Lead, Nova Retail</div>
              </blockquote>
              <blockquote className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                "The dashboards make it easy to track product approvals, stock, and order activity."
                <div className="mt-2 text-xs font-semibold text-slate-500">Marketplace Manager, Orbit Goods</div>
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
