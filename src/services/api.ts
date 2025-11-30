// Types - Frontend & API (Standardized)

export interface CriticalShip {
  id: number;
  name: string;
  risk: number;
  level: string;
}

export interface DashboardData {
  fleet_average_risk: number;
  critical_ships: CriticalShip[];
  total_extra_fuel_tons: number;
  total_savings_money: number;
  total_ships: number;
  risk_level: string;
}

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

export interface Ship {
  id: number;
  name: string;
  imo: string;
  ship_class: string;
}

export interface Logbook {
  id: number;
  ship_id: number;
  session_id: string;
  event_name: string;
  start_date: string;
  end_date: string;
  duration: number;
  distance: number;
  aft_draft: number;
  fwd_draft: number;
  mid_draft: number;
  trim: number;
  displacement: number;
  beaufort_scale: string;
  sea_condition: string;
  beaufort_scale_desc: string;
  sea_condition_desc: string;
  speed: number;
  speed_gps: number;
  port: string;
  latitude: number;
  longitude: number;
}

export interface LogbookCreate {
  ship_id: number;
  description: string; // Keeping this for compatibility if needed, or should be updated to match new structure? 
  // The prompt didn't specify the CREATE payload, only the GET response. 
  // I'll keep it simple for now or assume it matches a subset of Logbook.
  date: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const getDashboard = async (): Promise<DashboardData> => {
  try {
    const response = await fetch(`${API_URL}/dashboard`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
};

export const getFleetOverview = async (): Promise<FleetOverview> => {
  try {
    const response = await fetch(`${API_URL}/fleet/overview`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch from API:', error);
    throw error;
  }
};

export const generateInsight = async (params: PredictionParams): Promise<PredictionResult> => {
  try {
    const response = await fetch(`${API_URL}/predictions/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to generate insight:', error);
    throw error;
  }
};

export const getShips = async (): Promise<Ship[]> => {
  try {
    const response = await fetch(`${API_URL}/ships/`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch ships:', error);
    throw error;
  }
};

export const getLogbooks = async (): Promise<Logbook[]> => {
  try {
    const response = await fetch(`${API_URL}/logbooks/`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch logbooks:', error);
    throw error;
  }
};

export const createLogbook = async (logbook: LogbookCreate): Promise<Logbook> => {
  try {
    const response = await fetch(`${API_URL}/logbooks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logbook),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to create logbook:', error);
    throw error;
  }
};
