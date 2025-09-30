export interface TimeSeriesData {
  year: number;
  landUse: number; // 0-100 normalized
  energyConsumption: number; // 0-100 normalized
  waterConsumption: number; // 0-100 normalized
  noiseLevel: number; // 0-100 normalized
}

export interface DataCenter {
  id: number;
  name: string;
  lat: number;
  lng: number;
  energyConsumption: number; // MWh
  waterConsumption: number; // L
  noiseLevel: number; // dB
  buildingArea: number; // sqft
  type: 'operational' | 'high-consumption';
  timeSeries?: TimeSeriesData[]; // Historical data
}

// Generate placeholder time series data
const generateTimeSeries = (baseValues: { land: number; energy: number; water: number; noise: number }): TimeSeriesData[] => {
  const years = [2015, 2017, 2019, 2021, 2023, 2025];
  return years.map((year, index) => {
    const variation = Math.sin(index / 2) * 15;
    return {
      year,
      landUse: Math.max(20, Math.min(100, baseValues.land + variation)),
      energyConsumption: Math.max(20, Math.min(100, baseValues.energy + variation * 1.2)),
      waterConsumption: Math.max(20, Math.min(100, baseValues.water + variation * 0.8)),
      noiseLevel: Math.max(20, Math.min(100, baseValues.noise + variation * 1.5)),
    };
  });
};

// Mock data centers positioned based on reference images
// Loudoun County coordinates: ~39.0°N, -77.5°W
export const dataCenters: DataCenter[] = [
  // Ashburn area cluster (west)
  { id: 1, name: "Ashburn DC-1", lat: 39.043, lng: -77.487, energyConsumption: 45, waterConsumption: 850000, noiseLevel: 72, buildingArea: 125000, type: 'operational', timeSeries: generateTimeSeries({ land: 65, energy: 55, water: 58, noise: 72 }) },
  { id: 2, name: "Ashburn DC-2", lat: 39.038, lng: -77.495, energyConsumption: 62, waterConsumption: 1200000, noiseLevel: 78, buildingArea: 180000, type: 'high-consumption', timeSeries: generateTimeSeries({ land: 75, energy: 82, water: 78, noise: 80 }) },
  { id: 3, name: "Ashburn DC-3", lat: 39.035, lng: -77.482, energyConsumption: 38, waterConsumption: 720000, noiseLevel: 68, buildingArea: 95000, type: 'operational', timeSeries: generateTimeSeries({ land: 52, energy: 45, water: 48, noise: 58 }) },
  { id: 4, name: "Ashburn DC-4", lat: 39.041, lng: -77.478, energyConsumption: 52, waterConsumption: 980000, noiseLevel: 75, buildingArea: 145000, type: 'operational', timeSeries: generateTimeSeries({ land: 68, energy: 62, water: 65, noise: 70 }) },
  { id: 5, name: "Ashburn DC-5", lat: 39.048, lng: -77.492, energyConsumption: 41, waterConsumption: 790000, noiseLevel: 70, buildingArea: 110000, type: 'operational', timeSeries: generateTimeSeries({ land: 58, energy: 48, water: 52, noise: 65 }) },
  
  // Central cluster
  { id: 6, name: "Sterling DC-1", lat: 39.006, lng: -77.428, energyConsumption: 68, waterConsumption: 1350000, noiseLevel: 82, buildingArea: 210000, type: 'high-consumption', timeSeries: generateTimeSeries({ land: 80, energy: 88, water: 85, noise: 82 }) },
  { id: 7, name: "Sterling DC-2", lat: 39.010, lng: -77.435, energyConsumption: 44, waterConsumption: 830000, noiseLevel: 71, buildingArea: 118000, type: 'operational', timeSeries: generateTimeSeries({ land: 62, energy: 52, water: 55, noise: 68 }) },
  { id: 8, name: "Sterling DC-3", lat: 39.003, lng: -77.422, energyConsumption: 55, waterConsumption: 1050000, noiseLevel: 76, buildingArea: 158000, type: 'high-consumption', timeSeries: generateTimeSeries({ land: 72, energy: 68, water: 70, noise: 75 }) },
  { id: 9, name: "Sterling DC-4", lat: 39.015, lng: -77.440, energyConsumption: 39, waterConsumption: 740000, noiseLevel: 69, buildingArea: 102000, type: 'operational', timeSeries: generateTimeSeries({ land: 55, energy: 46, water: 49, noise: 62 }) },
  { id: 10, name: "Sterling DC-5", lat: 39.008, lng: -77.430, energyConsumption: 47, waterConsumption: 890000, noiseLevel: 73, buildingArea: 132000, type: 'operational', timeSeries: generateTimeSeries({ land: 64, energy: 56, water: 59, noise: 70 }) },
  
  // Eastern cluster (Dulles Town Center area)
  { id: 11, name: "Dulles DC-1", lat: 39.028, lng: -77.392, energyConsumption: 58, waterConsumption: 1100000, noiseLevel: 77, buildingArea: 168000, type: 'high-consumption', timeSeries: generateTimeSeries({ land: 74, energy: 72, water: 73, noise: 76 }) },
  { id: 12, name: "Dulles DC-2", lat: 39.032, lng: -77.388, energyConsumption: 43, waterConsumption: 810000, noiseLevel: 70, buildingArea: 115000, type: 'operational', timeSeries: generateTimeSeries({ land: 60, energy: 51, water: 54, noise: 67 }) },
  { id: 13, name: "Dulles DC-3", lat: 39.025, lng: -77.395, energyConsumption: 51, waterConsumption: 970000, noiseLevel: 74, buildingArea: 142000, type: 'operational', timeSeries: generateTimeSeries({ land: 67, energy: 60, water: 64, noise: 71 }) },
  { id: 14, name: "Dulles DC-4", lat: 39.030, lng: -77.385, energyConsumption: 36, waterConsumption: 680000, noiseLevel: 67, buildingArea: 92000, type: 'operational', timeSeries: generateTimeSeries({ land: 50, energy: 42, water: 45, noise: 60 }) },
  
  // Northern cluster (Kincora area)
  { id: 15, name: "Kincora DC-1", lat: 39.062, lng: -77.410, energyConsumption: 65, waterConsumption: 1280000, noiseLevel: 80, buildingArea: 195000, type: 'high-consumption', timeSeries: generateTimeSeries({ land: 78, energy: 80, water: 82, noise: 79 }) },
  { id: 16, name: "Kincora DC-2", lat: 39.058, lng: -77.415, energyConsumption: 42, waterConsumption: 800000, noiseLevel: 71, buildingArea: 112000, type: 'operational', timeSeries: generateTimeSeries({ land: 59, energy: 50, water: 53, noise: 68 }) },
  
  // Southern cluster (Oak Grove area)
  { id: 17, name: "Oak Grove DC-1", lat: 38.965, lng: -77.375, energyConsumption: 70, waterConsumption: 1400000, noiseLevel: 83, buildingArea: 220000, type: 'high-consumption', timeSeries: generateTimeSeries({ land: 82, energy: 85, water: 87, noise: 83 }) },
  { id: 18, name: "Oak Grove DC-2", lat: 38.970, lng: -77.382, energyConsumption: 48, waterConsumption: 910000, noiseLevel: 73, buildingArea: 135000, type: 'operational', timeSeries: generateTimeSeries({ land: 66, energy: 58, water: 60, noise: 72 }) },
  { id: 19, name: "Oak Grove DC-3", lat: 38.968, lng: -77.378, energyConsumption: 54, waterConsumption: 1020000, noiseLevel: 75, buildingArea: 152000, type: 'operational', timeSeries: generateTimeSeries({ land: 70, energy: 64, water: 68, noise: 74 }) },
  
  // Scattered locations
  { id: 20, name: "Countryside DC-1", lat: 39.055, lng: -77.445, energyConsumption: 40, waterConsumption: 760000, noiseLevel: 69, buildingArea: 105000, type: 'operational', timeSeries: generateTimeSeries({ land: 57, energy: 47, water: 50, noise: 64 }) },
  { id: 21, name: "Countryside DC-2", lat: 39.050, lng: -77.452, energyConsumption: 35, waterConsumption: 660000, noiseLevel: 66, buildingArea: 88000, type: 'operational', timeSeries: generateTimeSeries({ land: 48, energy: 40, water: 44, noise: 58 }) },
  { id: 22, name: "One Loudoun DC", lat: 39.075, lng: -77.465, energyConsumption: 33, waterConsumption: 630000, noiseLevel: 65, buildingArea: 82000, type: 'operational', timeSeries: generateTimeSeries({ land: 45, energy: 38, water: 42, noise: 55 }) },
  { id: 23, name: "University Center DC", lat: 39.088, lng: -77.438, energyConsumption: 37, waterConsumption: 700000, noiseLevel: 68, buildingArea: 98000, type: 'operational', timeSeries: generateTimeSeries({ land: 53, energy: 44, water: 46, noise: 61 }) },
  { id: 24, name: "Lansdowne DC", lat: 39.095, lng: -77.502, energyConsumption: 46, waterConsumption: 870000, noiseLevel: 72, buildingArea: 128000, type: 'operational', timeSeries: generateTimeSeries({ land: 63, energy: 54, water: 58, noise: 69 }) },
  { id: 25, name: "Leesburg DC-1", lat: 39.020, lng: -77.520, energyConsumption: 59, waterConsumption: 1120000, noiseLevel: 78, buildingArea: 172000, type: 'high-consumption', timeSeries: generateTimeSeries({ land: 76, energy: 74, water: 75, noise: 77 }) },
  { id: 26, name: "Leesburg DC-2", lat: 39.015, lng: -77.515, energyConsumption: 44, waterConsumption: 840000, noiseLevel: 71, buildingArea: 120000, type: 'operational', timeSeries: generateTimeSeries({ land: 61, energy: 52, water: 56, noise: 68 }) },
  { id: 27, name: "Chantilly DC-1", lat: 38.892, lng: -77.431, energyConsumption: 50, waterConsumption: 950000, noiseLevel: 74, buildingArea: 140000, type: 'operational', timeSeries: generateTimeSeries({ land: 69, energy: 59, water: 63, noise: 73 }) },
  { id: 28, name: "Chantilly DC-2", lat: 38.895, lng: -77.425, energyConsumption: 63, waterConsumption: 1220000, noiseLevel: 79, buildingArea: 185000, type: 'high-consumption', timeSeries: generateTimeSeries({ land: 77, energy: 78, water: 80, noise: 78 }) },
  { id: 29, name: "Herndon DC", lat: 38.969, lng: -77.386, energyConsumption: 41, waterConsumption: 780000, noiseLevel: 70, buildingArea: 108000, type: 'operational', timeSeries: generateTimeSeries({ land: 58, energy: 49, water: 52, noise: 66 }) },
  { id: 30, name: "Reston DC", lat: 38.958, lng: -77.356, energyConsumption: 56, waterConsumption: 1060000, noiseLevel: 76, buildingArea: 160000, type: 'high-consumption', timeSeries: generateTimeSeries({ land: 73, energy: 70, water: 71, noise: 75 }) },
];
