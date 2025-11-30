import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAuth } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Ship, Activity, Settings } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { PredictionComponent } from '@/components/prediction/PredictionComponent';
import { getFleetOverview, getShips } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogbookList from '@/components/LogbookList';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Auth check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      dispatch(setAuth({ user: session?.user ?? null, session }));
      if (!session) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setAuth({ user: session?.user ?? null, session }));
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  // Data fetching
  const { data: fleetData, isLoading } = useQuery({
    queryKey: ['fleetOverview'],
    queryFn: getFleetOverview,
  });

  const { data: ships, isLoading: isLoadingShips } = useQuery({
    queryKey: ['ships'],
    queryFn: getShips,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#003950] p-1.5 rounded-lg">
              <Ship className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#003950]">LogBio</h1>
              <p className="text-xs text-slate-500 font-medium">Fleet Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistema Operacional
            </div>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-600 hover:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Dashboard Principal</h2>
            <p className="text-slate-500">Visão geral da frota e monitoramento de bioincrustação</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
            <Button className="bg-[#003950] hover:bg-[#002a3b]">
              <Activity className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100 data-[state=active]:text-[#003950]">Visão Geral</TabsTrigger>
            <TabsTrigger value="prediction" className="data-[state=active]:bg-slate-100 data-[state=active]:text-[#003950]">Predição & IA</TabsTrigger>
            <TabsTrigger value="ships" className="data-[state=active]:bg-slate-100 data-[state=active]:text-[#003950]">Navios</TabsTrigger>
            <TabsTrigger value="logbooks" className="data-[state=active]:bg-slate-100 data-[state=active]:text-[#003950]">Diário de Bordo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Grid */}
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
                  description="Histórico de eficiência hidrodinâmica dos últimos 30 dias"
                  data={fleetData?.performanceHistory || []}
                  isLoading={isLoading}
                />
              </div>
              <div className="lg:col-span-1 space-y-4">
                {/* Side widgets could go here */}
                <div className="bg-[#003950] rounded-xl p-6 text-white h-full flex flex-col justify-between relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">Status da Frota</h3>
                    <div className="space-y-4 mt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Em Operação</span>
                        <span className="font-bold text-2xl">{fleetData?.activeShips || 0}</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: '92%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-300">Em Manutenção</span>
                        <span className="font-bold text-2xl">{(fleetData?.totalShips || 0) - (fleetData?.activeShips || 0)}</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="absolute top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prediction">
            <PredictionComponent />
          </TabsContent>

          <TabsContent value="ships">
            {isLoadingShips ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ships?.map((ship) => (
                  <div key={ship.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <Ship className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{ship.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">IMO: {ship.imo}</p>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-sm text-slate-600">Status</span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Operacional
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="logbooks">
            <LogbookList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
