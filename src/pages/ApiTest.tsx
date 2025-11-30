import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Server } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { getFleetOverview, FleetOverview } from '@/services/api';

export default function ApiTest() {
  const [data, setData] = useState<FleetOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    try {
      const result = await getFleetOverview();
      setRawResponse(JSON.stringify(result, null, 2));
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="container mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Server className="h-6 w-6 text-[#003950]" />
              Backend Connection Test
            </h1>
            <p className="text-slate-500">Testing connection to http://localhost:8000/api/v1/fleet/overview</p>
          </div>
          <Button onClick={fetchData} disabled={loading} className="bg-[#003950]">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Retry Connection
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2 text-xs font-mono bg-red-950/10 p-2 rounded">
                Check if the backend is running on port 8000 and CORS is configured.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {rawResponse && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-mono">Raw Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
                {rawResponse}
              </pre>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Visualized Data</h2>
            
            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.kpis.map((kpi) => (
                <KPICard
                  key={kpi.id}
                  title={kpi.title}
                  value={kpi.value}
                  unit={kpi.unit}
                  trend={kpi.trend}
                  trendValue={kpi.trendValue}
                  status={kpi.status}
                />
              ))}
            </div>

            {/* Main Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TimeSeriesChart
                  title="Performance Média da Frota"
                  description="Histórico de eficiência hidrodinâmica"
                  data={data.performanceHistory || []}
                  isLoading={loading}
                />
              </div>
              <div className="lg:col-span-1">
                 <Card className="h-full bg-[#003950] text-white border-none">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Status da Frota</h3>
                            <div className="space-y-4 mt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300">Em Operação</span>
                                    <span className="font-bold text-2xl">{data.activeShips}</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-400 h-full" style={{ width: `${(data.activeShips / data.totalShips) * 100}%` }}></div>
                                </div>
                                
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-slate-300">Em Manutenção</span>
                                    <span className="font-bold text-2xl">{data.totalShips - data.activeShips}</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-400 h-full" style={{ width: `${((data.totalShips - data.activeShips) / data.totalShips) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
