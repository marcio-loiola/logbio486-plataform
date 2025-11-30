// External API Integration Services
// Connects to backend endpoints from feat/external-api branch

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

// =============================================================================
// TYPES
// =============================================================================

export interface EnhancedPredictionRequest {
  vessel_id: string;
  speed: number;
  displacement: number;
  draft: number;
  days_since_cleaning: number;
  latitude?: number;
  longitude?: number;
  port?: string;
}

export interface EnhancedPredictionResponse {
  predicted_consumption: number;
  biofouling_index: number;
  fuel_cost_usd: number;
  co2_emissions_tons: number;
  sea_state_adjustment?: number;
  beaufort_scale?: number;
  enriched_data: Record<string, any>;
  data_sources: string[];
}

export interface CleaningRecommendation {
  vessel_id: string;
  biofouling_index: number;
  cleaning_urgency: string;
  recommended_action?: string;
  estimated_savings: number;
  next_available_slot?: string;
  last_cleaning_date?: string;
  days_since_cleaning?: number;
}

export interface SeaConditions {
  latitude: number;
  longitude: number;
  sea_state?: number;
  wave_height?: number;
  wind_speed?: number;
  wind_direction?: number;
  temperature?: number;
}

export interface FuelPrice {
  port?: string;
  fuel_type: string;
  price_usd_per_ton: number;
  currency: string;
  last_updated: string;
}

export interface VesselPosition {
  imo: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  status?: string;
  last_update?: string;
}

export interface OceanEnvironment {
  temperature: number;
  salinity: number;
  density: number;
  chlorophyll: number;
  wave_height: number;
  current_speed: number;
  zone: string;
  updated_at: string;
}

// =============================================================================
// INTEGRATIONS ENDPOINTS
// =============================================================================

export const getIntegrationsHealth = async (): Promise<Record<string, any> | null> => {
  try {
    const response = await fetch(`${API_URL}/integrations/health`);
    if (!response.ok) {
      // Return null instead of throwing to allow graceful degradation
      if (response.status === 404 || response.status === 503) {
        return null;
      }
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch integrations health:', error);
    // Return null to allow UI to show fallback message
    return null;
  }
};

export const getEnhancedPrediction = async (
  request: EnhancedPredictionRequest
): Promise<EnhancedPredictionResponse> => {
  try {
    const response = await fetch(`${API_URL}/integrations/predictions/enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get enhanced prediction:', error);
    throw error;
  }
};

export const getCleaningRecommendation = async (
  vesselId: string,
  currentBiofoulingIndex: number
): Promise<CleaningRecommendation> => {
  try {
    const response = await fetch(
      `${API_URL}/integrations/vessels/${encodeURIComponent(vesselId)}/cleaning-recommendation?current_biofouling_index=${currentBiofoulingIndex}`
    );
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to get cleaning recommendation:', error);
    throw error;
  }
};

export const getSeaConditions = async (
  latitude: number,
  longitude: number
): Promise<SeaConditions> => {
  try {
    const response = await fetch(
      `${API_URL}/integrations/weather/sea-conditions?latitude=${latitude}&longitude=${longitude}`
    );
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to get sea conditions:', error);
    throw error;
  }
};

export const getFuelPrices = async (
  port?: string,
  fuelType: string = 'VLSFO'
): Promise<FuelPrice> => {
  try {
    const url = new URL(`${API_URL}/integrations/fuel-prices`);
    url.searchParams.append('fuel_type', fuelType);
    if (port) url.searchParams.append('port', port);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to get fuel prices:', error);
    throw error;
  }
};

export const getVesselPosition = async (imo: string): Promise<VesselPosition> => {
  try {
    const response = await fetch(`${API_URL}/integrations/vessels/${imo}/position`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to get vessel position:', error);
    throw error;
  }
};

export const scheduleCleaning = async (
  vesselId: string,
  proposedDate: Date,
  priority: string = 'normal'
): Promise<Record<string, any>> => {
  try {
    const response = await fetch(
      `${API_URL}/integrations/vessels/${encodeURIComponent(vesselId)}/schedule-cleaning`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposed_date: proposedDate.toISOString(),
          priority,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to schedule cleaning:', error);
    throw error;
  }
};

// =============================================================================
// OPERATIONAL ENDPOINTS
// =============================================================================

export const getOceanEnvironment = async (): Promise<OceanEnvironment | null> => {
  try {
    const response = await fetch('/operational/ocean/env');
    if (!response.ok) {
      if (response.status === 404 || response.status === 503) {
        return null; // Service not configured
      }
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to get ocean environment:', error);
    return null; // Return null instead of throwing for graceful degradation
  }
};

export const getFleetOptimization = async (
  vesselIds: string[]
): Promise<Record<string, any>> => {
  try {
    const response = await fetch(`${API_URL}/integrations/fleet/optimization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vessel_ids: vesselIds }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get fleet optimization:', error);
    throw error;
  }
};

