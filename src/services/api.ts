import { z } from "zod";

// =============================================================================
// TYPES (Aligned with Backend Schemas)
// =============================================================================

export interface ShipSummary {
  ship_name: string;
  num_events: number;
  avg_excess_ratio: number;
  max_excess_ratio: number;
  avg_bio_index: number;
  max_bio_index: number;
  total_baseline_fuel: number;
  total_real_fuel: number;
  total_additional_fuel?: number;
  total_additional_cost_usd?: number;
  total_additional_co2?: number;
}

export interface FleetSummary {
  generated_at: string;
  total_ships: number;
  total_events: number;
  fleet_avg_bio_index: number;
  fleet_total_additional_fuel: number;
  fleet_total_additional_cost_usd: number;
  fleet_total_additional_co2: number;
  ships: ShipSummary[];
}

export interface ShipInfo {
  ship_name: string;
  total_events: number;
  last_event_date?: string;
  last_cleaning_date?: string;
  days_since_cleaning?: number;
  paint_type?: string;
  // Dimensions (mapped from details endpoint if available, or mocked for now)
  length?: number;
  beam?: number;
  draft?: number;
}

export interface ShipListResponse {
  total: number;
  ships: ShipInfo[];
}

export interface PredictionRequest {
  ship_name: string;
  speed: number;
  duration: number;
  days_since_cleaning: number;
  // Optional fields with defaults
  displacement?: number;
  mid_draft?: number;
  beaufort_scale?: number;
  pct_idle_recent?: number;
  paint_type?: string;
}

export interface PredictionResponse {
  ship_name: string;
  status: string;
  predicted_consumption: number;
  baseline_consumption: number;
  excess_ratio: number;
  bio_index: number;
  bio_class: string;
  additional_fuel_tons: number;
  additional_cost_usd: number;
  additional_co2_tons: number;
  prediction_timestamp: string;
}

// Frontend-specific interfaces (Adapters)
export interface DashboardData {
  fleet_average_risk: number;
  critical_ships: CriticalShip[];
  total_extra_fuel_tons: number;
  total_savings_money: number;
  total_ships: number;
  risk_level: string;
}

export interface CriticalShip {
  id: string; // using ship_name as ID
  name: string;
  risk: number;
  level: string;
}

export interface FleetOverview {
  totalShips: number;
  activeShips: number;
  averageEfficiency: number;
  kpis: KPIData[];
  performanceHistory: TimeSeriesPoint[];
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

export interface Ship {
  id: number | string; // Supporting both for compatibility
  name: string;
  imo: string;
  ship_class: string;
}

export interface BiofoulingReportItem {
  ship_name: string;
  event_date: string;
  session_id: string;
  consumption: number;
  baseline_consumption: number;
  excess_ratio: number;
  bio_index: number;
  bio_class: string;
  additional_fuel_tons?: number;
  additional_cost_usd?: number;
  additional_co2_tons?: number;
}

export interface BiofoulingReport {
  total_records: number;
  records: BiofoulingReportItem[];
}

export interface BiofoulingReportParams {
  ship_name?: string;
  start_date?: string;
  end_date?: string;
  min_bio_index?: number;
  bio_class?: string;
  limit?: number;
  offset?: number;
}

// =============================================================================
// API CLIENT
// =============================================================================

// =============================================================================
// API CLIENT STATE MANAGEMENT
// =============================================================================

export type ApiStatus = 'connected' | 'disconnected' | 'unknown';
let currentStatus: ApiStatus = 'unknown';
const listeners: ((status: ApiStatus) => void)[] = [];

export const subscribeToApiStatus = (listener: (status: ApiStatus) => void) => {
  listeners.push(listener);
  listener(currentStatus);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

const setApiStatus = (status: ApiStatus) => {
  if (currentStatus !== status) {
    currentStatus = status;
    listeners.forEach(l => l(status));
  }
};

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

// MOCK DATA (Fallback)
const MOCK_DASHBOARD: DashboardData = {
  fleet_average_risk: 42,
  critical_ships: [
    { id: "Navio Alpha", name: "Navio Alpha", risk: 85, level: "critical" },
    { id: "Navio Beta", name: "Navio Beta", risk: 72, level: "high" },
  ],
  total_extra_fuel_tons: 1250,
  total_savings_money: 4500000,
  total_ships: 33,
  risk_level: "Moderate"
};

const MOCK_FLEET_SUMMARY: FleetSummary = {
  generated_at: new Date().toISOString(),
  total_ships: 33,
  total_events: 150,
  fleet_avg_bio_index: 4.2,
  fleet_total_additional_fuel: 1250,
  fleet_total_additional_cost_usd: 4500000,
  fleet_total_additional_co2: 3800,
  ships: [
    {
      ship_name: "Navio Alpha",
      num_events: 10,
      avg_excess_ratio: 1.15,
      max_excess_ratio: 1.25,
      avg_bio_index: 8.5,
      max_bio_index: 9.0,
      total_baseline_fuel: 500,
      total_real_fuel: 575,
      total_additional_fuel: 75,
      total_additional_cost_usd: 45000,
      total_additional_co2: 230
    },
    {
      ship_name: "Navio Beta",
      num_events: 12,
      avg_excess_ratio: 1.05,
      max_excess_ratio: 1.10,
      avg_bio_index: 3.5,
      max_bio_index: 4.0,
      total_baseline_fuel: 600,
      total_real_fuel: 630,
      total_additional_fuel: 30,
      total_additional_cost_usd: 18000,
      total_additional_co2: 90
    }
  ]
};

export const getDashboard = async (): Promise<DashboardData> => {
  try {
    // Try to fetch from real backend
    const response = await fetch(`${API_URL}/ships/fleet/summary`);
    
    if (!response.ok) {
      console.warn(`API Error: ${response.statusText}. Using mock data.`);
      setApiStatus('disconnected');
      return MOCK_DASHBOARD;
    }

    setApiStatus('connected');
    const fleetSummary: FleetSummary = await response.json();
    
    // Validate data integrity
    if (!fleetSummary || !fleetSummary.ships || fleetSummary.ships.length === 0) {
      console.warn('API returned empty fleet summary. Using mock data.');
      setApiStatus('disconnected');
      return MOCK_DASHBOARD;
    }
    
    // Adapter: Convert FleetSummary to DashboardData
    const criticalShips = fleetSummary.ships
      .filter(s => s.avg_bio_index > 5) // Threshold for critical/high
      .map(s => ({
        id: s.ship_name,
        name: s.ship_name,
        risk: s.avg_bio_index * 10, // Scale 0-10 to 0-100%
        level: s.avg_bio_index > 7 ? 'critical' : 'high'
      }))
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 5);

    return {
      fleet_average_risk: fleetSummary.fleet_avg_bio_index * 10,
      critical_ships: criticalShips,
      total_extra_fuel_tons: fleetSummary.fleet_total_additional_fuel,
      total_savings_money: fleetSummary.fleet_total_additional_cost_usd,
      total_ships: fleetSummary.total_ships,
      risk_level: fleetSummary.fleet_avg_bio_index > 5 ? "High" : "Moderate"
    };

  } catch (error) {
    console.warn('Failed to fetch dashboard data, using mock data:', error);
    setApiStatus('disconnected');
    return MOCK_DASHBOARD;
  }
};

// Biofouling Report endpoint
export const getBiofoulingReport = async (params: BiofoulingReportParams = {}): Promise<BiofoulingReport> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.ship_name) queryParams.append('ship_name', params.ship_name);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.min_bio_index !== undefined) queryParams.append('min_bio_index', params.min_bio_index.toString());
    if (params.bio_class) queryParams.append('bio_class', params.bio_class);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_URL}/reports/biofouling?${queryParams.toString()}`);
    
    if (!response.ok) {
      setApiStatus('disconnected');
      throw new Error(`API Error: ${response.statusText}`);
    }

    setApiStatus('connected');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch biofouling report:', error);
    setApiStatus('disconnected');
    return { total_records: 0, records: [] };
  }
};

// Helper function to get historical performance data from biofouling reports
const getPerformanceHistory = async (days: number = 30): Promise<TimeSeriesPoint[]> => {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch biofouling report with date filter
    const report = await getBiofoulingReport({
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      limit: 1000, // Get more records for better history
    });

    if (!report || !report.records || report.records.length === 0) {
      return [];
    }

    // Group by date and calculate average efficiency (inverse of bio_index)
    const dailyData: Record<string, { total: number; count: number }> = {};
    
    report.records.forEach((record) => {
      const date = new Date(record.event_date).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { total: 0, count: 0 };
      }
      // Efficiency = 100 - (bio_index * 10) to convert 0-10 scale to 0-100%
      const efficiency = 100 - (record.bio_index * 10);
      dailyData[date].total += efficiency;
      dailyData[date].count += 1;
    });

    // Convert to TimeSeriesPoint array
    const history: TimeSeriesPoint[] = Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        value: data.total / data.count, // Average efficiency
        type: 'historical' as const,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return history;
  } catch (error) {
    console.error('Failed to get performance history:', error);
    return [];
  }
};

export const getFleetOverview = async (): Promise<FleetOverview> => {
  try {
    const [fleetSummary, performanceHistory] = await Promise.all([
      fetch(`${API_URL}/ships/fleet/summary`).then(r => r.ok ? r.json() : null),
      getPerformanceHistory(30), // Get last 30 days
    ]);
    
    if (!fleetSummary) {
      setApiStatus('disconnected');
      return {
        totalShips: 33,
        activeShips: 28,
        averageEfficiency: 87.5,
        kpis: [],
        performanceHistory: []
      };
    }

    setApiStatus('connected');
    const data: FleetSummary = fleetSummary;

    return {
      totalShips: data.total_ships,
      activeShips: data.total_ships, // Assuming all active for now
      averageEfficiency: 100 - (data.fleet_avg_bio_index * 10), // Rough proxy
      kpis: [
        { id: "1", title: "Custo Extra Total", value: `USD ${(data.fleet_total_additional_cost_usd/1000).toFixed(1)}k`, unit: "", trend: "up", trendValue: "", status: "error" },
        { id: "2", title: "Combustível Extra", value: data.fleet_total_additional_fuel.toFixed(0), unit: "tons", trend: "up", trendValue: "", status: "warning" },
        { id: "3", title: "Emissões CO2", value: data.fleet_total_additional_co2.toFixed(0), unit: "tons", trend: "up", trendValue: "", status: "error" },
        { id: "4", title: "Índice Médio Biofouling", value: data.fleet_avg_bio_index.toFixed(2), unit: "/10", trend: data.fleet_avg_bio_index > 5 ? "up" : "down", trendValue: `${data.fleet_avg_bio_index.toFixed(1)}`, status: data.fleet_avg_bio_index >= 7 ? "error" : data.fleet_avg_bio_index >= 4 ? "warning" : "success" }
      ],
      performanceHistory: performanceHistory
    };
  } catch (error) {
    console.warn('Failed to fetch fleet overview:', error);
    setApiStatus('disconnected');
    return {
      totalShips: 0,
      activeShips: 0,
      averageEfficiency: 0,
      kpis: [],
      performanceHistory: []
    };
  }
};

export const getShips = async (): Promise<Ship[]> => {
  try {
    const response = await fetch(`${API_URL}/ships/`);
    if (!response.ok) {
      setApiStatus('disconnected');
      // Fallback mock
      return [
        { id: 1, name: "Navio Alpha", imo: "9876543", ship_class: "Suezmax" },
        { id: 2, name: "Navio Beta", imo: "1234567", ship_class: "Aframax" }
      ];
    }
    setApiStatus('connected');
    const data: ShipListResponse = await response.json();
    
    return data.ships.map((s, index) => ({
      id: s.ship_name, // Using name as ID for consistency with other endpoints
      name: s.ship_name,
      imo: "N/A", // Not in list endpoint
      ship_class: s.paint_type || "Unknown"
    }));
  } catch (error) {
    console.warn('Failed to fetch ships:', error);
    setApiStatus('disconnected');
    return [];
  }
};

// Prediction endpoints
export const predictBiofouling = async (request: PredictionRequest): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${API_URL}/predictions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      setApiStatus('disconnected');
      throw new Error(`API Error: ${response.statusText}`);
    }

    setApiStatus('connected');
    return await response.json();
  } catch (error) {
    console.error('Failed to predict biofouling:', error);
    setApiStatus('disconnected');
    throw error;
  }
};

// Prediction / Scenario Analysis (Legacy)
export const generateInsight = async (params: any): Promise<any> => {
  // Mapping frontend params to backend PredictionRequest
  const requestPayload: PredictionRequest = {
    ship_name: params.shipId, // Assuming shipId is the name
    speed: params.speed || 14,
    duration: (params.days || 30) * 24, // Days to hours
    days_since_cleaning: 180, // Default assumption
    paint_type: "Generic"
  };

  try {
    const response = await fetch(`${API_URL}/predictions/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      setApiStatus('disconnected');
      throw new Error(`API Error: ${response.statusText}`);
    }

    setApiStatus('connected');
    const result: PredictionResponse = await response.json();

    // Adapter to frontend PredictionResult
    return {
      fuelConsumption: result.predicted_consumption,
      biofoulingRisk: result.bio_index * 10, // Scale 0-100
      maintenanceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // Mocked
      chartData: [] // Would need separate call
    };
  } catch (error) {
    console.warn('Prediction failed, using mock:', error);
    setApiStatus('disconnected');
    return {
      fuelConsumption: 450,
      biofoulingRisk: 65,
      maintenanceDate: new Date().toISOString(),
      chartData: []
    };
  }
};
