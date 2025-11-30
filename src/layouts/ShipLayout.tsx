import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export const ShipLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Redirect to basic data if no sub-route is present
  // This logic might need to be in the parent route definition or handled here carefully
  // For now, we assume the user navigates to one of the tabs directly or we handle it in the component mounting.

  const tabs = [
    { name: 'Dados Básicos', path: 'basic' },
    { name: 'Radar Operacional', path: 'radar' },
    { name: 'Financeiro', path: 'financial' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#003950]">Visão do Navio</h1>
        <p className="text-slate-500">Gestão detalhada e monitoramento</p>
      </div>

      {/* Tabs Container */}
      <div className="border-b border-slate-200 bg-[#F8FAFC]">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={`/ship/${id}/${tab.path}`}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap py-4 px-1 border-b-4 font-medium text-sm transition-colors",
                  isActive
                    ? "border-[#FACC15] text-[#003950]"
                    : "border-transparent text-[#454545] hover:text-[#003950] hover:border-slate-300"
                )
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};
