import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <DashboardSidebar />
      <main className="space-y-6">
        <Outlet />
      </main>
    </div>
  );
}
