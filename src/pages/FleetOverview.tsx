import { useQuery } from '@tanstack/react-query';
import { getFleetOverview, getDashboard } from '@/services/api';
import { KPICard } from '@/components/dashboard/KPICard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, DollarSign, Droplets } from 'lucide-react';

export default function FleetOverview() {
  const { data: fleetData, isLoading: isLoadingFleet } = useQuery({
    queryKey: ['fleetOverview'],
    queryFn: getFleetOverview,
  });

  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });

  const isLoading = isLoadingFleet || isLoadingDashboard;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#003950]">Visão da Frota</h2>
        <p className="text-slate-500">Monitoramento consolidado de performance e riscos</p>
      </div>

      {/* Dashboard Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#006159]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Risco Médio da Frota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#003950]">{dashboardData?.fleet_average_risk ?? '-'}%</div>
            <p className="text-xs text-slate-500 mt-1">Nível de Bioincrustação</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-[#FACC15]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Navios Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#003950]">{dashboardData?.critical_ships?.length ?? 0}</div>
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Ação Necessária
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Desperdício de Combustível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#003950]">{dashboardData?.total_extra_fuel_tons?.toLocaleString() ?? '-'} ton</div>
            <p className="text-xs text-slate-500 mt-1">Acumulado (Estimado)</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Economia Potencial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#003950]">R$ {dashboardData?.total_savings_money?.toLocaleString() ?? '-'}</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Oportunidade
            </p>
          </CardContent>
        </Card>
      </div>

      {/* KPIs Grid from Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <KPICard key={i} title="" value="" isLoading={true} />
          ))
        ) : (
          fleetData?.kpis.map((kpi) => (
            <KPICard
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              unit={kpi.unit}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
              status={kpi.status}
            />
          ))
        )}
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimeSeriesChart
            title="Performance Média da Frota"
            description="Histórico de eficiência hidrodinâmica"
            data={fleetData?.performanceHistory || []}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-[#003950] rounded-xl p-6 text-white h-full flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Status da Frota</h3>
                <div className="space-y-4 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Em Operação</span>
                    <span className="font-bold text-2xl">{fleetData?.activeShips || 0}</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full" style={{ width: `${((fleetData?.activeShips || 0) / (fleetData?.totalShips || 1)) * 100}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-300">Em Manutenção</span>
                    <span className="font-bold text-2xl">{(fleetData?.totalShips || 0) - (fleetData?.activeShips || 0)}</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${(((fleetData?.totalShips || 0) - (fleetData?.activeShips || 0)) / (fleetData?.totalShips || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>
        </div>
      </div>
    </div>
  );
}
