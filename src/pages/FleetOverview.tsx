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

      {/* Location & Risk Map + Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* World Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003950]">Localização e Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[300px] bg-slate-100 rounded-lg overflow-hidden">
              {/* Simple world map representation - in production, use a library like react-simple-maps */}
              <svg viewBox="0 0 1000 500" className="w-full h-full">
                {/* Simplified world map paths */}
                <path 
                  d="M 100 150 Q 150 140, 200 160 L 250 140 L 300 170 L 350 150 L 400 180 L 450 160 L 500 190 L 550 170 L 600 200 L 650 180 L 700 210 L 750 190 L 800 220 L 850 200 L 900 230"
                  fill="none" 
                  stroke="#CBD5E1" 
                  strokeWidth="1"
                />
                <ellipse cx="300" cy="250" rx="150" ry="80" fill="#E2E8F0" opacity="0.3" />
                <ellipse cx="650" cy="200" rx="120" ry="60" fill="#E2E8F0" opacity="0.3" />
                <ellipse cx="500" cy="300" rx="100" ry="50" fill="#E2E8F0" opacity="0.3" />
                
                {/* Ship markers */}
                {dashboardData?.critical_ships?.slice(0, 5).map((ship, idx) => {
                  const positions = [
                    { x: 250, y: 200 },
                    { x: 450, y: 250 },
                    { x: 650, y: 180 },
                    { x: 350, y: 280 },
                    { x: 550, y: 220 },
                  ];
                  const pos = positions[idx] || { x: 400, y: 250 };
                  const color = ship.level === 'critical' ? '#EF4444' : ship.level === 'high' ? '#F59E0B' : '#10B981';
                  
                  return (
                    <g key={ship.id}>
                      <circle cx={pos.x} cy={pos.y} r="8" fill={color} opacity="0.8" />
                      <circle cx={pos.x} cy={pos.y} r="12" fill={color} opacity="0.3" />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="mt-4 flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-slate-600">Crítico</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-slate-600">Alto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600">Normal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priorities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#003950]">Prioridades de Atenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData?.critical_ships?.slice(0, 4).map((ship) => {
                const levelColors = {
                  critical: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', bar: 'bg-red-500' },
                  high: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', bar: 'bg-amber-500' },
                  medium: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', bar: 'bg-blue-500' },
                  low: { bg: 'bg-slate-50', border: 'border-slate-500', text: 'text-slate-700', bar: 'bg-slate-500' },
                };
                const colors = levelColors[ship.level as keyof typeof levelColors] || levelColors.low;

                return (
                  <div key={ship.id} className={`p-3 rounded-lg border-l-4 ${colors.border} ${colors.bg}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm text-[#003950]">{ship.name}</p>
                        <p className={`text-xs ${colors.text} uppercase font-medium mt-1`}>
                          {ship.level === 'critical' ? 'Crítico' : ship.level === 'high' ? 'Alto' : ship.level === 'medium' ? 'Médio' : 'Baixo'}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-[#003950]">{ship.risk}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`${colors.bar} h-full transition-all`} style={{ width: `${ship.risk}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
