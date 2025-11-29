// Types
export interface KPIData {
  id: string;
  title: string;
  value: string | number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  type: 'historical' | 'prediction';
}

export interface FleetOverview {
  totalShips: number;
  activeShips: number;
  averageEfficiency: number;
  kpis: KPIData[];
  performanceHistory: TimeSeriesPoint[];
}

export interface PredictionParams {
  shipId: string;
  routeId: string;
  speed: number;
  days: number;
}

export interface PredictionResult {
  fuelConsumption: number;
  biofoulingRisk: number;
  maintenanceDate: string;
  chartData: TimeSeriesPoint[];
}

// Mock Data
const MOCK_FLEET_OVERVIEW: FleetOverview = {
  totalShips: 45,
  activeShips: 42,
  averageEfficiency: 87.5,
  kpis: [
    {
      id: '1',
      title: 'Eficiência Média',
      value: 87.5,
      unit: '%',
      trend: 'up',
      trendValue: '+2.1%',
      status: 'success',
    },
    {
      id: '2',
      title: 'Risco de Bioincrustação',
      value: 'Baixo',
      unit: '',
      trend: 'neutral',
      trendValue: 'Estável',
      status: 'info',
    },
    {
      id: '3',
      title: 'Consumo de Combustível',
      value: 1250,
      unit: 'ton',
      trend: 'down',
      trendValue: '-5.4%',
      status: 'success',
    },
    {
      id: '4',
      title: 'Manutenções Pendentes',
      value: 3,
      unit: '',
      trend: 'up',
      trendValue: '+1',
      status: 'warning',
    },
  ],
  performanceHistory: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 80 + Math.random() * 15,
    type: 'historical',
  })),
};

export const getFleetOverview = async (): Promise<FleetOverview> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return MOCK_FLEET_OVERVIEW;
};

export const generateInsight = async (params: PredictionParams): Promise<PredictionResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Mock prediction logic
  const lastValue = 85;
  const futureData: TimeSeriesPoint[] = Array.from({ length: params.days }, (_, i) => ({
    date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: lastValue - (Math.random() * 0.5 * (i + 1)), // Degradation over time
    type: 'prediction',
  }));

  return {
    fuelConsumption: params.speed * 20 * params.days,
    biofoulingRisk: Math.min(100, 10 + params.days * 1.5),
    maintenanceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    chartData: futureData,
  };
};
