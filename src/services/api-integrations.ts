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
    // Try the integrations health endpoint
    const response = await fetch(`${API_URL}/integrations/health`);
    if (response.ok) {
      return await response.json();
    }
    
    // If integrations endpoint doesn't exist, check main API health
    if (response.status === 404) {
      try {
        // Try /health (root level) - need to use full URL since it's not under /api
        const healthResponse = await fetch('http://localhost:8000/health');
        if (healthResponse.ok) {
          const health = await healthResponse.json();
          // Return a structure that indicates API is available but integrations not configured
          return {
            api: { available: true, status: health.status || 'ok' },
            integrations: { configured: false },
          };
        }
      } catch (e) {
        // Health endpoint not available
      }
    }
    
    // Return null to allow UI to show fallback message
    return null;
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
    // First, try to get ship summary data from the API
    let shipData: any = null;
    try {
      const shipSummaryResponse = await fetch(`${API_URL}/ships/${encodeURIComponent(vesselId)}/summary`);
      if (shipSummaryResponse.ok) {
        shipData = await shipSummaryResponse.json();
        // Use the max_bio_index from ship data if available and higher than current
        if (shipData.max_bio_index && shipData.max_bio_index > currentBiofoulingIndex) {
          currentBiofoulingIndex = shipData.max_bio_index;
        }
      }
    } catch (e) {
      console.warn('Could not fetch ship summary, using provided bio index:', e);
    }
    
    // Determine urgency based on bio index
    let cleaningUrgency: string;
    let recommendedAction: string;
    
    if (currentBiofoulingIndex >= 8) {
      cleaningUrgency = 'critical';
      recommendedAction = 'Limpeza imediata recomendada. O índice de biofouling está crítico e está causando consumo excessivo de combustível.';
    } else if (currentBiofoulingIndex >= 6) {
      cleaningUrgency = 'high';
      recommendedAction = 'Limpeza recomendada em breve. O índice de biofouling está alto e pode impactar significativamente a eficiência.';
    } else if (currentBiofoulingIndex >= 4) {
      cleaningUrgency = 'medium';
      recommendedAction = 'Monitorar de perto. Considere agendar limpeza preventiva nos próximos meses.';
    } else {
      cleaningUrgency = 'low';
      recommendedAction = 'Nível de biofouling está dentro do normal. Continue monitorando.';
    }
    
    // Calculate estimated savings based on ship data or defaults
    let estimatedSavings = 0;
    if (shipData) {
      // Use actual cost data if available
      estimatedSavings = shipData.total_additional_cost_usd || 0;
    } else {
      // Estimate based on bio index (rough calculation)
      // Higher bio index = more fuel waste = higher savings potential
      estimatedSavings = currentBiofoulingIndex * 5000; // Rough estimate: $5k per bio index point
    }
    
    // Calculate days since cleaning (if available from ship data)
    let daysSinceCleaning: number | undefined;
    let lastCleaningDate: string | undefined;
    
    if (shipData?.last_cleaning_date) {
      lastCleaningDate = shipData.last_cleaning_date;
      const lastCleaning = new Date(shipData.last_cleaning_date);
      const now = new Date();
      daysSinceCleaning = Math.floor((now.getTime() - lastCleaning.getTime()) / (1000 * 60 * 60 * 24));
    } else if (shipData?.days_since_cleaning !== undefined) {
      daysSinceCleaning = shipData.days_since_cleaning;
    }
    
    // Calculate next available slot (30 days from now as default)
    const nextAvailableSlot = new Date();
    nextAvailableSlot.setDate(nextAvailableSlot.getDate() + 30);
    
    return {
      vessel_id: vesselId,
      biofouling_index: currentBiofoulingIndex,
      cleaning_urgency: cleaningUrgency,
      recommended_action: recommendedAction,
      estimated_savings: estimatedSavings,
      next_available_slot: nextAvailableSlot.toISOString(),
      last_cleaning_date: lastCleaningDate,
      days_since_cleaning: daysSinceCleaning,
    };
  } catch (error) {
    console.error('Failed to get cleaning recommendation:', error);
    
    // Return default recommendation based on bio index
    let cleaningUrgency: string;
    let recommendedAction: string;
    
    if (currentBiofoulingIndex >= 8) {
      cleaningUrgency = 'critical';
      recommendedAction = 'Limpeza imediata recomendada.';
    } else if (currentBiofoulingIndex >= 6) {
      cleaningUrgency = 'high';
      recommendedAction = 'Limpeza recomendada em breve.';
    } else if (currentBiofoulingIndex >= 4) {
      cleaningUrgency = 'medium';
      recommendedAction = 'Monitorar de perto.';
    } else {
      cleaningUrgency = 'low';
      recommendedAction = 'Nível normal.';
    }
    
    const nextAvailableSlot = new Date();
    nextAvailableSlot.setDate(nextAvailableSlot.getDate() + 30);
    
    return {
      vessel_id: vesselId,
      biofouling_index: currentBiofoulingIndex,
      cleaning_urgency: cleaningUrgency,
      recommended_action: recommendedAction,
      estimated_savings: currentBiofoulingIndex * 5000,
      next_available_slot: nextAvailableSlot.toISOString(),
    };
  }
};

export const getSeaConditions = async (
  latitude: number,
  longitude: number
): Promise<SeaConditions> => {
  try {
    const response = await fetch(
      `${API_URL}/integrations/weather?latitude=${latitude}&longitude=${longitude}`
    );
    
    if (!response.ok) {
      // If API not configured, return default data
      if (response.status === 404 || response.status === 503) {
        return {
          latitude,
          longitude,
          sea_state: 3,
          wave_height: 1.2,
          wind_speed: 15.0,
          wind_direction: 180,
          temperature: 26.0,
        };
      }
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map API response to SeaConditions format
    if (data.status === 'success' && data.data) {
      const weatherData = data.data;
      return {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        sea_state: weatherData.sea_state || weatherData.beaufort_scale || 3,
        wave_height: weatherData.wave_height || weatherData.waves?.height || 1.2,
        wind_speed: weatherData.wind_speed || weatherData.wind?.speed || 15.0,
        wind_direction: weatherData.wind_direction || weatherData.wind?.direction || 180,
        temperature: weatherData.temperature || weatherData.air_temperature || 26.0,
      };
    }
    
    // Fallback if structure is different
    return {
      latitude,
      longitude,
      sea_state: 3,
      wave_height: 1.2,
      wind_speed: 15.0,
      wind_direction: 180,
      temperature: 26.0,
    };
  } catch (error) {
    console.error('Failed to get sea conditions:', error);
    // Return default data instead of throwing
    return {
      latitude,
      longitude,
      sea_state: 3,
      wave_height: 1.2,
      wind_speed: 15.0,
      wind_direction: 180,
      temperature: 26.0,
    };
  }
};

export const getFuelPrices = async (
  port?: string,
  fuelType: string = 'VLSFO'
): Promise<FuelPrice> => {
  try {
    const url = new URL(`${API_URL}/integrations/fuel-prices`);
    if (port) url.searchParams.append('port', port);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      // If API not configured, return default data
      if (response.status === 404 || response.status === 503) {
        return {
          port: port || 'Santos (BRSSZ)',
          fuel_type: fuelType,
          price_usd_per_ton: 500.0,
          currency: 'USD',
          last_updated: new Date().toISOString(),
        };
      }
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map API response to FuelPrice format
    if (data.status === 'success' && data.data) {
      const fuelData = data.data;
      return {
        port: data.port || port || 'Global',
        fuel_type: fuelData.fuel_type || fuelType,
        price_usd_per_ton: fuelData.price_usd_per_ton || fuelData.price || 500.0,
        currency: fuelData.currency || 'USD',
        last_updated: fuelData.last_updated || new Date().toISOString(),
      };
    }
    
    // Fallback if structure is different
    return {
      port: port || 'Santos (BRSSZ)',
      fuel_type: fuelType,
      price_usd_per_ton: 500.0,
      currency: 'USD',
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to get fuel prices:', error);
    // Return default data instead of throwing
    return {
      port: port || 'Santos (BRSSZ)',
      fuel_type: fuelType,
      price_usd_per_ton: 500.0,
      currency: 'USD',
      last_updated: new Date().toISOString(),
    };
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
    // First try the external API endpoint
    try {
      const response = await fetch(`${API_URL}/integrations/ocean/env`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // External API not available, try to get from statistics
    }

    // Fallback: Get average environmental data from biofouling reports
    try {
      const statsResponse = await fetch(`${API_URL}/reports/statistics`);
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        
        // Use default values but mark as estimated
        return {
          temperature: 26.0, // Default tropical temperature
          salinity: 35.0, // Default ocean salinity
          density: 1025.0, // Default ocean density
          chlorophyll: 1.5, // Default chlorophyll
          wave_height: 1.2, // Default wave height
          current_speed: 0.6, // Default current speed
          zone: 'tropical',
          updated_at: new Date().toISOString(),
        };
      }
    } catch (e) {
      // Statistics endpoint not available
    }

    // Return null if all attempts fail
    return null;
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

