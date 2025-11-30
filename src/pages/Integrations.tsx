import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  getIntegrationsHealth, 
  getSeaConditions, 
  getFuelPrices,
  getOceanEnvironment 
} from '@/services/api-integrations';
import { 
  CheckCircle2, 
  XCircle, 
  Cloud, 
  Droplets, 
  Waves, 
  Thermometer,
  RefreshCw,
  AlertCircle,
  Activity,
  Info
} from 'lucide-react';
import { useState } from 'react';

export default function Integrations() {
  const [loadSeaConditions, setLoadSeaConditions] = useState(false);
  const [loadFuelPrices, setLoadFuelPrices] = useState(false);

  const { data: health, isLoading: isLoadingHealth, error: healthError, refetch: refetchHealth } = useQuery({
    queryKey: ['integrationsHealth'],
    queryFn: async () => {
      try {
        return await getIntegrationsHealth();
      } catch (error) {
        console.error('Health check failed:', error);
        return null; // Return null to allow fallback
      }
    },
    refetchInterval: 30000,
    retry: 1,
  });

  const { data: oceanEnv, isLoading: isLoadingOcean, error: oceanError, refetch: refetchOcean } = useQuery({
    queryKey: ['oceanEnvironment'],
    queryFn: async () => {
      try {
        return await getOceanEnvironment();
      } catch (error) {
        console.error('Ocean env failed:', error);
        return null; // Return null to allow fallback
      }
    },
    refetchInterval: 60000,
    retry: 1,
  });

  const { data: seaConditions, isLoading: isLoadingSea } = useQuery({
    queryKey: ['seaConditions', -23.5505, -46.6333],
    queryFn: () => getSeaConditions(-23.5505, -46.6333),
    enabled: loadSeaConditions,
    retry: 1,
  });

  const { data: fuelPrice, isLoading: isLoadingFuel } = useQuery({
    queryKey: ['fuelPrice', 'BRSSZ'],
    queryFn: () => getFuelPrices('BRSSZ'),
    enabled: loadFuelPrices,
    retry: 1,
  });

  // Parse health data - handle different response formats
  const parseHealthData = () => {
    if (!health || typeof health !== 'object') return null;
    
    // If it has services structure
    if (health.services?.external_apis) {
      const services = health.services.external_apis;
      return Object.entries(services).map(([name, available]: [string, any]) => ({
        service: name,
        available: Boolean(available),
        last_check: new Date().toISOString(),
      }));
    }
    
    // If it's a flat object with service names
    const entries = Object.entries(health);
    if (entries.length > 0 && entries[0][0] !== 'status' && entries[0][0] !== 'message') {
      return entries.map(([name, status]: [string, any]) => ({
        service: name,
        available: status?.available ?? Boolean(status),
        last_check: status?.last_check || new Date().toISOString(),
      }));
    }
    
    return null;
  };

  const healthServices = parseHealthData();
  
  // Default ocean environment data (always available)
  const defaultOceanEnv = {
    temperature: 26.0,
    salinity: 35.0,
    density: 1025.0,
    chlorophyll: 1.5,
    wave_height: 1.2,
    current_speed: 0.6,
    zone: 'tropical',
    updated_at: new Date().toISOString(),
  };

  const displayOceanEnv = oceanEnv || defaultOceanEnv;
  const isUsingDefaultOcean = !oceanEnv;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#003950]">Integrações e APIs Externas</h2>
        <p className="text-slate-500">Status dos serviços externos e dados em tempo real</p>
      </div>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Status das Integrações
              </CardTitle>
              <CardDescription>Monitoramento de todos os serviços externos conectados</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchHealth()}
              disabled={isLoadingHealth}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingHealth ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingHealth ? (
            <div className="flex justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin text-[#003950]" />
            </div>
          ) : !healthServices || healthServices.length === 0 ? (
            <div className="text-center p-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
              <p className="text-lg font-medium text-slate-700 mb-2">
                Serviços não configurados
              </p>
              <p className="text-sm text-slate-500 mb-4">
                Os serviços externos precisam ser configurados no backend para aparecer aqui
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-900 font-semibold mb-2">Como configurar os serviços:</p>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Configure as variáveis de ambiente no backend (WEATHER_API_URL, VESSEL_API_URL, etc.)</li>
                      <li>Adicione as chaves de API dos serviços externos</li>
                      <li>Reinicie o servidor para aplicar as mudanças</li>
                      <li>Os serviços aparecerão aqui automaticamente quando configurados</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {healthServices.map((service) => (
                <div
                  key={service.service}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {service.available ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-900 capitalize">
                        {service.service.replace(/_/g, ' ')}
                      </div>
                      {service.last_check && (
                        <div className="text-sm text-slate-500">
                          Última verificação: {new Date(service.last_check).toLocaleString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={service.available ? 'default' : 'destructive'}>
                    {service.available ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ocean Environment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5" />
                  Ambiente Oceânico
                </CardTitle>
                <CardDescription>Dados ambientais em tempo real</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchOcean()}
                disabled={isLoadingOcean}
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingOcean ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingOcean ? (
              <div className="flex justify-center p-8">
                <RefreshCw className="h-6 w-6 animate-spin text-[#003950]" />
              </div>
            ) : (
              <div className="space-y-4">
                {isUsingDefaultOcean && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                      <p className="text-xs text-amber-800">
                        Exibindo dados padrão. Configure OCEAN_API_URL no backend para dados em tempo real.
                      </p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-slate-500">Temperatura</div>
                      <div className="text-lg font-bold text-[#003950]">
                        {displayOceanEnv.temperature?.toFixed(1) || '26.0'}°C
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-slate-500">Salinidade</div>
                      <div className="text-lg font-bold text-[#003950]">
                        {displayOceanEnv.salinity?.toFixed(2) || '35.0'} PSU
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Waves className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-slate-500">Altura das Ondas</div>
                      <div className="text-lg font-bold text-[#003950]">
                        {displayOceanEnv.wave_height?.toFixed(2) || '1.2'} m
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-slate-500">Velocidade Corrente</div>
                      <div className="text-lg font-bold text-[#003950]">
                        {displayOceanEnv.current_speed?.toFixed(2) || '0.6'} m/s
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="text-sm text-slate-500">
                    Densidade: <span className="font-semibold text-slate-900">{displayOceanEnv.density?.toFixed(2) || '1025.0'} kg/m³</span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Clorofila: <span className="font-semibold text-slate-900">{displayOceanEnv.chlorophyll?.toFixed(2) || '1.5'} mg/m³</span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Zona: <span className="font-semibold text-slate-900 capitalize">{displayOceanEnv.zone || 'tropical'}</span>
                  </div>
                  {displayOceanEnv.updated_at && (
                    <div className="text-xs text-slate-400 mt-2">
                      {isUsingDefaultOcean ? 'Dados padrão' : 'Atualizado'}: {new Date(displayOceanEnv.updated_at).toLocaleString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sea Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Condições do Mar
            </CardTitle>
            <CardDescription>Condições meteorológicas e do mar em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSea ? (
              <div className="flex justify-center p-8">
                <RefreshCw className="h-6 w-6 animate-spin text-[#003950]" />
              </div>
            ) : seaConditions ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {seaConditions.wave_height !== undefined && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Waves className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-sm text-slate-500">Altura das Ondas</div>
                        <div className="text-lg font-bold text-[#003950]">
                          {seaConditions.wave_height.toFixed(2)} m
                        </div>
                      </div>
                    </div>
                  )}
                  {seaConditions.wind_speed !== undefined && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Cloud className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-sm text-slate-500">Velocidade do Vento</div>
                        <div className="text-lg font-bold text-[#003950]">
                          {seaConditions.wind_speed.toFixed(1)} km/h
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-slate-200 text-sm text-slate-500">
                  Localização: {seaConditions.latitude?.toFixed(4) || '-23.5505'}, {seaConditions.longitude?.toFixed(4) || '-46.6333'}
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <Cloud className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-500 mb-4">
                  Clique no botão para carregar as condições do mar em tempo real
                </p>
                <Button
                  onClick={() => setLoadSeaConditions(true)}
                  className="bg-[#003950] hover:bg-[#002a3b]"
                >
                  <Cloud className="mr-2 h-4 w-4" />
                  Carregar Condições
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fuel Prices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Preços de Combustível
          </CardTitle>
          <CardDescription>Preços atuais de combustível por porto</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingFuel ? (
            <div className="flex justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin text-[#003950]" />
            </div>
          ) : fuelPrice ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div>
                  <div className="font-semibold text-slate-900">
                    {fuelPrice.fuel_type || 'VLSFO'} {fuelPrice.port && `- ${fuelPrice.port}`}
                  </div>
                  <div className="text-sm text-slate-500">
                    {fuelPrice.currency || 'USD'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#003950]">
                    ${fuelPrice.price_usd_per_ton?.toFixed(2) || '500.00'}
                  </div>
                  <div className="text-sm text-slate-500">por tonelada</div>
                </div>
              </div>
              {fuelPrice.last_updated && (
                <div className="text-xs text-slate-400">
                  Atualizado: {new Date(fuelPrice.last_updated).toLocaleString('pt-BR')}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8">
              <Droplets className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-500 mb-2">
                Clique no botão para carregar preços de combustível
              </p>
              <p className="text-sm text-slate-400 mb-4">Porto padrão: Santos (BRSSZ)</p>
              <Button
                onClick={() => setLoadFuelPrices(true)}
                className="bg-[#003950] hover:bg-[#002a3b]"
              >
                <Droplets className="mr-2 h-4 w-4" />
                Carregar Preços
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
