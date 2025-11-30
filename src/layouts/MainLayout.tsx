import { Sidebar } from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';
import { ApiStatusIndicator } from '@/components/ApiStatusIndicator';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <div className="container mx-auto p-8">
          <Outlet />
        </div>
      </main>
      <ApiStatusIndicator />
    </div>
  );
};
