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

export const getFleetOverview = async (): Promise<FleetOverview> => {
  try {
    const response = await fetch(`${API_URL}/ships/fleet/summary`);
    
    if (!response.ok) {
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
    const data: FleetSummary = await response.json();

    return {
      totalShips: data.total_ships,
      activeShips: data.total_ships, // Assuming all active for now
      averageEfficiency: 100 - (data.fleet_avg_bio_index * 10), // Rough proxy
      kpis: [
        { id: "1", title: "Custo Extra Total", value: `USD ${(data.fleet_total_additional_cost_usd/1000).toFixed(1)}k`, unit: "", trend: "up", trendValue: "", status: "error" },
        { id: "2", title: "Combustível Extra", value: data.fleet_total_additional_fuel.toFixed(0), unit: "tons", trend: "up", trendValue: "", status: "warning" },
        { id: "3", title: "Emissões CO2", value: data.fleet_total_additional_co2.toFixed(0), unit: "tons", trend: "up", trendValue: "", status: "error" }
      ],
      performanceHistory: [] // Would need another endpoint for history
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

// Prediction / Scenario Analysis
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
